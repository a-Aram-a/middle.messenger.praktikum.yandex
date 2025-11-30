import { expect } from 'chai';
import { Templator } from './templator';

describe('Templator', () => {
  describe('compile метод', () => {
    it('должен компилировать простой шаблон', () => {
      const template = '<div>Hello World</div>';
      const result = Templator.compile(template);

      expect(result).to.equal('<div>Hello World</div>');
    });

    it('должен подставлять простые значения', () => {
      const template = '<div>Hello {{name}}</div>';
      const context = { name: 'John' };
      const result = Templator.compile(template, context);

      expect(result).to.equal('<div>Hello John</div>');
    });

    it('должен подставлять множественные значения', () => {
      const template = '<div>{{firstName}} {{lastName}}</div>';
      const context = { firstName: 'John', lastName: 'Doe' };
      const result = Templator.compile(template, context);

      expect(result).to.equal('<div>John Doe</div>');
    });

    it('должен работать с вложенными объектами', () => {
      const template = '<div>{{user.name}} - {{user.email}}</div>';
      const context = {
        user: {
          name: 'John',
          email: 'john@test.com',
        },
      };
      const result = Templator.compile(template, context);

      expect(result).to.equal('<div>John - john@test.com</div>');
    });

    it('должен экранировать HTML по умолчанию', () => {
      const template = '<div>{{content}}</div>';
      const context = { content: '<script>alert("XSS")</script>' };
      const result = Templator.compile(template, context);

      expect(result).to.include('&lt;script&gt;');
      expect(result).to.not.include('<script>');
    });

    it('должен не экранировать HTML с тройными скобками', () => {
      const template = '<div>{{{content}}}</div>';
      const context = { content: '<span>HTML</span>' };
      const result = Templator.compile(template, context);

      expect(result).to.equal('<div><span>HTML</span></div>');
    });

    it('должен работать с условиями (#if)', () => {
      const template = '{{#if show}}<div>Visible</div>{{/if}}';

      const resultTrue = Templator.compile(template, { show: true });
      expect(resultTrue).to.equal('<div>Visible</div>');

      const resultFalse = Templator.compile(template, { show: false });
      expect(resultFalse).to.equal('');
    });

    it('должен работать с else', () => {
      const template = '{{#if show}}<div>Yes</div>{{else}}<div>No</div>{{/if}}';

      const resultTrue = Templator.compile(template, { show: true });
      expect(resultTrue).to.equal('<div>Yes</div>');

      const resultFalse = Templator.compile(template, { show: false });
      expect(resultFalse).to.equal('<div>No</div>');
    });

    it('должен работать с циклами (#each)', () => {
      const template = '<ul>{{#each items}}<li>{{this}}</li>{{/each}}</ul>';
      const context = { items: ['Item 1', 'Item 2', 'Item 3'] };
      const result = Templator.compile(template, context);

      expect(result).to.equal('<ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>');
    });

    it('должен работать с циклами по объектам', () => {
      const template = '<ul>{{#each users}}<li>{{name}}</li>{{/each}}</ul>';
      const context = {
        users: [
          { name: 'John' },
          { name: 'Jane' },
          { name: 'Bob' },
        ],
      };
      const result = Templator.compile(template, context);

      expect(result).to.equal('<ul><li>John</li><li>Jane</li><li>Bob</li></ul>');
    });

    it('должен возвращать пустую строку для undefined значений', () => {
      const template = '<div>{{missing}}</div>';
      const result = Templator.compile(template, {});

      expect(result).to.equal('<div></div>');
    });

    it('должен работать с числами', () => {
      const template = '<div>{{count}}</div>';
      const context = { count: 42 };
      const result = Templator.compile(template, context);

      expect(result).to.equal('<div>42</div>');
    });

    it('должен работать с булевыми значениями', () => {
      const template = '<div>{{isActive}}</div>';
      const context = { isActive: true };
      const result = Templator.compile(template, context);

      expect(result).to.equal('<div>true</div>');
    });

    it('должен работать с пустым контекстом', () => {
      const template = '<div>Static content</div>';
      const result = Templator.compile(template);

      expect(result).to.equal('<div>Static content</div>');
    });

    it('должен работать со сложными шаблонами', () => {
      const template = `
        <div class="user-card">
          <h2>{{user.name}}</h2>
          <p>{{user.email}}</p>
          {{#if user.isActive}}
            <span class="badge">Active</span>
          {{else}}
            <span class="badge">Inactive</span>
          {{/if}}
          <ul>
            {{#each user.roles}}
              <li>{{this}}</li>
            {{/each}}
          </ul>
        </div>
      `;
      const context = {
        user: {
          name: 'John Doe',
          email: 'john@test.com',
          isActive: true,
          roles: ['admin', 'user'],
        },
      };
      const result = Templator.compile(template, context);

      expect(result).to.include('John Doe');
      expect(result).to.include('john@test.com');
      expect(result).to.include('Active');
      expect(result).to.include('<li>admin</li>');
      expect(result).to.include('<li>user</li>');
    });
  });

  describe('registerHelper и unregisterHelper методы', () => {
    afterEach(() => {
      Templator.unregisterHelper('uppercase');
      Templator.unregisterHelper('multiply');
    });

    it('должен регистрировать кастомный helper', () => {
      Templator.registerHelper('uppercase', function(str: string) {
        return str.toUpperCase();
      });

      const template = '<div>{{uppercase name}}</div>';
      const context = { name: 'john' };
      const result = Templator.compile(template, context);

      expect(result).to.equal('<div>JOHN</div>');
    });

    it('должен работать с хелперами принимающими несколько аргументов', () => {
      Templator.registerHelper('multiply', function(a: number, b: number) {
        return a * b;
      });

      const template = '<div>{{multiply 5 3}}</div>';
      const result = Templator.compile(template, {});

      expect(result).to.equal('<div>15</div>');
    });

    it('должен удалять зарегистрированный helper', () => {
      Templator.registerHelper('uppercase', function(str: string) {
        return str.toUpperCase();
      });

      let template = '<div>{{uppercase name}}</div>';
      let context = { name: 'john' };
      let result = Templator.compile(template, context);
      expect(result).to.equal('<div>JOHN</div>');

      Templator.unregisterHelper('uppercase');

      template = '<div>{{uppercase name}}</div>';
      context = { name: 'john' };

      expect(() => {
        Templator.compile(template, context);
      }).to.throw();
    });
  });

  describe('Специальные переменные Handlebars', () => {
    it('должен работать с @index в циклах', () => {
      const template = '<ul>{{#each items}}<li>{{@index}}: {{this}}</li>{{/each}}</ul>';
      const context = { items: ['a', 'b', 'c'] };
      const result = Templator.compile(template, context);

      expect(result).to.equal('<ul><li>0: a</li><li>1: b</li><li>2: c</li></ul>');
    });

    it('должен работать с @first и @last', () => {
      const template = '{{#each items}}{{#if @first}}First: {{/if}}{{this}}{{#if @last}} Last{{/if}}{{/each}}';
      const context = { items: ['a', 'b', 'c'] };
      const result = Templator.compile(template, context);

      expect(result).to.include('First: a');
      expect(result).to.include('c Last');
    });
  });

  describe('Обработка ошибок', () => {
    it('должен обрабатывать некорректный синтаксис шаблона', () => {
      const template = '{{#if unclosed}}<div>Test</div>';

      expect(() => {
        Templator.compile(template, { unclosed: true });
      }).to.throw();
    });
  });
});

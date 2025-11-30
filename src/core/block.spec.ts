import { expect } from 'chai';
import sinon from 'sinon';
import { Block, type Props } from './block';

describe('Block', () => {
  class TestBlock extends Block<Props> {
    constructor(props: Props) {
      super(props);
    }

    protected render(): string {
      return '<div class="test-block">{{text}}</div>';
    }
  }

  class TestBlockWithChildren extends Block<Props> {
    constructor(props: Props) {
      super(props);
    }

    protected render(): string {
      return '<div class="parent">{{{child}}}</div>';
    }
  }

  describe('Создание компонента', () => {
    it('должен создавать экземпляр Block с пропсами', () => {
      const props = { text: 'Hello' };
      const block = new TestBlock(props);

      expect(block).to.be.instanceOf(Block);
      expect(block.props.text).to.equal('Hello');
    });

    it('должен генерировать уникальный id', () => {
      const block1 = new TestBlock({});
      const block2 = new TestBlock({});

      expect(block1.id).to.be.a('string');
      expect(block2.id).to.be.a('string');
      expect(block1.id).to.not.equal(block2.id);
    });

    it('должен разделять props и children', () => {
      const childBlock = new TestBlock({ text: 'child' });
      const parentBlock = new TestBlockWithChildren({
        text: 'parent',
        child: childBlock,
      });

      expect(parentBlock.props.text).to.equal('parent');
      expect(parentBlock.children.child).to.equal(childBlock);
    });
  });

  describe('Lifecycle методы', () => {
    it('должен вызвать init при создании', () => {
      const initStub = sinon.stub(TestBlock.prototype, 'init');

      new TestBlock({ text: 'test' });

      expect(initStub.calledOnce).to.be.true;

      initStub.restore();
    });

    it('должен вызвать componentDidMount', () => {
      const block = new TestBlock({ text: 'test' });
      const spy = sinon.spy(block, 'componentDidMount');

      block.dispatchComponentDidMount();

      expect(spy.calledOnce).to.be.true;
    });

    it('должен вызвать componentDidUpdate при изменении props', (done) => {
      const block = new TestBlock({ text: 'initial' });
      const spy = sinon.spy(block, 'componentDidUpdate');

      setTimeout(() => {
        block.setProps({ text: 'updated' });

        setTimeout(() => {
          expect(spy.called).to.be.true;
          done();
        }, 10);
      }, 10);
    });
  });

  describe('Рендеринг', () => {
    it('должен создать DOM элемент', () => {
      const block = new TestBlock({ text: 'Hello World' });

      const element = block.getContent();

      expect(element).to.be.instanceOf(HTMLElement);
      expect(element?.className).to.equal('test-block');
      expect(element?.textContent).to.equal('Hello World');
    });

    it('должен компилировать шаблон с Handlebars', () => {
      const block = new TestBlock({ text: 'Test Content' });

      const element = block.getContent();

      expect(element?.textContent).to.equal('Test Content');
    });

    it('должен рендерить дочерние компоненты', () => {
      const childBlock = new TestBlock({ text: 'Child' });
      const parentBlock = new TestBlockWithChildren({
        child: childBlock,
      });

      const element = parentBlock.getContent();
      const childElement = element?.querySelector('.test-block');

      expect(childElement).to.not.be.null;
      expect(childElement?.textContent).to.equal('Child');
    });

    it('должен рендерить массив дочерних компонентов', () => {
      class ListBlock extends Block<Props> {
        protected render(): string {
          return '<ul>{{{items}}}</ul>';
        }
      }

      class ItemBlock extends Block<Props> {
        protected render(): string {
          return '<li>{{text}}</li>';
        }
      }

      const items = [
        new ItemBlock({ text: 'Item 1' }),
        new ItemBlock({ text: 'Item 2' }),
        new ItemBlock({ text: 'Item 3' }),
      ];

      const listBlock = new ListBlock({ items });

      const element = listBlock.getContent();
      const listItems = element?.querySelectorAll('li');

      expect(listItems).to.have.lengthOf(3);
      expect(listItems?.[0].textContent).to.equal('Item 1');
      expect(listItems?.[1].textContent).to.equal('Item 2');
      expect(listItems?.[2].textContent).to.equal('Item 3');
    });
  });

  describe('Обновление props', () => {
    it('должен обновлять props через setProps', () => {
      const block = new TestBlock({ text: 'initial' });

      block.setProps({ text: 'updated' });

      expect(block.props.text).to.equal('updated');
    });

    it('должен перерендерить компонент при обновлении props', (done) => {
      const block = new TestBlock({ text: 'initial' });

      setTimeout(() => {
        const initialText = block.getContent()?.textContent;
        expect(initialText).to.equal('initial');

        block.setProps({ text: 'updated' });

        setTimeout(() => {
          const updatedText = block.getContent()?.textContent;
          expect(updatedText).to.equal('updated');
          done();
        }, 10);
      }, 10);
    });

    it('не должен обновлять props если передан null или undefined', () => {
      const block = new TestBlock({ text: 'initial' });

      block.setProps(null as any);
      block.setProps(undefined as any);

      expect(block.props.text).to.equal('initial');
    });
  });

  describe('События', () => {
    it('должен добавлять обработчики событий', () => {
      const clickHandler = sinon.spy();
      const block = new TestBlock({
        text: 'Click me',
        events: {
          click: clickHandler,
        },
      });

      const element = block.getContent();
      element?.click();

      expect(clickHandler.calledOnce).to.be.true;
    });

    it('должен поддерживать делегирование событий', () => {
      class ButtonBlock extends Block<Props> {
        protected render(): string {
          return '<div><button class="btn">Click</button></div>';
        }
      }

      const clickHandler = sinon.spy();
      const block = new ButtonBlock({
        events: {
          'click@.btn': clickHandler,
        },
      });

      const element = block.getContent();
      const button = element?.querySelector('.btn') as HTMLElement;
      button?.click();

      expect(clickHandler.calledOnce).to.be.true;
    });

    it('должен удалять старые обработчики при перерендере', (done) => {
      const oldHandler = sinon.spy();
      const newHandler = sinon.spy();

      const block = new TestBlock({
        text: 'test',
        events: { click: oldHandler },
      });

      setTimeout(() => {
        block.setProps({
          events: { click: newHandler },
        });

        setTimeout(() => {
          const element = block.getContent();
          element?.click();

          expect(oldHandler.called).to.be.false;
          expect(newHandler.calledOnce).to.be.true;
          done();
        }, 10);
      }, 10);
    });
  });

  describe('getContent', () => {
    it('должен возвращать DOM элемент', () => {
      const block = new TestBlock({ text: 'test' });

      const content = block.getContent();

      expect(content).to.be.instanceOf(HTMLElement);
    });

    it('должен возвращать тот же элемент при повторных вызовах', () => {
      const block = new TestBlock({ text: 'test' });

      const content1 = block.getContent();
      const content2 = block.getContent();

      expect(content1).to.equal(content2);
    });
  });

  describe('Проверка работы Proxy для props', () => {
    it('должен триггерить componentDidUpdate при изменении props через прямое присваивание', (done) => {
      const block = new TestBlock({ text: 'initial' });
      const spy = sinon.spy(block, 'componentDidUpdate');

      setTimeout(() => {
        block.props.text = 'changed';

        setTimeout(() => {
          expect(spy.called).to.be.true;
          done();
        }, 10);
      }, 10);
    });

    it('должен выбросить ошибку при попытке удалить свойство', () => {
      const block = new TestBlock({ text: 'test' });

      expect(() => {
        delete block.props.text;
      }).to.throw('No access');
    });
  });

  describe('dispatchComponentDidMount для дочерних компонентов', () => {
    it('должен вызвать componentDidMount у всех дочерних компонентов', () => {
      const child1 = new TestBlock({ text: 'child1' });
      const child2 = new TestBlock({ text: 'child2' });

      const spy1 = sinon.spy(child1, 'componentDidMount');
      const spy2 = sinon.spy(child2, 'componentDidMount');

      class ParentBlock extends Block<Props> {
        protected render(): string {
          return '<div>{{{child1}}}{{{child2}}}</div>';
        }
      }

      const parent = new ParentBlock({
        child1,
        child2,
      });

      parent.dispatchComponentDidMount();

      expect(spy1.calledOnce).to.be.true;
      expect(spy2.calledOnce).to.be.true;
    });
  });
});

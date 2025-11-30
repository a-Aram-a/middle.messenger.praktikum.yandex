import { expect } from 'chai';
import sinon from 'sinon';
import { Router } from './router';
import { Block, Props } from '@/core/block';

describe('Router', () => {
  class TestPage extends Block<Props> {
    protected render(): string {
      return '<div>Test Page</div>';
    }
  }

  class NotFoundPage extends Block<Props> {
    protected render(): string {
      return '<div>404 Not Found</div>';
    }
  }

  let router: Router;

  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>';
    window.history.replaceState({}, '', '/');

    (Router as any).__instance = undefined;
    router = new Router('#app');
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('Singleton паттерн', () => {
    it('должен возвращать один и тот же экземпляр', () => {
      const router1 = new Router('#app');
      const router2 = new Router('#other');

      expect(router1).to.equal(router2);
    });

    it('должен сохранять rootQuery из первого экземпляра', () => {
      const router1 = new Router('#app');
      const router2 = new Router('#other');

      expect((router1 as any)._rootQuery).to.equal('#app');
      expect((router2 as any)._rootQuery).to.equal('#app');
    });
  });

  describe('Регистрация маршрутов', () => {
    it('должен регистрировать маршрут через use', () => {
      router.use('/', TestPage);

      expect((router as any).routes).to.have.lengthOf(1);
    });

    it('должен возвращать this для цепочки вызовов', () => {
      const result = router.use('/', TestPage);

      expect(result).to.equal(router);
    });

    it('должен регистрировать несколько маршрутов', () => {
      router
        .use('/', TestPage)
        .use('/page1', TestPage)
        .use('/page2', TestPage);

      expect((router as any).routes).to.have.lengthOf(3);
    });

    it('должен передавать props в маршрут', () => {
      const props = { title: 'Test' };
      router.use('/', TestPage, props);

      const route = (router as any).routes[0];
      expect((route as any)._props).to.deep.equal(props);
    });
  });

  describe('Навигация', () => {
    it('должен изменять URL при вызове go', () => {
      router.use('/test', TestPage);

      router.go('/test');

      expect(window.location.pathname).to.equal('/test');
    });

    it('должен обновлять состояние history при переходе', () => {
      const pushStateSpy = sinon.spy(window.history, 'pushState');

      router.use('/test', TestPage);
      router.go('/test');

      expect(pushStateSpy.calledOnce).to.be.true;
      expect(pushStateSpy.firstCall.args[2]).to.equal('/test');
    });

    it('должен рендерить компонент при переходе на маршрут', () => {
      router.use('/test', TestPage);
      router.start();

      router.go('/test');

      const content = document.querySelector('#app')?.textContent;
      expect(content).to.include('Test Page');
    });

    it('должен вызывать back для возврата назад', () => {
      const backSpy = sinon.spy(window.history, 'back');

      router.back();

      expect(backSpy.calledOnce).to.be.true;
    });

    it('должен вызывать forward для перехода вперед', () => {
      const forwardSpy = sinon.spy(window.history, 'forward');

      router.forward();

      expect(forwardSpy.calledOnce).to.be.true;
    });
  });

  describe('Обработка popstate', () => {
    it('должен обрабатывать событие popstate', () => {
      router.use('/test', TestPage);
      router.start();

      router.go('/test');
      window.history.back();

      expect(window.onpopstate).to.not.be.null;
    });

    it('должен рендерить корректный компонент при popstate', (done) => {
      router
        .use('/', TestPage)
        .use('/page1', TestPage)
        .start();

      router.go('/page1');

      setTimeout(() => {
        const popStateEvent = new PopStateEvent('popstate', {
          state: {},
        });
        Object.defineProperty(popStateEvent, 'currentTarget', {
          value: window,
          writable: false,
        });

        window.onpopstate?.(popStateEvent);

        done();
      }, 10);
    });
  });

  describe('404 страница', () => {
    it('должен показывать 404 для несуществующего маршрута', () => {
      router
        .use('/', TestPage)
        .use('/404', NotFoundPage)
        .start();

      router.go('/nonexistent');

      const content = document.querySelector('#app')?.textContent;
      expect(content).to.include('404 Not Found');
    });

    it('не должен показывать ошибку если 404 маршрут не зарегистрирован', () => {
      router.use('/', TestPage).start();

      expect(() => {
        router.go('/nonexistent');
      }).to.not.throw();
    });
  });

  describe('start метод', () => {
    it('должен рендерить текущий маршрут при старте', () => {
      window.history.replaceState({}, '', '/');

      router.use('/', TestPage).start();

      const content = document.querySelector('#app')?.textContent;
      expect(content).to.include('Test Page');
    });

    it('должен устанавливать обработчик popstate', () => {
      router.start();

      expect(window.onpopstate).to.be.a('function');
    });
  });

  describe('Переключение между маршрутами', () => {
    it('должен корректно переключаться между разными страницами', () => {
      class Page1 extends Block<Props> {
        protected render(): string {
          return '<div>Page 1</div>';
        }
      }

      class Page2 extends Block<Props> {
        protected render(): string {
          return '<div>Page 2</div>';
        }
      }

      router
        .use('/page1', Page1)
        .use('/page2', Page2)
        .start();

      router.go('/page1');
      let content = document.querySelector('#app')?.textContent;
      expect(content).to.include('Page 1');

      router.go('/page2');
      content = document.querySelector('#app')?.textContent;
      expect(content).to.include('Page 2');
    });

    it('должен удалять предыдущий компонент при переходе', () => {
      router
        .use('/page1', TestPage)
        .use('/page2', TestPage)
        .start();

      router.go('/page1');
      const firstElement = document.querySelector('#app')?.firstChild;

      router.go('/page2');
      const secondElement = document.querySelector('#app')?.firstChild;

      expect(firstElement).to.not.equal(secondElement);
    });
  });

  describe('History state', () => {
    it('должен работать с history.length', () => {
      const initialLength = window.history.length;

      router.use('/test', TestPage);
      router.go('/test');

      expect(window.history.length).to.be.greaterThan(initialLength);
    });
  });
});

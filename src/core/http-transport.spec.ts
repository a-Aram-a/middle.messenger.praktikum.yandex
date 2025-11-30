import { expect } from 'chai';
import sinon from 'sinon';
import { HTTPTransport, Method } from './http-transport';

describe('HTTPTransport', () => {
  describe('GET метод', () => {
    it('должен формировать корректный URL без query параметров', (done) => {
      const transport = new HTTPTransport('https://api.test.com');

      const requestStub = sinon.stub(transport as any, 'request').callsFake((url: string, options: any) => {
        expect(url).to.equal('https://api.test.com/users');
        expect(options.method).to.equal(Method.Get);
        requestStub.restore();
        done();
        return Promise.resolve({} as XMLHttpRequest);
      });

      transport.get('/users');
    });

    it('должен добавлять query параметры к URL', (done) => {
      const transport = new HTTPTransport('https://api.test.com');

      const requestStub = sinon.stub(transport as any, 'request').callsFake((url: string) => {
        expect(url).to.equal('https://api.test.com/users?id=123&active=true');
        requestStub.restore();
        done();
        return Promise.resolve({} as XMLHttpRequest);
      });

      transport.get('/users', { data: { id: 123, active: true } });
    });

    it('должен разрешить промис при успешном ответе', () => {
      const transport = new HTTPTransport('https://api.test.com');

      const mockXHR = {
        status: 200,
        responseText: '{"users":[]}',
      } as XMLHttpRequest;

      sinon.stub(transport as any, 'request').resolves(mockXHR);

      return transport.get('/users').then((response) => {
        expect(response.status).to.equal(200);
        expect(response.responseText).to.equal('{"users":[]}');
      });
    });

    it('должен отклонить промис при ошибке', () => {
      const transport = new HTTPTransport('https://api.test.com');

      const mockXHR = {
        status: 404,
      } as XMLHttpRequest;

      sinon.stub(transport as any, 'request').rejects(mockXHR);

      return transport.get('/users').catch((error) => {
        expect(error.status).to.equal(404);
      });
    });
  });

  describe('POST метод', () => {
    it('должен отправлять запрос с данными', (done) => {
      const transport = new HTTPTransport('https://api.test.com');
      const data = { name: 'John', email: 'john@test.com' };

      const requestStub = sinon.stub(transport as any, 'request').callsFake((url: string, options: any) => {
        expect(url).to.equal('https://api.test.com/users');
        expect(options.method).to.equal(Method.Post);
        expect(options.data).to.deep.equal(data);
        requestStub.restore();
        done();
        return Promise.resolve({} as XMLHttpRequest);
      });

      transport.post('/users', { data });
    });
  });

  describe('PUT метод', () => {
    it('должен отправлять PUT запрос с данными', (done) => {
      const transport = new HTTPTransport('https://api.test.com');
      const data = { name: 'Jane' };

      const requestStub = sinon.stub(transport as any, 'request').callsFake((url: string, options: any) => {
        expect(url).to.equal('https://api.test.com/users/1');
        expect(options.method).to.equal(Method.Put);
        expect(options.data).to.deep.equal(data);
        requestStub.restore();
        done();
        return Promise.resolve({} as XMLHttpRequest);
      });

      transport.put('/users/1', { data });
    });
  });

  describe('DELETE метод', () => {
    it('должен отправлять DELETE запрос', (done) => {
      const transport = new HTTPTransport('https://api.test.com');

      const requestStub = sinon.stub(transport as any, 'request').callsFake((url: string, options: any) => {
        expect(url).to.equal('https://api.test.com/users/1');
        expect(options.method).to.equal(Method.Delete);
        requestStub.restore();
        done();
        return Promise.resolve({} as XMLHttpRequest);
      });

      transport.delete('/users/1');
    });
  });

  describe('Обработка таймаутов', () => {
    it('должен использовать переданный timeout', (done) => {
      const transport = new HTTPTransport('https://api.test.com');
      const customTimeout = 10000;

      const requestStub = sinon.stub(transport as any, 'request').callsFake((_url: string, _options: any, timeout: number) => {
        expect(timeout).to.equal(customTimeout);
        requestStub.restore();
        done();
        return Promise.resolve({} as XMLHttpRequest);
      });

      transport.get('/users', { timeout: customTimeout });
    });

    it('должен использовать дефолтный timeout если не указан', (done) => {
      const transport = new HTTPTransport('https://api.test.com');

      const requestStub = sinon.stub(transport as any, 'request').callsFake((_url: string, _options: any, timeout?: number) => {
        expect(timeout).to.be.undefined;
        requestStub.restore();
        done();
        return Promise.resolve({} as XMLHttpRequest);
      });

      transport.get('/users');
    });
  });

  describe('Заголовки', () => {
    it('должен передавать кастомные заголовки', (done) => {
      const transport = new HTTPTransport('https://api.test.com');
      const headers = {
        'Authorization': 'Bearer token123',
        'X-Custom-Header': 'custom-value',
      };

      const requestStub = sinon.stub(transport as any, 'request').callsFake((_url: string, options: any) => {
        expect(options.headers).to.deep.equal(headers);
        requestStub.restore();
        done();
        return Promise.resolve({} as XMLHttpRequest);
      });

      transport.get('/users', { headers });
    });
  });

  describe('queryStringify', () => {
    it('должен формировать query string из объекта', (done) => {
      const transport = new HTTPTransport('https://api.test.com');

      const requestStub = sinon.stub(transport as any, 'request').callsFake((url: string) => {
        expect(url).to.include('?id=1&name=test&active=true');
        requestStub.restore();
        done();
        return Promise.resolve({} as XMLHttpRequest);
      });

      transport.get('/users', { data: { id: 1, name: 'test', active: true } });
    });
  });
});

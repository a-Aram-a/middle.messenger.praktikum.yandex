import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!DOCTYPE html><html><body><div id="app"></div></body></html>', {
  url: 'http://localhost',
});

global.window = dom.window as unknown as Window & typeof globalThis;
global.document = dom.window.document;
global.HTMLElement = dom.window.HTMLElement;
global.DocumentFragment = dom.window.DocumentFragment;
global.Node = dom.window.Node;
global.PopStateEvent = dom.window.PopStateEvent as any;


global.XMLHttpRequest = class XMLHttpRequest {
  public status = 0;
  public statusText = '';
  public responseText = '';
  public response = '';
  public readyState = 0;
  public timeout = 0;
  public withCredentials = false;

  public onload: (() => void) | null = null;
  public onerror: (() => void) | null = null;
  public onabort: (() => void) | null = null;
  public ontimeout: (() => void) | null = null;

  private _headers: Record<string, string> = {};
  private _method = '';
  private _url = '';

  open(method: string, url: string): void {
    this._method = method;
    this._url = url;
  }

  send(_data?: any): void {
  }

  setRequestHeader(name: string, value: string): void {
    this._headers[name] = value;
  }

  abort(): void {
    if (this.onabort) {
      this.onabort();
    }
  }
} as any;


global.history = {
  pushState: () => {},
  replaceState: () => {},
  back: () => {},
  forward: () => {},
  go: () => {},
  length: 1,
  state: null,
  scrollRestoration: 'auto',
} as any;

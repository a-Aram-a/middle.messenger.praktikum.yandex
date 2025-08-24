import {EventBus} from './event-bus';
import {nanoid} from 'nanoid';
import Handlebars from 'handlebars';

// Base type for events with delegation support ('eventName@selector')
type Events = { [key: string]: (event: Event) => void };

// Base type for props
export type Props = {
  events?: Events;
  [key: string]: unknown;
};

// any is used as the default value for the generic P to simplify the creation of components
// without explicitly specifying props. This is a deliberate compromise for the flexibility of the framework.
export class Block<P extends Props = any> {
  static EVENTS = {
    INIT: 'init',
    FLOW_CDM: 'flow:component-did-mount',
    FLOW_CDU: 'flow:component-did-update',
    FLOW_RENDER: 'flow:render',
  } as const;

  public id = nanoid(6);

  protected props: P;

  public children: Record<string, Block | Block[]>;

  private eventBus: () => EventBus;

  private _element: HTMLElement | null = null;

  constructor(propsWithChildren: P) {
    const eventBus = new EventBus();

    const {props, children} = this._separatePropsAndChildren(propsWithChildren);

    this.children = children;
    this.props = this._makePropsProxy({...props, ...children});
    this.eventBus = () => eventBus;

    this._registerEvents(eventBus);
    eventBus.emit(Block.EVENTS.INIT);
  }

  private _separatePropsAndChildren(propsAndChildren: P): { props: P; children: Record<string, Block | Block[]> } {
    const props: Record<string, unknown> = {};
    const children: Record<string, Block | Block[]> = {};

    Object.entries(propsAndChildren).forEach(([key, value]) => {
      if (value instanceof Block || (Array.isArray(value) && value.every(v => v instanceof Block))) {
        children[key] = value;
      } else {
        props[key] = value;
      }
    });

    return {props: props as P, children};
  }

  private _registerEvents(eventBus: EventBus) {
    eventBus.on(Block.EVENTS.INIT, this._init.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
    eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
  }

  private _init() {
    this.init();
    this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
  }

  protected init() {
  }

  private _componentDidMount() {
    this.componentDidMount();
  }

  public componentDidMount() {
  }

  public dispatchComponentDidMount() {
    this.eventBus().emit(Block.EVENTS.FLOW_CDM);
    Object.values(this.children).forEach(child => {
      if (Array.isArray(child)) {
        child.forEach(c => c.dispatchComponentDidMount());
      } else {
        child.dispatchComponentDidMount();
      }
    });
  }

  private _componentDidUpdate(oldProps: P, newProps: P) {
    if (this.componentDidUpdate(oldProps, newProps)) {
      this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
    }
  }

  protected componentDidUpdate(_oldProps: P, _newProps: P) {
    return true;
  }

  public setProps = (nextProps: Partial<P>) => {
    if (!nextProps) {
      return;
    }
    Object.assign(this.props, nextProps);
  };

  get element() {
    return this._element;
  }

  private _render() {
    const fragment = this.compile(this.render(), this.props);
    const newElement = fragment.firstElementChild as HTMLElement;

    if (this._element) {
      this._removeEvents();
      this._element.replaceWith(newElement);
    }

    this._element = newElement;
    this._addEvents();
  }

  protected render(): string {
    return '';
  }

  private compile(template: string, props: P): DocumentFragment {
    // separate the child components from the rest of the props
    const {props: propsWithoutChildren, children} = this._separatePropsAndChildren(props);
    this.children = children; // update children for dispatchComponentDidMount

    const fragment = document.createElement('template');

    // create "stubs" for the child components
    const stubs = Object.entries(children).reduce((acc, [key, child]) => {
      if (Array.isArray(child)) {
        acc[key] = child.map(c => `<div data-id="${c.id}"></div>`);
      } else {
        acc[key] = `<div data-id="${(child as Block).id}"></div>`;
      }
      return acc;
    }, {} as Record<string, string | string[]>);

    // compile the template with primitive props and stubs
    fragment.innerHTML = Handlebars.compile(template)({...propsWithoutChildren, ...stubs});

    // replace the stubs with real DOM elements of the child components
    Object.values(children).forEach(child => {
      if (Array.isArray(child)) {
        child.forEach(c => {
          const stub = fragment.content.querySelector(`[data-id="${c.id}"]`);
          stub?.replaceWith(c.getContent()!);
        });
      } else {
        const stub = fragment.content.querySelector(`[data-id="${(child as Block).id}"]`);
        stub?.replaceWith((child as Block).getContent()!);
      }
    });

    return fragment.content;
  }

  public getContent(): HTMLElement | null {
    return this.element;
  }

  private _makePropsProxy(props: P): P {
    const self = this;
    return new Proxy(props, {
      get(target, prop: string) {
        const value = target[prop];
        return typeof value === 'function' ? value.bind(target) : value;
      },
      set(target, prop: string, value) {
        const oldProps = {...target};
        target[prop as keyof P] = value;
        self.eventBus().emit(Block.EVENTS.FLOW_CDU, oldProps, target);
        return true;
      },
      deleteProperty() {
        throw new Error('No access');
      },
    });
  }

  private _addEvents() {
    const {events = {}} = this.props;

    Object.entries(events).forEach(([eventSpec, listener]) => {
      const [eventName, selector] = eventSpec.split('@');

      if (selector) {
        const targets = this._element?.querySelectorAll(selector);
        targets?.forEach(target => target.addEventListener(eventName, listener));
      } else {
        this._element?.addEventListener(eventName, listener);
      }
    });
  }

  private _removeEvents() {
    const {events = {}} = this.props;

    Object.entries(events).forEach(([eventSpec, listener]) => {
      const [eventName, selector] = eventSpec.split('@');

      if (selector) {
        const targets = this._element?.querySelectorAll(selector);
        targets?.forEach(target => target.removeEventListener(eventName, listener));
      } else {
        this._element?.removeEventListener(eventName, listener);
      }
    });
  }
}

import {type Block, type Props} from '@/core/block';
import {Route} from './route';

type BlockConstructor<P extends Props> = new (props: P) => Block<P>;

export class Router {
  private static __instance: Router;

  private routes: Route<any>[] = [];

  private history: History = window.history;

  private _currentRoute: Route<any> | null = null;

  private readonly _rootQuery: string;

  constructor(rootQuery: string) {
    if (Router.__instance) {
      this._rootQuery = Router.__instance._rootQuery;
      return Router.__instance;
    }

    this._rootQuery = rootQuery;
    Router.__instance = this;
  }

  public use<P extends Props>(pathname: string, block: BlockConstructor<P>, props: P = {} as P): Router {
    const route = new Route(pathname, block, this._rootQuery, props);
    this.routes.push(route);

    return this;
  }

  public start(): void {
    window.onpopstate = (event: PopStateEvent) => {
      const target = event.currentTarget as Window;
      this._onRoute(target.location.pathname);
    };

    this._onRoute(window.location.pathname);
  }

  private _onRoute(pathname: string): void {
    const route = this.getRoute(pathname);

    if (!route) {
      const notFoundRoute = this.getRoute('/404');
      if (notFoundRoute) {
        this._currentRoute?.leave();
        this._currentRoute = notFoundRoute;
        notFoundRoute.render();
      }
      return;
    }

    if (this._currentRoute && this._currentRoute !== route) {
      this._currentRoute.leave();
    }

    this._currentRoute = route;
    route.render();
  }

  public go(pathname: string): void {
    this.history.pushState({}, '', pathname);
    this._onRoute(pathname);
  }

  public back(): void {
    this.history.back();
  }

  public forward(): void {
    this.history.forward();
  }

  private getRoute(pathname: string): Route<any> | undefined {
    return this.routes.find(route => route.match(pathname));
  }
}

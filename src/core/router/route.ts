import { type Block, type Props } from '@/core/block';
import { renderDOM } from '@/core/render-dom';

type BlockConstructor<P extends Props> = new (props: P) => Block<P>;

export class Route<P extends Props> {
  private _pathname: string;

  private readonly _blockClass: BlockConstructor<P>;

  private _block: Block<P> | null = null;

  private readonly _rootQuery: string;

  private readonly _props: P;

  constructor(pathname: string, view: BlockConstructor<P>, rootQuery: string, props: P) {
    this._pathname = pathname;
    this._blockClass = view;
    this._rootQuery = rootQuery;
    this._props = props;
  }

  public navigate(pathname: string): void {
    if (this.match(pathname)) {
      this._pathname = pathname;
      this.render();
    }
  }

  public leave(): void {
    if (this._block) {
      this._block.getContent()?.remove();
      this._block = null;
    }
  }

  public match(pathname: string): boolean {
    return pathname === this._pathname;
  }

  public render(): void {
    if (!this._block) {
      this._block = new this._blockClass(this._props);
    }

    renderDOM(this._rootQuery, this._block);
  }
}

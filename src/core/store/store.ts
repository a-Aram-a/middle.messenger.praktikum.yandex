import { EventBus } from '@/core/event-bus';
import set from '@/utils/mydash/set';
import { type Block } from '@/core/block';

export enum StoreEvents {
  Updated = 'updated',
}

export type TStateMapper = (state: Record<string, unknown>) => Record<string, unknown>;


class Store extends EventBus {
  private state: Record<string, unknown> = {};

  public getState() {
    return this.state;
  }

  public set(path: string, value: unknown) {
    set(this.state, path, value);
    this.emit(StoreEvents.Updated);
  }
}

const store = new Store();


export function connect(mapStateToProps: TStateMapper) {
  return function <P extends Record<string, any>>(Component: new (props: P) => Block<P>) {
    return class extends Component {
      constructor(props: P) {
        super({ ...props, ...mapStateToProps(store.getState()) });

        store.on(StoreEvents.Updated, () => {
          const newProps = mapStateToProps(store.getState());
          this.setProps(newProps as Partial<P>);
        });
      }
    };
  };
}


export default store;

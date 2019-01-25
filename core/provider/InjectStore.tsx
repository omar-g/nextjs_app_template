import * as React from 'react';
import { container } from './container';

export function injectStore<E>(injected: E) {
  return <P extends React.ComponentType<Matching<TInjectCfg<E>, GetProps<P>>>>(Component: P) => {
    const injProps: () => TInjectCfg<E> = () => Object.keys(injected).reduce(
      // @ts-ignore
      (acc, val: string) => ({ ...acc, [val]: container.get(injected[val]) }),
      {} as TInjectCfg<E>,
    );

    return class InjectWrap extends React.Component<Omit<GetProps<P>, E>> {
      private injProps: TInjectCfg<E>;

      public constructor(props: Omit<GetProps<P>, E>) {
        super(props);
        this.injProps = injProps();
      }

      public render() {
        return React.createElement(
          // tslint:disable-next-line:no-any
          Component as any,
          { ...this.props, ...this.injProps },
          this.props.children,
        );
      }
    };
  };
}

// tslint:disable-next-line:no-any
type TInjectCfg<CFG extends any> = {
  [N in keyof CFG]: InstanceType<CFG[N]>;
};

export type Matching<InjectedProps, DecorationTargetProps> = {
  [P in keyof DecorationTargetProps]: P extends keyof InjectedProps
    ? InjectedProps[P] extends DecorationTargetProps[P]
      ? DecorationTargetProps[P]
      : InjectedProps[P]
    : DecorationTargetProps[P];
};

export type GetProps<C> = C extends React.ComponentType<infer P> ? P : never;

export type ExcludeValue<From, Value> = Pick<From, {
  [N in keyof From]: From[N] extends Value ? never : N
}[keyof From]>;

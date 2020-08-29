import React, { FC, ReactNode } from 'react';
import { useData, useHistory, useEpicNavigation, usePage } from './model';
import { RouteContext } from '../../utils/private';
import { RootProps as RootComponentProps } from '@vkontakte/vkui/dist/components/Root/Root';
import { EpicProps as EpicComponentProps } from '@vkontakte/vkui/dist/components/Epic/Epic';
import { ViewProps as ViewComponentProps } from '@vkontakte/vkui/dist/components/View/View';
import { PanelProps as PanelComponentProps } from '@vkontakte/vkui/dist/components/Panel/Panel';
import {
  Root as RootComponent,
  Epic as EpicComponent,
  View as ViewComponent,
  Panel as PanelComponent,
} from '@vkontakte/vkui';
import './styles.scss';

export type RootProps = Omit<RootComponentProps, 'activeView'>;

export const Root: FC<RootProps> = ({ id, ...props }) => {
  const { value, active } = useData(id);

  return active ? (
    <RouteContext.Provider value={value}>
      <RootComponent activeView={active} id={id} {...props} />
    </RouteContext.Provider>
  ) : null;
};

export type EpicProps = Omit<EpicComponentProps, 'activeStory' | 'tabbar'> & {
  tabbar: (props: ReturnType<typeof useEpicNavigation>) => ReactNode;
};

export const Epic: FC<EpicProps> = ({ id, tabbar, ...props }) => {
  const { value, active, router, path, isCurrent } = useData(id);
  const data = useEpicNavigation(
    router,
    path,
    isCurrent,
    value.depth - 1,
    active,
  );

  const tb = tabbar?.(data);

  return active ? (
    <RouteContext.Provider value={value}>
      <EpicComponent
        className={!tb && 'Epic--no-tabbar'}
        activeStory={active}
        id={id}
        tabbar={tb}
        {...props}
      />
    </RouteContext.Provider>
  ) : null;
};

export type ViewProps = Omit<ViewComponentProps, 'activePanel' | 'history'> & {
  history?: boolean;
};

export const View: FC<ViewProps> = ({ id, history = false, ...props }) => {
  const { value, active } = useData(id);
  const history$ = useHistory(id, value, history);

  return active ? (
    <RouteContext.Provider value={value}>
      <ViewComponent
        activePanel={active}
        id={id}
        history={history ? history$ : undefined}
        {...props}
      />
    </RouteContext.Provider>
  ) : null;
};

export type PanelProps = PanelComponentProps;

export const Panel: FC<PanelProps> = ({ id, ...props }) => {
  const { value } = useData(id);

  return (
    <RouteContext.Provider value={value}>
      <PanelComponent id={id} {...props} />
    </RouteContext.Provider>
  );
};

export type PageProps = Omit<ViewComponentProps, 'activePanel'> & {
  id: string;
};

export const Page: FC<PageProps> = ({ children, id, ...props }) => {
  const value = usePage(id);

  return (
    <RouteContext.Provider value={value}>
      {typeof children === 'function' ? (
        children(props)
      ) : (
        <ViewComponent activePanel={'main'} {...props}>
          <PanelComponent id={'main'}>{children}</PanelComponent>
        </ViewComponent>
      )}
    </RouteContext.Provider>
  );
};

declare module 'react-window-scroller' {
  import { FC, ReactNode, MutableRefObject } from 'react';

  interface ScrollerParams {
    ref: MutableRefObject<any>;
    outerRef: MutableRefObject<any>;
    style: {
      width: string;
      height: string;
      display: string;
    };
    onScroll: (options: any) => void;
  }

  interface ScrollerProps {
    throttleTime?: number;
    isGrid?: boolean;
    children: (params: ScrollerParams) => ReactNode;
  }

  export const ReactWindowScroller: FC<ScrollerProps>;
}

declare module 'eruda' {
  export const init: () => void;
  export const add: (module: any) => void;
}

declare module 'eruda-code' {
  export default {};
}

declare module 'eruda-dom' {
  export default {};
}

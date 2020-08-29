import React, { Component, MouseEventHandler, SyntheticEvent } from 'react';
import { transitionEvent } from '@vkontakte/vkui/dist/lib/supportEvents';
import { ANDROID } from '@vkontakte/vkui/dist/lib/platform';
import PopoutWrapper from '@vkontakte/vkui/dist/components/PopoutWrapper/PopoutWrapper';
import classNames from '@vkontakte/vkui/dist/lib/classNames';
import getClassName from '@vkontakte/vkui/dist/helpers/getClassName';
import Tappable from '@vkontakte/vkui/dist/components/Tappable/Tappable';
import withPlatform from '@vkontakte/vkui/dist/hoc/withPlatform';
import {
  AlertActionInterface,
  AlertProps,
  AlertState,
} from '@vkontakte/vkui/dist/components/Alert/Alert';

type TransitionEndHandler = (e?: TransitionEvent) => void;

type ItemClickHander = (item: AlertActionInterface) => () => void;

class AlertNotClosable extends Component<AlertProps, AlertState> {
  constructor(props: AlertProps) {
    super(props);
    this.element = React.createRef();
    this.state = {
      closing: false,
    };
  }

  element: React.RefObject<HTMLDivElement>;

  private transitionFinishTimeout: ReturnType<typeof setTimeout>;

  static defaultProps: AlertProps = {
    actionsLayout: 'horizontal',
    actions: [],
  };

  onItemClick: ItemClickHander = (item: AlertActionInterface) => () => {
    const { action, autoclose } = item;

    if (autoclose) {
      this.setState({ closing: true });
      this.waitTransitionFinish((e?: TransitionEvent) => {
        if (!e || e.propertyName === 'opacity') {
          autoclose && this.props.onClose();
          action && action();
        }
      });
    } else {
      action && action();
    }
  };

  onClose: VoidFunction = () => {
    this.setState({ closing: true });
    this.waitTransitionFinish((e?: TransitionEvent) => {
      if (!e || e.propertyName === 'opacity') {
        this.props.onClose();
      }
    });
  };

  stopPropagation: MouseEventHandler = (e: SyntheticEvent) => {
    e.stopPropagation();
  };

  waitTransitionFinish(eventHandler: TransitionEndHandler) {
    if (transitionEvent.supported) {
      // @ts-ignore
      this.element.current.removeEventListener(
        transitionEvent.name,
        eventHandler,
      );
      // @ts-ignore
      this.element.current.addEventListener(transitionEvent.name, eventHandler);
    } else {
      clearTimeout(this.transitionFinishTimeout);
      this.transitionFinishTimeout = setTimeout(
        eventHandler.bind(this),
        this.props.platform === ANDROID ? 200 : 300,
      );
    }
  }

  render() {
    const {
      actions,
      actionsLayout,
      children,
      className,
      style,
      platform,
      ...restProps
    } = this.props;
    const { closing } = this.state;

    return (
      <PopoutWrapper
        className={className}
        closing={closing}
        style={style}
        onClick={this.props.onClick}
      >
        <div
          {...restProps}
          ref={this.element}
          onClick={this.stopPropagation}
          className={classNames(getClassName('Alert', platform), {
            'Alert--v': actionsLayout === 'vertical',
            'Alert--h': actionsLayout === 'horizontal',
            'Alert--closing': closing,
          })}
        >
          <div className="Alert__content">{children}</div>
          <footer className="Alert__footer">
            {actions.map((action: AlertActionInterface, i: number) => {
              return (
                <Tappable
                  Component="button"
                  className={classNames(
                    'Alert__btn',
                    `Alert__btn--${action.mode}`,
                  )}
                  onClick={this.onItemClick(action)}
                  key={`alert-action-${i}`}
                >
                  <span dangerouslySetInnerHTML={{ __html: action.title }} />
                </Tappable>
              );
            })}
          </footer>
        </div>
      </PopoutWrapper>
    );
  }
}

export default withPlatform(AlertNotClosable);

import React, { Children, Component, ReactElement } from 'react';
import { transitionEvent } from '@vkontakte/vkui/dist/lib/supportEvents';
import { ANDROID, IOS } from '@vkontakte/vkui/dist/lib/platform';
import PopoutWrapper from '@vkontakte/vkui/dist/components/PopoutWrapper/PopoutWrapper';
import classNames from '@vkontakte/vkui/dist/lib/classNames';
import getClassName from '@vkontakte/vkui/dist/helpers/getClassName';
import { isNumeric } from '@vkontakte/vkui/dist/lib/utils';
import withPlatform from '@vkontakte/vkui/dist/hoc/withPlatform';
import withInsets from '@vkontakte/vkui/dist/hoc/withInsets';
import {
  ActionSheetProps,
  ActionSheetState,
  ActionType,
  AnimationEndCallback,
  ClickHandler,
  CloseCallback,
  IsItemLast,
  ItemClickHandler,
} from '@vkontakte/vkui/dist/components/ActionSheet/ActionSheet';

class ActionSheetNotClosable extends Component<
  ActionSheetProps,
  ActionSheetState
> {
  constructor(props: ActionSheetProps) {
    super(props);
    this.elRef = React.createRef();
  }

  state: ActionSheetState = {
    closing: false,
  };

  elRef: React.RefObject<HTMLDivElement>;

  private transitionFinishTimeout: ReturnType<typeof setTimeout>;

  onClose: CloseCallback = () => {
    this.setState({ closing: true });
    this.waitTransitionFinish(this.props.onClose);
  };

  onItemClick: ItemClickHandler = (action: ActionType, autoclose: boolean) => (
    event: React.MouseEvent,
  ) => {
    event.persist();

    if (autoclose) {
      this.setState({ closing: true });
      this.waitTransitionFinish(() => {
        autoclose && this.props.onClose();
        action && action(event);
      });
    } else {
      action && action(event);
    }
  };

  stopPropagation: ClickHandler = (e: React.MouseEvent<HTMLDivElement>) =>
    e.stopPropagation();

  waitTransitionFinish(eventHandler: AnimationEndCallback) {
    if (transitionEvent.supported) {
      // @ts-ignore
      this.elRef.current.removeEventListener(
        transitionEvent.name,
        eventHandler,
      );
      // @ts-ignore
      this.elRef.current.addEventListener(transitionEvent.name, eventHandler);
    } else {
      clearTimeout(this.transitionFinishTimeout);
      this.transitionFinishTimeout = setTimeout(
        eventHandler,
        this.props.platform === ANDROID ? 200 : 300,
      );
    }
  }

  isItemLast: IsItemLast = (index: number) => {
    const childrenArray = Children.toArray(this.props.children);
    const lastElement = childrenArray[childrenArray.length - 1] as ReactElement;

    if (index === childrenArray.length - 1) {
      return true;
    } else if (
      index === childrenArray.length - 2 &&
      lastElement.props.mode === 'cancel'
    ) {
      return true;
    }

    return false;
  };

  render() {
    const {
      children,
      className,
      header,
      text,
      style,
      insets,
      platform,
      ...restProps
    } = this.props;

    return (
      <PopoutWrapper
        closing={this.state.closing}
        alignY="bottom"
        className={className}
        style={style}
        onClick={this.props.onClick}
      >
        <div
          {...restProps}
          ref={this.elRef}
          onClick={this.stopPropagation}
          className={classNames(getClassName('ActionSheet', platform), {
            'ActionSheet--closing': this.state.closing,
          })}
        >
          {platform === IOS && (
            <header className="ActionSheet__header">
              {header && <div className="ActionSheet__title">{header}</div>}
              {text && <div className="ActionSheet__text">{text}</div>}
            </header>
          )}
          {(Children.toArray(children) as any[]).map(
            (child, index, arr) =>
              child &&
              React.cloneElement(child, {
                onClick: this.onItemClick(
                  child.props.onClick,
                  child.props.autoclose,
                ),
                style:
                  index === arr.length - 1 && isNumeric(insets.bottom)
                    ? { marginBottom: insets.bottom }
                    : null,
                isLast: this.isItemLast(index),
              }),
          )}
        </div>
      </PopoutWrapper>
    );
  }
}

export default withPlatform(withInsets(ActionSheetNotClosable));

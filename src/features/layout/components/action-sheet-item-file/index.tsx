import React, { InputHTMLAttributes } from 'react';
import {
  classNames,
  getClassName,
  Tappable,
  usePlatform,
} from '@vkontakte/vkui';
import { ActionSheetItemProps } from '@vkontakte/vkui/dist/components/ActionSheetItem/ActionSheetItem';
import './styles.scss';

const ActionSheetItemFile: React.FunctionComponent<
  ActionSheetItemProps & InputHTMLAttributes<HTMLInputElement>
> = ({
  className,
  children,
  autoclose,
  mode,
  // meta,
  // subtitle,
  before,
  isLast,
  ...restProps
}: ActionSheetItemProps) => {
  const platform = usePlatform();

  return (
    <Tappable
      {...restProps}
      className={classNames(
        getClassName('ActionSheetItem', platform),
        className,
        `ActionSheetItem--${mode}`,
        // eslint-disable-next-line
        { ['ActionSheetItem--last']: isLast },
        'ActionSheetItem--file',
      )}
      Component={'label'}
    >
      {before && <div className="ActionSheetItem__before">{before}</div>}
      <div className="ActionSheetItem__container">
        <div className="ActionSheetItem__content">
          <div className="ActionSheetItem__children">{children}</div>
          {/* {meta && <div className="ActionSheetItem__meta">{meta}</div>} */}
          {/* {subtitle && <div className="ActionSheetItem__descr">{subtitle}</div>} */}
        </div>
      </div>
    </Tappable>
  );
};

ActionSheetItemFile.defaultProps = {
  mode: 'default',
};

export default ActionSheetItemFile;

import ButtonTheme from './ButtonTheme';
import classNames from 'classnames';
import React from 'react';
import SelectionHelper from '../../helper/SelectionHelper';
import style from './styles.module.scss';
import Highlight from '../Highlight';
import { styles } from '@material-ui/pickers/views/Calendar/Calendar';

const Button = ({
  children,
  highlightType,
  highlightTheme,
  className,
  theme,
  onClick,
  withoutBackground = false,
  disabled,
  disabledWithOverlay = true,
  fixed,
  dataTrackingId,
}) => {
  const renderButtonDisabledOverlay = () => {
    if (disabled && disabledWithOverlay) {
      return <span className={style.buttonDisabledOverlay}></span>;
    }

    return null;
  };

  const renderHighlight = () => {
    if (highlightType) {
      return (
        <Highlight
          className={style.highlight}
          highlightType={highlightType}
          highlightTheme={highlightTheme}
        />
      );
    }

    return null;
  };
  return (
    <span
      className={classNames(
        style.button,
        className,
        fixed ? style.buttonFixed : null,
        withoutBackground ? style.withoutBackground : null,
        disabled ? style.disabled : null,
        SelectionHelper.get(theme, {
          [ButtonTheme.authenticationScreenButton]:
            style.authenticationScreenButton,
          [ButtonTheme.welcomeScreenButton]: style.welcomeScreenButton,
        })
      )}
      disabled={disabled}
      onClick={disabled ? null : onClick}
      data-tracking-id={dataTrackingId}
    >
      <div className={style.buttonInnerBackground}></div>
      {renderButtonDisabledOverlay()}
      <span>{children}</span>
      {renderHighlight()}
    </span>
  );
};

export default Button;

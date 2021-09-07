import React from 'react';
import _ from 'lodash';
import ChoiceSelectorTheme from '../ChoiceSelector/ChoiceSelectorTheme';
import classNames from 'classnames';
import styles from './styles.module.scss';

const ChoiceSelectorList = ({
  className,
  outcomes,
  renderChoiceSelector,
  resolved = false,
  forceSelect = false,
  pageSize = 2,
}) => {
  const renderPlaceholderChoiceSelector = () => {
    const outcomeSize = _.size(outcomes);
    const outcomesSizeModuloPageSize = outcomeSize % pageSize;
    const outcomesSizeIsOdd = outcomesSizeModuloPageSize !== 0;

    if (outcomesSizeIsOdd) {
      return _.map(_.range(0, outcomesSizeModuloPageSize), (value, index) => (
        <div key={index} className={styles.emptyChoiceSelector}></div>
      ));
    }

    return null;
  };

  const renderChoiceSelectors = () => {
    const themeArray = [];
    for (let theme in ChoiceSelectorTheme) {
      themeArray.push(theme);
    }

    return (
      <>
        {_.map(outcomes, (outcome, arrayIndex) => {
          const index = outcome.index;
          const theme = themeArray[arrayIndex % themeArray.length];

          return renderChoiceSelector(
            index,
            outcome.name,
            theme,
            styles,
            resolved,
            forceSelect
          );
        })}
      </>
    );
  };

  return (
    <div className={classNames(styles.choiceContainer, className)}>
      {renderChoiceSelectors()}
      {renderPlaceholderChoiceSelector()}
    </div>
  );
};

export default ChoiceSelectorList;

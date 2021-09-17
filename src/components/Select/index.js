import { useState } from 'react';
import styles from './styles.module.scss';
import classNames from 'classnames';
import { ReactComponent as ArrowIcon } from '../../data/icons/arrow-down.svg';
import { useOutsideClick } from '../../hooks/useOutsideClick';

function Select({ value, handleSelect, placeholder, options = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const element = useOutsideClick(() => {
    setIsOpen(false);
  });

  const handleSelectOpen = () => {
    setIsOpen(prevValue => !prevValue);
  };

  const handleSelectItem = item => {
    handleSelect(item);
    setIsOpen(false);
  };

  const getLabel = value => {
    return options ? options.find(option => option.value === value)?.label : '';
  };

  return (
    <div className={styles.selectContainer} ref={element}>
      <div
        className={classNames(styles.selectField, {
          [styles.open]: isOpen,
        })}
        onClick={handleSelectOpen}
      >
        {value ? (
          <span className={styles.selectedItem}>{getLabel(value)}</span>
        ) : (
          <span className={styles.placeholder}>{placeholder}</span>
        )}
        <ArrowIcon className={styles.arrowIcon} />
      </div>
      {isOpen && (
        <div
          className={classNames(styles.selectOverflowContainer, {
            [styles.open]: isOpen,
          })}
        >
          <div
            className={classNames(styles.selectOptions, {
              [styles.open]: isOpen,
            })}
          >
            {options.map(item => (
              <div
                key={item.label}
                className={styles.selectItem}
                onClick={() => handleSelectItem(item.value)}
              >
                {item.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Select;

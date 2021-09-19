import styles from './styles.module.scss';
import _ from 'lodash';
import StateBadge from '../StateBadge';
import classNames from 'classnames';
import { formatToFixed } from '../../helper/FormatNumbers';
import { calculateGain } from '../../helper/Calculation';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { PopupActions } from 'store/actions/popup';
import PopupTheme from 'components/Popup/PopupTheme';
import moment from 'moment';
import BetState from 'constants/BetState';

const MyTradesList = ({
  bets,
  withStatus = false,
  closeDrawer,
  allowCashout = false,
  showPulloutBetPopup,
}) => {
  const betsSorted = _.orderBy(bets, ['date'], ['desc']);

  const isFinalizedTrade = status =>
    [BetState.closed, BetState.canceled].includes(status);

  const renderBets = () => {
    return _.map(betsSorted, (item, index) => {
      const gain = calculateGain(item.investmentAmount, item.outcomeAmount);

      return (
        <div key={index} className={styles.betItem}>
          <img src={item.imageUrl} className={styles.eventImg} />
          <div className={styles.betInfo}>
            <div className={styles.titleContainer}>
              <Link
                to={`/trade/${item.eventSlug}/${item.betSlug}`}
                className={styles.titleLink}
                onClick={closeDrawer}
              >
                <div className={styles.title}>
                  {item.marketQuestion}
                  {withStatus && (
                    <StateBadge
                      state={item.status}
                      withoutBackground={true}
                      withoutText={true}
                      className={styles.status}
                    />
                  )}
                </div>
              </Link>
              <div className={styles.subtitle}>
                {moment(item.date).format('DD.MM.YYYY')} | Your Prediction:{' '}
                {item.outcomeValue}
              </div>
            </div>
            <div className={styles.numbersContainer}>
              <div className={styles.value}>
                <span
                  className={classNames(
                    styles.percentage,
                    gain.negative ? styles.negative : null
                  )}
                >
                  {gain.value}
                </span>
                {item.outcomeAmount}
              </div>
              <div className={styles.invested}>
                Invested: {item.investmentAmount}
              </div>
              {allowCashout && !isFinalizedTrade(item.status) && (
                <button
                  className={styles.betCashoutButton}
                  onClick={() =>
                    showPulloutBetPopup(
                      item.betId,
                      item.outcomes.find(
                        ({ name }) => name === item.outcomeValue
                      ).index,
                      +formatToFixed(item.investmentAmount)
                    )
                  }
                >
                  Cashout
                </button>
              )}
            </div>
          </div>
        </div>
      );
    });
  };

  return <div className={styles.betContainer}>{renderBets()}</div>;
};

const mapDispatchToProps = dispatch => {
  return {
    showPulloutBetPopup: (betId, outcome, amount) => {
      dispatch(
        PopupActions.show({
          popupType: PopupTheme.pulloutApprove,
          options: {
            small: true,
            betData: {
              betId,
              outcome,
              amount,
            },
          },
        })
      );
    },
  };
};

export default connect(null, mapDispatchToProps)(MyTradesList);

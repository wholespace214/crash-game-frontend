import { connect, useSelector } from 'react-redux';
import styles from './styles.module.scss';
import { formatToFixed } from 'helper/FormatNumbers';
import { PieChart } from 'react-minimal-pie-chart';
import { GeneralActions } from 'store/actions/general';
import _ from 'lodash';
import { selectUser } from 'store/selectors/authentication';

const WalletBalance = () => {
  const { balance, totalInvestmentAmount, totalOpenTradesAmount, currency } =
    useSelector(selectUser);

  const overallFundsTotal = balance + totalInvestmentAmount;
  const liquidFundsPercentage = (100 * balance) / overallFundsTotal;
  const investedFundsPercentage =
    (100 * totalInvestmentAmount) / overallFundsTotal;

  return (
    <div className={styles.walletBalance}>
      <div className={styles.walletBalanceHeading}>
        <p className={styles.walletBalanceTitle}>total balance</p>
      </div>
      <div className={styles.walletBalanceContent}>
        <div className={styles.walletBalanceItem}>
          <div className={styles.overallFunds}>
            <div className={styles.overallFundsAmount}>
              <PieChart
                data={[
                  {
                    title: 'InvestedFunds',
                    value: investedFundsPercentage,
                    color: '#69ffa5',
                  },
                  {
                    title: 'LiquidFunds',
                    value: liquidFundsPercentage,
                    color: '#3570ff',
                  },
                ]}
                lineWidth={14}
                startAngle={270}
              />
              <p className={styles.overallFundsTotal}>
                {formatToFixed(overallFundsTotal)}
              </p>
              <p className={styles.overallFundsTitle}>{currency}</p>
            </div>
          </div>
        </div>
        <div className={styles.walletBalanceSum}>
          <div className={styles.walletBalanceItem}>
            <div className={styles.availableWfairs}>
              <div className={styles.availableWfairsHeadline}>
                <div className={styles.availableWfairsDot} />
                Available amount
              </div>
              <div className={styles.availableWfairsAmount}>
                <p className={styles.availableWfairsTotal}>
                  {formatToFixed(balance)}
                </p>
                <p className={styles.availableWfairsTitle}>{currency}</p>
              </div>
            </div>
          </div>
          <div className={styles.walletBalanceItem}>
            <div className={styles.liquidFunds}>
              <div className={styles.liquidFundsHeadline}>
                <div className={styles.liquidFundsDot} />
                Open positions
              </div>
              <div className={styles.liquidFundsAmount}>
                <p className={styles.liquidFundsTotal}>
                  {formatToFixed(totalOpenTradesAmount)}
                </p>
                <p className={styles.liquidFundsTitle}>{currency}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapDispatchToProps = dispatch => {
  return {
    handleMyTradesVisible: bool => {
      dispatch(GeneralActions.setMyTradesVisible(bool));
    },
    handleEmailNotificationsVisible: bool => {
      dispatch(GeneralActions.setEmailNotificationsVisible(bool));
    },
    handlePreferencesVisible: bool => {
      dispatch(GeneralActions.setPreferencesVisible(bool));
    },
    setOpenDrawer: drawerName => {
      dispatch(GeneralActions.setDrawer(drawerName));
    },
  };
};

export default connect(null, mapDispatchToProps)(WalletBalance);

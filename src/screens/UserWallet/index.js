import React, { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import Grid from '@material-ui/core/Grid';
import BaseContainerWithNavbar from '../../components/BaseContainerWithNavbar';
import { connect, useSelector } from 'react-redux';
import { selectUser } from 'store/selectors/authentication';
import { formatToFixed } from 'helper/FormatNumbers';
import { PopupActions } from '../../store/actions/popup';
import PopupTheme from '../../components//Popup/PopupTheme';
import { RosiGameActions } from 'store/actions/rosi-game';
import TabOptions from 'components/TabOptions';
import useRosiData from 'hooks/useRosiData';
import useDepositsCounter from 'hooks/useDepositsCounter';
import UserWalletTables from 'components/UserWalletTables';
import classNames from 'classnames';
import { useWeb3React } from '@web3-react/core';
import Select from 'react-select';
import { UserActions } from 'store/actions/user';
import _ from 'lodash';

import Loader from 'components/Loader/Loader';
import { WallfairActions } from 'store/actions/wallfair';
import { TransactionActions } from 'store/actions/transaction';
import Button from 'components/Button';
import { ReactComponent as WfairIcon } from '../../data/icons/wfair-symbol.svg';
import { ReactComponent as BitcoinIcon } from '../../data/icons/wallet/bitcoin.svg';
import { ReactComponent as EuroIcon } from '../../data/icons/wallet/euro.svg';
import { ReactComponent as WalletIcon } from '../../data/icons/wallet/wallet.svg';
import { ReactComponent as RightArrow } from '../../data/icons/wallet/right-arrow.svg';
import { ReactComponent as LockerIcon } from '../../data/icons/wallet/locker-icon.svg';
import { ReactComponent as PaymentMethodIcon } from '../../data/icons/wallet/payment-icons.svg';
import { ReactComponent as LockYellowIcon } from '../../data/icons/wallet/locker-yellow-icon.svg';
import { ReactComponent as ClockYellowIcon } from '../../data/icons/wallet/clock-yellow-icon.svg';
import { ReactComponent as CheckYellowIcon } from '../../data/icons/wallet/check-yellow-icon.svg';

import * as ApiUrls from 'constants/Api';
import { getOpenBets, getTradeHistory, resendEmailVerification } from 'api';
import {
  trackWalletAddWfair,
  trackWalletBuyWfair,
  trackWalletBuyWithCryptoButton,
  trackWalletBuyWithFiatButton,
  trackWalletWithdraw,
} from 'config/gtm';

import Bonus100kDesktop from '../../data/images/deposit/bonus100k-desktop.png';
import Bonus100kMobile from '../../data/images/deposit/bonus100k-mobile.png';
import ButtonTheme from 'components/Button/ButtonTheme';
import { AVAILABLE_GAMES_CURRENCY } from '../../constants/Currency';
import { TOKEN_NAME } from '../../constants/Token';
import { convertAmount, currencyDisplay } from 'helper/Currency';
import { selectPrices } from 'store/selectors/info-channel';
import { red } from '@material-ui/core/colors';
import WalletFAQ from 'components/FAQ/WalletFAQ';

const UserWallet = ({
  connected,
  user,
  refreshMyBetsData,
  resetState,
  fetchWalletTransactions,
  isTransactionsFetchLoading,
  isTransactionsFetchError,
  transactions,
  showWithdrawPopup,
  showWalletDepositPopup,
  showWalletDepositCrypto,
  showWalletDepositFiat,
  showWalletConnectWallet,
  updateUser,
}) => {
  
  const { active, library, account, chainId } = useWeb3React();

  const { balance, gamesCurrency } = useSelector(selectUser);
  const prices = useSelector(selectPrices);
  const [selectedGamesCurrency, setSelectedGamesCurrency] = useState(gamesCurrency);

  const signer = library?.getSigner();
  const [stakesLoading, setStakesLoading] = useState(true);

  const { myBetsData } = useRosiData();
  // const [userKyc, setUserKyc] = useState({ ...user?.kyc });

  const [emailSent, setEmailSent] = useState(false);
  const [openTrades, setOpenTrades] = useState([]);
  const [tradeHistory, setTradeHistory] = useState([]);

  const depositCount = useDepositsCounter();

  const activityData = {
    DEPOSITS: transactions.deposit || [],
    WITHDRAWALS: transactions.withdraw || [],
    ONRAMP: transactions.onramp || [],
    CRYPTO: transactions.crypto || [],
    BETS: myBetsData ? myBetsData : [],
    OPEN_TRADES: openTrades,
    TRADE_HISTORY: tradeHistory,
  };

  const activityDataMap = {
    'FIAT DEPOSITS': 'ONRAMP',
    'WFAIR DEPOSITS': 'DEPOSITS',
    WITHDRAWALS: 'WITHDRAWALS',
    BETS: 'BETS',
    'CRYPTO DEPOSITS': 'CRYPTO',
    'OPEN TRADES': 'OPEN_TRADES',
    'TRADE HISTORY': 'TRADE_HISTORY',
  };

  const tabOptions = [
    { name: 'FIAT DEPOSITS', index: 0 },
    { name: 'WFAIR DEPOSITS', index: 1 },
    { name: 'CRYPTO DEPOSITS', index: 2 },
    { name: 'WITHDRAWALS', index: 3 },
  ];

  const [activityTab, setActivityTab] = useState({
    name: 'FIAT DEPOSITS',
    index: 0,
  });

  const [activityTabOptions, setActivityTabOptions] = useState(tabOptions);

  const handleActivitySwitchTab = ({ index }) => {
    setActivityTab(activityTabOptions[index]);
  };

  const handleResendEmailConfirmation = async () => {
    const result = await resendEmailVerification(user.userId);
    const resultOk = result?.data?.status === 'OK';
    console.log('e-mail confirmation sent', result);

    setEmailSent(resultOk);
  };

  const fetchTrades = () => {
    getOpenBets().then(res => setOpenTrades(res.data));
    getTradeHistory().then(res => setTradeHistory(res.data));
  }

  useEffect(() => {
    resetState();
  }, [account, active, resetState]);

  useEffect(() => {
    refreshMyBetsData({ userId: user.userId });
    if (user.userId) {
      setActivityTabOptions([
        ...tabOptions,
        { name: 'BETS', index: 4 },
        { name: 'OPEN TRADES', index: 5, refresh: fetchTrades },
        { name: 'TRADE HISTORY', index: 6 },
      ]);
    }
    // setUserKyc(user?.kyc);
  }, [connected, refreshMyBetsData, user]);

  useEffect(() => {
    fetchWalletTransactions();
    fetchTrades();
  }, [fetchWalletTransactions, balance]);

  useEffect(() => {
    isTransactionsFetchError ? setStakesLoading(false) : setStakesLoading(true);
  }, [isTransactionsFetchError]);

  // const isKycStarted = () => userKyc && userKyc.status;

  // const isKycVerified = () => userKyc && userKyc.status === 'approved';

  // const showKycBanner = () =>
  //   !isKycStarted() ||
  //   userKyc.status === 'error' ||
  //   userKyc.status === 'rejected';

  // const openFractal = () => {
  //   const kycUrl =
  //     ApiUrls.BACKEND_URL +
  //     ApiUrls.KYC_START_FOR_USER.replace(':userId', user.userId);
  //   window.open(kycUrl, 'fractal', 'width=480,height=700,top=150,left=150');
  // };

  const renderStats = () => {
    return (
      <div className={styles.activities}>
        <Grid item xs={12}>
          <div className={styles.activityWrapper}>
            <TabOptions
              options={activityTabOptions}
              className={styles.tabLayout}
            >
              {option => {
                const count = activityData[activityDataMap[option.name]].length;

                return (
                  <div
                    className={classNames(
                      styles.headerTables,
                      option.index === activityTab.index
                        ? styles.tabItemSelected
                        : styles.tabItem
                    )}
                    onClick={() => handleActivitySwitchTab(option)}
                    data-item-count={String(count)}
                  >
                    {option.name}
                  </div>
                );
              }}
            </TabOptions>

            <div className={styles.activityContainer}>
              {isTransactionsFetchLoading ? (
                <Loader />
              ) : (
                <UserWalletTables
                  type={activityDataMap[activityTab.name]}
                  rowData={activityData}
                  isError={isTransactionsFetchError}
                  refresh={activityTab.refresh}
                />
              )}
            </div>
          </div>
        </Grid>
      </div>
    );
  };

  const renderCurrentBalanceSection = () => {
    return (
      <div className={styles.currentBalanceSection}>
        <div className={styles.currentBalanceDescription}>
          <div className={styles.currentBalanceCard}>
            <div className={styles.balanceContainer}>
              <div className={styles.leftCard}>
                { balance && (
                  <div className={styles.balanceTextContainer}>
                    <p className={styles.currentbalanceHeading}>
                      Current balance
                    </p>
                    <div className={styles.balanceBottomContainer}>
                      <p className={styles.currentbalanceWFair}>
                        {/* <span>{formatToFixed(balance, 0, true)}</span> */}

                        {gamesCurrency !== TOKEN_NAME
                          ? `${convertAmount(
                              balance,
                              prices[gamesCurrency]
                            )}`
                          : `${formatToFixed(balance, 0, true)}`
                        }
                      </p>
                      {renderWalletPreferencesSection()}
                    </div>
                    <div className={styles.balanceToken}>
                      <span>Balance in WFAIR</span>
                      <span>{`${formatToFixed(balance, 0, true)} ${currencyDisplay(TOKEN_NAME)}`}</span>
                    </div>
                  </div>
                )}
              </div>
              <div className={styles.rightCard}>
                <Button
                  theme={ButtonTheme.primaryButtonL}
                  className={styles.buttonDeposit}
                  onClick={showWalletDepositPopup}
                >
                  <LockerIcon />
                  Safe Instant Deposit
                </Button>

                <Button
                  theme={ButtonTheme.secondaryButton}
                  onClick={showWithdrawPopup}
                  className={styles.withdrawButton}
                >
                  Instant Withdraw
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderWalletPreferencesSection = () => {
    const generateOptions = () => {
      return AVAILABLE_GAMES_CURRENCY.map(item => {
        const currencyCode = item.toUpperCase();
        return { value: currencyCode, label: currencyCode };
      });
    };

    const options = generateOptions();

    const getSelected = () => {
      return _.find(options, { value: selectedGamesCurrency });
    };

    const handleChangeCurrency = (value, options) => {
      setSelectedGamesCurrency(state => {
        const newCurrency = value.value;
        if (gamesCurrency !== newCurrency) {
          updateUser(user.userId, {
            gamesCurrency: newCurrency,
          });
        }

        return newCurrency;
      });
    };

    const dropdownCustomStyles = {
      'control':(provided, state) => ({
        ...provided,
        backgroundColor:'transparent',
        border: '0',
        color: '#ffffff',
        outline: '0',
      }),
      'input':(provided, state) => ({
        ...provided,
        color: 'white',
      }),
      'singleValue':(provided, state) => ({
        ...provided,
        color: 'white',
      })
    }

    return (
      // <div className={styles.walletPreferencesSection}>
      //   <div className={styles.boxContainer}>
      //     <div className={styles.settingsMainHeader}>Settings</div>

      //     <div className={styles.currentBalanceCard}>
      //       <div className={styles.settingsLabel}>Selected games currency</div>
            <Select
              onChange={handleChangeCurrency}
              options={options}
              isClearable={false}
              isSearchable={false}
              name="selected-currency"
              defaultValue={getSelected()}
              className={styles.inputSelect}
              styles={dropdownCustomStyles}
            />
      //     </div>
      //   </div>
      // </div>
    );
  };

  // const renderDepositBonusSection = () => {
  //   return (
  //     <div className={styles.currentBalanceSection}>
  //       {depositCount != null && depositCount === 0 && (
  //         <Grid
  //           className={styles.balanceCard}
  //           item
  //           lg={12}
  //           md={12}
  //         >
  //           <div className={styles.currentBalanceDescription}>
  //             <img
  //               src={Bonus100kDesktop}
  //               className={styles.bonusDesktop}
  //               alt="bonus desktop"
  //             />
  //             <img
  //               src={Bonus100kMobile}
  //               className={styles.bonusMobile}
  //               alt="bonus mobile"
  //             />
  //           </div>
  //         </Grid>
  //       )}

  //       {!user.emailConfirmed && (
  //         <Grid
  //           className={styles.balanceCard}
  //           item
  //           lg={12}
  //           md={12}
  //           style={{ width: '100%' }}
  //         >
  //           <div
  //             style={{ width: '100%' }}
  //             className={styles.currentBalanceDescription}
  //           >
  //             <div className={styles.currentBalanceCard}>
  //               <div
  //                 className={classNames(
  //                   styles.buttonContainer,
  //                   styles.rowContainer
  //                 )}
  //               >
  //                 <div>
  //                   <h2>Verify your e-mail</h2>
  //                   <p className={styles.label}>
  //                     In order to activate full functionality of your account,
  //                     you must verify your email.
  //                   </p>
  //                 </div>
  //                 <Button
  //                   className={styles.buttonBanner}
  //                   onClick={handleResendEmailConfirmation}
  //                   disabled={emailSent}
  //                   theme={ButtonTheme.alternativeButton}
  //                 >
  //                   {!emailSent ? 'Resend Email' : 'Email sent'}
  //                 </Button>
  //               </div>
  //             </div>
  //           </div>
  //         </Grid>
  //       )}

  //       {user.emailConfirmed && showKycBanner() && (
  //         <Grid
  //           className={styles.balanceCard}
  //           item
  //           lg={12}
  //           md={12}
  //           style={{ width: '100%' }}
  //         >
  //           <div
  //             style={{ width: '100%' }}
  //             className={styles.currentBalanceDescription}
  //           >
  //             <div className={styles.currentBalanceCard}>
  //               <div
  //                 className={classNames(
  //                   styles.buttonContainer,
  //                   styles.rowContainer
  //                 )}
  //               >
  //                 <div>
  //                   <h2>Verify your identity</h2>
  //                   <p className={styles.label}>
  //                     In order to activate full functionality of your account,
  //                     you must provide a proof-of-identity. To ensure your
  //                     safety and privacy, we use an external provider for this
  //                     procedure.
  //                   </p>
  //                 </div>
  //                 <Button
  //                   className={styles.buttonBanner}
  //                   onClick={openFractal}
  //                   theme={ButtonTheme.alternativeButton}
  //                 >
  //                   Start
  //                 </Button>
  //               </div>
  //             </div>
  //           </div>
  //         </Grid>
  //       )}
  //       <Grid
  //         container
  //         justifyContent="flex-start"
  //         alignContent="center"
  //         spacing={1}
  //       >
  //         <Grid className={styles.balanceCard} item lg={4} md={4} xs={12}>
  //           <div
  //             className={classNames(
  //               styles.currentBalanceDescription,
  //               styles.smallCurrentBalanceDescription
  //             )}
  //           >
  //             <div
  //               className={classNames(
  //                 styles.currentBalanceCard,
  //                 styles.smallCard
  //               )}
  //             >
  //               <div
  //                 className={styles.depositCardContainer}
  //                 onClick={showWalletDepositCrypto}
  //               >
  //                 <BitcoinIcon />
  //                 <p className={styles.depositTitle}>Deposit with Crypto</p>
  //                 <div className={styles.depositDescriptionSection}>
  //                   <p className={styles.depositDescription}>
  //                     Deposit ETH or BTC and start playing <br />
  //                     immediately.
  //                   </p>
  //                   <RightArrow />
  //                 </div>
  //               </div>
  //             </div>
  //           </div>
  //         </Grid>

  //         <Grid
  //           className={styles.balanceCard}
  //           item
  //           lg={4}
  //           md={4}
  //           xs={12}
  //         >
  //           <div
  //             className={classNames(
  //               styles.currentBalanceDescription,
  //               styles.smallCurrentBalanceDescription
  //             )}
  //           >
  //             <div
  //               className={classNames(
  //                 styles.currentBalanceCard,
  //                 styles.smallCard
  //               )}
  //             >
  //               <div
  //                 className={styles.depositCardContainer}
  //                 onClick={showWalletDepositFiat}
  //               >
  //                 <EuroIcon />
  //                 <p className={styles.depositTitle}>Deposit with EUR / USD</p>
  //                 <div className={styles.depositDescriptionSection}>
  //                   <p className={styles.depositDescription}>
  //                     Deposit EUR or USD to start playing in a<br /> few hours.
  //                   </p>
  //                   <RightArrow />
  //                 </div>
  //               </div>
  //             </div>
  //           </div>
  //         </Grid>

  //         <Grid className={styles.balanceCard} item lg={4} md={4} xs={12}>
  //           <div
  //             className={classNames(
  //               styles.currentBalanceDescription,
  //               styles.smallCurrentBalanceDescription
  //             )}
  //           >
  //             <div
  //               className={classNames(
  //                 styles.currentBalanceCard,
  //                 styles.smallCard
  //               )}
  //             >
  //               <div
  //                 className={styles.depositCardContainer}
  //                 onClick={showWalletConnectWallet}
  //               >
  //                 <WalletIcon />
  //                 <p className={styles.depositTitle}>Connect your Wallet</p>
  //                 <div className={styles.depositDescriptionSection}>
  //                   <p className={styles.depositDescription}>
  //                     Connect your existing wallet with WFAIR
  //                     <br /> your bought and start immediately
  //                   </p>
  //                   <RightArrow />
  //                 </div>
  //               </div>
  //             </div>
  //           </div>
  //         </Grid>
  //       </Grid>
  //       <Grid
  //         container
  //         alignContent="center"
  //         justifyContent="flex-start"
  //         spacing={1}
  //       >
  //         <Grid className={styles.balanceCard} item lg={4} md={4} xs={12}>
  //           <div
  //             className={classNames(
  //               styles.currentBalanceDescription,
  //               styles.smallCurrentBalanceDescription
  //             )}
  //           >
  //             <div
  //               className={classNames(
  //                 styles.currentBalanceCard,
  //                 styles.smallCard
  //               )}
  //             >
  //               <div className={styles.buttonContainer}>
  //                 <h2>Withdraw</h2>
  //                 <p className={styles.label}>
  //                   You can withdraw your funds directly to your
  //                   crypto wallet. You can then convert your WFAIR to other
  //                   cryptocurrencies or hold it to have early access to the
  //                   upcoming utilities.
  //                 </p>
  //                 <Button
  //                   className={styles.button}
  //                   // disabled={!isKycVerified() || !user.emailConfirmed}
  //                   disabledWithOverlay={false}
  //                   onClick={showWithdrawPopup}
  //                   title="Instant withdraw up to 100,000 WFAIR"
  //                   theme={ButtonTheme.secondaryButton}
  //                 >
  //                   Instant Withdraw
  //                 </Button>
  //               </div>
  //             </div>
  //           </div>
  //         </Grid>
  //       </Grid>
  //     </div>
  //   );
  // };


  const renderDepositBonusSection = () => {
    return (
      <div className={styles.howitworks}>
        <span className={styles.howitworksTitle}>How it works</span>

        <span className={styles.howitworksItem}>
          <div><LockYellowIcon /></div>
          <span>You can deposit funds <b>safely</b> via crypto payments credit card, bank wire, Apple Pay.</span>
        </span>

        <span className={styles.howitworksItem}>
          <div><LockYellowIcon /></div>
          <span><b>Safety matters!</b>Fully licensed casino, audited payment providers.</span>
        </span>

        <span className={styles.howitworksItem}>
          <div><ClockYellowIcon /></div>
          <span>You can play <b>instantly!</b></span>
        </span>

        <span className={styles.howitworksItem}>
          <div><CheckYellowIcon /></div>
          <span>You can withdraw up to 100,000 WFAIR per day. No KYC required.</span>
        </span>

        
      </div>
    )
  }


  return (
    <BaseContainerWithNavbar>
      <div className={styles.containerWrapper}>
        <div className={styles.container}>
          <div className={styles.titleSection}>
            <h1>My Wallet</h1>
          </div>
          {renderCurrentBalanceSection()}

          <div className={styles.paymentMethodIcons}>
            <PaymentMethodIcon onClick={showWalletDepositPopup} />
          </div>
          {/* {renderDepositBonusSection()} */}
          {renderStats()}

          {renderDepositBonusSection()}

          <Button
            theme={ButtonTheme.primaryButtonL}
            className={styles.buttonDeposit}
            onClick={showWalletDepositPopup}
          >
            <LockerIcon />
            Safe Instant Deposit
          </Button>

          <div className={styles.paymentMethodIcons}>
            <PaymentMethodIcon onClick={showWalletDepositPopup} />
          </div>

          <WalletFAQ className={styles.walletFAQ}/>
        </div>
      </div>
    </BaseContainerWithNavbar>
  );
};

const mapStateToProps = state => {
  return {
    tags: state.event.tags,
    events: state.event.events,
    connected: state.websockets.connected,
    user: state.authentication,
    isTransactionsFetchLoading: state.transaction.walletTransactions.isLoading,
    isTransactionsFetchError: state.transaction.walletTransactions.isError,
    transactions: state.transaction.walletTransactions.transactions,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateUser: (userId, preferences) => {
      dispatch(UserActions.updatePreferences({ userId, preferences }));
    },
    resetState: () => dispatch(WallfairActions.resetState()),
    refreshMyBetsData: data => dispatch(RosiGameActions.fetchMyBetsData(data)),
    showWithdrawPopup: () => {
      trackWalletWithdraw();
      dispatch(PopupActions.show({ popupType: PopupTheme.walletWithdraw }));
    },
    showWalletDepositPopup: () => {
      trackWalletAddWfair();
      dispatch(PopupActions.show({ popupType: PopupTheme.walletDeposit }));
    },
    fetchWalletTransactions: () => {
      dispatch(TransactionActions.fetchWalletTransactions());
    },
    showWalletDepositCrypto: () => {
      trackWalletBuyWithCryptoButton();
      dispatch(
        PopupActions.show({ popupType: PopupTheme.walletDepositCrypto })
      );
    },
    showWalletDepositFiat: () => {
      trackWalletBuyWithFiatButton();
      dispatch(PopupActions.show({ popupType: PopupTheme.walletDepositFiat }));
    },
    showWalletConnectWallet: () => {
      trackWalletBuyWfair();
      dispatch(
        PopupActions.show({ popupType: PopupTheme.walletConnectWallet })
      );
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(UserWallet));

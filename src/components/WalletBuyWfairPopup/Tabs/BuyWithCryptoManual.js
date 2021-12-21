import React, { useCallback, useEffect, useState } from 'react';
import styles from '../buywithcryptomanual.module.scss';
import InputLineSeparator from '../../../data/images/input_line_separator.png';
import Dropdown from '../../Dropdown';
import { ReactComponent as ArrowUp } from '../../../data/icons/arrow_up_icon.svg';
import { ReactComponent as ArrowDown } from '../../../data/icons/arrow_down_icon.svg';
import { ReactComponent as BitcoinIcon } from '../../../data/icons/bitcoin-symbol.svg';
import { ReactComponent as EthereumIcon } from '../../../data/icons/ethereum-symbol.svg';
import { ReactComponent as LitecoinIcon } from '../../../data/icons/litecoin-symbol.svg';
import { ReactComponent as WfairIcon } from '../../../data/icons/wfair-symbol.svg';
import {convertCurrency, sendBuyWithCrypto} from '../../../api/index'
import classNames from 'classnames';
import { numberWithCommas } from '../../../utils/common';
import ReferralLinkCopyInputBox from 'components/ReferralLinkCopyInputBox';
import InputBoxTheme from 'components/InputBox/InputBoxTheme';
import { addMetaMaskEthereum } from 'utils/helpers/ethereum';
import QRCode from 'react-qr-code';
import NumberCommaInput from 'components/NumberCommaInput/NumberCommaInput';
import { TOKEN_NAME } from 'constants/Token';
import Button from 'components/Button';
import useDebounce from 'hooks/useDebounce';

const cryptoShortName = {
  bitcoin: 'BTC',
  ethereum: `ETH`,
  litecoin: `LTC`,
};
const cryptoRegexFormat = {
  bitcoin: /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$/g,
  ethereum: /^0x[a-fA-F0-9]{40}$/g,
  litecoin: /^[LM3][a-km-zA-HJ-NP-Z1-9]{26,33}$/g,
};

const depositAddress = {
  bitcoin: process.env.REACT_APP_DEPOSIT_WALLET_BITCOIN,
  ethereum: process.env.REACT_APP_DEPOSIT_WALLET_ETHEREUM,
  litecoin: process.env.REACT_APP_DEPOSIT_WALLET_LITECOIN,
};

const BuyWithCryptoManual = () => {
  const CURRENCY_OPTIONS = [
    {
      label: 'EUR',
      value: 0,
    },
    {
      label: 'USD',
      value: 1,
    },
  ];
  const [selectedCurrency, setSelectedCurrency] = useState(CURRENCY_OPTIONS[0]);
  const [currency, setCurrency] = useState(0);
  const [tokenValue, setTokenValue] = useState(0);
  const [activeTab, setActiveTab] = useState('bitcoin');
  const [address, setAddress] = useState('');
  const [cryptoAddress, setCryptoAddress] = useState('');
  const [url, setUrl] = useState('');
  const [transaction, setTransaction] = useState(false);

  useEffect(() => {
    onCurrencyChange(currency);
    setCryptoAddress('')
  }, [activeTab, selectedCurrency]);

  const handleWFAIRClick = useCallback(async () => {
    await addMetaMaskEthereum();
  }, []);

  const selectContent = event => {
    event.target.select();
  };

  const onCurrencyChange = useCallback(async (value) => {
    setCurrency(value);
    if (value > 0) {
      const convertCurrencyPayload = {
        convertFrom: cryptoShortName[activeTab],
        convertTo: 'WFAIR',
        amount: value,
      };

      const { response } = await convertCurrency(convertCurrencyPayload);
      const { convertedAmount } = response?.data;
      const convertedTokenValue = !convertedAmount
        ? 0
        : convertedAmount.toFixed(4);

      const roundedAmount = Math.floor(Number(convertedTokenValue) * 100) / 100;
      let WfairTokenValue = !roundedAmount
        ? 0
        : numberWithCommas(roundedAmount);

      setTokenValue(WfairTokenValue);
    }
  }, [activeTab]);

  const onChangeAmount = useDebounce({
    callback: onCurrencyChange,
    delay: 500,
  });

  const OnClickConfirmAmount = () => {

    if(cryptoShortName[activeTab]
      && cryptoAddress
      && currency
      && tokenValue
    ){
      sendBuyWithCrypto({
        currency: cryptoShortName[activeTab],
        wallet: cryptoAddress,
        amount: currency,
        estimate: tokenValue
      })
    }

    setAddress(depositAddress[activeTab]);
    setUrl(`${activeTab}:${depositAddress[activeTab]}`);
    setTransaction(!transaction);
  };

  const cryptoAddressChange = useCallback(event => {
  const inputAddress = event.target.value;
  setCryptoAddress(inputAddress);
}, []);

const cryptoAddressLostFocus = useCallback(event => {
  const inputAddress = event.target.value;
  const regex = cryptoRegexFormat[activeTab];
  const valid = inputAddress.match(regex);

  if (!valid) {
    console.error(`wrong ${activeTab} address format`);
    return;
  }

  setCryptoAddress(inputAddress);
}, []);


  return (
    <div className={styles.buyWithCryptoManualContainer}>
      {!transaction && (
        <>
          {/* Crypto Tabs */}
          <div className={styles.cryptoTabsContianer}>
            <div
              className={classNames(
                styles.cryptoTab,
                activeTab === 'bitcoin' && styles.cryptoTabActive
              )}
              onClick={() => setActiveTab('bitcoin')}
            >
              <BitcoinIcon />
              <p className={styles.fullName}>Bitcoin</p>
              <p className={styles.shortName}>BTC</p>
            </div>
            <div
              className={classNames(
                styles.cryptoTab,
                activeTab === 'ethereum' && styles.cryptoTabActive
              )}
              onClick={() => setActiveTab('ethereum')}
            >
              <EthereumIcon />
              <p className={styles.fullName}>Ethereum</p>
              <p className={styles.shortName}>ETH</p>
            </div>
            <div
              className={classNames(
                styles.cryptoTab,
                activeTab === 'litecoin' && styles.cryptoTabActive
              )}
              onClick={() => setActiveTab('litecoin')}
            >
              <LitecoinIcon />
              <p className={styles.fullName}>Litecoin</p>
              <p className={styles.shortName}>LTC</p>
            </div>
          </div>

          {/* Crypto Calculator */}
          <div className={styles.cryptoCalculatorContainer}>
            {/* Crypto Address */}
            <div className={styles.addressInputContainer}>
              <div className={styles.labelContainer}>
                <span>{activeTab} Wallet Address</span>
              </div>
              <input
                type="text"
                value={cryptoAddress}
                onChange={cryptoAddressChange}
                onBlur={cryptoAddressLostFocus}
                onClick={selectContent}
                placeholder={`Add your ${cryptoShortName[activeTab]} wallet address`}
              />
            </div>

            {/* Currency */}
            <div className={styles.cryptoInputsWrapper}>
              <div className={styles.cryptoInputContiner}>
                <div className={styles.labelContainer}>
                  <span>You pay</span>
                </div>
                <NumberCommaInput
                  value={currency}
                  min={0}
                  max={2000}
                  onChange={onChangeAmount}
                  onClick={selectContent}
                />
                <div className={styles.inputRightContainer}>
                  {activeTab === 'bitcoin' && (
                    <>
                      <BitcoinIcon />
                      BTC
                    </>
                  )}
                  {activeTab === 'ethereum' && (
                    <>
                      <EthereumIcon />
                      ETH
                    </>
                  )}
                  {activeTab === 'litecoin' && (
                    <>
                      <LitecoinIcon />
                      LTC
                    </>
                  )}
                </div>
              </div>

              {/* WFAIR TOKEN */}
              <div className={styles.cryptoInputContiner}>
                <div className={styles.labelContainer}>
                  <span>You receive (estimate)</span>
                </div>
                <input disabled readOnly value={tokenValue} />
                <div className={styles.inputRightContainer}>
                  <WfairIcon
                    className={styles.wfairLogo}
                    onClick={handleWFAIRClick}
                  />
                  <span>{TOKEN_NAME}</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className={styles.cryptoContent}>
              <p>
                You can add WFAIR to your account by exchanging Bitcoin, Ethereum,
                or Litecoin.
              </p>
              <p>
                Transactions with BTC, ETH and LTC are being manually processed
                for the time being. It means it may take up to a few hours for your
                funds to arrive into the Alpacasino wallet. We intend to automate this
                in the next weeks.
              </p>
              <p>
                Please follow the instructions provided in the next step to use this deposit method.
              </p>
            </div>

            <Button
              className={classNames(
                styles.button,
                currency === 0 ? styles.disabled : null
              )}
              onClick={OnClickConfirmAmount}
              disabled={currency === 0}
            >
              Confirm Amount
            </Button>
          </div>
        </>
      )}

      {/* transaction Section */}
      {transaction && (
        <div className={styles.transactionContainer}>
          <div className={styles.transferSection}>
            <span
              className={styles.backBtn}
              onClick={() => setTransaction(false)}
            >
              Back
            </span>
            <p>
              Please transfer{' '}
              <span>
                {currency} {cryptoShortName[activeTab]}
              </span>{' '}
              to the following {cryptoShortName[activeTab]} Address
            </p>

            <div className={styles.transferInformation}>
              <div className={styles.qrCodeImg}>
                {url && <QRCode value={url} size={125} />}
              </div>
              <div className={styles.addressCopy}>
                <ReferralLinkCopyInputBox
                  inputTheme={InputBoxTheme.copyToClipboardInputWhite}
                  forDeposit={address}
                />
              </div>
            </div>
            <p>
              Once transaction is completed, please send proof of transaction
              via email to{' '}
              <a href="mailto:deposits@alpacasino.io?subject=Deposit">
                deposits@alpacasino.io
              </a>
            </p>
            {/* <div className={styles.transferSectionCopy}>
              <p>Send Transaction URL</p>
              <div className={styles.cryptoUrlContiner}>
                <input
                  type="text"
                  value={url}
                  placeholder="Paste URL here"
                  onChange={e => setUrl(e.target.value)}
                />
              </div>
            </div>
            <button className={styles.sendUrlBtn}> Send</button> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyWithCryptoManual;
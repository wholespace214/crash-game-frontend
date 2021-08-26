import React from 'react';
import _ from 'lodash';
import InputBox from '../InputBox';
import InputBoxTheme from '../InputBox/InputBoxTheme';
import { connect } from 'react-redux';
import { generateReferralLink } from '../../helper/ReferralLink';

const ReferralLinkCopyInputBox = ({
  className,
  userId,
  inputTheme = InputBoxTheme.copyToClipboardInput,
}) => {
  return (
    <InputBox
      className={className}
      type={'text'}
      setValue={_.noop}
      value={generateReferralLink(userId)}
      theme={inputTheme}
    />
  );
};

const mapStateToProps = state => {
  return {
    userId: state.authentication.userId,
  };
};

export default connect(mapStateToProps, null)(ReferralLinkCopyInputBox);

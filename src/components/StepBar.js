import React, {Fragment} from 'react';
import styled from 'styled-components';

import checkIcon from '../data/icons/check-icon.svg';

const StepBar = ({size, step}) => {

  return (
    <StepBarWrapper>
      <StepBarLine />
      {[...Array(size)].map((arr, index) => (
        <Fragment key={index}>
          {index < step ?
            <StepCompleteItemWrapper>
              <StepCompleteIcon src={checkIcon} alt="" />
            </StepCompleteItemWrapper> :
            <StepItemWrapper>
              {index === step ?
                <StepActiveItem>{index + 1}</StepActiveItem> :
                <StepInActiveItem>{index + 1}</StepInActiveItem>
              }
            </StepItemWrapper>
          }
        </Fragment>
      ))}
    </StepBarWrapper>
  );
};

const StepBarWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0;
  width: 100%;
  height: 30px;
  background: transparent;
`;

const StepBarLine = styled.div`
  position: absolute;
  left: 0;
  top: 50%;
  width: 100%;
  height: 1px;
  background-color: #d0d1d5;
  z-index: -1;
`;

const StepCompleteItemWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
`;

const StepCompleteIcon = styled.img`
  width: 100%;
  height: 100%;
`;

const StepItemWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 1px solid #d0d1d5;
  width: 30px;
  height: 30px;
  background-color: white;
`;

const StepActiveItem = styled.span`
  color: black;
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
`;

const StepInActiveItem = styled.span`
  color: #d0d1d5;
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
`;

export default StepBar;

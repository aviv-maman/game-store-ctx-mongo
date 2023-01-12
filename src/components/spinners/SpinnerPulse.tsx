import { FC } from 'react';
import { browserSupportsCSSProperty } from '../../app/helpers/browserSupportsCSSProperty';
import './spinkit.css';

type SpinnerPulseProps = {};

const SpinnerPulse: FC<SpinnerPulseProps> = () => {
  if (!browserSupportsCSSProperty('animation')) {
    return <div className=''>Loading...</div>;
  }
  return <div className='sk-pulse'></div>;
};

export default SpinnerPulse;

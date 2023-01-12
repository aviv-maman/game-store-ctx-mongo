import { FC } from 'react';
import { browserSupportsCSSProperty } from '../../app/helpers/browserSupportsCSSProperty';
import './spinkit.css';

type SpinnerWaveProps = {};

const SpinnerWave: FC<SpinnerWaveProps> = () => {
  if (!browserSupportsCSSProperty('animation')) {
    return <div className=''>Loading...</div>;
  }
  return (
    <div className='sk-wave'>
      <div className='sk-wave-rect'></div>
      <div className='sk-wave-rect'></div>
      <div className='sk-wave-rect'></div>
      <div className='sk-wave-rect'></div>
      <div className='sk-wave-rect'></div>
    </div>
  );
};

export default SpinnerWave;

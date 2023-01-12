import { FC } from 'react';
import { browserSupportsCSSProperty } from '../../app/helpers/browserSupportsCSSProperty';
import './spinkit.css';

type SpinnerWanderProps = {};

const SpinnerWander: FC<SpinnerWanderProps> = () => {
  if (!browserSupportsCSSProperty('animation')) {
    return <div className=''>Loading...</div>;
  }
  return (
    <div className='sk-wander'>
      <div className='sk-wander-cube'></div>
      <div className='sk-wander-cube'></div>
      <div className='sk-wander-cube'></div>
    </div>
  );
};

export default SpinnerWander;

import { FC } from 'react';
import { browserSupportsCSSProperty } from '../../app/helpers/browserSupportsCSSProperty';
import './spinkit.css';

type SpinnerCircleProps = {};

const SpinnerCircle: FC<SpinnerCircleProps> = () => {
  if (!browserSupportsCSSProperty('animation')) {
    return <div className=''>Loading...</div>;
  }
  return (
    <div className='sk-circle'>
      <div className='sk-circle-dot'></div>
      <div className='sk-circle-dot'></div>
      <div className='sk-circle-dot'></div>
      <div className='sk-circle-dot'></div>
      <div className='sk-circle-dot'></div>
      <div className='sk-circle-dot'></div>
      <div className='sk-circle-dot'></div>
      <div className='sk-circle-dot'></div>
      <div className='sk-circle-dot'></div>
      <div className='sk-circle-dot'></div>
      <div className='sk-circle-dot'></div>
      <div className='sk-circle-dot'></div>
    </div>
  );
};

export default SpinnerCircle;

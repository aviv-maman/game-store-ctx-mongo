import { FC } from 'react';
import { browserSupportsCSSProperty } from '../../app/helpers/browserSupportsCSSProperty';
import './spinkit.css';

type SpinnerCircleFadeProps = {};

const SpinnerCircleFade: FC<SpinnerCircleFadeProps> = () => {
  if (!browserSupportsCSSProperty('animation')) {
    return <div className=''>Loading...</div>;
  }
  return (
    <div className='sk-circle-fade'>
      <div className='sk-circle-fade-dot'></div>
      <div className='sk-circle-fade-dot'></div>
      <div className='sk-circle-fade-dot'></div>
      <div className='sk-circle-fade-dot'></div>
      <div className='sk-circle-fade-dot'></div>
      <div className='sk-circle-fade-dot'></div>
      <div className='sk-circle-fade-dot'></div>
      <div className='sk-circle-fade-dot'></div>
      <div className='sk-circle-fade-dot'></div>
      <div className='sk-circle-fade-dot'></div>
      <div className='sk-circle-fade-dot'></div>
      <div className='sk-circle-fade-dot'></div>
    </div>
  );
};

export default SpinnerCircleFade;

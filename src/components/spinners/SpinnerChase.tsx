import { FC } from 'react';
import { browserSupportsCSSProperty } from '../../app/helpers/browserSupportsCSSProperty';
import './spinkit.css';

type SpinnerChaseProps = {};

const SpinnerChase: FC<SpinnerChaseProps> = () => {
  if (!browserSupportsCSSProperty('animation')) {
    return <div className=''>Loading...</div>;
  }
  return (
    <div className='sk-chase'>
      <div className='sk-chase-dot'></div>
      <div className='sk-chase-dot'></div>
      <div className='sk-chase-dot'></div>
      <div className='sk-chase-dot'></div>
      <div className='sk-chase-dot'></div>
      <div className='sk-chase-dot'></div>
    </div>
  );
};

export default SpinnerChase;

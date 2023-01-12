import { FC } from 'react';
import { browserSupportsCSSProperty } from '../../app/helpers/browserSupportsCSSProperty';
import './spinkit.css';

type SpinnerFoldProps = {};

const SpinnerFold: FC<SpinnerFoldProps> = () => {
  if (!browserSupportsCSSProperty('animation')) {
    return <div className=''>Loading...</div>;
  }
  return (
    <div className='sk-fold'>
      <div className='sk-fold-cube'></div>
      <div className='sk-fold-cube'></div>
      <div className='sk-fold-cube'></div>
      <div className='sk-fold-cube'></div>
    </div>
  );
};

export default SpinnerFold;

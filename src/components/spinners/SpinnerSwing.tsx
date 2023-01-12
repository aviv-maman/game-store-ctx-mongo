import { FC } from 'react';
import { browserSupportsCSSProperty } from '../../app/helpers/browserSupportsCSSProperty';
import './spinkit.css';

type SpinnerSwingProps = {};

const SpinnerSwing: FC<SpinnerSwingProps> = () => {
  if (!browserSupportsCSSProperty('animation')) {
    return <div className=''>Loading...</div>;
  }
  return (
    <div className='sk-swing'>
      <div className='sk-swing-dot'></div>
      <div className='sk-swing-dot'></div>
    </div>
  );
};

export default SpinnerSwing;

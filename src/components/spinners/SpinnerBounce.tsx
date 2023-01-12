import { FC } from 'react';
import { browserSupportsCSSProperty } from '../../app/helpers/browserSupportsCSSProperty';
import './spinkit.css';

type SpinnerBounceProps = {};

const SpinnerBounce: FC<SpinnerBounceProps> = () => {
  if (!browserSupportsCSSProperty('animation')) {
    return <div className=''>Loading...</div>;
  }
  return (
    <div className='sk-bounce'>
      <div className='sk-bounce-dot'></div>
      <div className='sk-bounce-dot'></div>
    </div>
  );
};

export default SpinnerBounce;

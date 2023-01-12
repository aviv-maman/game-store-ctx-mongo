import { FC } from 'react';
import { browserSupportsCSSProperty } from '../../app/helpers/browserSupportsCSSProperty';
import './spinkit.css';

type SpinnerFlowProps = {};

const SpinnerFlow: FC<SpinnerFlowProps> = () => {
  if (!browserSupportsCSSProperty('animation')) {
    return <div className=''>Loading...</div>;
  }
  return (
    <div className='sk-flow'>
      <div className='sk-flow-dot'></div>
      <div className='sk-flow-dot'></div>
      <div className='sk-flow-dot'></div>
    </div>
  );
};

export default SpinnerFlow;

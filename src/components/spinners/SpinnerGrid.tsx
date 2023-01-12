import { FC } from 'react';
import { browserSupportsCSSProperty } from '../../app/helpers/browserSupportsCSSProperty';
import './spinkit.css';

type SpinnerGridProps = {};

const SpinnerGrid: FC<SpinnerGridProps> = () => {
  if (!browserSupportsCSSProperty('animation')) {
    return <div className=''>Loading...</div>;
  }
  return (
    <div className='sk-grid'>
      <div className='sk-grid-cube'></div>
      <div className='sk-grid-cube'></div>
      <div className='sk-grid-cube'></div>
      <div className='sk-grid-cube'></div>
      <div className='sk-grid-cube'></div>
      <div className='sk-grid-cube'></div>
      <div className='sk-grid-cube'></div>
      <div className='sk-grid-cube'></div>
      <div className='sk-grid-cube'></div>
    </div>
  );
};

export default SpinnerGrid;

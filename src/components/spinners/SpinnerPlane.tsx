import { FC } from 'react';
import { browserSupportsCSSProperty } from '../../app/helpers/browserSupportsCSSProperty';
import './spinkit.css';

type SpinnerPlaneProps = {};

const SpinnerPlane: FC<SpinnerPlaneProps> = () => {
  if (!browserSupportsCSSProperty('animation')) {
    return <div className=''>Loading...</div>;
  }
  return <div className='sk-plane'></div>;
};

export default SpinnerPlane;

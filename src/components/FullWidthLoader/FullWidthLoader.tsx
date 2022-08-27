import React from 'react';
import { Spin } from 'antd';
import classes from './FullWidthLoader.module.scss';

const FullWidthLoader = () => {
  return (
    <div className={classes.loaderContainer}>
      <Spin size='large' />
    </div>
  );
};

export default FullWidthLoader;

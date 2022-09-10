import React from 'react';
import { Helmet } from 'react-helmet';
import { Card } from 'antd';

import classes from './NotFoundPage.module.scss';

const NotFoundPage = () => {
  return (
    <>
      <Helmet>
        <title>Not found - IT-interviewer</title>
      </Helmet>

      <div className={classes.container}>
        <Card>Sorry. This page is not found</Card>
      </div>
    </>
  );
};

export default NotFoundPage;

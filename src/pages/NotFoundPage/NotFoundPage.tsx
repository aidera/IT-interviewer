import React from 'react';
import { Helmet } from 'react-helmet';
import { Card } from 'antd';

const NotFoundPage = () => {
  return (
    <>
      <Helmet>
        <title>Not found - IT-interviewer</title>
      </Helmet>

      <Card>Sorry. This page is not found</Card>
    </>
  );
};

export default NotFoundPage;

import React from 'react';
import { Helmet } from 'react-helmet';
import { Typography } from 'antd';

import classes from './AnalyticsPage.module.scss';
import LearnLogsTable from '../../components/LearnLogsTable/LearnLogsTable';
import LearnLogsToolbar from '../../components/LearnLogsToolbar/LearnLogsToolbar';

const AnalyticsPage = () => {
  return (
    <>
      <Helmet>
        <title>Analytics - IT-interviewer</title>
      </Helmet>

      <div className={classes.container}>
        <Typography.Title>Analytics</Typography.Title>

        <LearnLogsToolbar />

        <LearnLogsTable />
      </div>
    </>
  );
};

export default AnalyticsPage;

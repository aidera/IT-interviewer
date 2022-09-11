import React from 'react';
import { Helmet } from 'react-helmet';
import { Typography } from 'antd';

import classes from './QuestionsPage.module.scss';
import QuestionsTable from '../../components/QuestionsTable/QuestionsTable';
import QuestionsToolbar from '../../components/QuestionsToolbar/QuestionsToolbar';

const QuestionsPage = () => {
  return (
    <>
      <Helmet>
        <title>All questions - IT-interviewer</title>
      </Helmet>

      <div className={classes.container}>
        <Typography.Title>All Questions</Typography.Title>

        <QuestionsToolbar />

        <QuestionsTable />
      </div>
    </>
  );
};

export default QuestionsPage;

import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Typography } from 'antd';

import classes from './QuestionsPage.module.scss';
import { categoriesStore, questionsStore } from '../../store';
import QuestionsTable from '../../components/QuestionsTable/QuestionsTable';
import QuestionsToolbar from '../../components/QuestionsToolbar/QuestionsToolbar';

const QuestionsPage = () => {
  useEffect(() => {
    questionsStore.getQuestions();
    categoriesStore.getCategories();
  }, []);

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

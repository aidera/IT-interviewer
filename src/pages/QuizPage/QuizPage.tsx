import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { Helmet } from 'react-helmet';
import { Typography } from 'antd';

import { quizStore } from '../../store';
import QuizConditionsForm from '../../components/QuizConditionsForm/QuizConditionsForm';
import QuizQuestionsRunner from '../../components/QuizQuestionsRunner/QuizQuestionsRunner';

const QuizPage = () => {
  useEffect(() => {
    quizStore.getQuizData();
  }, []);

  return (
    <>
      <Helmet>
        <title>Quiz - IT-interviewer</title>
      </Helmet>

      <Typography.Title>Quiz</Typography.Title>

      {!quizStore.questionIds.length && <QuizConditionsForm />}
      {quizStore.questionIds.length !== 0 && <QuizQuestionsRunner />}
    </>
  );
};

export default observer(QuizPage);

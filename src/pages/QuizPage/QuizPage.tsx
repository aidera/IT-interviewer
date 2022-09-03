import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
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
      <Typography.Title>Quiz</Typography.Title>

      {!quizStore.questionIds.length && <QuizConditionsForm />}
      {quizStore.questionIds.length !== 0 && <QuizQuestionsRunner />}
    </>
  );
};

export default observer(QuizPage);

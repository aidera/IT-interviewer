import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { Typography } from 'antd';
import QuizConditionsForm from '../../components/QuizConditionsForm/QuizConditionsForm';
import QuizQuestionsRunner from '../../components/QuizQuestionsRunner/QuizQuestionsRunner';
import { quizStore } from '../../store';

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

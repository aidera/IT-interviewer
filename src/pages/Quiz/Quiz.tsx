import React from 'react';
import { Card, Typography } from 'antd';
import QuizConditionsForm from './QuizConditionsForm/QuizConditionsForm';

const Quiz = () => {
  return (
    <>
      <Typography.Title>Quiz</Typography.Title>
      <Card>
        <QuizConditionsForm />
      </Card>
    </>
  );
};

export default Quiz;

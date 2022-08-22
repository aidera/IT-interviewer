import React, { useCallback, useEffect, useState } from 'react';
import { Card, Typography } from 'antd';
import QuizConditionsForm from './QuizConditionsForm/QuizConditionsForm';
import QuizAPIInstance from '../../api/quiz.api';
import { QuizData } from '../../models/quiz.model';
import QuizQuestionsRunner from './QuizQuestionsRunner/QuizQuestionsRunner';

const Quiz = () => {
  const [quizData, setQuizData] = useState<QuizData | null>(null);

  const getQuizData = useCallback(() => {
    QuizAPIInstance.getQuiz().then((res) => {
      setQuizData(res.data || null);
    });
  }, []);

  useEffect(() => {
    getQuizData();
  }, []);

  return (
    <>
      <Typography.Title>Quiz</Typography.Title>
      <Card>
        {!quizData && <QuizConditionsForm setQuizData={setQuizData} />}
        {quizData && (
          <QuizQuestionsRunner quizData={quizData} getQuizData={getQuizData} />
        )}
      </Card>
    </>
  );
};

export default Quiz;

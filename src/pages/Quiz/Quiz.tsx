import React, { useEffect, useState } from 'react';
import { Card, Typography } from 'antd';
import QuizConditionsForm from './QuizConditionsForm/QuizConditionsForm';
import QuizAPIInstance from '../../api/quiz.api';
import { QuizData } from '../../models/quiz.model';
import QuizQuestionsRunner from './QuizQuestionsRunner/QuizQuestionsRunner';

const Quiz = () => {
  const [quizData, setQuizData] = useState<QuizData | null>(null);

  useEffect(() => {
    QuizAPIInstance.getQuiz().then((res) => {
      setQuizData(res.data || null);
    });
  }, []);

  return (
    <>
      <Typography.Title>Quiz</Typography.Title>
      <Card>
        {!quizData && <QuizConditionsForm setQuizData={setQuizData} />}
        {quizData && (
          <QuizQuestionsRunner quizData={quizData} setQuizData={setQuizData} />
        )}
      </Card>
    </>
  );
};

export default Quiz;

import React, { useCallback, useEffect, useState } from 'react';
import { Typography } from 'antd';
import QuizConditionsForm from '../../components/QuizConditionsForm/QuizConditionsForm';
import QuizAPIInstance from '../../api/quiz.api';
import { QuizData } from '../../models/quiz.model';
import QuizQuestionsRunner from '../../components/QuizQuestionsRunner/QuizQuestionsRunner';

const QuizPage = () => {
  const [quizData, setQuizData] = useState<QuizData | null>(null);

  const getQuizData = useCallback(
    (callback?: (data: QuizData | null) => void) => {
      QuizAPIInstance.getQuiz().then((res) => {
        setQuizData(res.data || null);
        if (callback) callback(res.data || null);
      });
    },
    [],
  );

  useEffect(() => {
    getQuizData();
  }, []);

  return (
    <>
      <Typography.Title>Quiz</Typography.Title>

      {(!quizData || !quizData.questionIds.length) && (
        <QuizConditionsForm setQuizData={setQuizData} />
      )}
      {quizData && quizData.questionIds.length !== 0 && (
        <QuizQuestionsRunner quizData={quizData} getQuizData={getQuizData} />
      )}
    </>
  );
};

export default QuizPage;

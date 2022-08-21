import React, { useEffect, useState } from 'react';
import { Button, Typography } from 'antd';
import { QuizData } from '../../../models/quiz.model';
import QuizAPIInstance from '../../../api/quiz.api';
import GlossaryAPIInstance from '../../../api/glossary.api';
import { QuizletQuestion } from '../../../models/question.model';

type PropsType = {
  quizData: QuizData;
  setQuizData: (quizData: QuizData | null) => void;
};

const QuizQuestionsRunner = (props: PropsType) => {
  const [questions, setQuestions] = useState<QuizletQuestion[]>([]);

  useEffect(() => {
    if (props.quizData.questionIds.length) {
      GlossaryAPIInstance.getQuestionsByIds(props.quizData.questionIds).then(
        (res) => {
          setQuestions(res.data || []);
        },
      );
    }
  }, []);

  const clearQuiz = () => {
    QuizAPIInstance.clearQuiz().then(() => {
      props.setQuizData(null);
    });
  };

  return (
    <div>
      <Typography.Title level={2}>Answer Questions</Typography.Title>
      <Typography.Text>
        Summary: {props.quizData.questionIds.length}, completed:{' '}
        {props.quizData.completedQuestionIds.length}, not completed:{' '}
        {props.quizData.notCompletedQuestionIds.length}
      </Typography.Text>

      <div>
        <ol>
          {questions.map((question) => {
            return <li key={question.id}>{question.title}</li>;
          })}
        </ol>
      </div>

      <div>
        <Button onClick={clearQuiz}>Clear</Button>
      </div>
    </div>
  );
};

export default QuizQuestionsRunner;

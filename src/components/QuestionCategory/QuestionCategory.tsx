import React, { useEffect, useState } from 'react';
import Title from 'antd/lib/typography/Title';
import QuestionCardList from '../QuestionCardList/QuestionCardList';
import { QuizletQuestionCategory } from '../../models/category.model';
import { QuizletQuestion } from '../../models/question.model';

type PropsType = {
  category: QuizletQuestionCategory;
  questions: QuizletQuestion[];
  editQuestion: (question: QuizletQuestion) => void;
  deleteQuestion: (id: number) => void;
};

const QuestionCategory = (props: PropsType) => {
  const [questions, setQuestions] = useState<QuizletQuestion[]>([]);

  useEffect(() => {
    setQuestions(
      props.questions.filter((question) => {
        return question.category === props.category.id;
      }),
    );
  }, [props.questions, props.category]);

  return (
    <div>
      <Title level={2}>{props.category.title}</Title>
      <QuestionCardList
        category={props.category}
        editQuestion={props.editQuestion}
        questions={questions}
        deleteQuestion={props.deleteQuestion}
      />
    </div>
  );
};

export default QuestionCategory;

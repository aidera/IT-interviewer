import React, { useEffect, useState } from 'react';
import Title from 'antd/lib/typography/Title';
import classes from './QuestionCategory.module.scss';
import { QuizletQuestionCategory } from '../../models/category.model';
import { QuizletQuestion } from '../../models/question.model';
import QuestionCard from '../QuestionCard/QuestionCard';

type PropsType = {
  isUpdating?: boolean;
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
      <div className={classes.cards}>
        {questions.map((question) => {
          return (
            <QuestionCard
              key={question.id}
              question={question}
              editQuestion={props.editQuestion}
              deleteQuestion={props.deleteQuestion}
              isUpdating={props.isUpdating}
            />
          );
        })}
      </div>
    </div>
  );
};

export default QuestionCategory;

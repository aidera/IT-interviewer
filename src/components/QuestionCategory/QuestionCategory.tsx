import React, { useEffect, useState } from 'react';
import Title from 'antd/lib/typography/Title';
import classes from './QuestionCategory.module.scss';
import { QuizQuestionCategory } from '../../models/category.model';
import { QuizQuestion } from '../../models/question.model';
import QuestionCard from '../QuestionCard/QuestionCard';

type PropsType = {
  isUpdating?: boolean;
  category: QuizQuestionCategory;
  questions: QuizQuestion[];
  editQuestion: (question: QuizQuestion) => void;
  deleteQuestion: (id: number) => void;
};

const QuestionCategory = (props: PropsType) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);

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

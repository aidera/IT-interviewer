import React from 'react';
import classes from './QuestionCardList.module.scss';
import { QuizletQuestionCategory } from '../../models/category.model';
import QuestionCard from '../QuestionCard/QuestionCard';
import { QuizletQuestion } from '../../models/question.model';

type PropsType = {
  category: QuizletQuestionCategory;
  questions: QuizletQuestion[];
  editQuestion: (question: QuizletQuestion) => void;
  deleteQuestion: (id: number) => void;
};

const QuestionCardList = (props: PropsType) => {
  return (
    <div className={classes.cards}>
      {props.questions.map((question) => {
        return (
          <QuestionCard
            key={question.id}
            question={question}
            editQuestion={props.editQuestion}
            deleteQuestion={props.deleteQuestion}
          />
        );
      })}
    </div>
  );
};

export default QuestionCardList;

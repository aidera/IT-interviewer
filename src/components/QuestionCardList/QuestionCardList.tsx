import React from 'react';
import classes from './QuestionCardList.module.scss';
import { QUIZLET_QUESTIONS } from '../../data/questions';
import { QuizletQuestionCategory } from '../../models/category';
import QuestionCard from '../QuestionCard/QuestionCard';

type PropsType = {
  category: QuizletQuestionCategory;
};

const QuestionCardList = (props: PropsType) => {
  const { category } = props;
  const questions = QUIZLET_QUESTIONS;

  return (
    <div className={classes.cards}>
      {questions
        .filter((question) => question.category.includes(category.id))
        .map((question) => {
          return <QuestionCard key={question.id} question={question} />;
        })}
    </div>
  );
};

export default QuestionCardList;

import React from 'react';
import classes from './QuestionCategoryList.module.scss';
import { CATEGORIES } from '../../data/categories';
import { QuizletQuestionCategory } from '../../models/category';
import QuestionCategory from '../QuestionCategory/QuestionCategory';

const QuestionCategoryList = () => {
  const categories: QuizletQuestionCategory[] = JSON.parse(
    JSON.stringify(CATEGORIES),
  );
  return (
    <div className={classes.categories}>
      {categories.map((category) => {
        return <QuestionCategory key={category.id} category={category} />;
      })}
    </div>
  );
};

export default QuestionCategoryList;

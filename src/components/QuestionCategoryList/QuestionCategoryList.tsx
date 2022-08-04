import React from 'react';
import classes from './QuestionCategoryList.module.scss';
import { CATEGORIES } from '../../data/categories';
import { QuizletQuestionCategory } from '../../models/category.model';
import QuestionCategory from '../QuestionCategory/QuestionCategory';
import { QuizletQuestion } from '../../models/question.model';

type PropsType = {
  questions: QuizletQuestion[];
  editQuestion: (question: QuizletQuestion) => void;
  deleteQuestion: (id: number) => void;
};

const QuestionCategoryList = (props: PropsType) => {
  const categories: QuizletQuestionCategory[] = JSON.parse(
    JSON.stringify(CATEGORIES),
  );
  return (
    <div className={classes.categories}>
      {categories.map((category) => {
        return (
          <QuestionCategory
            key={category.id}
            category={category}
            questions={props.questions}
            editQuestion={props.editQuestion}
            deleteQuestion={props.deleteQuestion}
          />
        );
      })}
    </div>
  );
};

export default QuestionCategoryList;

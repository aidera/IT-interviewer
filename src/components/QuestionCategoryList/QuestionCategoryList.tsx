import React, { useEffect, useState } from 'react';
import classes from './QuestionCategoryList.module.scss';
import { QuizletQuestionCategory } from '../../models/category.model';
import QuestionCategory from '../QuestionCategory/QuestionCategory';
import { QuizletQuestion } from '../../models/question.model';
import CategoriesAPIInstance from '../../api/categories.api';
import { Spin } from 'antd';

type PropsType = {
  questions: QuizletQuestion[];
  editQuestion: (question: QuizletQuestion) => void;
  deleteQuestion: (id: number) => void;
};

const QuestionCategoryList = (props: PropsType) => {
  const [categories, setCategories] = useState<QuizletQuestionCategory[]>([]);
  const [categoriesAreLoading, setCategoriesAreLoading] =
    useState<boolean>(false);

  const getCategories = () => {
    setCategoriesAreLoading(true);
    CategoriesAPIInstance.getCategories()
      .then((res) => {
        if (res.data) {
          setCategories(res.data);
        }
      })
      .finally(() => {
        setCategoriesAreLoading(false);
      });
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <>
      {categoriesAreLoading && (
        <div className={classes.loaderContainer}>
          <Spin size='large' />
        </div>
      )}
      {!categoriesAreLoading && (
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
      )}
    </>
  );
};

export default QuestionCategoryList;

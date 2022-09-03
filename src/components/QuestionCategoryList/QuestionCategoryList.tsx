import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { Spin } from 'antd';

import classes from './QuestionCategoryList.module.scss';
import { categoriesStore } from '../../store';
import { QuizQuestion } from '../../models/question.model';
import QuestionCategory from '../QuestionCategory/QuestionCategory';

type PropsType = {
  isUpdating?: boolean;
  questions: QuizQuestion[];
  editQuestion: (question: QuizQuestion) => void;
  deleteQuestion: (id: number) => void;
};

const QuestionCategoryList = (props: PropsType) => {
  useEffect(() => {
    categoriesStore.getCategories();
  }, []);

  return (
    <>
      {categoriesStore.isFetching && (
        <div className={classes.loaderContainer}>
          <Spin size='large' />
        </div>
      )}
      {!categoriesStore.isFetching && (
        <div className={classes.categories}>
          {categoriesStore.categories.map((category) => {
            if (props.questions.some((el) => el.category === category.id)) {
              return (
                <QuestionCategory
                  key={category.id}
                  category={category}
                  questions={props.questions}
                  editQuestion={props.editQuestion}
                  deleteQuestion={props.deleteQuestion}
                  isUpdating={props.isUpdating}
                />
              );
            } else {
              return;
            }
          })}
        </div>
      )}
    </>
  );
};

export default observer(QuestionCategoryList);

import React from 'react';
import Title from 'antd/lib/typography/Title';
import QuestionCardList from '../QuestionCardList/QuestionCardList';
import { QuizletQuestionCategory } from '../../models/category';

type PropsType = {
  category: QuizletQuestionCategory;
};

const QuestionCategory = (props: PropsType) => {
  const { category } = props;
  return (
    <div>
      <Title level={2}>{category.label}</Title>
      <QuestionCardList category={category} />
    </div>
  );
};

export default QuestionCategory;

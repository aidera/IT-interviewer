import React from 'react';
import classes from './QuizFinalCard.module.scss';
import { ReactComponent as CongratsSvg } from '../../icons/congratulations.svg';
import { Typography } from 'antd';

type PropsType = {
  type: 'finished' | 'iteration';
};

const QuizFinalCard = (props: PropsType) => {
  return (
    <div className={classes.wrapper}>
      <CongratsSvg />
      <Typography.Title level={4}>
        {props.type === 'iteration'
          ? 'Iteration completed!'
          : 'Fully completed!'}
      </Typography.Title>
    </div>
  );
};

export default QuizFinalCard;

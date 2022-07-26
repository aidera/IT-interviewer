import React, { useEffect, useState } from 'react';
import { Typography } from 'antd';

import classes from './QuizQuestionCard.module.scss';
import { GetQuizQuestion } from '../../models/question.model';

type PropsType = {
  question: GetQuizQuestion;
};

const QuizQuestionCard = (props: PropsType) => {
  const [isAnswerOpen, setIsAnswerOpen] = useState<boolean>(false);

  useEffect(() => {
    setIsAnswerOpen(false);
  }, [props.question]);

  return (
    <div className={classes.mainCardContainer}>
      <div className={classes.titlesContainer}>
        <Typography.Title level={3}>{props.question.title}</Typography.Title>
      </div>

      {isAnswerOpen && (
        <div
          dangerouslySetInnerHTML={{
            __html: props.question.answer,
          }}
        ></div>
      )}

      <div className={classes.snowButtonContainer}>
        {!isAnswerOpen && (
          <Typography.Link onClick={() => setIsAnswerOpen(true)}>
            Show answer
          </Typography.Link>
        )}
        {isAnswerOpen && (
          <Typography.Link onClick={() => setIsAnswerOpen(false)}>
            Hide answer
          </Typography.Link>
        )}
      </div>
    </div>
  );
};

export default QuizQuestionCard;

import React, { useEffect, useState } from 'react';
import { Button, Typography } from 'antd';
import { QuizletQuestion } from '../../../../models/question.model';
import { QuizQuestionAnswerType } from '../../../../models/quiz.model';
import classes from './QuizQuestionCard.module.scss';

type PropsType = {
  question: QuizletQuestion;
  answerQuiz: (result: QuizQuestionAnswerType) => void;
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

      <div className={classes.buttonsContainer}>
        <Button
          type='primary'
          onClick={() => props.answerQuiz(QuizQuestionAnswerType.completed)}
        >
          Know
        </Button>
        <Button
          type='primary'
          onClick={() => props.answerQuiz(QuizQuestionAnswerType.notCompleted)}
        >
          Learn
        </Button>
      </div>
    </div>
  );
};

export default QuizQuestionCard;

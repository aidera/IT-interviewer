import React from 'react';
import { Button } from 'antd';

type PropsType = {
  runNewIteration: () => void;
};

const QuizFinalCard = (props: PropsType) => {
  return (
    <div>
      <div>Iteration Completed!</div>
      <Button type='primary' onClick={props.runNewIteration}>
        Next round
      </Button>
    </div>
  );
};

export default QuizFinalCard;

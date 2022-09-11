import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { Button, Card } from 'antd';

import classes from './QuizQuestionsRunner.module.scss';
import { quizStore } from '../../store';
import { QuizQuestionAnswerType } from '../../models/quiz.model';
import { GetQuizQuestion } from '../../models/question.model';
import QuizQuestionCard from '../QuizQuestionCard/QuizQuestionCard';
import QuizFinalCard from '../QuizFinalCard/QuizFinalCard';
import FullWidthLoader from '../FullWidthLoader/FullWidthLoader';

const QuizQuestionsRunner = () => {
  useEffect(() => {
    quizStore.getQuestions();
  }, []);

  const clearQuiz = () => {
    quizStore.clearQuiz();
  };

  const answerQuiz = (result: QuizQuestionAnswerType) => {
    quizStore.answerQuiz(result);
  };

  const finishQuiz = () => {
    quizStore.finishQuiz();
  };

  return (
    <>
      {quizStore.areQuestionsFetching && <FullWidthLoader />}

      {!quizStore.areQuestionsFetching && (
        <>
          <div className={classes.runnerDescription}>
            <span>Summary: {quizStore.questionIds.length}, </span>
            <span className={classes.runnerDescription__success}>
              completed: {quizStore.completedQuestionIds.length},{' '}
            </span>
            <span className={classes.runnerDescription__failure}>
              not completed: {quizStore.notCompletedQuestionIds.length}
            </span>
          </div>

          <Card className={classes.wrapper}>
            <div>
              {quizStore.currentQuestionId &&
                !quizStore.isQuizFullyCompleted &&
                !quizStore.isIterationCompleted && (
                  <QuizQuestionCard
                    question={quizStore.currentQuestion as GetQuizQuestion}
                  />
                )}
              {quizStore.isIterationCompleted &&
                !quizStore.isQuizFullyCompleted && (
                  <QuizFinalCard type={'iteration'} />
                )}
              {quizStore.isQuizFullyCompleted && (
                <QuizFinalCard type={'finished'} />
              )}
            </div>

            <div className={classes.buttonsContainer}>
              <div>
                {!quizStore.isIterationCompleted && (
                  <>
                    <Button
                      type='primary'
                      size='large'
                      onClick={() =>
                        answerQuiz(QuizQuestionAnswerType.completed)
                      }
                    >
                      I know it
                    </Button>
                    <Button
                      type='primary'
                      size='large'
                      danger={true}
                      onClick={() =>
                        answerQuiz(QuizQuestionAnswerType.notCompleted)
                      }
                    >
                      Learn later
                    </Button>
                  </>
                )}

                {quizStore.isIterationCompleted && (
                  <>
                    <Button type='primary' size='large' onClick={finishQuiz}>
                      {quizStore.isQuizFullyCompleted
                        ? 'Start Over'
                        : 'Next round'}
                    </Button>
                  </>
                )}

                <div className='spacer'></div>
                {((!quizStore.isQuizFullyCompleted &&
                  quizStore.isIterationCompleted) ||
                  !quizStore.isIterationCompleted) && (
                  <Button size='large' onClick={clearQuiz}>
                    Start Over
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </>
      )}
    </>
  );
};

export default observer(QuizQuestionsRunner);

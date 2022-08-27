import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Card } from 'antd';
import { QuizData, QuizQuestionAnswerType } from '../../models/quiz.model';
import QuizAPIInstance from '../../api/quiz.api';
import GlossaryAPIInstance from '../../api/glossary.api';
import { QuizQuestion } from '../../models/question.model';
import QuizQuestionCard from '../QuizQuestionCard/QuizQuestionCard';
import classes from './QuizQuestionsRunner.module.scss';
import QuizFinalCard from '../QuizFinalCard/QuizFinalCard';
import FullWidthLoader from '../FullWidthLoader/FullWidthLoader';

type PropsType = {
  quizData: QuizData;
  getQuizData: (callback?: (data: QuizData | null) => void) => void;
};

const QuizQuestionsRunner = (props: PropsType) => {
  const [areQuestionsFetching, setAreQuestionsFetching] =
    useState<boolean>(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionId, setCurrentQuestionId] = useState<number | null>(
    null,
  );
  const [isCongratsCardOpen, setIsCongratsCardOpen] = useState<boolean>(false);

  useEffect(() => {
    if (props.quizData.questionIds.length) {
      setAreQuestionsFetching(true);

      GlossaryAPIInstance.getQuestionsByIds(props.quizData.questionIds).then(
        (res) => {
          setQuestions(res.data || []);
          if (props.quizData.questionIds.length) {
            setCurrentQuestionId(props.quizData.questionIds[0]);
          }
          setAreQuestionsFetching(false);
        },
      );
    }
  }, []);

  const clearQuiz = () => {
    QuizAPIInstance.clearQuiz().then(() => {
      props.getQuizData();
    });
  };

  const getIsFinalMemo = useMemo(() => {
    return (
      props.quizData.questionIds.length ===
      props.quizData.completedQuestionIds.length
    );
  }, [
    props.quizData.questionIds.length,
    props.quizData.completedQuestionIds.length,
  ]);

  const getQuestionMemo = useMemo(() => {
    return questions.find((el) => el.id === currentQuestionId);
  }, [currentQuestionId, props.quizData]);

  const answerQuiz = useCallback(
    (result: QuizQuestionAnswerType) => {
      if (!currentQuestionId) {
        return;
      }

      QuizAPIInstance.answearQuizQuestion(currentQuestionId, result).then(
        () => {
          const currentQuestionIndex = props.quizData.questionIds.findIndex(
            (el) => el === currentQuestionId,
          );

          if (props.quizData.questionIds.length - 1 > currentQuestionIndex) {
            setCurrentQuestionId(
              props.quizData.questionIds[currentQuestionIndex + 1],
            );
          }
          if (props.quizData.questionIds.length - 1 === currentQuestionIndex) {
            setCurrentQuestionId(null);
            setIsCongratsCardOpen(true);
          }

          props.getQuizData();
        },
      );
    },
    [currentQuestionId, props.quizData],
  );

  const finishQuiz = useCallback(() => {
    QuizAPIInstance.finishQuiz().then(() => {
      const callback = (data: QuizData | null) => {
        if (data && data.questionIds.length) {
          setCurrentQuestionId(data.questionIds[0]);
        }
        setIsCongratsCardOpen(false);
      };

      props.getQuizData(callback);
    });
  }, [props.quizData]);

  return (
    <>
      {areQuestionsFetching && <FullWidthLoader />}

      {!areQuestionsFetching && (
        <>
          <div className={classes.runnerDescription}>
            <span>Summary: {props.quizData.questionIds.length}, </span>
            <span className={classes.runnerDescription__success}>
              completed: {props.quizData.completedQuestionIds.length},{' '}
            </span>
            <span className={classes.runnerDescription__failure}>
              not completed: {props.quizData.notCompletedQuestionIds.length}
            </span>
          </div>

          <Card className={classes.wrapper}>
            <div>
              {currentQuestionId && !isCongratsCardOpen && (
                <QuizQuestionCard question={getQuestionMemo as QuizQuestion} />
              )}
              {isCongratsCardOpen && (
                <QuizFinalCard
                  type={getIsFinalMemo ? 'finished' : 'iteration'}
                />
              )}
            </div>

            <div className={classes.buttonsContainer}>
              <div>
                {!isCongratsCardOpen && (
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

                {isCongratsCardOpen && (
                  <>
                    <Button type='primary' size='large' onClick={finishQuiz}>
                      {getIsFinalMemo ? 'Start Over' : 'Next round'}
                    </Button>
                  </>
                )}

                <div className='spacer'></div>
                {((!getIsFinalMemo && isCongratsCardOpen) ||
                  !isCongratsCardOpen) && (
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

export default QuizQuestionsRunner;

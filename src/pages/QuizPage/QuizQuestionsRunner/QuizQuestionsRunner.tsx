import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Typography } from 'antd';
import { QuizData, QuizQuestionAnswerType } from '../../../models/quiz.model';
import QuizAPIInstance from '../../../api/quiz.api';
import GlossaryAPIInstance from '../../../api/glossary.api';
import { QuizletQuestion } from '../../../models/question.model';
import QuizQuestionCard from './QuizQuestionCard/QuizQuestionCard';
import classes from './QuizQuestionsRunner.module.scss';
import QuizFinalCard from './QuizFinalCard/QuizFinalCard';

type PropsType = {
  quizData: QuizData;
  getQuizData: (callback?: (data: QuizData | null) => void) => void;
};

const QuizQuestionsRunner = (props: PropsType) => {
  const [questions, setQuestions] = useState<QuizletQuestion[]>([]);
  const [currentQuestionId, setCurrentQuestionId] = useState<number | null>(
    null,
  );
  const [isFinalOpen, setIsFinalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (props.quizData.questionIds.length) {
      GlossaryAPIInstance.getQuestionsByIds(props.quizData.questionIds).then(
        (res) => {
          setQuestions(res.data || []);
          if (props.quizData.questionIds.length) {
            setCurrentQuestionId(props.quizData.questionIds[0]);
          }
        },
      );
    }
  }, []);

  const clearQuiz = () => {
    QuizAPIInstance.clearQuiz().then(() => {
      props.getQuizData();
    });
  };

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
            setIsFinalOpen(true);
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
        setIsFinalOpen(false);
      };

      props.getQuizData(callback);
    });
  }, [props.quizData]);

  return (
    <div>
      <Typography.Title level={2}>Answer Questions</Typography.Title>
      <Typography.Text>
        Summary: {props.quizData.questionIds.length}, completed:{' '}
        {props.quizData.completedQuestionIds.length}, not completed:{' '}
        {props.quizData.notCompletedQuestionIds.length}
      </Typography.Text>

      <div className={classes.cardContainer}>
        {currentQuestionId && !isFinalOpen && (
          <QuizQuestionCard
            question={getQuestionMemo as QuizletQuestion}
            answerQuiz={answerQuiz}
          />
        )}
        {isFinalOpen && <QuizFinalCard runNewIteration={finishQuiz} />}
      </div>

      <div>
        <Button onClick={clearQuiz}>Start Over</Button>
      </div>
    </div>
  );
};

export default QuizQuestionsRunner;

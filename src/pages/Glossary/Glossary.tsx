import React, { ElementRef, useEffect, useRef, useState } from 'react';
import classes from './Glossary.module.scss';
import { Button } from 'antd';
import QuestionCategoryList from '../../components/QuestionCategoryList/QuestionCategoryList';
import EditQuestionModal from '../../components/EditQuestionModal/EditQuestionModal';
import { EditTypeEnum } from '../../models/utils.model';
import { QuizletQuestion } from '../../models/question.model';
import GlossaryAPIInstance from '../../api/glossary.api';

const Glossary = () => {
  const editModalRef = useRef<ElementRef<typeof EditQuestionModal>>(null);
  const [questions, setQuestions] = useState<QuizletQuestion[]>([]);

  const openAddQuestionModal = () => {
    if (editModalRef.current) {
      editModalRef.current.openModal({ type: EditTypeEnum.add });
    }
  };

  const editQuestion = (question: QuizletQuestion) => {
    if (editModalRef.current) {
      editModalRef.current.openModal({
        type: EditTypeEnum.edit,
        initialValues: question,
      });
    }
  };

  const getQuestions = () => {
    GlossaryAPIInstance.getQuestions().then((res) => {
      if (res.data) {
        setQuestions(res.data);
      }
    });
  };

  const deleteQuestion = (id: number) => {
    GlossaryAPIInstance.deleteQuestion(id).then((res) => {
      if (res.data) {
        getQuestions();
      }
    });
  };

  const onModalSucceed = () => {
    getQuestions();
  };

  useEffect(() => {
    getQuestions();
  }, []);

  return (
    <>
      <div className={classes.container}>
        <div>
          <Button type='primary' onClick={openAddQuestionModal}>
            Add question
          </Button>
        </div>
        <QuestionCategoryList
          editQuestion={editQuestion}
          questions={questions}
          deleteQuestion={deleteQuestion}
        />
      </div>

      <EditQuestionModal ref={editModalRef} onOkCallback={onModalSucceed} />
    </>
  );
};

export default Glossary;

import React, { ElementRef, useRef } from 'react';
import classes from './Glossary.module.scss';
import { Button } from 'antd';
import QuestionCategoryList from '../../components/QuestionCategoryList/QuestionCategoryList';
import EditQuestionModal from '../../components/EditQuestionModal/EditQuestionModal';
import { EditTypeEnum } from '../../models/utils';

const Glossary = () => {
  const editModalRef = useRef<ElementRef<typeof EditQuestionModal>>(null);

  const openAddQuestionModal = () => {
    if (editModalRef.current) {
      editModalRef.current.openModal({ type: EditTypeEnum.add });
    }
  };

  return (
    <>
      <div className={classes.container}>
        <div>
          <Button type='primary' onClick={openAddQuestionModal}>
            Add question
          </Button>
        </div>
        <QuestionCategoryList />
      </div>

      <EditQuestionModal ref={editModalRef} />
    </>
  );
};

export default Glossary;

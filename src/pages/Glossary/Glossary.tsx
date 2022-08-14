import React, { ElementRef, useEffect, useRef, useState } from 'react';
import classes from './Glossary.module.scss';
import { Button, Spin } from 'antd';
import { saveAs } from 'file-saver';
import QuestionCategoryList from '../../components/QuestionCategoryList/QuestionCategoryList';
import EditQuestionModal from '../../components/EditQuestionModal/EditQuestionModal';
import { EditTypeEnum } from '../../models/utils.model';
import { QuizletQuestion } from '../../models/question.model';
import GlossaryAPIInstance from '../../api/glossary.api';
import AddOrOverwriteConfirmModal from '../../components/AddOrOverwriteConfirmModal/AddOrOverwriteConfirmModal';
import { APIResponse } from '../../models/api.model';

const Glossary = () => {
  const editModalRef = useRef<ElementRef<typeof EditQuestionModal>>(null);
  const addOrOverwriteModalRef =
    useRef<ElementRef<typeof AddOrOverwriteConfirmModal>>(null);
  const uploadFileInput = useRef<HTMLInputElement>(null);
  const [questionsAreLoading, setQuestionsAreLoading] =
    useState<boolean>(false);
  const [questions, setQuestions] = useState<QuizletQuestion[]>([]);
  const [uploadFile, setUploadFile] = useState<string | null>(null);

  const openAddQuestionModal = () => {
    if (editModalRef.current) {
      editModalRef.current.openModal({ type: EditTypeEnum.add });
    }
  };

  const uploadFromJSON = () => {
    uploadFileInput?.current?.click();
  };

  const uploadFromJSONHandleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const fileReader = new FileReader();
    if (e?.target?.files?.[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
    }
    fileReader.onload = (e) => {
      if (e?.target?.result) {
        setUploadFile(e.target.result as string);
        addOrOverwriteModalRef.current?.openModal();
      } else {
        setUploadFile(null);
      }
    };
  };

  const uploadCommonTemplate = (request: Promise<APIResponse<number>>) => {
    request
      .then((res) => {
        if (res.data) {
          getQuestions();
        }
      })
      .finally(() => {
        if (uploadFileInput?.current) {
          uploadFileInput.current.value = '';
        }
        setUploadFile(null);
      });
  };

  const uploadOverwrite = () => {
    if (!uploadFile) {
      return;
    }
    uploadCommonTemplate(
      GlossaryAPIInstance.addAndUpdateQuestionsBulk(JSON.parse(uploadFile)),
    );
  };

  const uploadAdd = () => {
    if (!uploadFile) {
      return;
    }
    uploadCommonTemplate(
      GlossaryAPIInstance.addQuestionsBulk(JSON.parse(uploadFile)),
    );
  };

  const downloadToJSON = () => {
    const data = new Blob([JSON.stringify(questions)], {
      type: 'text/plain;charset=utf-8',
    });
    saveAs(data, 'questions.json');
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
    setQuestionsAreLoading(true);
    GlossaryAPIInstance.getQuestions()
      .then((res) => {
        if (res.data) {
          setQuestions(res.data);
        }
      })
      .finally(() => {
        setQuestionsAreLoading(false);
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
        <div className={classes.buttonsContainer}>
          <Button type='primary' onClick={openAddQuestionModal}>
            Add question
          </Button>
          <Button onClick={uploadFromJSON}>Upload (.json)</Button>
          <Button onClick={downloadToJSON}>Download (.json)</Button>
        </div>

        <div style={{ display: 'none' }}>
          <input
            type='file'
            id='upload-from-json'
            accept='.json'
            ref={uploadFileInput}
            onChange={uploadFromJSONHandleChange}
          />
        </div>

        {questionsAreLoading && (
          <div className={classes.loaderContainer}>
            <Spin size='large' />
          </div>
        )}

        {!questionsAreLoading && (
          <QuestionCategoryList
            editQuestion={editQuestion}
            questions={questions}
            deleteQuestion={deleteQuestion}
          />
        )}
      </div>

      <EditQuestionModal ref={editModalRef} onOkCallback={onModalSucceed} />
      <AddOrOverwriteConfirmModal
        ref={addOrOverwriteModalRef}
        onOverwriteSelected={uploadOverwrite}
        onAddSelected={uploadAdd}
      />
    </>
  );
};

export default Glossary;

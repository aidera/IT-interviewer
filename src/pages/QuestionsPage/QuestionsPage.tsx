import React, { ElementRef, useEffect, useRef, useState } from 'react';
import classes from './QuestionsPage.module.scss';
import { observer } from 'mobx-react';
import {
  Button,
  Dropdown,
  Menu,
  Typography,
  MenuProps,
  Input,
  Select,
} from 'antd';
import {
  DownloadOutlined,
  EllipsisOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { saveAs } from 'file-saver';
import QuestionCategoryList from '../../components/QuestionCategoryList/QuestionCategoryList';
import EditQuestionModal from '../../components/EditQuestionModal/EditQuestionModal';
import { EditTypeEnum } from '../../models/utils.model';
import { QuizQuestion } from '../../models/question.model';
import AddOrOverwriteConfirmModal from '../../components/AddOrOverwriteConfirmModal/AddOrOverwriteConfirmModal';
import FullWidthLoader from '../../components/FullWidthLoader/FullWidthLoader';
import { questionsStore } from '../../store';

const levelOptions: React.ReactNode[] = [];
for (let i = 1; i <= 10; i++) {
  levelOptions.push(
    <Select.Option key={i} value={i}>
      {i}
    </Select.Option>,
  );
}

const QuestionsPage = () => {
  const editModalRef = useRef<ElementRef<typeof EditQuestionModal>>(null);
  const addOrOverwriteModalRef =
    useRef<ElementRef<typeof AddOrOverwriteConfirmModal>>(null);

  const uploadFileInput = useRef<HTMLInputElement>(null);

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

  const bulkUpload = (type: 'add' | 'overwrite') => {
    if (!uploadFile) {
      return;
    }
    const callback = () => {
      if (uploadFileInput?.current) {
        uploadFileInput.current.value = '';
      }
      setUploadFile(null);
    };
    questionsStore.uploadBulkQuestions(type, JSON.parse(uploadFile), callback);
  };

  const downloadToJSON = () => {
    const data = new Blob([JSON.stringify(questionsStore.questions)], {
      type: 'text/plain;charset=utf-8',
    });
    saveAs(data, 'questions.json');
  };

  const editQuestion = (question: QuizQuestion) => {
    if (editModalRef.current) {
      editModalRef.current.openModal({
        type: EditTypeEnum.edit,
        initialValues: question,
      });
    }
  };

  const deleteQuestion = (id: number) => {
    questionsStore.deleteQuestion(id);
  };

  const handleMoreActionsMenuClick: MenuProps['onClick'] = (e) => {
    switch (e.key) {
      case 'download':
        downloadToJSON();
        break;
      case 'upload':
        uploadFromJSON();
        break;
    }
  };

  const moreActionsMenu = (
    <Menu
      onClick={handleMoreActionsMenuClick}
      items={[
        {
          label: 'Download (.json)',
          key: 'download',
          icon: <DownloadOutlined />,
        },
        {
          label: 'Upload (.json)',
          key: 'upload',
          icon: <UploadOutlined />,
        },
      ]}
    />
  );

  useEffect(() => {
    questionsStore.getQuestions();
  }, []);

  return (
    <>
      <div className={classes.container}>
        <Typography.Title>All Questions</Typography.Title>

        <div className={classes.toolbar}>
          <div className={classes.filters}>
            <span>Filters: </span>
            <Input
              placeholder='Search by title...'
              allowClear
              value={questionsStore.filters.title}
              onChange={(e) => {
                questionsStore.setFilters('title', e.target.value);
              }}
            />
            <Select
              mode='multiple'
              allowClear
              placeholder='Levels'
              maxTagCount='responsive'
              value={questionsStore.filters.level}
              onChange={(e) => {
                questionsStore.setFilters('level', e);
              }}
            >
              {levelOptions}
            </Select>
          </div>

          <div className={classes.buttonsContainer}>
            <Button type='primary' onClick={openAddQuestionModal}>
              Add question
            </Button>
            <Dropdown
              overlay={moreActionsMenu}
              placement='bottomRight'
              arrow={{ pointAtCenter: true }}
            >
              <Button icon={<EllipsisOutlined />}></Button>
            </Dropdown>
          </div>
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

        {questionsStore.isFetching && <FullWidthLoader />}

        {!questionsStore.isFetching && (
          <QuestionCategoryList
            editQuestion={editQuestion}
            questions={questionsStore.filteredQuestions}
            deleteQuestion={deleteQuestion}
          />
        )}
      </div>

      <EditQuestionModal ref={editModalRef} />
      <AddOrOverwriteConfirmModal
        ref={addOrOverwriteModalRef}
        onOverwriteSelected={() => bulkUpload('overwrite')}
        onAddSelected={() => bulkUpload('add')}
      />
    </>
  );
};

export default observer(QuestionsPage);

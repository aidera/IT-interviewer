import React, { ElementRef, useEffect, useMemo, useRef, useState } from 'react';
import classes from './GlossaryPage.module.scss';
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
import GlossaryAPIInstance from '../../api/glossary.api';
import AddOrOverwriteConfirmModal from '../../components/AddOrOverwriteConfirmModal/AddOrOverwriteConfirmModal';
import { APIResponse } from '../../models/api.model';
import FullWidthLoader from '../../components/FullWidthLoader/FullWidthLoader';
import SetDefaultDataModal from '../../components/SetDefaultDataModal/SetDefaultDataModal';

const levelOptions: React.ReactNode[] = [];
for (let i = 1; i <= 10; i++) {
  levelOptions.push(
    <Select.Option key={i} value={i}>
      {i}
    </Select.Option>,
  );
}

const GlossaryPage = () => {
  const defaultsModalRef = useRef<ElementRef<typeof SetDefaultDataModal>>(null);
  const editModalRef = useRef<ElementRef<typeof EditQuestionModal>>(null);
  const addOrOverwriteModalRef =
    useRef<ElementRef<typeof AddOrOverwriteConfirmModal>>(null);

  const uploadFileInput = useRef<HTMLInputElement>(null);

  const [questionsAreFetching, setQuestionsAreFetching] =
    useState<boolean>(false);
  const [questionsAreUpdating, setQuestionsAreUpdating] =
    useState<boolean>(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [filters, setFilters] = useState<{ title: string; level: number[] }>({
    title: '',
    level: [],
  });
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
          getQuestions(true);
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

  const editQuestion = (question: QuizQuestion) => {
    if (editModalRef.current) {
      editModalRef.current.openModal({
        type: EditTypeEnum.edit,
        initialValues: question,
      });
    }
  };

  const getQuestions = (useUpdateingInsteadOfFetching?: boolean) => {
    if (!useUpdateingInsteadOfFetching) {
      setQuestionsAreFetching(true);
    } else {
      setQuestionsAreUpdating(true);
    }

    GlossaryAPIInstance.getQuestions()
      .then((res) => {
        if (res.data) {
          setQuestions(res.data);
        }
      })
      .finally(() => {
        if (!useUpdateingInsteadOfFetching) {
          setQuestionsAreFetching(false);
        } else {
          setQuestionsAreUpdating(false);
        }
      });
  };

  const deleteQuestion = (id: number) => {
    GlossaryAPIInstance.deleteQuestion(id).then((res) => {
      if (res.data) {
        getQuestions(true);
      }
    });
  };

  const onModalSucceed = () => {
    getQuestions(true);
  };

  const setDefaults = () => {
    const beenAskedAboutDefaults =
      localStorage.getItem('beenAskedAboutDefaults') === 'true';
    if (!beenAskedAboutDefaults) {
      defaultsModalRef?.current?.openModal();
    }
  };

  const onSetDefaultsSucceed = () => {
    getQuestions();
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

  const getFilteredQuestions = useMemo(() => {
    const filtered = questions.filter((question) => {
      const clearedTitle = question.title.trim().toLowerCase();
      const clearedTitleFilter = filters.title.trim().toLowerCase();
      const titleFits = clearedTitle.includes(clearedTitleFilter);
      const levelFits =
        filters.level.includes(question.level) || filters.level.length === 0;

      return titleFits && levelFits;
    });

    return filtered;
  }, [questions, filters]);

  useEffect(() => {
    getQuestions();
    setDefaults();
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
              value={filters.title}
              onChange={(e) => {
                setFilters({ ...filters, title: e.target.value });
              }}
            />
            <Select
              mode='multiple'
              allowClear
              placeholder='Levels'
              maxTagCount='responsive'
              value={filters.level}
              onChange={(e) => {
                setFilters({ ...filters, level: e });
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

        {questionsAreFetching && <FullWidthLoader />}

        {!questionsAreFetching && (
          <QuestionCategoryList
            editQuestion={editQuestion}
            questions={getFilteredQuestions}
            deleteQuestion={deleteQuestion}
            isUpdating={questionsAreUpdating}
          />
        )}
      </div>

      <EditQuestionModal ref={editModalRef} onOkCallback={onModalSucceed} />
      <AddOrOverwriteConfirmModal
        ref={addOrOverwriteModalRef}
        onOverwriteSelected={uploadOverwrite}
        onAddSelected={uploadAdd}
      />
      <SetDefaultDataModal
        ref={defaultsModalRef}
        onSet={onSetDefaultsSucceed}
      />
    </>
  );
};

export default GlossaryPage;

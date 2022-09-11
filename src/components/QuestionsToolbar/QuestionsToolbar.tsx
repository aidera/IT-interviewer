import React, { ElementRef, useMemo, useRef, useState } from 'react';
import { observer } from 'mobx-react';
import {
  CloseOutlined,
  DownloadOutlined,
  EllipsisOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { Button, Dropdown, Input, Menu, MenuProps, Select } from 'antd';
import { saveAs } from 'file-saver';
import { useMediaQuery } from '@react-hook/media-query';

import classes from './QuestionsToolbar.module.scss';
import { categoriesStore, questionsStore } from '../../store';
import EditQuestionModal from '../EditQuestionModal/EditQuestionModal';
import AddOrOverwriteConfirmModal from '../AddOrOverwriteConfirmModal/AddOrOverwriteConfirmModal';
import { EditTypeEnum } from '../../models/utils.model';

const levelOptions: React.ReactNode[] = [];
for (let i = 1; i <= 10; i++) {
  levelOptions.push(
    <Select.Option key={i} value={i}>
      {i}
    </Select.Option>,
  );
}

const QuestionsToolbar = () => {
  const editModalRef = useRef<ElementRef<typeof EditQuestionModal>>(null);
  const addOrOverwriteModalRef =
    useRef<ElementRef<typeof AddOrOverwriteConfirmModal>>(null);

  const uploadFileInput = useRef<HTMLInputElement>(null);

  const [uploadFile, setUploadFile] = useState<string | null>(null);

  const isMobileView = useMediaQuery('(max-width: 700px)');

  const categoryOptions: React.ReactNode[] = useMemo(() => {
    return categoriesStore.categories.map((category) => {
      return (
        <Select.Option key={category.id} value={category.id}>
          {category.title}
        </Select.Option>
      );
    });
  }, [categoriesStore.categories]);

  const onClearFiltersClick = () => {
    questionsStore.clearFilters();
  };

  const openAddQuestionModal = () => {
    if (editModalRef.current) {
      editModalRef.current.openModal({ type: EditTypeEnum.add });
    }
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

  const uploadFromJSON = () => {
    uploadFileInput?.current?.click();
  };

  const downloadToJSON = () => {
    const data = new Blob([JSON.stringify(questionsStore.questions)], {
      type: 'text/plain;charset=utf-8',
    });
    saveAs(data, 'questions.json');
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

  return (
    <>
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
            placeholder='Categories'
            maxTagCount='responsive'
            value={questionsStore.filters.category}
            onChange={(e) => {
              questionsStore.setFilters('category', e);
            }}
          >
            {categoryOptions}
          </Select>

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

          {!isMobileView ? (
            <Button
              onClick={onClearFiltersClick}
              title='Clear filters'
              type='text'
              icon={<CloseOutlined />}
            ></Button>
          ) : (
            <Button onClick={onClearFiltersClick}>Clear filters</Button>
          )}
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
            {!isMobileView ? (
              <Button icon={<EllipsisOutlined />}></Button>
            ) : (
              <Button>More actions</Button>
            )}
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

      <EditQuestionModal ref={editModalRef} />
      <AddOrOverwriteConfirmModal
        ref={addOrOverwriteModalRef}
        onOverwriteSelected={() => bulkUpload('overwrite')}
        onAddSelected={() => bulkUpload('add')}
      />
    </>
  );
};

export default observer(QuestionsToolbar);

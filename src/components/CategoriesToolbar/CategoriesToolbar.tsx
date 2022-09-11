import React, { ElementRef, useRef, useState } from 'react';
import { observer } from 'mobx-react';
import { Button, Dropdown, Input, Menu, MenuProps } from 'antd';
import {
  CloseOutlined,
  DownloadOutlined,
  DownOutlined,
  EllipsisOutlined,
  UploadOutlined,
  UpOutlined,
} from '@ant-design/icons';
import { saveAs } from 'file-saver';
import { useMediaQuery } from '@react-hook/media-query';

import classes from './CategoriesToolbar.module.scss';
import { categoriesStore } from '../../store';
import { EditTypeEnum } from '../../models/utils.model';
import EditCategoryModal from '../../components/EditCategoryModal/EditCategoryModal';
import AddOrOverwriteConfirmModal from '../AddOrOverwriteConfirmModal/AddOrOverwriteConfirmModal';

const CategoriesToolbar = () => {
  const editModalRef = useRef<ElementRef<typeof EditCategoryModal>>(null);
  const addOrOverwriteModalRef =
    useRef<ElementRef<typeof AddOrOverwriteConfirmModal>>(null);
  const uploadFileInput = useRef<HTMLInputElement>(null);

  const [uploadFile, setUploadFile] = useState<string | null>(null);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] =
    useState<boolean>(false);

  const isMobileView = useMediaQuery('(max-width: 700px)');

  const onClearFiltersClick = () => {
    categoriesStore.clearFilters();
  };

  const openAddCategoryModal = () => {
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
    categoriesStore.uploadBulkCategories(
      type,
      JSON.parse(uploadFile),
      callback,
    );
  };

  const downloadToJSON = () => {
    const data = new Blob([JSON.stringify(categoriesStore.categories)], {
      type: 'text/plain;charset=utf-8',
    });
    saveAs(data, 'categories.json');
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
        {isMobileView && (
          <div className={classes.mobileFiltersTrigger}>
            <Button
              onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
              type='link'
              icon={isMobileFiltersOpen ? <UpOutlined /> : <DownOutlined />}
            >
              Filters
            </Button>
          </div>
        )}

        <div
          className={
            classes.filters +
            ' ' +
            (!isMobileFiltersOpen ? classes.filtersClosed : '')
          }
        >
          {!isMobileView && <span>Filters: </span>}

          <Input
            placeholder='Search by title...'
            allowClear
            value={categoriesStore.filters.title}
            onChange={(e) => {
              categoriesStore.setFilters('title', e.target.value);
            }}
          />

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
          <Button type='primary' onClick={openAddCategoryModal}>
            Add category
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

      <EditCategoryModal ref={editModalRef} />
      <AddOrOverwriteConfirmModal
        ref={addOrOverwriteModalRef}
        onOverwriteSelected={() => bulkUpload('overwrite')}
        onAddSelected={() => bulkUpload('add')}
      />
    </>
  );
};

export default observer(CategoriesToolbar);

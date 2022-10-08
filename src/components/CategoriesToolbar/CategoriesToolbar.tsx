import React, { ElementRef, useRef, useState } from 'react';
import { inject, observer } from 'mobx-react';
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
import CategoriesStore from '../../store/categories.store';
import { EditTypeEnum } from '../../models/utils.model';
import EditCategoryModal from '../../components/EditCategoryModal/EditCategoryModal';
import AddOrOverwriteConfirmModal from '../AddOrOverwriteConfirmModal/AddOrOverwriteConfirmModal';

type PropsType = {
  categoriesStore?: CategoriesStore;
};

const CategoriesToolbar = inject('categoriesStore')(
  observer((props: PropsType) => {
    const editModalRef = useRef<ElementRef<typeof EditCategoryModal>>(null);
    const addOrOverwriteModalRef =
      useRef<ElementRef<typeof AddOrOverwriteConfirmModal>>(null);
    const uploadFileInput = useRef<HTMLInputElement>(null);

    const [uploadFile, setUploadFile] = useState<string | null>(null);
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] =
      useState<boolean>(false);

    const isMobileView = useMediaQuery('(max-width: 700px)');

    const onClearFiltersClick = () => {
      props.categoriesStore?.clearFilters();
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
      console.log(1);
      if (e?.target?.files?.[0]) {
        console.log(2);
        fileReader.readAsText(e.target.files[0], 'UTF-8');
      }
      fileReader.onload = (e) => {
        console.log(3);
        if (e?.target?.result) {
          console.log(4);
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
      props.categoriesStore?.uploadBulkCategories(
        type,
        JSON.parse(uploadFile),
        callback,
      );
    };

    const downloadToJSON = () => {
      const data = new Blob(
        [JSON.stringify(props.categoriesStore?.categories)],
        {
          type: 'text/plain;charset=utf-8',
        },
      );
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
        aria-label='more actions menu'
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
            data-testid='filters'
          >
            {!isMobileView && <span>Filters: </span>}

            <Input
              placeholder='Search by title...'
              allowClear
              value={props.categoriesStore?.filters.title}
              onChange={(e) => {
                props.categoriesStore?.setFilters('title', e.target.value);
              }}
            />

            {!isMobileView ? (
              <Button
                onClick={onClearFiltersClick}
                title='Clear filters'
                type='text'
                icon={<CloseOutlined />}
                aria-label='clear filters'
              ></Button>
            ) : (
              <Button onClick={onClearFiltersClick} aria-label='clear filters'>
                Clear filters
              </Button>
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
              trigger={['click']}
            >
              {!isMobileView ? (
                <Button
                  icon={<EllipsisOutlined />}
                  aria-label='more actions button'
                ></Button>
              ) : (
                <Button aria-label='more actions button'>More actions</Button>
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
            aria-label='upload file'
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
  }),
);

export default CategoriesToolbar;

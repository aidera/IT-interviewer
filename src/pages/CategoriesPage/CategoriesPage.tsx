import React, { ElementRef, useEffect, useMemo, useRef, useState } from 'react';
import {
  Button,
  Dropdown,
  Input,
  List,
  Menu,
  MenuProps,
  Spin,
  Typography,
} from 'antd';
import {
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  EllipsisOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { saveAs } from 'file-saver';
import classes from './CategoriesPage.module.scss';
import { QuizQuestionCategory } from '../../models/category.model';
import EditCategoryModal from '../../components/EditCategoryModal/EditCategoryModal';
import AddOrOverwriteConfirmModal from '../../components/AddOrOverwriteConfirmModal/AddOrOverwriteConfirmModal';
import { EditTypeEnum } from '../../models/utils.model';
import { APIResponse } from '../../models/api.model';
import CategoriesAPIInstance from '../../api/categories.api';

const CategoriesPage = () => {
  const editModalRef = useRef<ElementRef<typeof EditCategoryModal>>(null);
  const addOrOverwriteModalRef =
    useRef<ElementRef<typeof AddOrOverwriteConfirmModal>>(null);
  const uploadFileInput = useRef<HTMLInputElement>(null);

  const [categories, setCategories] = useState<QuizQuestionCategory[]>([]);
  const [filters, setFilters] = useState<{ title: string }>({
    title: '',
  });
  const [categoriesAreLoading, setCategoriesAreLoading] =
    useState<boolean>(false);
  const [uploadFile, setUploadFile] = useState<string | null>(null);

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

  const uploadCommonTemplate = (request: Promise<APIResponse<number>>) => {
    request
      .then((res) => {
        if (res.data) {
          getCategories();
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
      CategoriesAPIInstance.addAndUpdateCategoriesBulk(JSON.parse(uploadFile)),
    );
  };

  const uploadAdd = () => {
    if (!uploadFile) {
      return;
    }
    uploadCommonTemplate(
      CategoriesAPIInstance.addCategoriesBulk(JSON.parse(uploadFile)),
    );
  };

  const downloadToJSON = () => {
    const data = new Blob([JSON.stringify(categories)], {
      type: 'text/plain;charset=utf-8',
    });
    saveAs(data, 'categories.json');
  };

  const editCategory = (category: QuizQuestionCategory) => {
    if (editModalRef.current) {
      editModalRef.current.openModal({
        type: EditTypeEnum.edit,
        initialValues: category,
      });
    }
  };

  const getCategories = () => {
    setCategoriesAreLoading(true);
    CategoriesAPIInstance.getCategories()
      .then((res) => {
        if (res.data) {
          setCategories(res.data);
        }
      })
      .finally(() => {
        setCategoriesAreLoading(false);
      });
  };

  const deleteCategory = (id: number) => {
    CategoriesAPIInstance.deleteCategory(id).then((res) => {
      if (res.data) {
        getCategories();
      }
    });
  };

  const onModalSucceed = () => {
    getCategories();
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

  const getFilteredCategories = useMemo(() => {
    const filtered = categories.filter((category) => {
      const clearedTitle = category.title.trim().toLowerCase();
      const clearedTitleFilter = filters.title.trim().toLowerCase();
      const titleFits = clearedTitle.includes(clearedTitleFilter);

      return titleFits;
    });

    return filtered;
  }, [categories, filters]);

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <>
      <div className={classes.container}>
        <Typography.Title>Categories</Typography.Title>

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

        {categoriesAreLoading && (
          <div className={classes.loaderContainer}>
            <Spin size='large' />
          </div>
        )}

        {!categoriesAreLoading && (
          <List
            size='small'
            bordered
            dataSource={getFilteredCategories}
            renderItem={(item) => (
              <List.Item key={item.id} className={classes.listElement}>
                <Button
                  shape='circle'
                  icon={<EditOutlined />}
                  onClick={() => {
                    editCategory(item);
                  }}
                />
                <Button
                  shape='circle'
                  icon={<DeleteOutlined />}
                  onClick={() => {
                    deleteCategory(item.id as number);
                  }}
                />
                <strong>{item.title}</strong>
              </List.Item>
            )}
          />
        )}
      </div>

      <EditCategoryModal ref={editModalRef} onOkCallback={onModalSucceed} />
      <AddOrOverwriteConfirmModal
        ref={addOrOverwriteModalRef}
        onOverwriteSelected={uploadOverwrite}
        onAddSelected={uploadAdd}
      />
    </>
  );
};

export default CategoriesPage;

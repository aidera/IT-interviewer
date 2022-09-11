import React, { ElementRef, useRef } from 'react';
import { Button, List, Spin } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react';

import classes from './CategoriesList.module.scss';
import { categoriesStore } from '../../store';
import { QuizQuestionCategory } from '../../models/category.model';
import { EditTypeEnum } from '../../models/utils.model';
import EditCategoryModal from '../../components/EditCategoryModal/EditCategoryModal';

const CategoriesList = () => {
  const editModalRef = useRef<ElementRef<typeof EditCategoryModal>>(null);

  const editCategory = (category: QuizQuestionCategory) => {
    if (editModalRef.current) {
      editModalRef.current.openModal({
        type: EditTypeEnum.edit,
        initialValues: category,
      });
    }
  };

  const deleteCategory = (id: number) => {
    categoriesStore.deleteCategory(id);
  };

  return (
    <>
      {categoriesStore.isFetching && (
        <div className={classes.loaderContainer}>
          <Spin size='large' />
        </div>
      )}

      {!categoriesStore.isFetching && (
        <List
          size='small'
          bordered
          dataSource={categoriesStore.filteredCategories}
          className={categoriesStore.isUpdating ? classes.listIsUpdating : ''}
          renderItem={(item) => (
            <List.Item key={item.id} className={classes.listElement}>
              <Button
                shape='circle'
                icon={<EditOutlined />}
                onClick={() => {
                  editCategory(item);
                }}
                disabled={categoriesStore.isUpdating}
              />
              <Button
                shape='circle'
                icon={<DeleteOutlined />}
                onClick={() => {
                  deleteCategory(item.id as number);
                }}
                disabled={categoriesStore.isUpdating}
              />
              <strong>{item.title}</strong>
            </List.Item>
          )}
        />
      )}

      <EditCategoryModal ref={editModalRef} />
    </>
  );
};

export default observer(CategoriesList);

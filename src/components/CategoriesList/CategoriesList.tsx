import React, { ElementRef, useRef } from 'react';
import { Button, List, Spin } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { inject, observer } from 'mobx-react';

import classes from './CategoriesList.module.scss';
import CategoriesStore from '../../store/categories.store';
import { QuizQuestionCategory } from '../../models/category.model';
import { EditTypeEnum } from '../../models/utils.model';
import EditCategoryModal from '../../components/EditCategoryModal/EditCategoryModal';

type PropsType = {
  categoriesStore?: CategoriesStore;
};

const CategoriesList = inject('categoriesStore')(
  observer((props: PropsType) => {
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
      props.categoriesStore?.deleteCategory(id);
    };

    return (
      <>
        {props.categoriesStore?.isFetching && (
          <div className={classes.loaderContainer}>
            <Spin size='large' aria-label='spinner' />
          </div>
        )}

        {!props.categoriesStore?.isFetching && (
          <List
            size='small'
            bordered
            dataSource={props.categoriesStore?.filteredCategories}
            className={
              props.categoriesStore?.isUpdating ? classes.listIsUpdating : ''
            }
            renderItem={(item) => (
              <List.Item key={item.id} className={classes.listElement}>
                <Button
                  shape='circle'
                  icon={<EditOutlined />}
                  onClick={() => {
                    editCategory(item);
                  }}
                  disabled={props.categoriesStore?.isUpdating}
                  aria-label='edit-button'
                />
                <Button
                  shape='circle'
                  icon={<DeleteOutlined />}
                  onClick={() => {
                    deleteCategory(item.id as number);
                  }}
                  disabled={props.categoriesStore?.isUpdating}
                  aria-label='delete-button'
                />
                <strong>{item.title}</strong>
              </List.Item>
            )}
          />
        )}

        <EditCategoryModal ref={editModalRef} />
      </>
    );
  }),
);

export default CategoriesList;

import React, {
  ForwardedRef,
  forwardRef,
  useImperativeHandle,
  useState,
} from 'react';
import { Button, Form, Input, Modal } from 'antd';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import { categoriesStore } from '../../store';
import { EditTypeEnum } from '../../models/utils.model';
import {
  EditQuizQuestionCategory,
  QuizQuestionCategory,
} from '../../models/category.model';
import { formUtils } from '../../utils/form.utils';

type PropsType = {
  onOkCallback?: () => void;
  onCancelCallback?: () => void;
};

type OpenModalType = {
  type: EditTypeEnum;
  initialValues?: QuizQuestionCategory;
};

type FormInput = EditQuizQuestionCategory;

export type EditQuestionCategoryModalRefType = {
  openModal: (props: OpenModalType) => void;
};

const defaultValues = {
  title: null,
};

const EditCategoryModal = forwardRef(
  (props: PropsType, ref: ForwardedRef<EditQuestionCategoryModalRefType>) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [title, setTitle] = useState('');
    const [modalProps, setModalProps] = useState<OpenModalType>();

    const form = useForm<FormInput>({
      mode: 'onTouched',
      reValidateMode: 'onChange',
    });

    useImperativeHandle(ref, () => ({
      openModal(modalProps: OpenModalType) {
        setModalProps(modalProps);
        setTitle(
          (modalProps.type === EditTypeEnum.add ? 'Add' : 'Edit') + ' Category',
        );
        if (modalProps.type === EditTypeEnum.edit && modalProps.initialValues) {
          form.reset(modalProps.initialValues);
        } else {
          form.reset(defaultValues as unknown as FormInput);
        }
        setIsModalVisible(true);
      },
    }));

    const closeModal = () => {
      form.reset(defaultValues as unknown as FormInput);
      setIsModalVisible(false);
    };

    const submit: SubmitHandler<FormInput> = (data) => {
      const callback = () => {
        form.reset();
        if (props.onOkCallback) {
          props.onOkCallback();
        }
        closeModal();
      };

      switch (modalProps?.type) {
        case EditTypeEnum.add:
          categoriesStore.addCategory(data, callback);
          break;
        case EditTypeEnum.edit:
          if (modalProps?.initialValues?.id) {
            categoriesStore.editCategory(
              modalProps.initialValues.id,
              data,
              callback,
            );
          }
          break;
      }
    };

    return (
      <Modal
        title={title}
        visible={isModalVisible}
        onCancel={closeModal}
        transitionName=''
        footer={[
          <Button key='back' onClick={closeModal}>
            Cancel
          </Button>,
          <Button
            key='submit'
            type='primary'
            onClick={form.handleSubmit(submit)}
          >
            {modalProps?.type === EditTypeEnum.edit ? 'Save' : 'Submit'}
          </Button>,
        ]}
      >
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          autoComplete='off'
          onFinish={form.handleSubmit(submit)}
        >
          <Form.Item label='Title' name='title' required={true}>
            <Controller
              name='title'
              control={form.control}
              rules={{ required: 'Required' }}
              render={({ field, fieldState }) => {
                return (
                  <>
                    <Input
                      {...field}
                      status={formUtils.returnFieldStatus(fieldState)}
                    />

                    {formUtils.drawError(fieldState)}
                  </>
                );
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    );
  },
);

EditCategoryModal.displayName = 'EditCategoryModal';

export default EditCategoryModal;

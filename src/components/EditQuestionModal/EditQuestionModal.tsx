import React, {
  ForwardedRef,
  forwardRef,
  useImperativeHandle,
  useState,
} from 'react';
import { observer } from 'mobx-react';
import { Button, Form, Input, InputNumber, Modal, Select } from 'antd';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import { categoriesStore, questionsStore } from '../../store';
import { EditTypeEnum } from '../../models/utils.model';
import { EditQuizQuestion } from '../../models/question.model';
import RichEditor from '../RichEditor/RichEditor';
import { formUtils } from '../../utils/form.utils';

type PropsType = {
  onOkCallback?: () => void;
  onCancelCallback?: () => void;
};

type OpenModalType = {
  type: EditTypeEnum;
  initialValues?: EditQuizQuestion;
};

type FormInput = EditQuizQuestion;

export type EditQuestionModalRefType = {
  openModal: (props: OpenModalType) => void;
};

const defaultValues = {
  answer: null,
  category: null,
  level: null,
  title: null,
};

const EditQuestionModal = forwardRef(
  (props: PropsType, ref: ForwardedRef<EditQuestionModalRefType>) => {
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
          (modalProps.type === EditTypeEnum.add ? 'Add' : 'Edit') + ' Question',
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
          questionsStore.addQuestion(data, callback);
          break;
        case EditTypeEnum.edit:
          if (modalProps?.initialValues?.id) {
            questionsStore.editQuestion(
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
        width='700px'
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

          <Form.Item name='category' label='Category' required={true}>
            <Controller
              name='category'
              control={form.control}
              rules={{ required: 'Required' }}
              render={({ field, fieldState }) => (
                <>
                  <Select
                    placeholder='Select a option and change input text above'
                    status={formUtils.returnFieldStatus(fieldState)}
                    loading={categoriesStore.isFetching}
                    {...field}
                  >
                    {categoriesStore.categories.map((category) => {
                      return (
                        <Select.Option value={category.id} key={category.id}>
                          {category.title}
                        </Select.Option>
                      );
                    })}
                  </Select>

                  {formUtils.drawError(fieldState)}
                </>
              )}
            />
          </Form.Item>

          <Form.Item label='Level' name='level' required={true}>
            <Controller
              name='level'
              control={form.control}
              rules={{ required: 'Required' }}
              render={({ field, fieldState }) => (
                <>
                  <InputNumber
                    max={10}
                    min={1}
                    step={1}
                    formatter={formUtils.toFieldIntegerNumber}
                    status={formUtils.returnFieldStatus(fieldState)}
                    {...field}
                  />

                  {formUtils.drawError(fieldState)}
                </>
              )}
            />
          </Form.Item>

          <Form.Item label='Answer' name='answer'>
            <Controller
              name='answer'
              control={form.control}
              render={({ field }) => {
                return isModalVisible ? (
                  <RichEditor value={field.value} onChange={field.onChange} />
                ) : (
                  <></>
                );
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    );
  },
);

EditQuestionModal.displayName = 'EditQuestionModal';

export default observer(EditQuestionModal);

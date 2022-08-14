import React, {
  ForwardedRef,
  forwardRef,
  useImperativeHandle,
  useState,
} from 'react';
import { Form, Input, InputNumber, Modal, Select } from 'antd';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { EditTypeEnum } from '../../models/utils.model';
import { CATEGORIES } from '../../data/categories';
import { QuizletQuestionCategory } from '../../models/category.model';
import GlossaryAPIInstance from '../../api/glossary.api';
import { EditQuizletQuestion } from '../../models/question.model';
import { APIResponse } from '../../models/api.model';
import RichEditor from '../RichEditor/RichEditor';

type PropsType = {
  onOkCallback?: () => void;
  onCancelCallback?: () => void;
};

type OpenModalType = {
  type: EditTypeEnum;
  initialValues?: EditQuizletQuestion;
};

type FormInput = EditQuizletQuestion;

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

    const form = useForm<FormInput>();

    const categories: QuizletQuestionCategory[] = JSON.parse(
      JSON.stringify(CATEGORIES),
    );

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
      setIsModalVisible(false);
    };

    const submit: SubmitHandler<FormInput> = (data) => {
      let request: Promise<APIResponse<number>> | undefined;
      switch (modalProps?.type) {
        case EditTypeEnum.add:
          request = GlossaryAPIInstance.addQuestion(data);
          break;
        case EditTypeEnum.edit:
          if (modalProps?.initialValues?.id) {
            request = GlossaryAPIInstance.editQuestion(
              modalProps.initialValues.id,
              data,
            );
          }
          break;
      }

      if (!request) {
        return;
      }

      request.then(() => {
        form.reset();
        if (props.onOkCallback) {
          props.onOkCallback();
        }
        closeModal();
      });
    };

    return (
      <Modal
        title={title}
        visible={isModalVisible}
        onCancel={closeModal}
        okText={modalProps?.type === EditTypeEnum.edit ? 'Save' : 'Submit'}
        onOk={form.handleSubmit(submit)}
        mask={false}
      >
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          autoComplete='off'
          onFinish={form.handleSubmit(submit)}
        >
          <Form.Item
            label='Title'
            name='title'
            rules={[{ required: true, message: 'Please input a title!' }]}
          >
            <Controller
              name='title'
              control={form.control}
              render={({ field }) => <Input {...field} />}
            />
          </Form.Item>

          <Form.Item
            name='category'
            label='Category'
            rules={[{ required: true }]}
          >
            <Controller
              name='category'
              control={form.control}
              render={({ field }) => (
                <Select
                  placeholder='Select a option and change input text above'
                  {...field}
                >
                  {categories.map((category) => {
                    return (
                      <Select.Option value={category.id} key={category.id}>
                        {category.label}
                      </Select.Option>
                    );
                  })}
                </Select>
              )}
            />
          </Form.Item>

          <Form.Item
            label='Level'
            name='level'
            rules={[{ required: true, message: 'Please input a level!' }]}
          >
            <Controller
              name='level'
              control={form.control}
              render={({ field }) => (
                <InputNumber
                  max={10}
                  min={1}
                  step={1}
                  formatter={(value) => `${value}`.replaceAll('.', '')}
                  {...field}
                />
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

export default EditQuestionModal;

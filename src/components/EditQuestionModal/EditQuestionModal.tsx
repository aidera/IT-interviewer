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

type PropsType = {
  onOkCallback?: () => void;
  onCancelCallback?: () => void;
};

type OpenModalType = {
  type?: EditTypeEnum;
};

interface IFormInput {
  title: string;
  category: number;
  level: number;
  answer: string;
}

export type EditQuestionModalRefType = {
  openModal: (props: OpenModalType) => void;
};

const EditQuestionModal = forwardRef(
  (props: PropsType, ref: ForwardedRef<EditQuestionModalRefType>) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [title, setTitle] = useState('');
    const { control, handleSubmit, reset } = useForm<IFormInput>();

    const categories: QuizletQuestionCategory[] = JSON.parse(
      JSON.stringify(CATEGORIES),
    );

    useImperativeHandle(ref, () => ({
      openModal(modalProps: OpenModalType) {
        setTitle(
          (modalProps.type === EditTypeEnum.add ? 'Add' : 'Edit') + ' Question',
        );
        setIsModalVisible(true);
      },
    }));

    const closeModal = () => {
      setIsModalVisible(false);
    };

    const submit: SubmitHandler<IFormInput> = (data) => {
      GlossaryAPIInstance.addQuestion(data).then(() => {
        reset();
        closeModal();
      });
    };

    return (
      <Modal
        title={title}
        visible={isModalVisible}
        onCancel={closeModal}
        okText='Submit'
        onOk={handleSubmit(submit)}
      >
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          initialValues={{ remember: true }}
          autoComplete='off'
          onFinish={handleSubmit(submit)}
        >
          <Form.Item
            label='Title'
            name='title'
            rules={[{ required: true, message: 'Please input a title!' }]}
          >
            <Controller
              name='title'
              control={control}
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
              control={control}
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
              control={control}
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
              control={control}
              render={({ field }) => <Input.TextArea rows={4} {...field} />}
            />
          </Form.Item>
        </Form>
      </Modal>
    );
  },
);

EditQuestionModal.displayName = 'EditQuestionModal';

export default EditQuestionModal;

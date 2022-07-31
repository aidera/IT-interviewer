import React, {
  ForwardedRef,
  forwardRef,
  useImperativeHandle,
  useState,
} from 'react';
import { Form, Input, InputNumber, Modal, Select } from 'antd';
import { EditTypeEnum } from '../../models/utils';
import { CATEGORIES } from '../../data/categories';
import { QuizletQuestionCategory } from '../../models/category';

type PropsType = {
  onOkCallback?: () => void;
  onCancelCallback?: () => void;
};

type OpenModalType = {
  type?: EditTypeEnum;
};

export type EditQuestionModalRefType = {
  openModal: (props: OpenModalType) => void;
};

const EditQuestionModal = forwardRef(
  (props: PropsType, ref: ForwardedRef<EditQuestionModalRefType>) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [title, setTitle] = useState('');

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

    return (
      <Modal
        title={title}
        visible={isModalVisible}
        onCancel={closeModal}
        okText='Submit'
      >
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          initialValues={{ remember: true }}
          autoComplete='off'
        >
          <Form.Item
            label='Title'
            name='title'
            rules={[{ required: true, message: 'Please input a title!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name='category'
            label='Category'
            rules={[{ required: true }]}
          >
            <Select placeholder='Select a option and change input text above'>
              {categories.map((category) => {
                return (
                  <Select.Option value={category.id} key={category.id}>
                    {category.label}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>

          <Form.Item
            label='Level'
            name='level'
            rules={[{ required: true, message: 'Please input a level!' }]}
          >
            <InputNumber
              max={10}
              min={1}
              step={1}
              formatter={(value) => `${value}`.replaceAll('.', '')}
            />
          </Form.Item>

          <Form.Item label='Answer' name='answer'>
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    );
  },
);

EditQuestionModal.displayName = 'EditQuestionModal';

export default EditQuestionModal;

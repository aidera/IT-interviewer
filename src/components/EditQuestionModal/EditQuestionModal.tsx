import React, {
  ForwardedRef,
  forwardRef,
  useImperativeHandle,
  useState,
} from 'react';
import { Modal } from 'antd';
import { EditTypeEnum } from '../../models/utils';

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
      <Modal title={title} visible={isModalVisible} onCancel={closeModal}>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    );
  },
);

EditQuestionModal.displayName = 'EditQuestionModal';

export default EditQuestionModal;

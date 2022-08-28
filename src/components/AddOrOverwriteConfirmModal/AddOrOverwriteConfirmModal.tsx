import React, {
  ForwardedRef,
  forwardRef,
  useImperativeHandle,
  useState,
} from 'react';
import { Button, Modal } from 'antd';

type PropsType = {
  onAddSelected: () => void;
  onOverwriteSelected: () => void;
};

export type AddOrOverwriteConfirmModalRefType = {
  openModal: () => void;
};

const AddOrOverwriteConfirmModal = forwardRef(
  (props: PropsType, ref: ForwardedRef<AddOrOverwriteConfirmModalRefType>) => {
    const [isModalVisible, setIsModalVisible] = useState(false);

    const closeModal = () => {
      setIsModalVisible(false);
    };

    const add = () => {
      props.onAddSelected();
      setIsModalVisible(false);
    };

    const overwrite = () => {
      props.onOverwriteSelected();
      setIsModalVisible(false);
    };

    useImperativeHandle(ref, () => ({
      openModal() {
        setIsModalVisible(true);
      },
    }));

    return (
      <Modal
        title={'Upload method'}
        visible={isModalVisible}
        onCancel={closeModal}
        transitionName=''
        footer={[
          <Button key='back' onClick={closeModal}>
            Return
          </Button>,
          <Button key='add' type='primary' onClick={add}>
            Add as new
          </Button>,
          <Button key='overwrite' type='primary' onClick={overwrite}>
            Overwrite by IDs
          </Button>,
        ]}
      >
        We can overwrite the current data by elements&apos; id. Also we can
        ignore ids and add all the data elements as new ones without
        overwriting.
      </Modal>
    );
  },
);

AddOrOverwriteConfirmModal.displayName = 'AddOrOverwriteConfirmModal';

export default AddOrOverwriteConfirmModal;

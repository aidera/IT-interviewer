import React, {
  ForwardedRef,
  forwardRef,
  useImperativeHandle,
  useState,
} from 'react';
import { Button, Modal } from 'antd';
import { categoriesStore, questionsStore } from '../../store';

type PropsType = {
  onSet?: () => void;
};

export type SetDefaultDataModalRefType = {
  openModal: () => void;
};

const SetDefaultDataModal = forwardRef(
  (props: PropsType, ref: ForwardedRef<SetDefaultDataModalRefType>) => {
    const [isModalVisible, setIsModalVisible] = useState(false);

    const closeModal = () => {
      setIsModalVisible(false);
    };

    const setDefaults = () => {
      setIsModalVisible(false);

      const questionCallback = () => {
        localStorage.setItem('beenAskedAboutDefaults', 'true');
        props.onSet?.();
      };

      const categoriesCallback = () => {
        questionsStore.setDefaultQuestions(questionCallback);
      };

      categoriesStore.setDefaultCategories(categoriesCallback);
    };

    useImperativeHandle(ref, () => ({
      openModal() {
        setIsModalVisible(true);
      },
    }));

    return (
      <Modal
        title={'Set the defaults?'}
        visible={isModalVisible}
        onCancel={closeModal}
        transitionName=''
        footer={[
          <Button key='back' onClick={closeModal}>
            Cancel
          </Button>,
          <Button key='add' type='primary' onClick={setDefaults}>
            Set
          </Button>,
        ]}
      >
        You don&apos;t have categories or questions. Do you want to set the
        default ones?
      </Modal>
    );
  },
);

SetDefaultDataModal.displayName = 'SetDefaultDataModal';

export default SetDefaultDataModal;

import React, {
  ForwardedRef,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import { observer } from 'mobx-react';
import { Button, Divider, Modal, Typography } from 'antd';

import { categoriesStore } from '../../store';
import { QuizQuestion } from '../../models/question.model';

type PropsType = {
  onOkCallback?: () => void;
  onCancelCallback?: () => void;
};

type OpenModalType = {
  question: QuizQuestion;
};

export type ShowQuestionModalRefType = {
  openModal: (props: OpenModalType) => void;
};

const ShowQuestionModal = forwardRef(
  (props: PropsType, ref: ForwardedRef<ShowQuestionModalRefType>) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalProps, setModalProps] = useState<OpenModalType>();

    useImperativeHandle(ref, () => ({
      openModal(modalProps: OpenModalType) {
        setModalProps(modalProps);
        setIsModalVisible(true);
      },
    }));

    const closeModal = () => {
      setIsModalVisible(false);
    };

    const category = useMemo(() => {
      if (modalProps?.question?.category) {
        const foundCategory = categoriesStore.categories.find(
          (el) => el.id === modalProps.question.category,
        );
        if (!foundCategory) {
          return '';
        }
        return foundCategory.title;
      } else {
        return '';
      }
    }, [modalProps?.question.category]);

    return (
      <Modal
        title={'View Question'}
        visible={isModalVisible}
        onCancel={closeModal}
        width='700px'
        transitionName=''
        footer={[
          <Button key='back' onClick={closeModal}>
            Cancel
          </Button>,
        ]}
      >
        <div>
          <Typography.Title level={3}>
            {modalProps?.question.title || ''}
          </Typography.Title>
        </div>
        <div>Category: {category}</div>
        <div>Level: {modalProps?.question.level || ''}</div>

        <Divider></Divider>

        <div
          dangerouslySetInnerHTML={{
            __html: modalProps?.question.answer || '',
          }}
        ></div>
      </Modal>
    );
  },
);

ShowQuestionModal.displayName = 'ShowQuestionModal';

export default observer(ShowQuestionModal);

import React, {
  ForwardedRef,
  forwardRef,
  useImperativeHandle,
  useState,
} from 'react';
import { Button, Form, Input, Modal } from 'antd';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import classes from './RichEditorLinkModal.module.scss';
import { formUtils } from '../../utils/form.utils';
import { EditTypeEnum } from '../../models/utils.model';

type PropsType = {
  onOkCallback?: (data: FormInput) => void;
  onCancelCallback?: () => void;
};

type OpenModalType = {
  type: EditTypeEnum;
  initialValues?: FormInput;
};

type FormInput = {
  href: string;
};

export type RichEditorLinkModalRefType = {
  openModal: (props: OpenModalType) => void;
};

const defaultValues = {
  href: null,
};

const RichEditorLinkModal = forwardRef(
  (props: PropsType, ref: ForwardedRef<RichEditorLinkModalRefType>) => {
    const [modalProps, setModalProps] = useState<OpenModalType>();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const form = useForm<FormInput>({
      mode: 'onTouched',
      reValidateMode: 'onChange',
    });

    useImperativeHandle(ref, () => ({
      openModal(modalProps: OpenModalType) {
        setModalProps(modalProps);
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

    const removeLink = () => {
      form.reset(defaultValues as unknown as FormInput);
      props.onOkCallback?.(defaultValues as unknown as FormInput);
      setIsModalVisible(false);
    };

    const submit: SubmitHandler<FormInput> = (data) => {
      form.reset(defaultValues as unknown as FormInput);
      props.onOkCallback?.(data);
      setIsModalVisible(false);
      closeModal();
    };

    const footerButtons: React.ReactNode[] =
      modalProps?.type === EditTypeEnum.edit
        ? [
            <Button key='back' onClick={closeModal}>
              Cancel
            </Button>,
            <Button key='clear' type='primary' danger onClick={removeLink}>
              Remove Link
            </Button>,
            <Button
              key='submit'
              type='primary'
              onClick={form.handleSubmit(submit)}
            >
              Save
            </Button>,
          ]
        : [
            <Button key='back' onClick={closeModal}>
              Cancel
            </Button>,
            <Button
              key='submit'
              type='primary'
              onClick={form.handleSubmit(submit)}
            >
              Set
            </Button>,
          ];

    return (
      <Modal
        title={'Link'}
        visible={isModalVisible}
        onCancel={closeModal}
        width='400px'
        transitionName=''
        footer={footerButtons}
      >
        <Form
          autoComplete='off'
          layout='vertical'
          onFinish={form.handleSubmit(submit)}
        >
          <Form.Item
            name='href'
            required={true}
            className={classes.questionsCountColumn}
          >
            <Controller
              name='href'
              control={form.control}
              render={({ field, fieldState }) => (
                <>
                  <Input
                    status={formUtils.returnFieldStatus(fieldState)}
                    {...field}
                  />

                  {formUtils.drawError(fieldState)}
                </>
              )}
            />
          </Form.Item>
        </Form>
      </Modal>
    );
  },
);

RichEditorLinkModal.displayName = 'RichEditorLinkModal';

export default RichEditorLinkModal;

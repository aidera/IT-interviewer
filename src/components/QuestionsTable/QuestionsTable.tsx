import React, { ElementRef, useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react';
import { Button, Space, Table } from 'antd';
import Column from 'antd/lib/table/Column';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';

import classes from './QuestionsTable.module.scss';
import { questionsStore } from '../../store';
import EditQuestionModal from '../EditQuestionModal/EditQuestionModal';
import { GetQuizQuestion, QuizQuestion } from '../../models/question.model';
import { EditTypeEnum } from '../../models/utils.model';
import ShowQuestionModal from '../ShowQuestionModal/ShowQuestionModal';
import FullWidthLoader from '../FullWidthLoader/FullWidthLoader';
import { convertGetQuestionToBare } from '../../utils/api.utils';

interface DataType extends GetQuizQuestion {
  key: React.Key;
}

const QuestionsTable = () => {
  const showModalRef = useRef<ElementRef<typeof ShowQuestionModal>>(null);
  const editModalRef = useRef<ElementRef<typeof EditQuestionModal>>(null);
  const [questions, setQuestions] = useState<DataType[]>([]);

  const editQuestion = (question: QuizQuestion) => {
    if (editModalRef.current) {
      editModalRef.current.openModal({
        type: EditTypeEnum.edit,
        initialValues: question,
      });
    }
  };

  const deleteQuestion = (id: number) => {
    questionsStore.deleteQuestion(id);
  };

  const openShowQuestionModal = (questionId: number) => {
    const question = questionsStore.questions.find(
      (el) => el.id === questionId,
    );
    if (!question) {
      return;
    }
    showModalRef?.current?.openModal({
      question: convertGetQuestionToBare(question),
    });
  };

  const openEditQuestionModal = (questionId: number) => {
    const question = questionsStore.questions.find(
      (el) => el.id === questionId,
    );
    if (!question) {
      return;
    }
    editQuestion(convertGetQuestionToBare(question));
  };

  const openDeleteQuestionModal = (questionId: number) => {
    deleteQuestion(questionId);
  };

  useEffect(() => {
    questionsStore;
  }, []);

  useEffect(() => {
    const tableQuestions = questionsStore.filteredQuestions.map((q) => {
      return {
        ...q,
        key: q.id,
      } as DataType;
    });
    setQuestions(tableQuestions);
  }, [questionsStore.filteredQuestions]);

  return (
    <>
      {questionsStore.isFetching && <FullWidthLoader />}

      {!questionsStore.isFetching && (
        <Table
          dataSource={questions}
          className={
            classes.table +
            ' ' +
            (questionsStore.isUpdating ? classes.tableIsUpdating : '')
          }
        >
          <Column
            title=''
            key='action'
            render={(_: any, record: DataType) => (
              <Space size='small'>
                <Button
                  shape='circle'
                  icon={<EyeOutlined />}
                  onClick={() => openShowQuestionModal(record.id)}
                  disabled={questionsStore.isUpdating}
                />
                <Button
                  shape='circle'
                  icon={<EditOutlined />}
                  onClick={() => openEditQuestionModal(record.id)}
                  disabled={questionsStore.isUpdating}
                />
                <Button
                  shape='circle'
                  icon={<DeleteOutlined />}
                  onClick={() => openDeleteQuestionModal(record.id)}
                  disabled={questionsStore.isUpdating}
                />
              </Space>
            )}
          />

          <Column
            title='Title'
            dataIndex='title'
            key='title'
            className={classes.titleColumn}
          />

          <Column
            title='Category'
            dataIndex='categoryName'
            key='categoryName'
            className={classes.categoryColumn}
          />

          <Column title='Level' dataIndex='level' key='level' />
        </Table>
      )}

      <ShowQuestionModal ref={showModalRef} />
      <EditQuestionModal ref={editModalRef} />
    </>
  );
};

export default observer(QuestionsTable);

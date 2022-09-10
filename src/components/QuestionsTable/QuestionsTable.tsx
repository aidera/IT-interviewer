import React, { ElementRef, useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react';
import { Button, Space, Table } from 'antd';
import Column from 'antd/lib/table/Column';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';

import classes from './QuestionsTable.module.scss';
import { questionsStore, categoriesStore } from '../../store';
import EditQuestionModal from '../EditQuestionModal/EditQuestionModal';
import { QuizQuestion } from '../../models/question.model';
import { EditTypeEnum } from '../../models/utils.model';
import ShowQuestionModal from '../ShowQuestionModal/ShowQuestionModal';

interface DataType {
  key: React.Key;
  id: number;
  title: string;
  level: number;
  category: string;
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
    showModalRef?.current?.openModal({ question });
  };

  const openEditQuestionModal = (questionId: number) => {
    const question = questionsStore.questions.find(
      (el) => el.id === questionId,
    );
    if (!question) {
      return;
    }
    editQuestion(question);
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
        key: q.id,
        id: q.id,
        title: q.title,
        level: q.level,
        category:
          categoriesStore.categories.find((c) => q.category === c.id)?.title ||
          '',
      } as DataType;
    });
    setQuestions(tableQuestions);
  }, [questionsStore.filteredQuestions]);

  return (
    <>
      <Table dataSource={questions} className={classes.table}>
        <Column
          title=''
          key='action'
          render={(_: any, record: DataType) => (
            <Space size='small'>
              <Button
                shape='circle'
                icon={<EyeOutlined />}
                onClick={() => openShowQuestionModal(record.id)}
              />
              <Button
                shape='circle'
                icon={<EditOutlined />}
                onClick={() => openEditQuestionModal(record.id)}
              />
              <Button
                shape='circle'
                icon={<DeleteOutlined />}
                onClick={() => openDeleteQuestionModal(record.id)}
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
          dataIndex='category'
          key='category'
          className={classes.categoryColumn}
        />

        <Column title='Level' dataIndex='level' key='level' />
      </Table>

      <ShowQuestionModal ref={showModalRef} />
      <EditQuestionModal ref={editModalRef} />
    </>
  );
};

export default observer(QuestionsTable);

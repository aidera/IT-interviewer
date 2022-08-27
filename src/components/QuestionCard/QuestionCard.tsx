import React, { useRef } from 'react';
import classes from './QuestionCard.module.scss';
import { Button, Collapse } from 'antd';
import Title from 'antd/lib/typography/Title';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { QuizQuestion } from '../../models/question.model';
import useOnScreen from '../../hooks/useOnScreen';

type PropsType = {
  isUpdating?: boolean;
  question: QuizQuestion;
  editQuestion: (question: QuizQuestion) => void;
  deleteQuestion: (id: number) => void;
};

const QuestionCard = (props: PropsType) => {
  const ref = useRef<HTMLInputElement>(null);
  const isVisible = useOnScreen(ref);

  const openEditQuestionModal = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    props.editQuestion(props.question);
  };

  const openDeleteQuestionModal = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    if (props.question.id) {
      props.deleteQuestion(props.question.id);
    }
  };

  return (
    <div className={classes.wrapper} ref={ref}>
      {props.question && props.question.id && isVisible && (
        <Collapse key={props.question.id}>
          <Collapse.Panel
            header={
              <div className={classes.headerPanel}>
                <div className={classes.buttons}>
                  <Button
                    shape='circle'
                    icon={<EditOutlined />}
                    onClick={openEditQuestionModal}
                    disabled={props.isUpdating}
                  />
                  <Button
                    shape='circle'
                    icon={<DeleteOutlined />}
                    onClick={openDeleteQuestionModal}
                    disabled={props.isUpdating}
                  />
                </div>
                <strong>{props.question.title}</strong>
                <i>Level: {props.question.level}</i>
              </div>
            }
            key={props.question.id}
          >
            <div
              dangerouslySetInnerHTML={{
                __html: props.question.answer,
              }}
            ></div>

            {props.question.links && (
              <div className={classes.links}>
                <Title level={5}>Ссылки на материалы:</Title>
                <ul>
                  {props.question.links.map((link) => {
                    return (
                      <li key={link.href}>
                        <a href={link.href}>{link.label}</a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </Collapse.Panel>
        </Collapse>
      )}
    </div>
  );
};

export default QuestionCard;

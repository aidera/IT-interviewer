import React from 'react';
import classes from './QuestionCard.module.scss';
import { Collapse } from 'antd';
import Title from 'antd/lib/typography/Title';
import { QuizletQuestion } from '../../models/question.model';

type PropsType = {
  question: QuizletQuestion;
};

const QuestionCard = (props: PropsType) => {
  const { question } = props;

  return (
    <Collapse key={question.id}>
      <Collapse.Panel
        header={
          <div className={classes.headerPanel}>
            <strong>{question.title}</strong>
            <i>Level: {question.level}</i>
          </div>
        }
        key={question.id}
      >
        <div
          dangerouslySetInnerHTML={{
            __html: question.answer,
          }}
        ></div>

        {question.links && (
          <div className={classes.links}>
            <Title level={5}>Ссылки на материалы:</Title>
            <ul>
              {question.links.map((link) => {
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
  );
};

export default QuestionCard;

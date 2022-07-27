import React from 'react';
import './App.css';
import 'antd/dist/antd.min.css';
import { Card, Collapse, Layout, Menu } from 'antd';
import { Content, Footer, Header } from 'antd/lib/layout/layout';
import Sider from 'antd/lib/layout/Sider';
import { ItemType } from 'antd/lib/menu/hooks/useItems';
import {
  QuizletQuestionCategory,
  QuizletQuestionLevel,
  QUIZLET_QUESTIONS,
} from './questions';
import { getEnumKeys } from './utils';
import Title from 'antd/lib/typography/Title';

function App() {
  const menuItems: ItemType[] = [
    {
      key: 1,
      label: 'All Questions',
    },
    {
      key: 2,
      label: 'Quizlet',
    },
  ];

  const levels = getEnumKeys(QuizletQuestionLevel);
  const categories = getEnumKeys(QuizletQuestionCategory);
  const questions = QUIZLET_QUESTIONS;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header className='site-layout-background' style={{ padding: 0 }} />
      <Layout style={{ flexDirection: 'row' }}>
        <Sider>
          <div className='logo' />
          <Menu
            theme='dark'
            defaultSelectedKeys={['1']}
            mode='inline'
            items={menuItems}
          />
        </Sider>
        <Layout className='site-layout'>
          <Content style={{ margin: '0 16px' }}>
            {levels.map((level) => {
              return (
                <div key={level}>
                  <Title level={1}>{QuizletQuestionLevel[level]}</Title>
                  {categories.map((category) => {
                    return (
                      <div key={category}>
                        <Title level={2}>
                          {QuizletQuestionCategory[category]}
                        </Title>
                        <div
                          style={{
                            display: 'flex',
                            gap: '16px',
                            flexDirection: 'column',
                          }}
                        >
                          {questions
                            .filter(
                              (question) =>
                                question.level === level &&
                                question.category.includes(category),
                            )
                            .map((question) => {
                              return (
                                <Collapse onChange={() => {}} key={question.id}>
                                  <Collapse.Panel
                                    header={question.title}
                                    key={question.id}
                                  >
                                    <div
                                      dangerouslySetInnerHTML={{
                                        __html: question.answer,
                                      }}
                                    ></div>

                                    {question.links && (
                                      <div style={{ marginTop: 24 }}>
                                        <Title level={5}>
                                          Ссылки на материалы:
                                        </Title>
                                        <ul>
                                          {question.links.map((link) => {
                                            return (
                                              <li>
                                                <a href={link.href}>
                                                  {link.label}
                                                </a>
                                              </li>
                                            );
                                          })}
                                        </ul>
                                      </div>
                                    )}
                                  </Collapse.Panel>
                                </Collapse>
                              );
                            })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            Ant Design ©2018 Created by Ant UED
          </Footer>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default App;

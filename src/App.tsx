import React from 'react';
import './App.css';
import 'antd/dist/antd.min.css';
import { Layout, Menu } from 'antd';
import { Content, Footer, Header } from 'antd/lib/layout/layout';
import Title from 'antd/lib/typography/Title';
import { ItemType } from 'antd/lib/menu/hooks/useItems';
import Glossary from './pages/Glossary';

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

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header className='header' style={{ padding: 0 }}>
        <div className='logo'>IT-interviewer</div>
        <Menu
          theme='dark'
          mode='horizontal'
          defaultSelectedKeys={['1']}
          items={menuItems}
        />
      </Header>
      <Layout className='site-layout'>
        <Content style={{ margin: '0 16px' }}>
          <Glossary />
        </Content>
        <Footer style={{ textAlign: 'center' }}></Footer>
      </Layout>
    </Layout>
  );
}

export default App;

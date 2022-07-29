import React from 'react';
import './App.css';
import 'antd/dist/antd.min.css';
import { Layout, Menu } from 'antd';
import { Content, Footer, Header } from 'antd/lib/layout/layout';
import Sider from 'antd/lib/layout/Sider';
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
            <Glossary />
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

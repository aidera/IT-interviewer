import React from 'react';
import './App.css';
import 'antd/dist/antd.min.css';
import { Layout, Menu, MenuProps } from 'antd';
import { Content, Footer, Header } from 'antd/lib/layout/layout';
import { ItemType } from 'antd/lib/menu/hooks/useItems';
import { useLocation, useNavigate } from 'react-router-dom';
import AppRouter from './AppRouter';

const menuItems: ItemType[] = [
  {
    key: '/questions',
    label: 'All Questions',
  },
  {
    key: '/categories',
    label: 'Categories',
  },
  {
    key: '/quiz',
    label: 'Quiz',
  },
];

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();

  let selectedRoutes: string[] = [];

  menuItems.forEach((el) => {
    if (el && location.pathname.includes(el.key as string)) {
      selectedRoutes.push(el.key as string);
    }
  });

  const onMenuClickHandler: MenuProps['onClick'] = (event) => {
    selectedRoutes = [event.key];
    navigate(event.key);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header className='header' style={{ padding: 0 }}>
        <div className='logo'>IT-interviewer</div>
        <Menu
          theme='dark'
          mode='horizontal'
          selectedKeys={selectedRoutes}
          items={menuItems}
          onClick={onMenuClickHandler}
        />
      </Header>
      <Layout className='site-layout'>
        <Content style={{ margin: '0 16px', padding: '24px 0' }}>
          <AppRouter />
        </Content>
        <Footer style={{ textAlign: 'center' }}></Footer>
      </Layout>
    </Layout>
  );
};

export default App;

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Layout, Menu, MenuProps } from 'antd';
import { Content, Header } from 'antd/lib/layout/layout';
import { ItemType } from 'antd/lib/menu/hooks/useItems';
import classes from './MainLayout.module.scss';

type PropsType = {
  children?: React.ReactNode;
};

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

const MainLayout = (props: PropsType) => {
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
    <Layout className={classes.layout}>
      <Header className={classes.header}>
        <div className={classes.logo}>IT-interviewer</div>
        <Menu
          className={classes.menu}
          theme='light'
          mode='horizontal'
          selectedKeys={selectedRoutes}
          items={menuItems}
          onClick={onMenuClickHandler}
        />
      </Header>

      <Layout className={classes.contentLayout}>
        <Content style={{ margin: '0 16px', padding: '24px 0' }}>
          {props.children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;

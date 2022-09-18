import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMediaQuery } from '@react-hook/media-query';
import { Button, Drawer, Layout, Menu, MenuProps } from 'antd';
import { Content, Header } from 'antd/lib/layout/layout';
import { ItemType } from 'antd/lib/menu/hooks/useItems';
import { MenuOutlined } from '@ant-design/icons';

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
  {
    key: '/analytics',
    label: 'Analytics',
  },
];

const MainLayout = (props: PropsType) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDrawerVisible, setIsDrawerVisible] = useState<boolean>(false);
  const isHeaderSmallScreen = useMediaQuery('(max-width: 750px)');

  let selectedRoutes: string[] = [];

  menuItems.forEach((el) => {
    if (el && location.pathname.includes(el.key as string)) {
      selectedRoutes.push(el.key as string);
    }
  });

  const onMenuClickHandler: MenuProps['onClick'] = (event) => {
    selectedRoutes = [event.key];
    navigate(event.key);
    setIsDrawerVisible(false);
  };

  return (
    <Layout className={classes.layout}>
      <Header className={classes.header}>
        <div className={classes.logo}>IT-interviewer</div>
        {!isHeaderSmallScreen && (
          <Menu
            className={classes.menu}
            theme='light'
            mode='horizontal'
            selectedKeys={selectedRoutes}
            items={menuItems}
            onClick={onMenuClickHandler}
          />
        )}

        {isHeaderSmallScreen && (
          <Button
            type='text'
            icon={<MenuOutlined />}
            onClick={() => {
              setIsDrawerVisible(true);
            }}
          ></Button>
        )}

        <Drawer
          className={classes.drawer}
          title='IT-interviewer'
          placement='left'
          closable={true}
          onClose={() => {
            setIsDrawerVisible(false);
          }}
          visible={isDrawerVisible}
        >
          <Menu
            className={classes.menu}
            theme='light'
            mode='vertical'
            selectedKeys={selectedRoutes}
            items={menuItems}
            onClick={onMenuClickHandler}
          />
        </Drawer>
      </Header>

      <Layout className={classes.contentLayout}>
        <Content className={classes.content}>{props.children}</Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;

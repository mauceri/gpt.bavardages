//import Head from 'next/head'
import Terminal from 'components/terminal';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  SwitcherOutlined,
  VideoCameraOutlined,
  FolderOutlined,
} from '@ant-design/icons';
import { Layout, Menu, theme, ConfigProvider, MenuProps, Alert } from 'antd';
import React, { useEffect, useState } from 'react';
import {
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
  RedirectToSignIn,
} from "@clerk/clerk-react";
import MenuClerk from '@/components/menu-clerk';
import Contextes from '@/components/contextes';
import AntdList from '@/components/testAntdList';

type MenuItem = Required<MenuProps>['items'][number];

const { Header, Sider, Content } = Layout;
const { useToken } = theme;

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const items: MenuItem[] =
  [
    getItem('Bascule du thème', '1', <SwitcherOutlined />),
    getItem('Chargement...', '3', <UploadOutlined />),
  ];



export default function Home() {
  const [collapsed, setCollapsed] = useState(false);
  const { isLoaded, isSignedIn, user } = useUser();
  var { token } = useToken();
  const { defaultAlgorithm, darkAlgorithm } = theme;
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [colorBgColor, setColorBgColor] = useState(token.colorBgContainer);


  function handleClick() {
    setIsDarkMode((previousValue) => !previousValue);

    setColorBgColor((previousValue) => previousValue === token.colorBgContainer
      ? token.colorBgContainer
      : token.colorBgContainer);
  }

  const onClick: MenuProps['onClick'] = (e) => {

    switch (e.key) {
      case "1": {
        handleClick()
        return;
      }
      default: {
        alert(e.keyPath);
      }

    }
  };


  return (
    <ConfigProvider
      theme={{
        algorithm: (isDarkMode ? darkAlgorithm : defaultAlgorithm),
      }}>

      <Layout className="site-layout"  >
        <Sider trigger={null} collapsible collapsed={collapsed} theme="light"
          style={{
            borderRightColor: token.colorPrimary,
            borderRightWidth: 'thin',
            borderRightStyle: 'solid'
          }}>
          <MenuClerk />
          <Menu
            //theme= {isDarkMode ? "dark" : "light"}
            onClick={onClick}
            mode="inline"
            defaultSelectedKeys={['2']}
            items={items}
          />
          <Contextes />
        </Sider>
        <Layout>
          <Header
            className='header'
            style={{
              padding: 0,
              backgroundColor: (isDarkMode ? "#111a2c" : "#ffffff"),
              color: (isDarkMode ? "#ffffff" :"#000000" ),
              //backgroundColor: 'black',
              borderBottomColor: token.colorPrimary,
              borderBottomWidth: 'thin',
              borderBottomStyle: 'solid'
            }} >
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger',
              onClick: () => setCollapsed(!collapsed),
            })}
          </Header>
          
          <Content >
            <Terminal
              style={{
                backgroundColor: (isDarkMode ?  "#111a2c" :"#ffffff" ),
                color: (isDarkMode ? "rgba(255, 255, 255, 0.85)" :"#000000" )
              }} />
          </Content>
        </Layout>

      </Layout>
    </ConfigProvider>
  )
}
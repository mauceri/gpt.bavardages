//import Head from 'next/head'
import Terminal from 'components/terminal';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  FolderOutlined,
} from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
import React, { useState } from 'react';
import {
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
  RedirectToSignIn,
} from "@clerk/clerk-react";
import MenuClerk from '@/components/menu-clerk';
import Contextes from '@/components/contextes';

const { Header, Sider, Content } = Layout;
const { useToken } = theme;

export default function Home() {
  const [collapsed, setCollapsed] = useState(false);
  const { isLoaded, isSignedIn, user } = useUser();
  const {
    token
  } = useToken();

  return (
    <Layout className="site-layout">
      <Sider className="sider" trigger={null} collapsible collapsed={collapsed} >
      <MenuClerk />
        <Menu
          className='menu'
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['2']}
          items={[
            {
              key: '1',
              icon: <UserOutlined />,
              label: 'nav 1',
            },
            {
              key: '2',
              icon: <VideoCameraOutlined />,
              label: 'nav 2',
            },
            {
              key: '3',
              icon: <UploadOutlined />,
              label: 'nav 3',
            },
          ]}

        />
        <Contextes />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: token.colorPrimary }} >
          {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: 'trigger',
            onClick: () => setCollapsed(!collapsed),
          })}
        </Header>
        <Content>
          <Terminal />
        </Content>
      </Layout>

    </Layout>
  )
}
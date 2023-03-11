//import Head from 'next/head'
import Terminal from 'components/terminal';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  SwitcherOutlined,
} from '@ant-design/icons';
import { Layout, Menu, theme, ConfigProvider, MenuProps, Alert, message, Upload, UploadProps, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import {
  useUser,
} from "@clerk/clerk-react";
import MenuClerk from '@/components/menu-clerk';
import { ListeBavardagesProps } from '@/components/liste-bavardages';
import ListeBavardages from '@/components/liste-bavardages';
import { EditBavardageData } from '@/components/edit-bavardage';

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



export default function Home() {
  const [collapsed, setCollapsed] = useState(false);
  const { isLoaded, isSignedIn, user } = useUser();
  var { token } = useToken();
  const { defaultAlgorithm, darkAlgorithm } = theme;
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [colorBgColor, setColorBgColor] = useState(token.colorBgContainer);
  const [bavardage, setBavardage] =
    useState<EditBavardageData>({ name: "inconnu", date: Date(), prompt: "", model: "", history: true });
  const [fileContent, setFileContent] = useState("");
  useEffect(() => {
    message.info(fileContent);
  }, [fileContent]);
  function handleClickBasculeTheme() {
    setIsDarkMode((previousValue) => !previousValue);

    setColorBgColor((previousValue) => previousValue === token.colorBgContainer
      ? token.colorBgContainer
      : token.colorBgContainer);
  }

  const onClickMenu: MenuProps['onClick'] = (e) => {

    switch (e.key) {
      case "1": {
        handleClickBasculeTheme()
        return;
      }
      default: {
        console.log(e.keyPath);
      }

    }
  };
  const handleUpload = (file: File) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      message.info("Aqui");
      const result = event.target?.result;
      if (typeof result === "string") {
        setFileContent(result);
      }
    };
    reader.readAsText(file);
  };
  const propsUpload: UploadProps = {
    listType: 'text',
    action: "/api/upload",
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        //console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },

    beforeUpload(file) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.addEventListener(
          "load",
          () => {
            const content = reader.result;
            setFileContent(content as string);
          },
          false
        );
      });
    }
  }
  const items: MenuItem[] =
    [
      getItem('Bascule du thème', '1', <SwitcherOutlined />),
      getItem('Chargement...', '3',
        <div>
          <Upload {...propsUpload}>
            <a href="#"><UploadOutlined /></a>
          </Upload>
        </div>),
    ];



  return (
    <ConfigProvider
      theme={{
        algorithm: (isDarkMode ? darkAlgorithm : defaultAlgorithm),
      }}>
      <div id="root"></div>
      <Layout className="site-layout"  >
        <Sider trigger={null} collapsible collapsed={collapsed} theme="light"
          style={{
            borderRightColor: token.colorPrimary,
            borderRightWidth: 'thin',
            borderRightStyle: 'solid',
          }}>
          <Space>
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger',
              onClick: () => setCollapsed(!collapsed),
            })}
            <MenuClerk />
          </Space>
          <Menu
            style={{
              borderTopColor: token.colorPrimary,
              borderTopWidth: 'thin',
              borderTopStyle: 'solid',
              borderBottomColor: token.colorPrimary,
              borderBottomWidth: 'thin',
              borderBottomStyle: 'solid',

            }}
            //theme= {isDarkMode ? "dark" : "light"}
            onClick={onClickMenu}
            mode="inline"
            defaultSelectedKeys={['2']}
            items={items}
          />

          <ListeBavardages
            notificationListeBavardages=
            {(bavardage: EditBavardageData, i: number) => {
              setBavardage(bavardage)
            }}
            style={{ color: "blue" }} />
        </Sider>
        <Layout>


          <Content >
            <Terminal
              style={{
                //backgroundColor: useToken().token.colorBgContainer,
                //color: useToken().token.colorPrimaryActive,
                backgroundColor: (isDarkMode ? "#111a2c" : "#ffffff"),
                color: (isDarkMode ? "rgba(255, 255, 255, 0.85)" : "#000000")
              }}
              bavardage={bavardage} />
          </Content>
        </Layout>

      </Layout>
    </ConfigProvider>
  )
}

/*
<Header
            className='header'
            style={{
              padding: 0,
              //backgroundColor: useToken().token.colorBgContainer,
              backgroundColor: (isDarkMode ? "#111a2c" : "#ffffff"),
              color: (isDarkMode ? "#ffffff" : "#000000"),
              //color: useToken().token.colorPrimaryActive,
              //backgroundColor: 'black',
              borderBottomColor: token.colorPrimary,
              borderBottomWidth: 'thin',
              borderBottomStyle: 'solid'
            }} >
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger',
              onClick: () => setCollapsed(!collapsed),
            })}
          </Header>*/
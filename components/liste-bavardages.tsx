import React, { useEffect, useState } from 'react';
import { Avatar, Button, Divider, List, Modal, Skeleton, Space } from 'antd';
import {
  EditOutlined,
  MenuOutlined,
  DeleteFilled,
  MessageOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { useUser } from '@clerk/clerk-react';
import {NouveauBavardageData,NouveauBavardageProps } from './nouveau-bavardage';
import NouveauBavardage from './nouveau-bavardage';
``

interface BavardageType {
  _id: string;
  id: string;
  name: string;
  date?: string;
  loading: boolean;
}
const count = 3;
const fakeDataUrl = `https://randomuser.me/api/?results=${count}&inc=name,gender,email,nat,picture&noinfo`;
interface AntdListProps {
  style?: React.CSSProperties;
}
const AntdList: React.FC<AntdListProps> = ((props) => {
  const style: React.CSSProperties = props.style as React.CSSProperties;
  const [initLoading, setInitLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<BavardageType[]>([]);
  const { isLoaded, isSignedIn, user } = useUser();
  const [contextes, setContextes] = useState<BavardageType[]>([]);

  useEffect(() => {
    if (user) {
      fetch("/api/queryMDB?op=list_bavardages&user=" + user?.id)
        .then((res) => res.json())
        .then((res) => {
          setInitLoading(false);
          setContextes(res);
        });
    }
  }, [user]);

  function createBavardage(name: string, date: string) {
    if (user) {
      fetch("/api/queryMDB?op=create_bavardage&user=" + user?.id + "&name=" + name + "&date=" + date)
        .then((res) => res.json())
        .then((res) => {
          setInitLoading(false);
          setContextes(res);
        });
    }
  }
  ``
  const [open, setOpen] = useState(false);

  const showModal = () => {
    setOpen(true);
  };
  const onFinish = (values: any) => {
    console.log("onFinish ",values); // Affiche les valeurs saisies dans le formulaire
    setOpen(false);
  };
  const onCreate = (values: NouveauBavardageData) => {
    console.log('Received values of form: ', values);
    setOpen(false);
  };

  return (
    <div
      id="scrollableDiv"
      style={{
        height: '70vh',
        overflow: 'scroll',
        paddingTop: '10px'
      }}>

      <Button style={{ paddingBottom: '10px', width: '90%', overflow: 'hidden', }}
        onClick={() => {
          console.log("Aqui");
          setOpen(true);
        }}>
        <span ><PlusOutlined /> Nouveau bavardage</span>
      </Button>

      <NouveauBavardage
        open={open}
        onCreate={onCreate}
        onCancel={() => {
          setOpen(false);
        }}
      />

      <List
        className="liste-bavardages"
        //header={<><div style={{ fontSize: "16px", color: "blue", width: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}><MenuOutlined /> Bavardages</div></>}

        split={true}
        loading={initLoading}
        itemLayout="horizontal"
        dataSource={contextes}
        renderItem={(item: BavardageType) => (
          <List.Item
            actions={[
              <Button key={1} style={{ border: 'none', padding: '0px', margin: '0px', fontSize: '10px' }}>
                <EditOutlined />
              </Button>,
              <Button key={2} style={{ border: 'none', padding: '0px', margin: '0px', color: 'red', fontSize: '10px' }}>
                <DeleteFilled />
              </Button>,
            ]}>
            <Skeleton title={false} loading={item.loading} active>
              <List.Item.Meta
                //avatar={<Button key="edit" icon={<MessageOutlined style={{ fontSize: '10px' }} />} />}
                description={
                  <Button
                    style={{
                      width: '150%',
                      whiteSpace: 'nowrap',
                      border: 'none',
                      padding: '0px',
                      margin: '0px',
                      textOverflow: 'ellipsis',
                    }} onClick={() => alert("Coucou")}>
                    <MessageOutlined />  {item.name} {item.date} darladidadada
                  </Button>
                }
              />
            </Skeleton>
          </List.Item>
        )}
      />
    </div>
  );
});

export default AntdList;
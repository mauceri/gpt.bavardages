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
import { NouveauBavardageData, NouveauBavardageProps } from './nouveau-bavardage';
import NouveauBavardage from './nouveau-bavardage';


const count = 3;
const fakeDataUrl = `https://randomuser.me/api/?results=${count}&inc=name,gender,email,nat,picture&noinfo`;
interface AntdListProps {
  style?: React.CSSProperties;
}
const AntdList: React.FC<AntdListProps> = ((props) => {
  const style: React.CSSProperties = props.style as React.CSSProperties;
  const [initLoading, setInitLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  const { isLoaded, isSignedIn, user } = useUser();
  const [bavardages, setBavardages] = useState<NouveauBavardageData[]>([]);
  const [bavardage, setBavardage] = useState<NouveauBavardageData>({ name: "", date: "" });
  const [openBavardage, setOpenBavardage] = useState(false);
  const [touch, setTouch] = useState(0);


  useEffect(() => {
    loadBavardages();
  }, [user]);

  function loadBavardages() {
    if (user) {
      console.log("avant liste b");
      fetch("/api/queryMDB?op=list_bavardages&user=" + user?.id)
        .then((res) => res.json())
        .then((res) => {
          console.log("liste b", res);
          setInitLoading(false);
          setBavardages(res);
        });
    }
  }

  function updateBavardage(values: NouveauBavardageData) {

    console.log('Received values of form: ', values);
    try {
      removeBavardage(values.name as string, values.date);
      createBavardage(values.name as string, values.date,values.param);
    } catch (e) { console.log(e.message) }
    setInitLoading(false);
    setOpenBavardage(false);
    loadBavardages();
  }

  function createBavardage(name: string, date: string, param?: string) {
    if (user) {
      console.log("add ", bavardage)
      fetch("/api/queryMDB?op=push_bavardage&user=" + user?.id
        + "&name=" + name
        + "&date=" + date
        + "&param" + param
        )
        .then((res) => res.json())
        .then((res) => {
          console.log(res);
        })
        .catch((e) => { throw e });
    }
  }

  function removeBavardage(name: string, date: string) {
    if (user) {
      console.log("remove ", { name, date })
      fetch("/api/queryMDB?op=pull_bavardage&user=" + user?.id + "&name=" + name + "&date=" + date)
        .then((res) => res.json())
        .then((res) => {
          console.log(res);
        })
        .catch((e) => { throw e });
    }
  }

  

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
          setOpenBavardage(true);
        }}>
        <span ><PlusOutlined /> Nouveau bavardage</span>
      </Button>

      <NouveauBavardage
        open={openBavardage}
        onCreate={
          updateBavardage
        }
        onCancel={() => {
          setOpenBavardage(false);
        }}
        item={bavardage}
      />

      <List
        className="liste-bavardages"
        //header={<><div style={{ fontSize: "16px", color: "blue", width: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}><MenuOutlined /> Bavardages</div></>}

        split={true}
        loading={initLoading}
        itemLayout="horizontal"
        dataSource={bavardages}
        renderItem={(item: NouveauBavardageData, index: number) => (
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
                    }} onClick={() => {
                      try {
                        console.log("Bavardage ", bavardage);
                        setBavardage({ name: item.name, date: item.date });
                        console.log("avan modal ", bavardage);
                        setOpenBavardage(true);
                      } catch (e) { console.log(e) }
                    }}>
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
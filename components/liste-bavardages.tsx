import React, { useEffect, useState } from 'react';
import { Avatar, Button, Divider, List, Skeleton, Space } from 'antd';
import {
  EditOutlined,
  MenuOutlined,
  DeleteFilled,
  MessageOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { useUser } from '@clerk/clerk-react';

interface BavardageType {
  _id: string;
  id:string;
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
  const [list, setList] = useState<BavardageType[]>([]);
  const { isLoaded, isSignedIn, user } = useUser();
  const [contextes, setContextes] = useState<BavardageType[]>([]);

  useEffect(() => {
    if (user) {
      fetch("/api/queryMDB?op=list_contexts&user=" + user?.id)
        .then((res) => res.json())
        .then((res) => {
          setInitLoading(false);
          setData(res);
          setContextes(res);
        });
    }
  }, [user]);



  return (
    <div
      id="scrollableDiv"
      style={{
        height: '70vh',
        //width: '30vh',
        overflow: 'scroll',
      }}>
      
        <Button style={{
          paddingBottom: '10px',
          width: '90%',
          overflow: 'hidden',
        }}
          onClick={() => alert("Coucou")}
        >
          <span ><PlusOutlined /> Nouveau bavardage</span>
        </Button>

        <List
          className="liste-bavardages"
          //header={<><div style={{ fontSize: "16px", color: "blue", width: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}><MenuOutlined /> Bavardages</div></>}

          split={true}
          loading={initLoading}
          itemLayout="horizontal"
          //loadMore={loadMore}
          dataSource={contextes}
          renderItem={(item: BavardageType) => (
            <List.Item
              actions={[
                <Button key={item._id} style={{ border: 'none', padding: '0px', margin: '0px' }}>
                  <EditOutlined />
                </Button>
              ]}>
              <Skeleton title={false} loading={item.loading} active>
                <List.Item.Meta
                  //avatar={<Button key="edit" icon={<MessageOutlined style={{ fontSize: '10px' }} />} />}
                  description={
                      <Button 
                      style={{ 
                        width: '145%',
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
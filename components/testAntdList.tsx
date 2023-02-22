import React, { useEffect, useState } from 'react';
import { Avatar, Button, Divider, List, Skeleton, Space } from 'antd';
import {
  EditOutlined,
  MenuOutlined,
  DeleteFilled,
  MessageOutlined,
  PlusSquareOutlined,
} from '@ant-design/icons';
import { useUser } from '@clerk/clerk-react';

interface DataType {
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
  const [data, setData] = useState<DataType[]>([]);
  const [list, setList] = useState<DataType[]>([]);
  const { isLoaded, isSignedIn, user } = useUser();
  const [contextes, setContextes] = useState<DataType[]>([]);

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
        overflow: 'scroll',
      }}>
      <div style={{ fontSize: "16px", color: "blue", width: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>

        <Button key="new" icon={<PlusSquareOutlined style={{ fontSize: '10px' }} />} />
        <span>  Nouveau bavardage </span>

      </div>
      <List
        className="demo-loadmore-list"
        //header={<><div style={{ fontSize: "16px", color: "blue", width: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}><MenuOutlined /> Contextes</div></>}

        split={true}
        loading={initLoading}
        itemLayout="vertical"
        //loadMore={loadMore}
        dataSource={contextes}
        renderItem={(item: DataType) => (
          <List.Item
            actions={[
              <Space key={1}>
                <Button key="edit" icon={<EditOutlined style={{ fontSize: '10px' }} />} />
                <Button key="delete" danger icon={<DeleteFilled style={{ fontSize: '10px' }} />} />
              </Space>,
            ]}>
            <Skeleton avatar title={false} loading={item.loading} active>
              <List.Item.Meta
                avatar={<Button key="edit" icon={<MessageOutlined style={{ fontSize: '10px' }} />} />}
                title={
                  <div style={{ width: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.name} {item.date}
                  </div>
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
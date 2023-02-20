import React, { useEffect, useState } from 'react';
import { Avatar, Button, List, Skeleton, Space } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  DeleteFilled,
  MessageOutlined,
} from '@ant-design/icons';

interface DataType {
  gender?: string;
  name: {
    title?: string;
    first?: string;
    last?: string;
  };
  email?: string;
  picture: {
    large?: string;
    medium?: string;
    thumbnail?: string;
  };
  nat?: string;
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

  useEffect(() => {
    fetch(fakeDataUrl)
      .then((res) => res.json())
      .then((res) => {
        setInitLoading(false);
        setData(res.results);
        setList(res.results);
      });
  }, []);

  const onLoadMore = () => {
    setLoading(true);
    setList(
      data.concat([...new Array(count)].map(() => ({ loading: true, name: {}, picture: {} }))),
    );
    fetch(fakeDataUrl)
      .then((res) => res.json())
      .then((res) => {
        const newData = data.concat(res.results);
        setData(newData);
        setList(newData);
        setLoading(false);
        // Resetting window's offsetTop so as to display react-virtualized demo underfloor.
        // In real scene, you can using public method of react-virtualized:
        // https://stackoverflow.com/questions/46700726/how-to-use-public-method-updateposition-of-react-virtualized
        window.dispatchEvent(new Event('resize'));
      });
  };

  const loadMore =
    !initLoading && !loading ? (
      <div
        style={{
          textAlign: 'center',
          marginTop: 12,
          height: 32,
          lineHeight: '32px',
        }}
      >
        <Button onClick={onLoadMore}>loading more</Button>
      </div>
    ) : null;

  return (
    <div
      id="scrollableDiv"
      style={{
        height: '70vh',
        overflow: 'scroll',
      }}
    >
      <List
        className="demo-loadmore-list"
        header={<div style={style}>Contextes</div>}

        split={true}
        loading={initLoading}
        itemLayout="vertical"
        loadMore={loadMore}
        dataSource={list}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Space>
                <Button key="edit" icon={<EditOutlined style={{ fontSize: '10px' }} />} />
                <Button key="delete" danger icon={<DeleteFilled style={{ fontSize: '10px' }} />} />
              </Space>,
            ]}>
            <Skeleton avatar title={false} loading={item.loading} active>
              <List.Item.Meta
                avatar={<Button key="edit" icon={<MessageOutlined style={{ fontSize: '10px' }} />} />}
                title={
                  <div style={{ width: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.name.last}
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
import React, { useEffect, useState } from 'react';
import { Avatar, Button, Divider, Dropdown, DropdownProps, List, Menu, MenuProps, message, Modal, Popconfirm, Skeleton, Space } from 'antd';
import {
  EditOutlined,
  SyncOutlined,
  DeleteFilled,
  DownOutlined,
  ExclamationCircleOutlined,
  MessageOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { useUser } from '@clerk/clerk-react';
import { EditBavardageData} from './edit-bavardage';
import EditBavardage from './edit-bavardage';

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
  const [bavardages, setBavardages] = useState<EditBavardageData[]>([]);
  const [touch, setTouch] = useState(0);
  const [modal, contextHolder] = Modal.useModal();


  useEffect(() => {
    loadBavardages();
  }, [user]);

  function loadBavardages() {
    if (user) {
      fetch("/api/queryMDB?op=list_bavardages&user=" + user?.id)
        .then((res) => res.json())
        .then((res) => {
          setInitLoading(false);
          setBavardages((res as Array<any>).reverse());
        }).catch((err: any) => {
          console.log(err.message)
        });
    }
  }

  function updateBavardage(newBavardage: EditBavardageData, oldBavardage:EditBavardageData) {

    try {
      console.log("Update bavardages with", newBavardage);
      updateBavardageFetch(
        newBavardage.name as string,
        oldBavardage.name as string,
        newBavardage.date,
        oldBavardage.date,
        newBavardage.param)
    } catch (e: any) { console.log(e.message) }
    loadBavardages();
  }

  function updateBavardageFetch(
    name: string,
    oldname: string,
    date: string,
    olddate: string,
    param?: string) {
    if (user) {
      fetch("/api/queryMDB?op=update_bavardage&user="
        + user?.id
        + "&name=" + name
        + "&oldname=" + oldname
        + "&date=" + date
        + "&olddate=" + olddate
        + "&param=" + param
      )
        .then((res) => res.json())
        .then((res) => {
          console.log("Update : ", res);
        })
        .catch((e) => { throw e });

    }
  }
  function createBavardageFetch(name: string, date: string, param?: string) {
    if (user) {
      fetch("/api/queryMDB?op=create_bavardage&user=" + user?.id
        + "&name=" + name
        + "&date=" + date
        + "&param" + param
      )
        .then((res) => res.json())
        .then((res) => {
          console.log("Create ", res);
        })
        .catch((e) => { throw e });
    }
  }

  function removeBavardageFetch(name: string, date: string) {
    if (user) {
      console.log("remove ", { name, date })
      fetch("/api/queryMDB?op=remove_bavardage&user=" + user?.id + "&name=" + name + "&date=" + date)
        .then((res) => res.json())
        .then((res) => {
          console.log("Remove : ", res);
        })
        .catch((e) => { throw e });
    }
  }



  
  const DeleteBavardageModal: React.FC<{ item: EditBavardageData }> = ({ item }) => {
    const [open, setOpen] = useState(false);

    function deleteBavardage() {
      removeBavardageFetch(item.name as string, item.date);
      loadBavardages();
      setOpen(false);
    }
    const showModal = () => {
      setOpen(true);
    };

    const hideModal = () => {
      setOpen(false);
    };

    return (
      <>
        <Button danger type="text" onClick={showModal} size="small">
          <DeleteFilled />
        </Button>
        <Modal
          title="Attention vous êtes sur le point de détruire ce bavardage !"
          open={open}
          onOk={deleteBavardage}
          onCancel={hideModal}
          okText="Oui"
          cancelText="Non"
        >
          <p>Voulez-vous vraiment le détruire ?</p>
        </Modal>
      </>
    );
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
          createBavardageFetch("Nouveau bavardage", Date(), "");
          loadBavardages();
        }}>
        <span ><PlusOutlined /> Nouveau bavardage</span>
      </Button>

      <Button style={{ paddingBottom: '10px', width: '90%', overflow: 'hidden', borderWidth: '0' }}
        onClick={() => {
          loadBavardages();
        }}>
        <span ><SyncOutlined /></span>
      </Button>


      <List
        className="liste-bavardages"
        //header={<><div style={{ fontSize: "16px", color: "blue", width: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}><MenuOutlined /> Bavardages</div></>}

        split={true}
        loading={initLoading}
        itemLayout="horizontal"
        dataSource={bavardages}
        renderItem={(item: EditBavardageData, index: number) => (
          <List.Item
            actions={[
              <EditBavardage updateBavardage={updateBavardage} oldBavardage={item} />,
              <DeleteBavardageModal item={item} />,
            ]}
          >
            <Skeleton title={false} loading={item.loading} active>
              <List.Item.Meta
                //avatar={<Button key="edit" icon={<MessageOutlined style={{ fontSize: '10px' }} />} />}
                description={

                  <Button
                    style={{
                      width: '140%',
                      whiteSpace: 'nowrap',
                      border: 'none',
                      padding: '0px',
                      margin: '0px',
                      textOverflow: 'ellipsis',
                    }}
                    onClick={() => {
                      message.info("En cours")
                    }}>
                    <MessageOutlined />  {item.name}
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


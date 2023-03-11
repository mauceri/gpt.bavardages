import React, { useEffect, useRef, useState } from 'react';
import { Button, List, message, Modal, Skeleton, Tooltip } from 'antd';
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
import { EditBavardageData } from './edit-bavardage';
import EditBavardage from './edit-bavardage';

const count = 3;
const fakeDataUrl = `https://randomuser.me/api/?results=${count}&inc=name,gender,email,nat,picture&noinfo`;
export interface ListeBavardagesProps {
  notificationListeBavardages: ((EditBavardageData: EditBavardageData, index?: any) => void)
  style?: React.CSSProperties;
}
const ListeBavardages: React.FC<ListeBavardagesProps> = (({ notificationListeBavardages, style }) => {

  const [initLoading, setInitLoading] = useState(true);
  const { user } = useUser();
  const [bavardages, setBavardages] = useState<EditBavardageData[]>([]);
  const isMounted = useRef(false);

  useEffect(() => {
    loadBavardages();
    if (!isMounted.current) {
      message.info("Démarrage");
      isMounted.current = true;
    }
  }, [user]);

  useEffect(() => {
    if (bavardages.length > 0) {
      //console.log("Avant notification", bavardages[0])
      notificationListeBavardages(bavardages[0]);
    }
  }, [bavardages]);

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

  function updateBavardage(newBavardage: EditBavardageData, oldBavardage: EditBavardageData) {

    try {
      //console.log("Update bavardages with", newBavardage);
      updateBavardageFetch(
        newBavardage.name as string,
        oldBavardage.name as string,
        newBavardage.date,
        oldBavardage.date,
        newBavardage.model,
        newBavardage.history,
        newBavardage.prompt)
    } catch (e: any) { console.log(e.message) }
    loadBavardages();
  }

  function updateBavardageFetch(
    name: string,
    oldname: string,
    date: string,
    olddate: string,
    model: string,
    history: boolean,
    prompt?: string,
  ) {
    if (user) {
     /* console.log("Query update bavardages call with",
        "prompt=" + prompt,
        "model=" + model,
        "history=" + history
      );*/
      fetch("/api/queryMDB?op=update_bavardage&user="
        + user?.id
        + "&name=" + name
        + "&oldname=" + oldname
        + "&date=" + date
        + "&olddate=" + olddate
        + "&prompt=" + prompt
        + "&model=" + model
        + "&history=" + history
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

      fetch("/api/queryMDB?op=push_replique&user=" + user?.id +
        "&name=" + name +
        "&date=" + date +
        "&from=" + "IA" +
        "&replique=Bonjour, Je suis votre assistant virtuel ! Que puis-je faire pour vous ?")
        .then((res) => res.json())
        .then((res) => {
          //console.log(res);
        }).catch((err: any) => {
          throw err
        });
    }
  }

  function removeBavardageFetch(name: string, date: string) {
    if (user) {
      //console.log("remove ", { name, date })
      fetch("/api/queryMDB?op=remove_bavardage&user=" + user?.id + "&name=" + name + "&date=" + date)
        .then((res) => res.json())
        .then((res) => {
          //console.log("Remove : ", res);
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
        itemLayout="vertical"
        dataSource={bavardages}
        renderItem={(item: EditBavardageData, index: number) => (
          <List.Item
            actions={[
              <EditBavardage key="1" updateBavardage={updateBavardage} oldBavardage={item} />,
              <DeleteBavardageModal key="2" item={item} />,
            ]}
          >
            <Skeleton title={false} loading={item.loading} active>
              <List.Item.Meta
                //avatar={<Button key="edit" icon={<MessageOutlined style={{ fontSize: '10px' }} />} />}
                title={<span style={{fontSize:'14px'}}>{item.name}</span>}
                description={
                  <Tooltip title={`name: ${item.name} prompt: ${item.prompt}`}>
                    <Button
                      style={{
                        //alignSelf: 'left',
                        //alignContent: 'left',
                        width: '95%',
                        //whiteSpace: 'nowrap',
                        border: 'none',
                        padding: '0px',
                        margin: '0px',
                        overflow: 'ellipsis',
                      }}
                      onClick={() => {
                        //console.log("Notification liste bavardages", item);
                        notificationListeBavardages(item, index);
                      }}>
                      <span ><MessageOutlined /> {item.prompt}</span>
                    </Button>
                  </Tooltip>
                }
              />
            </Skeleton>
          </List.Item>
        )}
      />
    </div>
  );
});

export default ListeBavardages;


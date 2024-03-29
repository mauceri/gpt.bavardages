import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import {
    Form,
    Input,
    DatePicker,
    Modal,
    Button,
    Typography,
    Switch,
} from 'antd';
import dayjs from 'dayjs';
//import 'dayjs/locale/fr';
import locale from 'antd/lib/date-picker/locale/fr_FR';
import { EditOutlined } from '@ant-design/icons';
<DatePicker locale={locale} />;
const { TextArea } = Input;

export interface EditBavardageData {
    name: string | number | (string | number)[];
    date: string;
    model: string;
    history: boolean;
    prompt?: string;
    loading?: boolean;
    value?: any;
    touched?: boolean;
    validating?: boolean;
    errors?: string[];
}
export interface NouveauBavardageProps {
    updateBavardage: (values: EditBavardageData, bavardage: EditBavardageData) => void;
    oldBavardage: EditBavardageData;
}

const EditBavardage: React.FC<NouveauBavardageProps> = ({
    updateBavardage,
    oldBavardage,
}) => {
    const [form] = Form.useForm();
    const [open, setOpen] = useState(false);
    const titre = "Édition du bavardage : " + oldBavardage.name
    form.setFieldsValue(oldBavardage);

    const showModal = () => {
        setOpen(true);
    };

    const hideModal = () => {
        setOpen(false);
    };


    return (
        <>
            <Button danger type="text" onClick={showModal} size="small">
                <EditOutlined />
            </Button>

            <Modal
                open={open}
                title={titre}
                okText="OK"
                cancelText="Annulation"
                onCancel={hideModal}
                onOk={() => {
                    form.validateFields()
                        .then((newBavardage:EditBavardageData) => {
                            form.resetFields();
                            console.log("New bavardage",newBavardage);
                            updateBavardage(newBavardage, oldBavardage);
                            hideModal();

                        })
                        .catch((info) => {
                            console.log('Validate Failed:', info);
                        });
                }}
            >
                <Form
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 30 }}
                    layout="horizontal"
                    style={{ maxWidth: 600 }}
                    form={form}
                >
                    <Form.Item name="name" label="Nom">
                        <Input />
                    </Form.Item>
                    <Form.Item name="date" label="Date">
                        <Typography.Text className="ant-form-text" type="secondary">
                            {form.getFieldValue("date")}
                        </Typography.Text>
                    </Form.Item>
                    <Form.Item name="model" label="Modèle">
                        <Input />
                    </Form.Item>
                    <Form.Item name="prompt" label="Prompt">
                        <TextArea rows={4} />
                    </Form.Item>
                    <Form.Item name="history" label="History" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default EditBavardage;

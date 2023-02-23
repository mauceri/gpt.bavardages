import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import {
    Form,
    Input,
    DatePicker,
    Modal,
    Button,
} from 'antd';
import dayjs from 'dayjs';
//import 'dayjs/locale/fr';
import locale from 'antd/lib/date-picker/locale/fr_FR';
//import enUS from 'antd/lib/locale-provider/en_US';

<DatePicker locale={locale} />;
const { TextArea } = Input;

export interface NouveauBavardageData {
    name: string | number | (string | number)[];
    date: string;
    param?: string;
    loading?: boolean;
    value?: any;
    touched?: boolean;
    validating?: boolean;
    errors?: string[];
}
export interface NouveauBavardageProps {
    open: boolean;
    onCreate: (values: NouveauBavardageData) => void;
    onCancel: () => void;
    item: NouveauBavardageData;
}
const dateFormat = 'DD/MM/YYYY';

const NouveauBavardage: React.FC<NouveauBavardageProps> = ({
    open,
    onCreate,
    onCancel,
    item,
}) => {
    const [form] = Form.useForm();
    console.log("avant set values", item);
    //alert(item.date);
    //item.date = dayjs(item.date,dateFormat)
    form.setFieldsValue(item);
    console.log("après set values", form.getFieldValue("name"));

    return (
        <Modal
            open={open}
            title="Paramètres pour un nouveau bavardage"
            okText="Create"
            cancelText="Cancel"
            onCancel={onCancel}
            onOk={() => {
                form.validateFields()
                    .then((values) => {
                        form.resetFields();
                        onCreate(values);
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
                    <Input />
                </Form.Item>
                <Form.Item name="param" label="Paramètres">
                    <TextArea rows={4} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default NouveauBavardage;

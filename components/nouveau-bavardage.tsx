import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import {
    Form,
    Input,
    DatePicker,
    Modal,
    Button,
} from 'antd';

const { TextArea } = Input;

export interface NouveauBavardageData {
    name: string | number | (string | number)[];
    value?: any;
    touched?: boolean;
    validating?: boolean;
    errors?: string[];
}

export interface NouveauBavardageProps {
    open: boolean;
    onCreate: (values: NouveauBavardageData) => void;
    onCancel: () => void;
}
const NouveauBavardage: React.FC<NouveauBavardageProps> = ({
    open,
    onCreate,
    onCancel,
}) => {
    const [form] = Form.useForm();
    
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
                    <DatePicker />
                </Form.Item>
                <Form.Item name="param" label="Paramètres">
                    <TextArea rows={4} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default NouveauBavardage;

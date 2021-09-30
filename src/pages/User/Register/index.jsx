import React, { Component } from 'react';
import {
    Form,
    Input,
    Button,
    message,
} from 'antd'
import { PhoneOutlined, LockOutlined } from '@ant-design/icons'
import './register.css'
import { userRegister } from '../../../api/user/user';

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
    },
};
const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 16,
            offset: 8,
        },
    },
};

export default class Register extends Component {

    onFinish = async (values) => {
        const { phone, password } = values
        const result = await userRegister(phone, password)
        if (result.code === 1) {
            message.success('注册成功')
            this.props.history.push({ pathname: "/user/login" })
        } else {
            message.error(result.msg)
        }

    }

    render() {
        return (
            <div>
                <div className="user-register">
                    <h1 className="user-register-title">用户注册</h1>
                    <br />
                    <Form
                        {...formItemLayout}
                        name="register"
                        onFinish={this.onFinish}
                        scrollToFirstError
                    >
                        <Form.Item
                            name="phone"
                            rules={[{ required: true, message: '请输入手机号码！' }]}
                            style={{ width: '400px' }}
                        >
                            <Input
                                maxLength={11}
                                prefix={<PhoneOutlined className="site-form-item-icon" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="手机号" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入密码！',
                                },
                            ]}
                            hasFeedback
                            style={{ width: '400px' }}
                        >
                            <Input.Password prefix={<LockOutlined className="site-form-item-icon" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="密码" />
                        </Form.Item>

                        <Form.Item
                            name="confirm"
                            dependencies={['password']}
                            hasFeedback
                            style={{ width: '400px' }}
                            rules={[
                                {
                                    required: true,
                                    message: '请输入确认密码！',
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('两次密码不一致！'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password prefix={<LockOutlined className="site-form-item-icon" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="确认密码" />
                        </Form.Item>
                        <Form.Item {...tailFormItemLayout} style={{ marginRight: '1000px', marginTop: '10px' }}>
                            <Button type="primary" size='large' shape='round' htmlType="submit" style={{ width: '100px' }}>
                                注册
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        )
    }
}

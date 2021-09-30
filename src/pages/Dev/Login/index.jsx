import React, { Component } from 'react'
import { Form, Input, Button, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { adminLogin } from '../../../api/dev/admin'
// import MemoryUser from '../../../utils/MemoryUser'
import storageUtils from '../../../utils/storageUtils'
import './login.css'

export default class Login extends Component {


    onFinish = async (values) => {
        const { phone, password } = values
        const result = await adminLogin(phone, password)
        if (result.code === 1) {
            message.success("登录成功！")
            // MemoryUser.token=result.token
            // MemoryUser.user=result.admin
            storageUtils.saveAdminToken(result.data.token)
            storageUtils.saveAdmin(result.data.admin)
            this.props.history.push({ pathname: "/dev/home" })
        } else {
            message.error(result.msg)
        }

    }

    render() {
        return (
            <div>

                <div className="login" style={{ marginRight: '700px' }}>
                    <h1 className="login-title">订票系统运维平台</h1>
                    <br />
                    <Form
                        name="normal_login"
                        className="login-form"
                        onFinish={this.onFinish}
                    >
                        <Form.Item
                            name="phone"
                            rules={[{ required: true, message: '请输入用户名！' }]}
                        >
                            <Input maxLength={11} prefix={<UserOutlined className="site-form-item-icon" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="手机号" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: '请输入密码！' }]}
                        >
                            <Input
                                prefix={<LockOutlined className="site-form-item-icon" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type="password"
                                placeholder="密码"
                            />
                        </Form.Item>

                        <Form.Item>

                            <Button type="primary" htmlType="submit" className="login-form-button" style={{ marginLeft: '240px' }}>
                                登录
                            </Button>

                        </Form.Item>
                    </Form>
                </div>
            </div>
        )
    }
}


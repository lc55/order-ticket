import React, { Component } from 'react'
import { Form, Input, Button, message } from 'antd'
import { PhoneOutlined, LockOutlined } from '@ant-design/icons'
import LinkButton from '../../../components/LinkButton'
import './login.css'
import { userLogin } from '../../../api/user/user'
import storageUtils from '../../../utils/storageUtils'

export default class Login extends Component {

    register = () => {
        this.props.history.push({ pathname: "/user/register" })
    }
    onFinish = async (values) => {
        const { phone, password } = values
        const result = await userLogin(phone, password)
        if (result.code === 1) {
            message.success("登录成功！")
            storageUtils.saveUserToken(result.data.token)
            storageUtils.saveUser(result.data.user)
            this.props.history.push({ pathname: "/user/ticketList", state: this.props.location.state })
        } else {
            message.error(result.msg)
        }
    }

    render() {
        return (
            <div className="login" style={{ marginRight: '700px' }}>
                <h1 className="user-login-title">用户登录</h1>
                <br />
                <Form
                    name="normal_login"
                    className="login-form"
                    onFinish={this.onFinish}
                >
                    <Form.Item
                        name="phone"
                        rules={[{ required: true, message: '请输入手机号码！' }]}
                    >
                        <Input maxLength={11} prefix={<PhoneOutlined className="site-form-item-icon" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="手机号" />
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
                        <LinkButton onClick={this.register} >注册用户</LinkButton>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            登录
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        )
    }
}


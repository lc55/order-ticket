import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { Layout, message, Modal } from 'antd';
import DevLeftNav from '../../../components/DevLeftNav'
import Site from '../Site'
import Carriage from '../Carriage'
import Trains from '../Trains'
import Order from '../Order'
import Platform from '../Platform'
import Welcome from '../Welcome'
import storageUtils from '../../../utils/storageUtils';
import { adminLogout } from '../../../api/dev/admin';
import './home.css'
import LinkButton from '../../../components/LinkButton';

const { Sider, Content, Header } = Layout
export default class Dev extends Component {

    // 退出登录
    logout = () => {
        Modal.confirm({
            content: '确定退出登录吗？',
            onOk: async () => {
                // 删除保存的user数据
                storageUtils.removeAdmin()
                storageUtils.removeAdminToken()
                const result = await adminLogout()
                if (result.code === 1) {
                    // 跳转到login
                    this.props.history.push({ pathname: '/dev/login' })
                } else {
                    message.error('退出失败！')
                }

            },
            onCancel: () => {

            }
        })

    }

    render() {
        const admin = storageUtils.getUser()
        if (Object.keys(admin).length === 0) {
            return <Redirect to='/dev/login' />
        }
        return (
            <div>
                <Layout>
                    <Header className="head">订票系统运维平台
                        <span style={{ marginLeft: '800px', fontSize: '15px' }}>{admin.phone}
                            <LinkButton onClick={this.logout} style={{ marginLeft: '20px' }}>退出登录</LinkButton></span>
                    </Header>
                    <Layout>
                        <Sider theme="light">
                            <DevLeftNav />
                        </Sider>

                        <Content style={{ margin: '24px 16px 0' }}>
                            <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                                <Switch>
                                    <Route path="/dev/home/site" component={Site} />
                                    <Route path="/dev/home/carriage" component={Carriage} />
                                    <Route path="/dev/home/trains" component={Trains} />
                                    <Route path="/dev/home/order" component={Order} />
                                    <Route path="/dev/home/platform" component={Platform} />
                                    <Route path="/dev/home/welcome" component={Welcome} />
                                    <Redirect to="/dev/home/welcome" />
                                </Switch>
                            </div>
                        </Content>
                    </Layout>
                </Layout>
            </div>
        )
    }
}

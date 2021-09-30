import React, { Component } from 'react'
import { Layout, message } from 'antd';
import { Switch, Link, Route, Redirect } from 'react-router-dom'
import UserLeftNav from '../../../components/UserLeftNav';
import Center from '../Center'
import MyOrder from '../MyOrder'
import Passenger from '../Passenger';
import storageUtils from '../../../utils/storageUtils'
import LinkButton from '../../../components/LinkButton'
import { userLogout } from '../../../api/user/user'

const { Sider, Content, Header } = Layout
export default class Home extends Component {

    logout = async () => {
        const user = storageUtils.getUser()
        storageUtils.removeUser()
        storageUtils.removeUserToken()
        const result = await userLogout(user.id)
        if (result.code === 1) {
            this.props.history.push({ pathname: '/user/login' })
        } else {
            message.error(result.msg)
        }
    }

    render() {
        const user = storageUtils.getUser()
        return (
            <div>
                <Layout>
                    <Header className="head"><Link to="/user/ticketList">订票系统</Link>
                        <span style={{ marginLeft: '800px', fontSize: '15px' }}>
                            {
                                Object.keys(user).length === 0 ? <Link to="/user/login" style={{ marginLeft: '20px' }}>登录</Link> : user.phone
                            }
                            {
                                Object.keys(user).length === 0 ? null : <LinkButton onClick={this.logout} style={{ marginLeft: '20px' }}>退出</LinkButton>
                            }
                        </span>
                    </Header>
                </Layout>
                <Layout>
                    <Sider theme="light">
                        <UserLeftNav />
                    </Sider>
                    <Content>
                        <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                            <Switch>
                                <Route path="/user/home/center" component={Center} />
                                <Route path="/user/home/myOrder" component={MyOrder} />
                                <Route path="/user/home/passenger" component={Passenger} />
                                <Redirect to="/user/home/center" />
                            </Switch>
                        </div>
                    </Content>
                </Layout>
            </div>
        )
    }
}

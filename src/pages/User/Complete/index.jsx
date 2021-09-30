import React, { Component } from 'react'
import { Result, Button, Layout } from 'antd'
import MyNavLink from '../../../components/MyNavLink'
import LinkButton from '../../../components/LinkButton'
import storageUtils from '../../../utils/storageUtils'
import { Link } from 'react-router-dom'

const { Header } = Layout
export default class Complete extends Component {

    state = {
        isSuccess: 0,
        data: []
    }

    componentDidMount() {
        const { isSuccess, data } = this.props.history.location.state
        this.setState({ isSuccess, data })
    }

    render() {
        const { isSuccess, data } = this.state
        const user = storageUtils.getUser()
        return (
            <div>
                <Header className="head"><Link to="/user/ticketList">订票系统</Link>
                    <span style={{ marginLeft: '800px', fontSize: '15px' }}>
                        {
                            Object.keys(user).length === 0 ? <Link to="/user/login" style={{ marginLeft: '20px' }}>登录</Link> : <Link to="/user/home/center" style={{ marginLeft: '20px' }}>{user.phone}</Link>
                        }
                        {
                            Object.keys(user).length === 0 ? null : <LinkButton onClick={this.logout} style={{ marginLeft: '20px' }}>退出</LinkButton>
                        }
                    </span>
                </Header>
                {
                    isSuccess === 1 ? <Result
                        status="success"
                        title="订票成功！"
                        subTitle={`订单编号: ${data.map((item) => {
                            return item
                        })}`}
                        extra={[
                            <MyNavLink to="/user/home/center">
                                <Button type="primary" key="console">
                                    个人中心
                                </Button>
                            </MyNavLink>
                            ,
                            <MyNavLink to="/user/search">
                                <Button key="buy">继续买票</Button>
                            </MyNavLink>,

                        ]}
                        style={{ marginTop: '100px' }}
                    />
                        :
                        <Result
                            status="success"
                            title="取消成功！"
                            subTitle={`订单编号: ${data.map((item) => {
                                return item
                            })}`}
                            extra={[
                                <MyNavLink to="/user/home/center">
                                    <Button type="primary" key="console">
                                        个人中心
                                    </Button>
                                </MyNavLink>
                                ,
                                <MyNavLink to="/user/search">
                                    <Button key="buy">继续买票</Button>
                                </MyNavLink>,

                            ]}
                            style={{ marginTop: '100px' }}
                        />
                }

            </div>
        )
    }
}

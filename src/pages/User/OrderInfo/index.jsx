import React, { Component } from 'react'
import { Card, Divider, Table, Statistic, Row, Col, Select, Layout, Button, message } from 'antd'
import { cancelOrder, payment } from '../../../api/user/order';
import storageUtils from '../../../utils/storageUtils'
import { Link } from 'react-router-dom'
import LinkButton from '../../../components/LinkButton'
import { userLogout } from '../../../api/user/user'
const { Header } = Layout
const { Countdown } = Statistic
const deadline = Date.now() + 1000 * 60 * 30
export default class OrderInfo extends Component {

    state = {
        dataSource: [],
        order: 1,
        trainInfo: {}
    }

    onFinish = () => {
        cancelOrder()
    }

    componentDidMount() {
        let { order } = this.state
        const { endName, endTime, startDate, startName, startTime, trainNumber, passengerList } = this.props.history.location.state
        const newData = passengerList.map((item) => {
            item.order = order
            order++
            return item
        })
        this.setState({
            trainInfo: { endName, endTime, startDate, startName, startTime, trainNumber },
            dataSource: newData
        })
    }

    cancelOrder = async () => {
        const { dataSource } = this.state
        const orderIds = dataSource.map((item) => {
            return item.orderId
        })
        // 取消订单
        const result = await cancelOrder(orderIds)
        if (result.code === 1) {
            message.success('取消成功')
            const { data } = result
            const orderNumbers = { isSuccess: 2, data }
            this.props.history.push({ pathname: '/user/orderComplete', state: orderNumbers })
        } else {
            message.error(result.msg)
        }
    }

    onlinePayment = async () => {
        const { dataSource } = this.state
        const orderIds = dataSource.map((item) => {
            return item.orderId
        })
        // 支付
        const result = await payment(orderIds)
        if (result.code === 1) {
            message.success('支付成功')
            const { data } = result
            const orderNumbers = { isSuccess: 1, data }
            this.props.history.push({ pathname: '/user/orderComplete', state: orderNumbers })
        } else {
            message.error(result.msg)
        }
    }
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

        const { dataSource, trainInfo } = this.state
        const user = storageUtils.getUser()
        const columns = [
            {
                title: '序号',
                dataIndex: 'order',
                key: '1',
                align: 'center',
            },
            {
                title: '姓名',
                dataIndex: 'name',
                key: '2',
                align: 'center',
            },
            {
                title: '证件号码',
                key: '4',
                dataIndex: 'idCard',
                align: 'center',
            },
            {
                title: '席别',
                dataIndex: 'levelCar',
                key: '4',
                align: 'center',
            },
            {
                title: '车厢',
                key: '5',
                dataIndex: 'carriageOrder',
                align: 'center',
            },
            {
                title: '席位号',
                key: '6',
                dataIndex: 'seatNumber',
                align: 'center',
            },
            {
                title: '票价（元）',
                key: '7',
                dataIndex: 'price',
                align: 'center',
            },
        ];

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
                <Layout style={{ backgroundColor: '#fff' }}>
                    {/* <Header style={{ backgroundColor: '#fff'}}> */}
                    <h1 style={{
                        border: 'solid 1px #298CCE',
                        width: '1000px',
                        height: '80px',
                        marginTop: '50px',
                        marginLeft: '400px',
                        textAlign: 'center',
                        lineHeight: '80px'
                    }}>
                        <div>
                            席位已锁定，请在
                            <span style={{ color: '#fb7403' }}>30</span>
                            分钟内进行支付，完成订票。支付剩余时间：
                            <Countdown
                                valueStyle={{ color: '#fb7403' }}
                                style={{ marginLeft: '655px', marginTop: '-59px' }}
                                value={deadline} onFinish={this.onFinish}
                                format='mm:ss' />
                        </div>
                    </h1>


                    {/* </Header> */}
                    {/* <Content style={{marginTop:'100px',backgroundColor:'#fff',height:'1000px'}}> */}
                    <Card
                        style={{ marginTop: '25px' }}
                        title="订单信息"
                        headStyle={{ backgroundColor: '#3B99FC', width: '1000px', marginLeft: '400px', marginTop: '50px' }}
                        bodyStyle={{ backgroundColor: '#FFFFFF', width: '1000px', marginLeft: '400px' }}
                        bordered={false}
                    >
                        <div>
                            <p className="order-train-info-p">
                                <strong className="order-train-info-mr5">{trainInfo.startDate}</strong>
                                <strong className="order-train-info-ml5">{trainInfo.trainNumber}</strong>
                                次
                                <strong className="order-train-info-ml5">{trainInfo.startName}</strong>
                                站
                                <strong className="order-train-info-s">（{trainInfo.startTime}开）——{trainInfo.endName}</strong>
                                站（{trainInfo.endTime}到）
                            </p>
                        </div>
                        <Divider dashed />
                        <Table
                            columns={columns}
                            dataSource={dataSource}
                            bordered
                            rowKey="passengerId"
                            pagination={false}
                        />
                    </Card>
                    {/* </Content> */}
                    <div>
                        <Button onClick={this.cancelOrder} shape="round" style={{ marginLeft: '750px' }}>取消订单</Button>
                        {/* <MyNavLink to="/user/orderComplete"> */}
                        <Button onClick={this.onlinePayment} shape="round" style={{ backgroundColor: '#FF8000', marginLeft: '200px', marginTop: '50px', color: '#fff' }}>网上支付</Button>
                        {/* </MyNavLink> */}
                    </div>
                </Layout>
            </div>

        )
    }
}

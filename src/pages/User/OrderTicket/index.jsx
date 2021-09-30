import { Card, Divider, Table, Checkbox, Row, Col, Select, Drawer, Button, Layout, Modal, Form, Input, Space, message } from 'antd'
import React, { Component } from 'react'
import { createFromIconfontCN } from '@ant-design/icons';
import './OrderTicket.css'
import { getPassengerList } from '../../../api/user/user';
import storageUtils from '../../../utils/storageUtils'
import { toOrder } from '../../../api/user/order';
import LinkButton from '../../../components/LinkButton'
import { userLogout, addPassenger } from '../../../api/user/user'
import {
    PlusOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom'
const IconFont = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_2779508_d3ob7o1ykpv.js',
})

const { Option } = Select
const { Header, Content, Footer } = Layout
export default class OrderTicket extends Component {
    myForm = React.createRef()
    state = {
        order: 1,
        visible: false,
        trainInfo: {},
        passengerList: [],
        dataSource: [],
        select: 0,
        showAdd: false
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

    // 删除乘客
    deletePassenger = (key) => {
        let { order } = this.state
        const dataSource = [...this.state.dataSource]
        const newDataSource = dataSource.filter((item) => {
            if (item.id !== key) {
                if (item.id > key) {
                    // --item.id
                    --item.order
                }
                return item
            }
        })
        order--
        if (newDataSource.length === 0) {
            this.setState({ order: 1 })
        }
        this.setState({
            dataSource: newDataSource,
            order
        })
    }

    // 处理选中乘客
    handleCheck = (event) => {
        const { dataSource, passengerList, order } = this.state
        const { checked, value } = event.target
        if (checked) {
            let newData = passengerList.find((item) => {
                if (item.id === value) return item
            })
            const newPassenger = { ...newData, order }
            this.setState({
                dataSource: [...dataSource, newPassenger],
                order: order + 1,
            })
        } else {
            this.deletePassenger(value)
        }
    }

    // 处理对话框完成
    handleOk = async () => {
        // 为乘客生成订单
        const user = storageUtils.getUser()
        const { dataSource, trainInfo } = this.state
        const { id, startId, endId, startDate, trainNumber, endDate, startName, endName, startTime, endTime } = trainInfo
        const newData = dataSource.map((item) => {
            const { id, levelCar, price } = item
            const data = { id, levelCar, price }
            return data
        })
        const json = { id, startId, endId, startDate, endDate, trainNumber, startName, endName, startTime, endTime, userId: user.id, passengerList: newData }
        // console.log(json)
        const result = await toOrder(json)
        if (result.code === 1) {
            const data = result.data.map((item) => {
                dataSource.map((i) => {
                    if (item.passengerId === i.id) {
                        item.levelCar = i.levelCar === 1 ? '豪华' : (i.levelCar === 2 ? '普通' : '经济')
                        item.price = i.price
                    }
                })
                return item
            })
            const orderInfo = { startDate, trainNumber, startName, endName, startTime, endTime, passengerList: data }
            this.setState({ visible: false })
            this.props.history.push({ pathname: '/user/orderInfo', state: orderInfo })
        } else {
            message.error(result.msg)
        }

    }

    // 关闭对话框
    handleCancel = () => {
        this.setState({ visible: false })
    }

    // 打开订单详情确认对话框
    showOrderInfo = () => {
        const { dataSource } = this.state
        let flag = false
        if (dataSource.length === 0) {
            message.error('请选择乘车人！')
            return
        }
        dataSource.map((item) => {
            if (!item.levelCar) {
                flag = true
            }
        })
        if (flag) {
            message.error('请选择座位类型！')
            return
        } else {
            this.setState({ visible: true })
        }
    }

    async componentDidMount() {
        // 获取乘车人信息
        const result = await getPassengerList(storageUtils.getUser().id)
        if (result.code === 1) {
            this.setState({
                passengerList: result.data,
                trainInfo: this.props.location.state
            })
        } else {
            message.error(result.msg)
        }

    }

    selectType = (value, record) => {
        const { dataSource, trainInfo } = this.state
        const newData = dataSource.map((item) => {
            if (item.id === record.id) {
                item.levelCar = value
                item.price = value === 1 ? trainInfo.luxuryPrice : (value === 2 ? trainInfo.ordinalPrice : trainInfo.enco)
            }
            return item
        })
        this.setState({ dataSource: newData })
    }

    showAdd = () => {
        this.setState({ showAdd: true })
    }

    // 添加用户
    addPassenger = async (values) => {
        const { name, idCard, phone } = values
        const user = storageUtils.getUser()
        const result = await addPassenger(phone, name, idCard, user.id)
        if (result.code === 1) {
            message.success('添加成功')
            // 获取乘车人信息
            const result = await getPassengerList(storageUtils.getUser().id)
            if (result.code === 1) {
                this.setState({
                    passengerList: result.data,
                    trainInfo: this.props.location.state
                })
            } else {
                message.error(result.msg)
            }
            this.setState({ showAdd: false })
            this.myForm.current.resetFields()
        } else {
            message.error(result.msg)
        }
    }

    handleAddClose = () => {
        this.setState({ showAdd: false })
    }

    render() {
        const { passengerList, visible, trainInfo, dataSource, showAdd } = this.state
        const user = storageUtils.getUser()
        const columns = [
            {
                title: '序号',
                dataIndex: 'order',
                key: '1',
                align: 'center',
            },
            {
                title: '席别',
                dataIndex: 'level',
                key: '2',
                align: 'center',
                render: (_, record) => (
                    <Select style={{ width: 100 }} onChange={(value) => { this.selectType(value, record) }}>
                        {
                            trainInfo.luxury ? <Option value={1}>豪华</Option> : null
                        }
                        {
                            trainInfo.ordinal ? <Option value={2}>普通</Option> : null
                        }
                        {
                            trainInfo.enco ? <Option value={3}>经济</Option> : null
                        }
                    </Select>
                ),

            },
            {
                title: '姓名',
                dataIndex: 'passengerName',
                key: '3',
                align: 'center',
            },
            {
                title: '证件号码',
                key: '4',
                dataIndex: 'passengerCard',
                align: 'center',
            },
            {
                title: '手机号码',
                key: '5',
                dataIndex: 'passengerPhone',
                align: 'center',
            },
        ];

        const columnsInfo = [
            {
                title: '序号',
                dataIndex: 'order',
                key: '1',
                align: 'center',
            },
            {
                title: '席别',
                dataIndex: 'levelCar',
                key: '2',
                align: 'center',
                render: (value) => {
                    return value === 1 ? '豪华' : (value === 2 ? '普通' : '经济')
                }
            },
            {
                title: '姓名',
                dataIndex: 'passengerName',
                key: '3',
                align: 'center',
            },
            {
                title: '证件号码',
                key: '4',
                dataIndex: 'passengerCard',
                align: 'center',
            },
            {
                title: '手机号码',
                key: '5',
                dataIndex: 'passengerPhone',
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
                {
                    Object.keys(trainInfo).length !== 0 ?
                        <Layout>
                            <Header style={{ height: '250px', backgroundColor: '#fff' }}>
                                <div className="order-trian-info">
                                    <Card
                                        title="列车信息"
                                        headStyle={{ backgroundColor: '#3B99FC' }}
                                        bodyStyle={{ backgroundColor: '#EEF1F8' }}
                                    >
                                        <p className="order-train-info-p">
                                            <strong className="order-train-info-mr5">{trainInfo.startDate}</strong>
                                            <strong className="order-train-info-ml5">{trainInfo.trainNumber}</strong>
                                            次
                                            <strong className="order-train-info-ml5">{trainInfo.startName}</strong>
                                            站
                                            <strong className="order-train-info-s">（{trainInfo.startTime}开）——{trainInfo.endName}</strong>
                                            站（{trainInfo.endTime}到）
                                        </p>
                                        <p>
                                            {
                                                trainInfo.luxury ?
                                                    <span>豪华（
                                                        <span style={{ color: '#fb7403' }}>￥{trainInfo.luxuryPrice}</span>
                                                        ）{trainInfo.luxury} 张
                                                    </span> : null
                                            }
                                            {
                                                trainInfo.ordinal ? <span style={{ marginLeft: '50px' }}>普通（
                                                    <span style={{ color: '#fb7403' }}>￥{trainInfo.ordinalPrice}</span>
                                                    ）{trainInfo.ordinal} 张
                                                </span> : null
                                            }
                                            {
                                                trainInfo.enco ? <span style={{ marginLeft: '50px' }}>经济（
                                                    <span style={{ color: '#fb7403' }}>￥{trainInfo.encoPrice}</span>
                                                    ）{!trainInfo.enco} 张
                                                </span> : null
                                            }
                                        </p>
                                    </Card>
                                </div>
                            </Header>
                            <Content style={{ height: '450px', backgroundColor: '#fff' }}>
                                <div className="order-passenger-info">
                                    <Card
                                        title="乘客信息"
                                        headStyle={{ backgroundColor: '#3B99FC' }}
                                        bodyStyle={{ backgroundColor: '#FFFFFF' }}
                                    >
                                        <div>
                                            <span>
                                                <IconFont type="anticonchengcheren" />
                                                <span style={{ marginLeft: '10px' }}>乘车人</span>
                                            </span>
                                            <span style={{ marginLeft: 1000 }}>
                                                <Button icon={<PlusOutlined />} type="primary" size='small' onClick={this.showAdd} >添加</Button>
                                            </span>
                                        </div>
                                        <div>
                                            <Checkbox.Group style={{ width: '100%', marginLeft: '25px' }} >
                                                <Row>
                                                    {
                                                        passengerList.map((item) => {
                                                            return (
                                                                <Col key={item.id} span={2}>
                                                                    <Checkbox onChange={this.handleCheck} key={item.id} value={item.id}>{item.passengerName}</Checkbox>
                                                                </Col>
                                                            )
                                                        })
                                                    }
                                                </Row>
                                            </Checkbox.Group>
                                        </div>
                                        <Divider dashed />
                                        <Table
                                            columns={columns}
                                            dataSource={dataSource}
                                            bordered
                                            rowKey="order"
                                            pagination={false}
                                        />
                                    </Card>
                                </div>
                            </Content>
                        </Layout> : null
                }
                <Footer style={{ backgroundColor: '#fff' }}>
                    <Button onClick={this.showOrderInfo} type="primary" size="large" shape="round" style={{ marginLeft: '600px' }}>提交订单</Button>
                </Footer>
                {/* 确认订单信息对话框 */}
                <div>
                    <Modal
                        title="核对一下信息"
                        visible={visible}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        cancelText="返回修改"
                        destroyOnClose
                        width='800px'
                    >
                        <p className="order-train-info-p">
                            <strong className="order-train-info-mr5">{trainInfo.startDate}</strong>
                            <strong className="order-train-info-ml5">{trainInfo.trainNumber}</strong>
                            次
                            <strong className="order-train-info-ml5">{trainInfo.startName}</strong>
                            站
                            <strong className="order-train-info-s">（{trainInfo.startTime}开）——{trainInfo.endName}</strong>
                            站（{trainInfo.endTime}到）
                        </p>
                        <Table
                            columns={columnsInfo}
                            dataSource={dataSource}
                            bordered
                            rowKey="order"
                            pagination={false}
                        />
                    </Modal>
                </div>
                <div>
                    <Modal
                        title="添加乘车人"
                        visible={showAdd}
                        onOk={this.addPassenger}
                        onCancel={this.handleAddClose}
                        footer={[]}
                        width='800px'
                        style={{ top: 100 }}
                        destroyOnClose='true'
                    >
                        <Form
                            layout="vertical"
                            onFinish={this.addPassenger}
                            ref={this.myForm}
                        >
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="name"
                                        label="姓名"
                                        rules={[{ required: true, message: '请输入姓名!' }]}
                                    >
                                        <Input autoComplete="off" placeholder="请输入姓名" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="idCard"
                                        label="身份证"
                                        rules={[{ required: true, message: '请输入身份证!' }]}
                                    >
                                        <Input maxLength={18} autoComplete="off" placeholder="请输入身份证" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="phone"
                                        label="手机号码"
                                        rules={[{ required: true, message: '请输入手机号码!' }]}
                                        required="true"
                                    >
                                        <Input maxLength={11} autoComplete="off" placeholder="请输入手机号码" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <div
                                style={{
                                    textAlign: 'right',
                                    marginTop: '50px'
                                }}
                            >
                                <Space size="large">
                                    <Button onClick={this.handleAddClose} style={{ marginRight: 8 }}>
                                        取消
                                    </Button>
                                    <Button type="primary" htmlType="submit">
                                        确认
                                    </Button>
                                </Space>

                            </div>
                        </Form>
                    </Modal>
                </div>
            </div>
        )
    }
}

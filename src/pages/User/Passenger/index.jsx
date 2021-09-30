import React, { Component } from 'react'
import {
    Input, Card, Table,
    Drawer, Form, Button, Col, Row, Space, message, Radio, Popconfirm
} from 'antd';
import {
    PlusOutlined
} from '@ant-design/icons';
import LinkButton from '../../../components/LinkButton';
import { addPassenger, deletePassenger, editPassenger, getPassengerList } from '../../../api/user/user';
import storageUtils from '../../../utils/storageUtils'
import { Link } from 'react-router-dom'

export default class PlatForm extends Component {
    myForm = React.createRef()
    state = {
        totalCount: 0,
        showStatus: 0,
        count: 0,
        dataSource: [],
        passengerInfo: {}
    }

    // 打开添加抽屉
    showAddUser = () => {
        this.setState({ visible: 1 })
    }

    // 关闭抽屉
    onClose = () => {
        this.setState({ visible: 0 })
        this.myForm.current.resetFields()
    }

    // 添加用户
    addPassenger = async (values) => {
        const { name, idCard, phone } = values
        const user = storageUtils.getUser()
        const result = await addPassenger(phone, name, idCard, user.id)
        if (result.code === 1) {
            message.success('添加成功')
            this.getPassengerList()
            this.setState({ visible: 0 })
            this.myForm.current.resetFields()
        } else {
            message.error(result.msg)
        }

    }

    // 打开编辑的抽屉
    showUpdateUser = (record) => {
        this.setState({ visible: 2, passengerInfo: record })
    }

    updateUser = async (values) => {
        const { phone, name, idCard, id } = values
        const user = storageUtils.getUser()
        const result = await editPassenger(phone, name, idCard, id)
        if (result.code === 1) {
            message.success('编辑成功')
            this.getPassengerList()
            this.setState({ visible: 0 })
            this.myForm.current.resetFields()
        }

    }

    handleDelete = async (id) => {
        const result = await deletePassenger(id)
        if (result.code === 1) {
            message.success('删除成功')
            this.getPassengerList()
        } else {
            message.error(result.msg)
        }
    }

    componentDidMount() {
        this.getPassengerList()
    }

    async getPassengerList() {
        const user = storageUtils.getUser()
        if (Object.keys(user).length === 0) return
        const result = await getPassengerList(user.id)
        if (result.code === 1) {
            this.setState({ dataSource: result.data })
        } else {
            message.error(result.msg)
        }
    }


    render() {
        const { visible, dataSource, passengerInfo, pageSize, totalCount } = this.state
        const user = storageUtils.getUser()
        const columns = [
            {
                title: '姓名',
                dataIndex: 'passengerName',
                key: '1',
                align: 'center',
            },
            {
                title: '身份证',
                dataIndex: 'passengerCard',
                key: '2',
                align: 'center',
            },
            {
                title: '手机号码',
                dataIndex: 'passengerPhone',
                key: '3',
                align: 'center',
            },
            {
                title: '操作',
                key: '4',
                render: (_, record) => (
                    <Space size="middle">
                        <LinkButton onClick={() => { this.showUpdateUser(record) }}>编辑</LinkButton>
                        <Popconfirm title="确定删除吗" onConfirm={() => this.handleDelete(record.id)}>
                            <LinkButton >删除</LinkButton>
                        </Popconfirm>
                    </Space>
                ),
                align: 'center'
            },
        ]
        return (
            <div>
                {
                    Object.keys(user).length === 0 ?
                        <span>请先<Link to="/user/login">登录</Link></span> :
                        <div>
                            <div>
                                <Card
                                    extra={
                                        <Button icon={<PlusOutlined />} type="primary" onClick={this.showAddUser}>新增</Button>
                                    }
                                >
                                    <Table
                                        columns={columns}
                                        dataSource={dataSource}
                                        bordered
                                        rowKey="key"
                                        pagination={{
                                            pageSize: pageSize,
                                            total: totalCount,
                                        }}
                                    />
                                </Card>
                            </div>
                            {/* 新增的抽屉 */}
                            <div>
                                <Drawer
                                    title="新增用户"
                                    width={500}
                                    onClose={this.onClose}
                                    visible={visible === 1}
                                    bodyStyle={{ paddingBottom: 80 }}
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
                                                <Button onClick={this.onClose} style={{ marginRight: 8 }}>
                                                    取消
                                                </Button>
                                                <Button type="primary" htmlType="submit">
                                                    确认
                                                </Button>
                                            </Space>

                                        </div>
                                    </Form>
                                </Drawer>
                            </div>
                            {/* 编辑的抽屉 */}
                            <div>
                                <Drawer
                                    title="编辑用户"
                                    width={500}
                                    onClose={this.onClose}
                                    visible={visible === 2}
                                    bodyStyle={{ paddingBottom: 80 }}
                                >
                                    <Form
                                        layout="vertical"
                                        onFinish={this.updateUser}
                                        ref={this.myForm}
                                    >
                                        <Row gutter={16}>
                                            <Col span={12}>
                                                <Form.Item
                                                    name="name"
                                                    label="姓名"
                                                    rules={[{ required: true, message: '请输入姓名!' }]}
                                                    initialValue={passengerInfo.passengerName}
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
                                                    initialValue={passengerInfo.passengerCard}
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
                                                    initialValue={passengerInfo.passengerPhone}
                                                >
                                                    <Input maxLength={11} autoComplete="off" placeholder="请输入手机号码" />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row gutter={16}>
                                            <Col span={12}>
                                                <Form.Item
                                                    name="id"
                                                    initialValue={passengerInfo.id}
                                                >
                                                    <Input hidden={true} />
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
                                                <Button onClick={this.onClose} style={{ marginRight: 8 }}>
                                                    取消
                                                </Button>
                                                <Button type="primary" htmlType="submit">
                                                    确认
                                                </Button>
                                            </Space>

                                        </div>
                                    </Form>
                                </Drawer>
                            </div>
                        </div>
                }
            </div>
        )
    }
}

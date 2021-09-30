import React, { Component } from 'react'
import {
    Input, Card, Table,
    Drawer, Form, Button, Col, Row, Space, message, Radio
} from 'antd';
import {
    PlusOutlined
} from '@ant-design/icons';
import LinkButton from '../../../components/LinkButton';
import { addAdmin, adminInfo, adminList, updateAdmin } from '../../../api/dev/admin';

export default class PlatForm extends Component {
    myForm = React.createRef()
    state = {
        visible: 0,
        pageNum: 1,
        pageSize: 5,
        dataSource: [],
        adminInfo: {},
        totalCount: 0
    }

    componentDidMount() {
        const { pageNum, pageSize } = this.state
        this.getAdminList(pageNum, pageSize)
    }

    async getAdminList(pageNum, pageSize) {
        const result = await adminList(pageNum, pageSize)
        if (result.code === 1) {
            this.setState({ dataSource: result.data, totalCount: result.totalCount })
        } else {
            message.error(result.msg)
        }
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
    addUser = async (values) => {
        const { pageNum, pageSize } = this.state
        const result = await addAdmin(values)
        if (result.code === 1) {
            this.getAdminList(pageNum, pageSize)
            message.success('添加成功')
            this.setState({ visible: 0 })
            this.myForm.current.resetFields()
        }

    }

    // 打开编辑的抽屉
    showUpdateUser = async (id) => {
        const result = await adminInfo(id)
        if (result.code === 1) {
            this.setState({ adminInfo: result.data, visible: 2 })
        } else {
            message.error(result.msg)
        }
    }

    updateUser = async (values) => {
        const { pageNum, pageSize, adminInfo } = this.state
        const { id } = adminInfo
        const result = await updateAdmin({ ...values, id })
        if (result.code === 1) {
            this.getAdminList(pageNum, pageSize)
            message.success('编辑成功')
            this.setState({ visible: 0 })
            this.myForm.current.resetFields()
        }
    }

    render() {
        const { visible, dataSource, adminInfo, pageSize, totalCount } = this.state
        const columns = [
            {
                title: '手机号',
                dataIndex: 'phone',
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
                title: '状态',
                dataIndex: 'state',
                key: '3',
                align: 'center',
                render: (state) => {
                    return state === 1 ? '启用' : '禁用'
                }
            },
            {
                title: '操作',
                key: '4',
                render: (_, record) => (
                    <Space size="middle">
                        <LinkButton onClick={() => { this.showUpdateUser(record.id) }}>编辑</LinkButton>
                    </Space>
                ),
                align: 'center'
            },
        ];

        return (
            <div>
                <div>
                    <Card
                        title={<span style={{ fontSize: '30px' }}>平台用户</span>}
                        extra={
                            <Button icon={<PlusOutlined />} type="primary" onClick={this.showAddUser}>新增</Button>
                        }
                    >
                        <Table
                            columns={columns}
                            dataSource={dataSource}
                            bordered
                            rowKey="id"
                            pagination={{
                                onChange: page => {
                                    this.getAdminList(page, pageSize)
                                },
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
                            onFinish={this.addUser}
                            ref={this.myForm}
                        >
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
                                        name="password"
                                        label="密码"
                                        rules={[{ required: true, message: '请输入密码!' }]}
                                    >
                                        <Input autoComplete="off" placeholder="请输入密码" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="state"
                                        label="状态"
                                        rules={[{ required: true, message: '请选择状态！' }]}
                                    >
                                        <Radio.Group name="state" >
                                            <Radio value={1}>启用</Radio>
                                            <Radio value={2}>禁用</Radio>
                                        </Radio.Group>
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
                                        name="phone"
                                        label="手机号码"
                                        rules={[{ required: true, message: '请输入手机号码!' }]}
                                        required="true"
                                        initialValue={adminInfo.phone}
                                    >
                                        <Input autoComplete="off" placeholder="请输入手机号码" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="name"
                                        label="姓名"
                                        rules={[{ required: true, message: '请输入姓名!' }]}
                                        initialValue={adminInfo.name}
                                    >
                                        <Input autoComplete="off" placeholder="请输入姓名" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="password"
                                        label="密码"
                                        rules={[{ required: true, message: '请输入密码!' }]}
                                        initialValue={adminInfo.password}
                                    >
                                        <Input autoComplete="off" placeholder="请输入密码" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="state"
                                        label="状态"
                                        rules={[{ required: true, message: '请选择状态！' }]}
                                        initialValue={adminInfo.state}
                                    >
                                        <Radio.Group name="state" >
                                            <Radio value={1}>启用</Radio>
                                            <Radio value={2}>禁用</Radio>
                                        </Radio.Group>
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
        )
    }
}

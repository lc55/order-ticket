import React, { Component } from 'react'
import { Card, Button, Table, Modal, Space, Form, Input, Col, Row, Radio, message, Popconfirm } from 'antd'
import {
    PlusOutlined
} from '@ant-design/icons';
import LinkButton from '../../../components/LinkButton';
import { addCarriage, carriageInfo, listCarriage, editCarriage, deleteCarriage } from '../../../api/dev/carriage';

export default class Carriage extends Component {

    state = {
        showStatus: 0,// 0都不显示，1显示新增，2显示编辑
        seatCount: 0,
        carriageList: [],
        pageNum: 1,
        pageSize: 5,
        carriage: {}
    }

    // 打开新增模态窗口
    showAddModal = () => {
        this.setState({ showStatus: 1 })
    }
    // 打开编辑模态窗口
    showUpdateModal = async (record) => {
        const result = await carriageInfo(record.id)
        if (result.code === 1) {
            this.setState({ carriage: result.data, seatCount: result.data.seatCount })
        } else {
            message.error(result.msg)
            return
        }
        this.setState({ showStatus: 2 })
    }
    // 更新车厢信息
    updateCarriage = () => {
        this.setState({ showStatus: 0 })
    }

    // 删除车厢
    deleteCarriage = async (record) => {
        const result = await deleteCarriage(record.id)
        if (result.code === 1) {
            const { pageNum, pageSize } = this.state
            this.getCarriageList(pageNum, pageSize)
        } else {
            message.error(result.msg)
            return
        }
    }

    // 处理点击取消
    handleCancel = () => {
        this.setState({ showStatus: 0, seatCount: 0 })
    }

    // 输入完规格计算座位数
    handleBlur = () => {
        const left = this.leftInput.props.value * 1
        const right = this.rightInput.props.value * 1
        const row = this.rowInput.props.value
        if (isNaN(left) || isNaN(right) || isNaN(row)) return
        const seatCount = (left + right) * row
        this.setState({ seatCount })
    }

    // 添加车厢
    addCarriage = async (values) => {
        const { seatCount } = this.state
        const { adapter, carriageNumber, level, sizeLeft, sizeRight, sizeRow } = values
        const carriage = { adapter, carriageNumber, level, sizeLeft, sizeRight, sizeRow, seatCount }
        const result = await addCarriage(carriage)
        if (result.code === 1) {
            message.success("添加成功")
            const { pageNum, pageSize } = this.state
            this.getCarriageList(pageNum, pageSize)
            this.setState({ showStatus: 0, seatCount: 0 })
        } else {
            message.error(result.msg)
        }

    }

    // 编辑车厢
    editCarriage = async (values) => {
        console.log(values)
        const { seatCount } = this.state
        const id = this.state.carriage.id
        const { adapter, level, priceBase, sizeLeft, sizeRight, sizeRow } = values
        const carriage = { adapter, level, priceBase, sizeLeft, sizeRight, sizeRow, seatCount, id }
        const result = await editCarriage(carriage)
        if (result.code === 1) {
            message.success("编辑成功")
            this.setState({ showStatus: 0, seatCount: 0 })
        } else {
            message.error(result.msg)
        }
    }

    // 组件挂载完毕的时候去拉数据库，获取车厢列表
    componentDidMount() {
        const { pageNum, pageSize } = this.state
        this.getCarriageList(pageNum, pageSize)
    }

    async getCarriageList(pageNum, pageSize) {
        const result = await listCarriage(pageNum, pageSize)
        if (result.code === 1) {
            this.setState({
                carriageList: result.data,
                totalCount: result.totalCount,
                pageSize: result.pageSize
            })
        } else {
            message.error(result.msg)
        }
    }


    render() {
        const { carriage, pageSize, totalCount } = this.state
        const columns = [
            {
                title: '编号',
                dataIndex: 'carriageNumber',
                key: '1',
                align: 'center',
            },
            {
                title: '级别',
                dataIndex: 'levelCar',
                key: '2',
                align: 'center',
                render: (levelCar) => {
                    return levelCar === 1 ? '豪华' : (levelCar === 2 ? '普通' : '经济')
                }
            },
            {
                title: '规格',
                dataIndex: 'size',
                key: '3',
                align: 'center',
                render: (_, record) => {
                    return `(${record.leftSeat}+${record.rightSeat})*${record.rowSeat}`
                }
            },
            {
                title: '座位数',
                key: '4',
                dataIndex: 'seatCount',
                align: 'center',
            },
            {
                title: '价格基数',
                key: '5',
                dataIndex: 'priceBase',
                align: 'center',
            },
            {
                title: '适配车型',
                key: '6',
                dataIndex: 'adaptModel',
                align: 'center',
                render: (adaptModel) => {
                    return adaptModel === 1 ? '动车' : (adaptModel === 2 ? '高铁' : '动车、高铁')
                }
            },
            {
                title: '操作',
                key: '7',
                render: (record) => (
                    <Space size="middle">
                        <LinkButton onClick={() => { this.showUpdateModal(record) }}>编辑</LinkButton>
                        <Popconfirm title="确定删除吗？" okText="是" cancelText="否" onConfirm={() => { this.deleteCarriage(record) }}>
                            <LinkButton>删除</LinkButton>
                        </Popconfirm>
                    </Space>
                ),
                align: 'center'
            },
        ]

        const { seatCount, showStatus, carriageList } = this.state
        return (
            <div>
                <div>
                    <Card
                        title={<span style={{ fontSize: '30px' }}>车厢管理</span>}
                        extra={<Button icon={<PlusOutlined />} type="primary" onClick={this.showAddModal} >新增</Button>}
                    >
                        <Table
                            columns={columns}
                            dataSource={carriageList}
                            bordered
                            rowKey="id"
                            pagination={{
                                onChange: page => {
                                    this.getCarriageList(page, pageSize)
                                },
                                pageSize: pageSize,
                                total: totalCount,
                            }}
                        />
                    </Card>
                </div>
                {/* 新增的modal */}
                <div>
                    <Modal
                        title="新增车厢信息"
                        visible={showStatus === 1}
                        onCancel={this.handleCancel}
                        footer={[]}
                        width='800px'
                        style={{ top: 10 }}
                        destroyOnClose='true'
                    >
                        <Form
                            layout="vertical"
                            onFinish={this.addCarriage}
                        >
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="carriageNumber"
                                        label="编号"
                                        rules={[{ required: true, message: '请输入编号' }]}
                                        required="true"
                                    >
                                        <Input placeholder="请输入编号" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            {/* <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="priceBase"
                                        label="价格基数"
                                        rules={[{ required: true, message: '请输入价格基数' }]}
                                    >
                                        <Select style={{ width: 100 }} onChange={(value) => { this.selectType(value, record) }}>
                                            <Option value={15}>豪华（15）</Option>
                                            <Option value={10}>普通（10）</Option>
                                           <Option value={5}>经济（5）</Option> 
                                            
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row> */}
                            <Row gutter={16}>
                                <Col span={4}>
                                    <Form.Item
                                        name="sizeLeft"
                                        label="规格"
                                        rules={[{ required: true, message: '请输入规格' }]}
                                    >
                                        <Input ref={(input) => { this.leftInput = input }} onBlur={this.handleBlur} placeholder="左" />
                                    </Form.Item>
                                </Col>
                                <Col span={4}>
                                    <Form.Item
                                        name="sizeRight"
                                        label=" "
                                        rules={[{ required: true, message: '请输入规格' }]}
                                    >
                                        <Input ref={(input) => { this.rightInput = input }} onBlur={this.handleBlur} placeholder="右" />
                                    </Form.Item>
                                </Col>
                                <Col span={4}>
                                    <Form.Item
                                        name="sizeRow"
                                        label=" "
                                        rules={[{ required: true, message: '请输入规格' }]}
                                    >
                                        <Input ref={(input) => { this.rowInput = input }} placeholder="行" onBlur={this.handleBlur} />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="seatNumber"
                                        label="座位数"
                                        rules={[{ required: false }]}
                                    >
                                        <span>{seatCount}</span>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="level"
                                        label="级别"
                                        rules={[{ required: true }]}
                                    >
                                        <Radio.Group>
                                            <Radio value={1}>豪华</Radio>
                                            <Radio value={2}>普通</Radio>
                                            <Radio value={3}>经济</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="adapter"
                                        label="适配车型"
                                        rules={[{ required: true }]}
                                    >
                                        <Radio.Group name="radiogroup" >
                                            <Radio value={1}>动车</Radio>
                                            <Radio value={2}>高铁</Radio>
                                            <Radio value={3}>动车、特快</Radio>
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
                                    <Button onClick={this.handleCancel} style={{ marginRight: 8 }}>
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
                {/* 编辑的modal */}
                <div>
                    <Modal
                        title="编辑车厢信息"
                        visible={showStatus === 2}
                        onCancel={this.handleCancel}
                        footer={[]}
                        width='800px'
                        style={{ top: 10 }}
                        destroyOnClose='true'
                    >
                        <Form
                            layout="vertical"
                            onFinish={this.editCarriage}
                        >
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="carriageNumber"
                                        label="编号"
                                        rules={[{ required: true, message: '请输入编号' }]}
                                        required="true"
                                        initialValue={carriage.carriageNumber}
                                    >
                                        <Input placeholder="请输入车厢编号" readOnly />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="priceBase"
                                        label="价格基数"
                                        rules={[{ required: true, message: '请输入价格基数' }]}
                                        initialValue={carriage.priceBase}
                                    >
                                        <Input placeholder="请输入价格基数" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={4}>
                                    <Form.Item
                                        name="sizeLeft"
                                        label="规格"
                                        rules={[{ required: true, message: '请输入规格' }]}
                                        initialValue={carriage.leftSeat}
                                    >
                                        <Input ref={(input) => { this.leftInput = input }} onBlur={this.handleBlur} placeholder="请输入规格" />
                                    </Form.Item>
                                </Col>
                                <Col span={4}>
                                    <Form.Item
                                        name="sizeRight"
                                        label=" "
                                        rules={[{ required: true, message: '请输入规格' }]}
                                        initialValue={carriage.rightSeat}
                                    >
                                        <Input ref={(input) => { this.rightInput = input }} onBlur={this.handleBlur} placeholder="请输入规格" />
                                    </Form.Item>
                                </Col>
                                <Col span={4}>
                                    <Form.Item
                                        name="sizeRow"
                                        label=" "
                                        rules={[{ required: true, message: '请输入规格' }]}
                                        initialValue={carriage.rowSeat}
                                    >
                                        <Input ref={(input) => { this.rowInput = input }} placeholder="行" onBlur={this.handleBlur} placeholder="请输入规格" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="seatNumber"
                                        label="座位数"
                                        rules={[{ required: false }]}
                                        initialValue={carriage.seatCount}
                                    >
                                        <span>{seatCount}</span>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="level"
                                        label="级别"
                                        rules={[{ required: true }]}
                                        initialValue={carriage.levelCar}
                                    >
                                        <Radio.Group >
                                            <Radio value={1}>豪华</Radio>
                                            <Radio value={2}>普通</Radio>
                                            <Radio value={3}>经济</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="adapter"
                                        label="适配车型"
                                        rules={[{ required: true }]}
                                        initialValue={carriage.adaptModel}
                                    >
                                        <Radio.Group name="radiogroup" >
                                            <Radio value={1}>动车</Radio>
                                            <Radio value={2}>特快</Radio>
                                            <Radio value={3}>动车、特快</Radio>
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
                                    <Button onClick={this.handleCancel} style={{ marginRight: 8 }}>
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

import React, { Component } from 'react'
import moment from 'moment';
import {
    Input, Table, Card, Form, Button, Col, Row, Select, DatePicker, message
} from 'antd'
import { Link } from 'react-router-dom'
import storageUtils from '../../../utils/storageUtils'
import { getMyOrderList } from '../../../api/user/user';

const { Option } = Select
const { RangePicker } = DatePicker
const format = "YYYY-MM-DD"
export default class MyOrder extends Component {
    state = {
        pageNum: 1,
        pageSize: 5,
        dataSource: [],
        totalCount: 0
    }
    async componentDidMount() {
        const { pageNum, pageSize } = this.state
        this.getMyOrderList(pageNum, pageSize)
    }

    async getMyOrderList(pageNum, pageSize, startDate, endDate, type, orderState) {
        const user = storageUtils.getUser()
        const result = await getMyOrderList(user.id, pageNum, pageSize, startDate, endDate, type, orderState)
        if (result.code === 1) {
            this.setState({ dataSource: result.data, totalCount: result.totalCount })
        } else {
            message.error(result.msg)
        }
    }

    search = (values) => {
        const { orderState, type, date } = values
        let startDate
        let endDate
        if (date) {
            startDate = moment(date[0]).format(format)
            endDate = moment(date[1]).format(format)
        }
        const { pageNum, pageSize } = this.state
        this.getMyOrderList(pageNum, pageSize, startDate, endDate, type, orderState)
    }

    render() {
        const { dataSource, pageSize, totalCount } = this.state
        const user = storageUtils.getUser()
        const columns = [
            {
                title: '车次',
                key: '1',
                dataIndex: 'trainNumber',
                align: 'center',
            },
            {
                title: '始发地',
                dataIndex: 'startName',
                key: '2',
                align: 'center',
            },
            {
                title: '终点站',
                dataIndex: 'endName',
                key: '3',
                align: 'center',
            },
            {
                title: '出发时间',
                dataIndex: 'startDateTime',
                key: '4',
                align: 'center',
                render: (_, record) => {
                    return record.startDate + " " + record.startTime
                }
            },
            {
                title: '到达时间',
                dataIndex: 'endDateTime',
                key: '5',
                align: 'center',
                render: (_, record) => {
                    return record.endDate + " " + record.endTime
                }
            },
            {
                title: '级别',
                key: '6',
                dataIndex: 'levelCar',
                align: 'center',
                render: (record) => {
                    return record === 1 ? '豪华' : (record === 2 ? '普通' : '经济')
                }
            },
            {
                title: '车厢',
                key: '7',
                dataIndex: 'carriageOrder',
                align: 'center',
            },
            {
                title: '座位号',
                key: '8',
                dataIndex: 'seatNumber',
                align: 'center',
            },
            {
                title: '乘车人',
                key: '9',
                dataIndex: 'passengerName',
                align: 'center',
            },
            {
                title: '身份证',
                key: '10',
                dataIndex: 'passengerCard',
                align: 'center',
            },
            {
                title: '订单状态',
                key: '11',
                dataIndex: 'orderStatus',
                align: 'center',
                render: (record) => {
                    return record === 0 ? '未支付' : (record === 1 ? '已支付' : '已取消')
                }
            },
        ]
        return (
            <div>
                <div>
                    {
                        Object.keys(user).length === 0 ?
                            <span>请先<Link to="/user/login">登录</Link></span> :
                            <Card>
                                <div>
                                    <Form
                                        layout="inline"
                                        onFinish={this.search}
                                    >
                                        <Row gutter={16}>
                                            <Col span={12}>
                                                <Form.Item
                                                    name="date"
                                                >
                                                    <RangePicker />
                                                </Form.Item>
                                            </Col>
                                            <Col span={6}>
                                                <Form.Item
                                                    name="type"
                                                >
                                                    <Select placeholder="座位类别">
                                                        <Option value={1}>豪华</Option>
                                                        <Option value={2}>普通</Option>
                                                        <Option value={3}>经济</Option>
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                            <Col span={6}>
                                                <Form.Item
                                                    name="orderState"
                                                >
                                                    <Select placeholder="订单状态">
                                                        <Option value={1}>已支付</Option>
                                                        <Option value={0}>未支付</Option>
                                                        <Option value={2}>超时取消</Option>
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                        </Row>

                                        <Col span={0.3}
                                            style={{ marginRight: '20px' }}
                                        >
                                            <Form.Item>
                                                <Button type="primary" htmlType='submit' shape="round" >查询</Button>
                                            </Form.Item>
                                        </Col>
                                        <Col span={1}
                                        >
                                            <Form.Item>
                                                <Button shape="round" htmlType='reset' >重置</Button>
                                            </Form.Item>
                                        </Col>
                                    </Form>
                                </div>
                                {
                                    dataSource.length === 0 ? null : <div style={{ marginTop: '20px' }}>
                                        <Table
                                            columns={columns}
                                            dataSource={dataSource}
                                            bordered
                                            rowKey="id"
                                            pagination={{
                                                onChange: page => {
                                                    this.getMyOrderList(page, pageSize)
                                                },
                                                pageSize: pageSize,
                                                total: totalCount,
                                            }}
                                        />
                                    </div>
                                }
                            </Card>
                    }
                </div>
            </div>
        )
    }
}

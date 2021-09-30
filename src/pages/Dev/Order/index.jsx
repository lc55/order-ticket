import React, { Component } from 'react'
import {
    Input, Table, Card, Form, Button, Col, Row, Select, message
} from 'antd';
import moment from 'moment'
import { getOrderList } from '../../../api/dev/order';

const { Option } = Select
const format = 'YYYY-MM-DD HH:mm'
const dataformat = 'YYYY-MM-DD HH:mm:ss'
export default class Order extends Component {

    state = {
        pageNum: 1,
        pageSize: 5,
        dataSource: [],
        totalCount: 0
    }

    myForm = React.createRef()
    // 清空表单
    onReset = () => {
        this.myForm.current.resetFields()
    }

    onSearch = async (values) => {
        const { pageNum, pageSize } = this.state
        const { idCard, orderStatus, passengerName, seatType, trainNumber } = values
        const result = await getOrderList(pageNum, pageSize, trainNumber ? trainNumber : undefined, passengerName ? passengerName : undefined, idCard ? idCard : undefined, orderStatus ? orderStatus : undefined, seatType ? seatType : undefined)
        if (result.code === 1) {
            this.setState({ dataSource: result.data })
        } else {
            message.error(result.msg)
        }
    }

    componentDidMount() {
        const { pageNum, pageSize } = this.state
        this.getOrderList(pageNum, pageSize)
    }
    async getOrderList(pageNum, pageSize) {
        const result = await getOrderList(pageNum, pageSize)
        if (result.code === 1) {
            this.setState({ dataSource: result.data, totalCount: result.totalCount })
        } else {
            message.error(result.msg)
        }
    }

    render() {
        const { dataSource, pageSize, totalCount } = this.state
        const columns = [
            {
                title: '车次',
                dataIndex: 'trainNumber',
                key: '1',
                align: 'center',
            },
            {
                title: '出发日期',
                dataIndex: 'startDateTime',
                key: '2',
                align: 'center',
                render: (_, record) => {
                    return record.startDate + " " + record.startTime
                }
            },
            {
                title: '起点站',
                dataIndex: 'startName',
                key: '3',
                align: 'center',
            },
            {
                title: '终点站',
                key: '4',
                dataIndex: 'endName',
                align: 'center',
            },
            {
                title: '达到时间',
                key: '5',
                dataIndex: 'endDateTime',
                align: 'center',
                render: (_, record) => {
                    return record.endDate + " " + record.endTime
                }
            },
            {
                title: '乘客姓名',
                key: '6',
                dataIndex: 'passengerName',
                align: 'center',
            },
            {
                title: '乘客身份证',
                key: '7',
                dataIndex: 'passengerCard',
                align: 'center',
            },
            {
                title: '座位类别',
                key: '8',
                dataIndex: 'levelCar',
                align: 'center',
                render: (level) => {
                    return level === 1 ? '豪华' : (level === 2 ? '普通' : '经济')
                }
            },
            {
                title: '座位号',
                key: '9',
                dataIndex: 'seatNumber',
                align: 'center',
                render: (_, record) => {
                    return `${record.carriageOrder}车-${record.seatNumber}`
                }
            },
            {
                title: '下单时时间',
                key: '10',
                dataIndex: 'orderTime',
                align: 'center',
                render: (time) => {
                    return moment(parseInt(time)).format(dataformat)
                }
            },
            {
                title: '支付状态',
                key: '11',
                dataIndex: 'orderStatus',
                align: 'center',
                render: (orderStatus) => {
                    return orderStatus === 0 ? '未支付' : (orderStatus === 1 ? '已支付' : '已取消')
                }
            },
        ];

        // const dataSource = [
        //     {
        //         key: '1',
        //         trainsNumber: 'G2154',
        //         startDate: '2021.01.01',
        //         startStation: '成都',
        //         endStation: '北京',
        //         endDate: '2021.01.01',
        //         name: '张三',
        //         idCard: '5108212121212',
        //         seatType: '豪华',
        //         seatNumber: 'A12',
        //         orderTime: '2121.01.01',
        //         payState: '已支付',
        //     },
        // ]

        return (
            <div>
                <div>
                    <Card
                        title={<span style={{ fontSize: '30px' }}>车票管理</span>}
                    >
                        <div>
                            <Form
                                ref={this.myForm}
                                layout="inline"
                                onFinish={this.onSearch}
                            >
                                <Row gutter={16}>
                                    <Col span={4}>
                                        <Form.Item
                                            name="trainNumber"
                                        >
                                            <Input placeholder="车次" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={4}>
                                        <Form.Item
                                            name="passengerName"
                                        >
                                            <Input placeholder="乘客姓名" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                        <Form.Item
                                            name="idCard"
                                            rules={[{
                                                len: 18,
                                                message: '请输入正确的身份证号码！',
                                                pattern: new RegExp(/^[1-9]\d*$/, "g")
                                            }]
                                            }
                                        >
                                            <Input placeholder="乘客身份证" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={4}>
                                        <Form.Item
                                            name="orderStatus"
                                        >
                                            <Select placeholder="订单状态">
                                                <Option value={1}>已支付</Option>
                                                <Option value={0}>未支付</Option>
                                                <Option value={2}>已取消</Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={4}>
                                        <Form.Item
                                            name="seatType"
                                        >
                                            <Select placeholder="座位类别">
                                                <Option value={1}>豪华</Option>
                                                <Option value={2}>普通</Option>
                                                <Option value={3}>经济</Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Col span={0.3}
                                    style={{ marginRight: '20px' }}
                                >
                                    <Form.Item>
                                        <Button type="primary" htmlType="submit" shape="round" >查询</Button>
                                    </Form.Item>
                                </Col>
                                <Col span={1}
                                >
                                    <Form.Item>
                                        <Button shape="round" htmlType="button" onClick={this.onReset}>重置</Button>
                                    </Form.Item>
                                </Col>
                            </Form>
                        </div>
                        <div style={{ marginTop: '20px' }}>
                            <Table
                                columns={columns}
                                dataSource={dataSource}
                                bordered
                                rowKey="id"
                                pagination={{
                                    onChange: page => {
                                        this.getOrderList(page, pageSize)
                                    },
                                    pageSize: pageSize,
                                    total: totalCount,
                                }}
                            />
                        </div>
                    </Card>
                </div>
            </div>
        )
    }
}

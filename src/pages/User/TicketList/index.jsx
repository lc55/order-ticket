import { Card, Table, Form, message, DatePicker, Button, Checkbox, Row, Col, Select, Modal, Layout } from 'antd'
import React, { Component } from 'react'
import moment from 'moment'
import LinkButton from '../../../components/LinkButton'
import './TicketList.css'

import { getSiteList } from '../../../api/dev/train';
import { moreTicket } from '../../../api/user/search';
import storageUtils from '../../../utils/storageUtils'
import { Link } from 'react-router-dom'
import { userLogout } from '../../../api/user/user'

const { Option } = Select
const format = "YYYY-MM-DD"
const { Header } = Layout
export default class TicketList extends Component {

    state = {
        dataSource: [],
        siteList: [],
        totalCount: 0,
        pageSize: 5,
    }
    // 条件搜索
    searchTicket = async (values) => {
        let { startTime, startId, endId, types } = values
        startTime = moment(startTime).format(format)
        const result = await moreTicket(startId, endId, startTime, !types ? null : types.join(','))
        if (result.code === 1) {
            this.setState({
                dataSource: result.data,
                totalCount: result.totalCount,
            })
        } else {
            message.error(result.msg)
        }
    }

    // 设置不能选择的日期
    disabledDate = (current) => {
        return current && current < moment().subtract(1, 'days')
    }
    async componentDidMount() {
        this.setState({ dataSource: this.props.location.state })
        const result = await getSiteList()
        if (result.code === 1) {
            this.setState({ siteList: result.data })
        } else {
            message.error(result.msg)
        }
    }

    checkLogin = (record) => {
        const { dataSource } = this.state
        const user = storageUtils.getUser()
        if (!record.luxury && !record.ordinal && !record.enco) {
            message.error('该车次没有余座了！')
            return
        }
        if (Object.keys(user).length === 0) {
            Modal.confirm({
                content: '请先进行登录！',
                onOk: async () => {
                    this.props.history.push({ pathname: '/user/login', state: dataSource })
                },
                onCancel: () => {

                }
            })
        } else {
            const data = dataSource.find((item) => {
                if (item.id === record.id) return item
            })
            this.props.history.push({ pathname: '/user/orderTicket', state: data })
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
        const { dataSource, siteList, totalCount, pageSize } = this.state
        const user = storageUtils.getUser()
        const columns = [
            {
                title: '车次',
                dataIndex: 'trainNumber',
                key: '1',
                align: 'center',
            },
            {
                title: '起点站',
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
                title: '出发日期',
                dataIndex: 'startDate',
                key: '4',
                align: 'center',
            },
            {
                title: '出发时间',
                key: '5',
                dataIndex: 'startTime',
                align: 'center',
            },
            {
                title: '到达时间',
                key: '6',
                dataIndex: 'endTime',
                align: 'center',
            },
            {
                title: '历时',
                key: '7',
                dataIndex: 'timeConsume',
                align: 'center',
            },
            ,
            {
                title: '豪华型',
                key: '8',
                dataIndex: 'luxury',
                align: 'center',
                render: (record) => {
                    if (!record) {
                        return "-"
                    } else {
                        return record
                    }
                }
            },
            ,
            {
                title: '普通',
                key: '9',
                dataIndex: 'ordinal',
                align: 'center',
                render: (record) => {
                    if (!record) {
                        return "-"
                    } else {
                        return record
                    }
                }
            },
            ,
            {
                title: '经济',
                key: '10',
                dataIndex: 'econ',
                align: 'center',
                render: (record) => {
                    if (!record) {
                        return "-"
                    } else {
                        return record
                    }
                }
            },
            {
                title: '操作',
                key: '11',
                render: (record) => (
                    // <MyNavLink to="/user/orderTicket">
                    <LinkButton onClick={() => { this.checkLogin(record) }}>预定</LinkButton>
                    // </MyNavLink>
                ),
                align: 'center'
            },
        ]

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
                <div className="search-ticket">
                    <Form name="search-ticket" layout="inline" onFinish={this.searchTicket}>
                        <Form.Item
                            name="startId"
                        >
                            <Select
                                showSearch
                                placeholder="起点"
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {siteList.map((item, _) => {
                                    return <Option key={item.id} value={item.id}>{item.siteName}</Option>
                                })}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="endId"
                        >
                            <Select
                                showSearch
                                placeholder="终点"
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {siteList.map((item, _) => {
                                    return <Option key={item.id} value={item.id}>{item.siteName}</Option>
                                })}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="startTime"
                        >
                            <DatePicker
                                format="YYYY-MM-DD"
                                disabledDate={this.disabledDate}
                            />
                        </Form.Item>
                        <Form.Item
                            name="types"
                            style={{ width: '150px' }}>

                            <Checkbox.Group style={{ width: '100%' }} onChange={this.checkTrainType}>
                                <Row>
                                    <Col span={12}>
                                        <Checkbox value={1}>动车D</Checkbox>
                                    </Col>
                                    <Col span={12}>
                                        <Checkbox value={2}>高铁G</Checkbox>
                                    </Col>
                                </Row>
                            </Checkbox.Group>
                        </Form.Item>
                        <Form.Item >
                            <Button
                                shape="round"
                                style={{ width: '100px', marginLeft: '50px' }}
                                type="primary"
                                htmlType="submit"
                            >
                                查询
                            </Button>
                        </Form.Item>
                    </Form>
                </div>

                <Card
                    bordered={false}
                >
                    <Table
                        columns={columns}
                        dataSource={dataSource}
                        bordered
                        rowKey="id"
                        pagination={{
                            pageSize: pageSize,
                            total: totalCount,
                        }}
                    />
                </Card>
            </div>
        )
    }
}

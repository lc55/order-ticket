import { Form, Input, Space, Button, Card, DatePicker, message, Select } from 'antd'
import React, { Component } from 'react'
import moment from 'moment';
import { getSiteList } from '../../../api/dev/train';
import { moreTicket } from '../../../api/user/search';

const { Option } = Select
const format = "YYYY-MM-DD"
export default class Search extends Component {

    state = {
        siteList: []
    }

    // 设置不可选中时间
    disabledDate = (current) => {
        return current && current < moment().subtract(1, 'days')
    }

    // 查询
    onFinish = async (values) => {
        let { startTime, startId, endId } = values
        startTime = moment(startTime).format(format)
        const result = await moreTicket(startId, endId, startTime)
        if (result.code === 1) {
            this.props.history.push({ pathname: "/user/ticketList", state: result.data })
        } else {
            message.error(result.msg)
        }

    }

    async componentDidMount() {
        const result = await getSiteList()
        if (result.code === 1) {
            this.setState({ siteList: result.data })
        } else {
            message.error(result.msg)
        }
    }

    render() {
        const { siteList } = this.state
        return (
            <div>
                <Card
                    bordered={false}
                >
                    <Form
                        layout="horizontal"
                        onFinish={this.onFinish}
                        labelCol={{ span: 2 }}
                        wrapperCol={{ span: 8 }}
                        style={{ marginLeft: '200px', marginTop: '50px' }}
                    >

                        <Form.Item
                            name="startId"
                            label="出发地"
                            rules={[{ required: true, message: '请输入出发地' }]}
                            required="true"
                        >
                            <Select
                                showSearch
                                placeholder="可以搜索站点"
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
                            label="目的地"
                            rules={[{ required: true, message: '请输入目的地' }]}
                        >
                            <Select
                                showSearch
                                placeholder="可以搜索站点"
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
                            label="出发日期"
                            rules={[{ required: true, message: '请选择出发日期' }]}
                        >
                            <DatePicker
                                format="YYYY-MM-DD"
                                disabledDate={this.disabledDate}
                            />
                        </Form.Item>

                        <div
                            style={{
                                textAlign: 'right',
                                marginTop: '20px',
                                marginRight: '650px'
                            }}
                        >
                            <Space size="large">
                                <Button size="large" shape="round" htmlType="reset" style={{ marginRight: 100 }}>
                                    重置
                                </Button>
                                <Button size="large" shape="round" htmlType="submit" type="primary" style={{ marginRight: 350 }}>
                                    查询
                                </Button>
                            </Space>
                        </div>
                    </Form>
                </Card>
            </div>
        )
    }
}

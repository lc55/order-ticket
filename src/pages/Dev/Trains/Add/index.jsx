import React, { Component } from 'react'
import {
    Input, Card,
    Form, Button, Col, Row, Space, Select, TimePicker, message
} from 'antd';
import moment from 'moment'
import SiteInfo from '../SiteInfo';
import CarriageInfo from '../CarriageInfo'
import MyNavLink from '../../../../components/MyNavLink'
import { addTrain } from '../../../../api/dev/train'
import { createFromIconfontCN } from '@ant-design/icons';
import LinkButton from '../../../../components/LinkButton';

const IconFont = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_2779508_d3ob7o1ykpv.js',
})

const { Option } = Select
const format = 'HH:mm'
export default class TrainAdd extends Component {

    state = {
        siteList: [],
        carriageList: []
    }

    // 添加车次
    addTrain = async (values) => {
        const { siteList, carriageList } = this.state
        const startTime = moment(values.startTime).format('HH:mm')
        const train = { ...values, startTime, siteList, carriageList }
        const result = await addTrain(train)
        if (result.code === 1) {
            message.success('添加成功')
            this.props.history.goBack()
        } else {
            message.error(result.msg)
        }
    }

    addSite = (site) => {
        const { siteList } = this.state
        const newSite = [...siteList, site]
        this.setState({ siteList: newSite })
    }

    addCarriage = (carriage) => {
        const { carriageList } = this.state
        const newCarriage = [...carriageList, carriage]
        this.setState({ carriageList: newCarriage })
    }

    render() {
        return (
            <div>
                <div>
                    <Card
                        title={<span><LinkButton onClick={() => { this.props.history.goBack() }}><IconFont type="anticonlishi-xunchaxiangqing-jiantou" /></LinkButton><span style={{ fontSize: '30px', marginLeft: '40px' }}>新增车次</span></span>}
                    >
                        <Form
                            layout="vertical"
                            onFinish={this.addTrain}
                        >
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="trainNumber"
                                        label="车次"
                                        rules={[{ required: true, message: '请输入车次' }]}
                                        required="true"
                                    >
                                        <Input placeholder="请输入车次" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="isReturn"
                                        label="返程车"
                                        rules={[{ required: true, message: '请选择是否返程' }]}
                                        required="true"
                                    >
                                        <Select placeholder="是否返程" >
                                            <Option value={1}>是</Option>
                                            <Option value={0}>否</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="type"
                                        label="类别"
                                        rules={[{ required: true, message: '请选择类别' }]}
                                        required="true"
                                    >
                                        <Select placeholder="请选择类别">
                                            <Option value={1}>动车</Option>
                                            <Option value={2}>高铁</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="startTime"
                                        label="发车时间"
                                        rules={[{ required: true, message: '请选择发车时间' }]}
                                        required="true"
                                    >
                                        <TimePicker format={format} />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="trainCount"
                                        label="班车数量"
                                        rules={[{ required: true, message: '请输入班车数量' }]}
                                    >
                                        <Input placeholder="请输入班车数量" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        rules={[{ required: true, message: '请输入站点信息' }]}

                                    >
                                        <SiteInfo addSite={this.addSite} />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={20}>
                                    <Form.Item
                                        rules={[{ required: true, message: '请输入车厢信息' }]}
                                    >
                                        <CarriageInfo addCarriage={this.addCarriage} />
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
                                    <MyNavLink to="/dev/trains">
                                        <Button style={{ marginRight: 8 }}>
                                            取消
                                        </Button>
                                    </MyNavLink>
                                    <Button type="primary" htmlType="submit">
                                        确认
                                    </Button>
                                </Space>

                            </div>
                        </Form>
                    </Card>
                </div>
            </div>
        )
    }
}

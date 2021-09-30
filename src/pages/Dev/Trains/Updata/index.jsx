import React, { Component } from 'react'
import {
    Input, Card,
    Form, Button, Col, Row, Space, Select, TimePicker, message
} from 'antd';
import moment from 'moment'
import SiteInfo from '../SiteInfo';
import CarriageInfo from '../CarriageInfo'
import MyNavLink from '../../../../components/MyNavLink'
import { updataTrain, getTrainInfo } from '../../../../api/dev/train'
import { createFromIconfontCN } from '@ant-design/icons';
import LinkButton from '../../../../components/LinkButton';

const IconFont = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_2779508_d3ob7o1ykpv.js',
})

const { Option } = Select
const format = 'HH:mm'
export default class TrainUpdate extends Component {

    state = {
        siteList: [],
        carriageList: [],
        carriages: [],
        site: {},
        isUpdata: 0,
    }

    deleteCarriage = (key) => {
        const carriages = [...this.state.carriages];
        const newDataSource = carriages.filter((item) => {
            if (item.carriageOrder !== key) {
                if (item.carriageOrder > key) {
                    --item.carriageOrder
                }
                return item
            }
        })
        const carriageIdList = newDataSource.map((item) => {
            return item.carriageId
        })
        this.setState({
            carriageList: carriageIdList,
            isUpdata: 1,
        });
    }

    deleteSite = (number) => {
        const siteList = [...this.state.siteList];
        const newDataSource = siteList.filter((item) => {
            if (item.number !== number) {
                if (item.number > number) {
                    --item.number
                }
                return item
            }
        })
        this.setState({
            siteList: newDataSource,
            isUpdata: 1,
        });
    }

    // 判断是否修改过表单
    handleIsUpdata = () => {
        this.setState({ isUpdata: 1 })
    }

    // 更新车次
    updataTrain = async (values) => {
        const { siteList, carriageList, isUpdata } = this.state
        if (isUpdata === 1) {
            const startTime = moment(values.startTime).format('HH:mm')
            const train = { ...values, startTime, siteList, carriageList }
            const result = await updataTrain(train)
            if (result.code === 1) {
                message.success('更新成功')
                this.props.history.goBack()
            } else {
                message.error(result.msg)
            }
        }

    }

    addSite = (site) => {
        const { siteList } = this.state
        const newSite = [...siteList, site]
        this.setState({ siteList: newSite, isUpdata: 1, })
    }

    addCarriage = (carriage) => {
        const { carriageList } = this.state
        const newCarriage = [...carriageList, carriage]
        this.setState({ carriageList: newCarriage, isUpdata: 1, })
    }

    async componentWillMount() {
        const { id } = this.props.match.params
        const result = await getTrainInfo(id)
        if (result.code === 1) {
            const { carriageList } = result.data
            const carriageIdList = carriageList.map((item, _) => {
                return item.carriageId
            })
            this.setState({
                siteList: result.data.siteList,
                carriages: result.data.carriageList,
                site: result.data.baseInfo,
                carriageList: carriageIdList
            })
        } else {
            message.error(result.msg)
        }
    }

    render() {
        const { siteList, carriages, site } = this.state
        return (
            <div>
                <div>
                    <Card
                        title={<span><LinkButton onClick={() => { this.props.history.goBack() }}><IconFont type="anticonlishi-xunchaxiangqing-jiantou" /></LinkButton><span style={{ fontSize: '30px', marginLeft: '40px' }}>编辑车次</span></span>}
                    >
                        {
                            Object.keys(site).length ?
                                <Form
                                    layout="vertical"
                                    onFinish={this.updataTrain}
                                    onValuesChange={this.handleIsUpdata}
                                >
                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <Form.Item
                                                name="trainNumber"
                                                label="车次"
                                                rules={[{ required: true, message: '请输入车次' }]}
                                                required="true"
                                                initialValue={site.trainNumber}
                                            >
                                                <Input placeholder="请输入车次" readOnly />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                name="isReturn"
                                                label="返程车"
                                                rules={[{ required: true, message: '请选择是否返程' }]}
                                                required="true"
                                                initialValue={site.isReturn}
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
                                                initialValue={site.type}
                                            >
                                                <Select placeholder="类别">
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
                                                initialValue={moment(site.startTime, format)}
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
                                                initialValue={site.shift}
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
                                                <SiteInfo addSite={this.addSite} deleteSite={this.deleteSite} siteList={siteList} />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={16}>
                                        <Col span={20}>
                                            <Form.Item
                                                rules={[{ required: true, message: '请输入车厢信息' }]}
                                            >
                                                <CarriageInfo addCarriage={this.addCarriage} deleteCarriage={this.deleteCarriage} carriageList={carriages} />
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
                                </Form> : null
                        }
                    </Card>
                </div>
            </div>
        )
    }
}

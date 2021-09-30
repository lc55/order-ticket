import React, { Component } from 'react'
import {
    Input, List, Card, Pagination,
    Drawer, Form, Button, Col, Row, Space, Select, message
} from 'antd';
import {
    PlusOutlined
} from '@ant-design/icons';
import './site.css'
import { addSite, listSite } from '../../../api/dev/site'

const { Search } = Input
const { Option } = Select

export default class Site extends Component {

    state = {
        visible: false,
        siteList: [],
        curPage: 1,
        totalCount: 0,
        pageSize: 5
    }

    onSearch = (value) => {
        const { curPage, pageSize } = this.state
        this.getSiteList(curPage, pageSize, value)
    }
    // 打开抽屉
    showDrawer = () => {
        this.setState({
            visible: true,
        });
    }
    // 关闭抽屉
    onClose = () => {
        this.setState({
            visible: false,
        });
    }

    onFinish = async (values) => {
        this.setState({ visible: false })
        const site = { ...values }
        const result = await addSite(site)
        if (result.code === 1) {
            message.success('添加成功！')
        } else {
            message.error(result.msg)
        }
    }

    // 组件挂载完毕的时候去拉数据库，获取站点列表
    componentDidMount() {
        const { curPage, pageSize } = this.state
        this.getSiteList(curPage, pageSize)
    }

    async getSiteList(pageNum, pageSize, key) {
        const result = await listSite(pageNum, pageSize,key)
        if (result.code === 1) {
            this.setState({
                siteList: result.data,
                totalCount: result.totalCount,
                pageSize: result.pageSize
            })
        } else {
            message.error(result.msg)
        }
    }

    render() {
        const { siteList, totalCount, pageSize } = this.state
        return (
            <div>
                <div>
                    <div>
                        <Card
                            title={<span style={{ fontSize: '30px' }}>车厢管理</span>}
                            extra={<Button icon={<PlusOutlined />} type="primary" onClick={this.showDrawer} >新增</Button>}
                        >
                            <Search style={{ width: '300px' }} placeholder="名称、首字母、简拼" onSearch={this.onSearch} enterButton />
                            <br />
                            <br />
                            <List
                                className="site-list"
                                grid={{ gutter: 16, column: 4 }}
                                pagination={{
                                    onChange: page => {
                                        this.getSiteList(page, pageSize)
                                    },
                                    pageSize: pageSize,
                                    total: totalCount,
                                }}
                                dataSource={siteList}
                                renderItem={item => (
                                    <List.Item>
                                        <Card style={{ textAlign: 'center' }}>{item.siteName}</Card>
                                    </List.Item>
                                )}

                            />
                        </Card>
                    </div>
                </div>
                {/* 新增的抽屉 */}
                <div>
                    <Drawer
                        title="新建站点"
                        width={550}
                        onClose={this.onClose}
                        visible={this.state.visible}
                        bodyStyle={{ paddingBottom: 80 }}
                    >
                        <Form
                            layout="vertical"
                            onFinish={this.onFinish}
                        >
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="siteName"
                                        label="站点名称"
                                        rules={[{ required: true, message: '请输入站点名称' }]}
                                        required="true"
                                    >
                                        <Input placeholder="请输入站点名称" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="initials"
                                        label="首字母"
                                        rules={[{ required: true, message: '请输入首字母' }]}
                                    >
                                        <Select placeholder="请输入首字母" >
                                            <Option value="A">A</Option>
                                            <Option value="B">B</Option>
                                            <Option value="C">C</Option>
                                            <Option value="D">D</Option>
                                            <Option value="E">E</Option>
                                            <Option value="F">F</Option>
                                            <Option value="G">G</Option>
                                            <Option value="H">H</Option>
                                            <Option value="I">I</Option>
                                            <Option value="J">J</Option>
                                            <Option value="K">K</Option>
                                            <Option value="L">L</Option>
                                            <Option value="M">M</Option>
                                            <Option value="N">N</Option>
                                            <Option value="O">O</Option>
                                            <Option value="P">P</Option>
                                            <Option value="Q">Q</Option>
                                            <Option value="R">R</Option>
                                            <Option value="S">S</Option>
                                            <Option value="T">T</Option>
                                            <Option value="U">U</Option>
                                            <Option value="V">V</Option>
                                            <Option value="W">W</Option>
                                            <Option value="X">X</Option>
                                            <Option value="Y">Y</Option>
                                            <Option value="Z">Z</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="abbreviation"
                                        label="简拼"
                                        rules={[{ required: true, message: '请输入简拼' }]}
                                    >
                                        <Input placeholder="请输入简拼" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="longitude"
                                        label="经度"
                                        rules={[{ required: true, message: '请输入经度' }]}
                                    >
                                        <Input placeholder="请输入经度" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="latitude"
                                        label="纬度"
                                        rules={[{ required: true, message: '请输入纬度' }]}
                                    >
                                        <Input placeholder="请输入纬度" />
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

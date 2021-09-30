import React, { Component } from 'react';
import { Card, Button, Table, Modal, Space, Form, Select, Popconfirm, Divider, message, Input } from 'antd'
import {
    PlusOutlined
} from '@ant-design/icons';
import LinkButton from '../../../../components/LinkButton';
import { getSiteList } from '../../../../api/dev/train';


const { Option } = Select
export default class SiteInfo extends Component {

    state = {
        showStatus: 0,
        number: 1,
        dataSource: [],
        sites: [],
        siteId: 0,
    }

    addSite = async () => {
        // 调用接口拿数据
        const result = await getSiteList()
        if (result.code === 1) {
            this.setState({ showStatus: 1, sites: result.data })
        } else {
            message.error(result.msg)
        }

    }

    // 处理点击取消
    handleCancel = () => {
        this.setState({ showStatus: 0 })
    }

    // 表单提交
    onFinish = (values) => {
        const { dataSource, number, siteId } = this.state
        const v = { number, ...values }
        v.number = number
        v.siteId = siteId
        v.key = siteId
        const newData = [...dataSource, v]
        const { useTime } = values
        const site = { siteId, useTime, number }
        this.props.addSite(site)
        this.setState({ showStatus: 0, dataSource: newData, number: number + 1 })
    }

    handleDelete = (number) => {
        const dataSource = [...this.state.dataSource];
        const newDataSource = dataSource.filter((item) => {
            if (item.number !== number) {
                if (item.number > number) {
                    --item.number
                }
                return item
            }
        })
        this.props.deleteSite(number)
        if (newDataSource.length === 0) this.setState({ count: 1 })
        this.setState({
            dataSource: newDataSource,
        });
    }

    // 处理选中站点
    handleSelect = (_, value) => {
        this.setState({ siteId: value.key })
    }
    componentDidMount() {
        let { siteList } = this.props
        if (!siteList) return
        let { number } = this.state
        const newList = siteList.map((item, _) => {
            item.number = number
            number++
            item.useTime = item.timeConsume
            return item
        })
        this.setState({ dataSource: newList, number })
    }
    render() {

        let { showStatus, dataSource, sites } = this.state

        const columns = [
            {
                title: '序号',
                dataIndex: 'number',
                key: '1',
                align: 'center',
            },
            {
                title: '到达城市',
                dataIndex: 'siteName',
                key: '2',
                align: 'center',
            },
            {
                title: '用时（分）',
                dataIndex: 'useTime',
                key: '3',
                align: 'center',
            }
            ,
            {
                title: '操作',
                key: '4',
                align: 'center',
                render: (_, record) =>
                    this.state.dataSource.length >= 1 ? (
                        <div>
                            <Popconfirm title="确定删除吗" onConfirm={() => this.handleDelete(record.number)}>
                                <LinkButton >删除</LinkButton>
                            </Popconfirm>
                        </div>
                    ) : null,
            }
        ];

        return (
            <div>
                <div>
                    <Card
                        title={<Divider orientation="left" plain>
                            <Button shape='round'>站点信息</Button>
                        </Divider>}
                        size='small'
                        extra={<Button onClick={this.addSite} icon={<PlusOutlined />} type="primary" style={{ marginRight: '20px' }}></Button>}
                    >
                        <Table
                            columns={columns}
                            dataSource={dataSource}
                            bordered
                            rowKey="number"
                            pagination={false}
                        />
                    </Card>
                </div>
                {/* 添加车厢信息的模态窗口 */}
                <div>
                    <Modal
                        title="添加车厢信息"
                        visible={showStatus === 1}
                        onOk={this.handleAdd}
                        onCancel={this.handleCancel}
                        footer={[]}
                        width='800px'
                        style={{ top: 100 }}
                        destroyOnClose='true'
                    >
                        <Form
                            layout="vertical"
                            onFinish={this.onFinish}
                        >
                            <Form.Item
                                name="siteName"
                                label="站点"
                                rules={[{ required: true, message: '请选择站点' }]}

                            >
                                <Select
                                    showSearch
                                    placeholder="可以搜索站点"
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    onSelect={this.handleSelect}
                                >
                                    {sites.map((item, _) => {
                                        return <Option key={item.id} value={item.siteName}>{item.siteName}</Option>
                                    })}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="useTime"
                                label="用时"
                                rules={[{ required: true, message: '请输入用时' }]}

                            >
                                <Input placeholder="请输入用时" />
                            </Form.Item>
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

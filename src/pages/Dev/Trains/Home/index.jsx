import React, { Component } from 'react'
import { Card, Button, Table, Space, message } from 'antd'
import {
    PlusOutlined
} from '@ant-design/icons';
import LinkButton from '../../../../components/LinkButton';
import MyNavLink from '../../../../components/MyNavLink'
import { getTrainList } from '../../../../api/dev/train';

export default class TrainsHome extends Component {

    state = {
        trainList: [],
        pageNum: 1,
        pageSize: 5,
        totalCount: 0
    }

    componentDidMount() {
        const { pageSize, pageNum } = this.state
        this.getTrainList(pageNum, pageSize)
    }

    async getTrainList(pageNum, pageSize) {
        // 拉取列表数据
        const result = await getTrainList(pageNum, pageSize)
        if (result.code === 1) {
            this.setState({ trainList: result.data, totalCount: result.totalCount })
        } else {
            message.error(result.msg)
        }
    }

    render() {
        const { trainList, totalCount, pageSize } = this.state
        const columns = [
            {
                title: '车次',
                dataIndex: 'trainNumber',
                key: '1',
                align: 'center',
            },
            {
                title: '类别',
                dataIndex: 'type',
                key: '2',
                align: 'center',
                render: (type) => {
                    return type === 1 ? '动车' : '高铁'
                }
            },
            {
                title: '起点',
                dataIndex: 'startName',
                key: '3',
                align: 'center',
            },
            {
                title: '终点',
                key: '4',
                dataIndex: 'endName',
                align: 'center',
            },
            {
                title: '发车时间',
                key: '5',
                dataIndex: 'startTime',
                align: 'center',
            },
            {
                title: '耗时',
                key: '6',
                dataIndex: 'timeConsume',
                align: 'center',
            },
            {
                title: '车厢',
                key: '7',
                dataIndex: 'carriage',
                align: 'center',
            },
            {
                title: '是否返程',
                dataIndex: 'isReturn',
                key: '8',
                align: 'center',
                render: (isReturn) => {
                    return isReturn === 0 ? '否' : '是'
                }
            },
            {
                title: '状态',
                key: '9',
                dataIndex: 'trainStatus',
                align: 'center',
                render: (trainStatus) => {
                    return trainStatus === 0 ? '禁用' : '启用'
                }
            },
            {
                title: '操作',
                key: '9',
                render: (train) => (
                    <Space size="middle">
                        {/* <MyNavLink to="/dev/home/trains/addupdate"> */}
                        <LinkButton onClick={() => { this.props.history.push(`/dev/home/trains/update/${train.id}`) }}>编辑</LinkButton>
                        {/* </MyNavLink> */}
                    </Space>
                ),
                align: 'center'
            },
        ]
        return (
            <div >
                <div>
                    <Card
                        title={<span style={{ fontSize: '30px' }}>车次管理</span>}
                        extra={
                            <MyNavLink to="/dev/home/trains/add">
                                <Button icon={<PlusOutlined />} type="primary" >新增</Button>
                            </MyNavLink>
                        }
                    >
                        <Table
                            columns={columns}
                            dataSource={trainList}
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
            </div >
        )
    }
}

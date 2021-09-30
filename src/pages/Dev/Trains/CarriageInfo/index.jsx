import React, { useContext, useState, useEffect, useRef } from 'react';
import { Card, Button, Table, Modal, Space, Form, Input, Select, Popconfirm, Divider, message } from 'antd'
import {
    PlusOutlined
} from '@ant-design/icons';

import LinkButton from '../../../../components/LinkButton';
import { getCarriageList } from '../../../../api/dev/train';
import { carriageInfo } from '../../../../api/dev/carriage';
const { Option } = Select
const EditableContext = React.createContext(null);

const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};

const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
}) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
        if (editing) {
            inputRef.current.focus();
        }
    }, [editing]);

    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({
            [dataIndex]: record[dataIndex],
        });
    };

    const save = async () => {
        try {
            const values = await form.validateFields();
            toggleEdit();
            handleSave({ ...record, ...values });
        } catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
    };

    let childNode = children;

    if (editable) {
        childNode = editing ? (
            <Form.Item
                style={{
                    margin: 0,
                }}
                name={dataIndex}
                rules={[
                    {
                        required: true,
                        message: `${title}是必填的`,
                    },
                ]}
            >
                <Input ref={inputRef} onPressEnter={save} onBlur={save} />
            </Form.Item>
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{
                    paddingRight: 24,
                }}
                onClick={toggleEdit}
            >
                {children}
            </div>
        );
    }

    return <td {...restProps}>{childNode}</td>;
};

export default class CarriageInfo extends React.Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title: '车厢序号',
                dataIndex: 'carriageOrder',
                key: '2',
                align: 'center',
            },
            {
                title: '车厢编号',
                dataIndex: 'carriageNumber',
                key: '3',
                align: 'center',
                editable: true,
            },
            {
                title: '类别',
                dataIndex: 'type',
                key: '4',
                align: 'center',
                editable: true,
            },
            {
                title: '座位数',
                dataIndex: 'seatNumber',
                key: '5',
                align: 'center',
                editable: true,
            },
            {
                title: '价格基数',
                dataIndex: 'priceBase',
                key: '6',
                align: 'center',
                editable: true,
            },
            {
                title: '操作',
                align: 'center',
                render: (_, record) =>
                    this.state.dataSource.length >= 1 ? (
                        <div>
                            <Popconfirm title="确定删除吗" onConfirm={() => this.handleDelete(record.carriageOrder)}>
                                <LinkButton >删除</LinkButton>
                            </Popconfirm>
                        </div>
                    ) : null,
            },
        ];
        this.state = {
            dataSource: [],
            count: 1,
            showStatus: 0,
            carriages: [],
            carriageOrder: 1,
        }
    }


    handleDelete = (key) => {
        const dataSource = [...this.state.dataSource];
        const newDataSource = dataSource.filter((item) => {
            if (item.carriageOrder !== key) {
                if (item.carriageOrder > key) {
                    --item.carriageOrder
                }
                return item
            }
        })
        this.props.deleteCarriage(key)
        if (newDataSource.length === 0) this.setState({ count: 1 })
        this.setState({
            dataSource: newDataSource,
        });
    }
    handleAdd = async () => {
        // 调接口拿数据
        const result = await getCarriageList()
        if (result.code === 1) {
            this.setState({ showStatus: 1, carriages: result.data })
        } else {
            message.error(result.msg)
        }
    }
    handleSave = (row) => {
        const newData = [...this.state.dataSource];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        this.setState({
            dataSource: newData,
        });
    }

    // 处理点击取消
    handleCancel = () => {
        this.setState({ showStatus: 0 })
    }

    // 表单提交
    onFinish = async (values) => {
        const result = await carriageInfo(values.carriageId)
        if (result.code === 1) {
            const { dataSource, carriages } = this.state
            const { data } = result
            const newData = {
                key: values.carriageId,
                carriageOrder: dataSource.length + 1,
                carriageNumber: data.carriageNumber,
                type: data.levelCar === 1 ? '豪华' : (data.levelCar === 2 ? '普通' : '经济'),
                seatNumber: data.seatCount,
                priceBase: data.priceBase,
            }
            const newCarriageLists = carriages.filter((item) => {
                return item.id !== values.carriageId
            })
            this.props.addCarriage(values.carriageId)
            this.setState({
                dataSource: [...dataSource, newData],
                count: dataSource.length + 1,
                carriages: carriages
            })
            this.setState({ showStatus: 0 })
        } else {
            message.error(result.msg)
        }

    }

    componentDidMount() {
        let { carriageOrder } = this.state
        let { carriageList } = this.props
        if (!carriageList) return
        const newList = carriageList.map((item, _) => {
            item.carriageOrder = carriageOrder
            carriageOrder++
            item.type = item.levelCar === 1 ? '豪华' : (item.levelCar === 2 ? '普通' : '经济')
            item.seatNumber = item.seatCount
            return item
        })
        this.setState({ dataSource: newList, carriageOrder })
    }

    render() {
        let { showStatus, dataSource, carriages } = this.state
        const components = {
            body: {
                row: EditableRow,
                cell: EditableCell,
            },
        };
        const columns = this.columns.map((col) => {
            if (!col.editable) {
                return col;
            }

            return {
                ...col,
                onCell: (record) => ({
                    record,
                    editable: col.editable,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    handleSave: this.handleSave,
                }),
            };
        });
        return (
            <div>
                <div>
                    <Card
                        title={<Divider orientation="left" plain>
                            <Button shape='round'>车厢信息</Button>
                        </Divider>}
                        size='small'
                        extra={<Button onClick={this.handleAdd} icon={<PlusOutlined />} type="primary" style={{ marginRight: '100px' }}></Button>}
                    >
                        <Table
                            components={components}
                            rowClassName={() => 'editable-row'}
                            bordered
                            dataSource={dataSource}
                            columns={columns}
                            rowKey="carriageOrder"
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
                                name="carriageId"
                                label="车厢"
                                rules={[{ required: true, message: '请选择车厢' }]}

                            >
                                <Select
                                    showSearch
                                    placeholder="可以搜索车厢编号"
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    onSelect={this.handleSelect}
                                >
                                    {carriages.map((item, _) => {
                                        return <Option key={item.id} value={item.id}>{item.carriageNumber}</Option>
                                    })}
                                </Select>
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
        );
    }
}
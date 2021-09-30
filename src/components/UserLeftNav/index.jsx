import React, { Component } from 'react'
import { Menu } from 'antd';
import MyNavLink from '../MyNavLink';
import { createFromIconfontCN } from '@ant-design/icons';

const IconFont = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_2779508_d3ob7o1ykpv.js',
})
export default class UserLeftNav extends Component {
    render() {
        return (
            <div>
                <Menu mode="inline" >
                    <Menu.Item key="1" icon={<IconFont type="anticongerenzhongxin-zhong" />}>
                        <MyNavLink to="/user/home/center">
                            个人中心
                        </MyNavLink>
                    </Menu.Item>
                    <Menu.Item key="2" icon={<IconFont type="anticonwodedingdan" />}>
                        <MyNavLink to="/user/home/myOrder">
                            我的订单
                        </MyNavLink>
                    </Menu.Item>
                    <Menu.Item key="3" icon={<IconFont type="anticonicn_chengkexinxi" />}>
                        <MyNavLink to="/user/home/passenger">
                            乘客信息
                        </MyNavLink>
                    </Menu.Item>
                </Menu>
            </div>
        )
    }
}

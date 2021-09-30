import React, { Component } from 'react'
import MyNavLink from '../MyNavLink';
import { Menu } from 'antd';
import { createFromIconfontCN } from '@ant-design/icons';

const IconFont = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_2779508_d3ob7o1ykpv.js',
})
export default class DevLeftNav extends Component {
    render() {
        return (
            <div>
                <Menu mode="inline">
                    <Menu.Item key="1" icon={<IconFont type="anticonorder-site" />}>
                        <MyNavLink to="/dev/home/site">
                            站点管理
                        </MyNavLink>
                    </Menu.Item>
                    <Menu.Item key="2" icon={<IconFont type="anticonchexiang" />}>
                        <MyNavLink to="/dev/home/carriage">
                            车厢管理
                        </MyNavLink>
                    </Menu.Item>
                    <Menu.Item key="3" icon={<IconFont type="anticonchecizhongxin" />}>
                        <MyNavLink to="/dev/home/trains">
                            车次管理
                        </MyNavLink>
                    </Menu.Item>
                    <Menu.Item key="4" icon={<IconFont type="anticondingpiao" />}>
                        <MyNavLink to="/dev/home/order">
                            订票管理
                        </MyNavLink>
                    </Menu.Item>
                    <Menu.Item key="5" icon={<IconFont type="anticonpingtaiyonghu" />}>
                        <MyNavLink to="/dev/home/platform">
                            平台用户
                        </MyNavLink>
                    </Menu.Item>
                </Menu>
            </div>
        )
    }
}

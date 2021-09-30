import React, { Component } from 'react'
import { Button } from 'antd';
import './root.css'
import MyNavLink from '../../components/MyNavLink';

export default class Root extends Component {
    render() {
        return (
            <div className="root">
                <div className="root-user">
                    <MyNavLink to="/user">
                        <Button type="primary" size="large" >用户端</Button>
                    </MyNavLink>
                </div>
                <div className="root-dev">
                    <MyNavLink to="/dev">
                        <Button type="primary" size="large">运维端</Button>
                    </MyNavLink>
                </div>
            </div>
        )
    }
}

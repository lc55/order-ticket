import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import storageUtils from '../../../utils/storageUtils'

export default class center extends Component {
    render() {
        const user = storageUtils.getUser()
        return (
            <div>
                {
                    Object.keys(user).length === 0 ? <span>请先<Link to="/user/login">登录</Link></span> : <p>手机号码：{user.phone}</p>
                }
            </div>
        )
    }
}

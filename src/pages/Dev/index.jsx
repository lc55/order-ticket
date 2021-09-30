import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Home from './Home'
import Login from './Login'

export default class Dev extends Component {
    render() {
        return (
            <div>
                <Switch>
                    <Route path="/dev/login" component={Login} />
                    <Route path="/dev/home" component={Home} />
                    <Redirect to="/dev/login" />
                </Switch>
            </div>
        )
    }
}

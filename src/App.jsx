import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import Root from './pages/Root'
import './app.css'
import '../node_modules/antd/dist/antd.css'
import Dev from './pages/Dev'
import User from './pages/User'

export default class App extends Component {
  render() {
    return (
      <Switch>
        <Route path="/user" component={User} />
        <Route path="/dev" component={Dev} />
        <Route path="/" component={Root} />
      </Switch>
    )
  }
}

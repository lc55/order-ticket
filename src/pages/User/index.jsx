import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Home from './Home'
import Complete from './Complete'
import Login from './Login'
import OrderInfo from './OrderInfo'
import OrderTicket from './OrderTicket'
import Register from './Register'
import Search from './Search'
import TicketList from './TicketList'

export default class User extends Component {
    render() {
        return (
            <div>
                <Switch>
                    <Route path="/user/search" component={Search} />
                    <Route path="/user/ticketList" component={TicketList} />
                    <Route path="/user/register" component={Register} />
                    <Route path="/user/login" component={Login} />
                    <Route path="/user/orderTicket" component={OrderTicket} />
                    <Route path="/user/orderInfo" component={OrderInfo} />
                    <Route path="/user/orderComplete" component={Complete} />
                    <Route path="/user/home" component={Home} />
                    <Redirect to="/user/search" />
                </Switch>
            </div>
        )
    }
}

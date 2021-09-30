import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom';
import TrainsHome from './Home'
import TrainsAdd from './Add'
import TrainsUpdata from './Updata'


export default class Trains extends Component {

    render() {
        return (
            <Switch>
                <Route path='/dev/home/trains/index' component={TrainsHome} />
                <Route path='/dev/home/trains/add' component={TrainsAdd} />
                <Route path='/dev/home/trains/update/:id' component={TrainsUpdata} />
                <Redirect to='/dev/home/trains/index' />
            </Switch>
        )
    }
}

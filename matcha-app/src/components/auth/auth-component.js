import React, { Component } from "react";
import { getJwt } from "./jwt-helper.js";
import axios from "axios";
var ip = require("../../server.json").ip;

export default class Authenticated extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: undefined
        }
    }

    componentDidMount() {
        const jwt = getJwt();

        if(!jwt) {
            this.props.history.push('/login');
        } else {
            axios.post(ip+'/auth/getUser', { headers: { Authorization: `bearer ${jwt}` } }).then(res => {
                this.setState({user: res.data});
            }).catch(err => {
                localStorage.removeItem('token');
                this.props.history.push('/login'); 
            });
        }

        console.log(jwt);
    }

    render() {
        return (
        <div>
            Hello from auth
        </div>
        )
    }
}
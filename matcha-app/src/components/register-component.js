import React, { Component } from 'react';
import "../styles/overload.css";
import "../styles/helpers.css";
import "../styles/index.css";
import axios from 'axios'; 
import iplocation from 'iplocation';
import '../../node_modules/font-awesome/css/font-awesome.min.css';
import { Link } from 'react-router-dom';
const ip = require("../server.json").ip;
// import "../styles/debug.css";

export default class Register extends Component {
    constructor(props) {
        super(props);

        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeSurname = this.onChangeSurname.bind(this);
        this.onChangePwd = this.onChangePwd.bind(this);
        this.onChangePwdCon = this.onChangePwdCon.bind(this);
        this.onChangeAge = this.onChangeAge.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.setLocationFromIp = this.setLocationFromIp.bind(this);

        this.state = {
            name: '',
            surname: '',
            age: '',
            pwd: '',
            pwdCon: '',
            email: '',
            gender: '',
            img: '',
            registered: false,
            location: [],
            pwdErr: '',
            pwdConErr: '',
            nameErr: '',
            surnameErr: '',
            ageErr: '',
            emailErr: '',
            genderErr: '',
            imageErr: '',
        };
    }

    
    componentDidMount() {
        this.setLocationFromIp()
    }
    async setLocationFromIp() {
        // Get user ip from cloudflare api
        axios.get('https://www.cloudflare.com/cdn-cgi/trace').then(res => {
            const rawIpData = res.data.split('=')
            const ip = (rawIpData[3].slice(0, -2)).trim()
            // Get location from based on ip
            iplocation(ip).then(res => {
                this.setState({ location: [
                        res.country,
                        res.region,
                        res.city,
                        res.postal,
                        res.longitude,
                        res.latitude
                    ]
                })
            })
        })
    }
    
    onChangeName(e) {
        this.setState({name: e.target.value});
    }
    
    onChangeSurname(e) {
        this.setState({surname: e.target.value});
    }

    onChangePwd(e) {
        this.setState({pwd: e.target.value});
    }    

    onChangeEmail(e) {
        this.setState({email: e.target.value});
    }

    onChangePwdCon(e) {
        this.setState({pwdCon: e.target.value});
    }

    onChangeAge(e) {
        this.setState({age: e.target.value});
    }

    onChangeGender = e => {
        this.setState({gender: e.target.value});
    }

    validateForm = () => {
        const values = this.state;
        let valid = true;

        if (values.name.trim() === "") {
            valid = false;
            this.setState({nameErr: 'Please fill in your name!'});    
        } else if (!values.name.match(/^[A-Za-z\s]+$/)) {
            valid = false;
            this.setState({nameErr: 'Your name can only contain letters!'});   
        } else {
            this.setState({nameErr: ''});
        }

        if (values.surname.trim() === "") {
            valid = false;
            this.setState({surnameErr: 'Please fill in your surname!'});    
        } else if (!values.surname.match(/^[A-Za-z\s]+$/)) {
            valid = false;
            this.setState({surnameErr: 'Your surname can only contain letters!'});   
        } else {
            this.setState({surnameErr: ''});
        }

        if (values.age === "") {
            valid = false;
            this.setState({ageErr: 'Please fill in your age!'});    
        } else if (!values.age.match(/^[0-9]+$/)) {
            valid = false;
            this.setState({ageErr: 'Your age can only contain numbers'});
        } else if (values.age.length > 3) {
            valid = false;
            this.setState({ageErr: 'invalid age'});
        } else {
            let age = parseInt(values.age);
            if (age < 18) {
                valid = false;
                this.setState({ageErr: 'You must 18 years or older to join!'});
            } else if (age > 125) {
                valid = false;
                this.setState({ageErr: "You're too old bruh!"});
            }
            else {
                this.setState({ageErr: ''});
            }
        }

        if (values.pwd === "") {
            valid = false;
            this.setState({pwdErr: 'Please fill in your password!'});    
        } else {
            if (values.pwd.length < 5) {
                valid = false;
                this.setState({pwdErr: 'Password has to more than 5 characters'});
            } else if (!values.pwd.match(/[A-Z]+/)) {
                valid = false;
                this.setState({pwdErr: 'Your needs to contain uppercase letters!'});
            } else if (!values.pwd.match(/[0-9]+/)) {
                valid = false;
                this.setState({pwdErr: 'Your needs to contain numbers!'});
            } else {
                this.setState({pwdErr: ''});
            }
        }

        if (values.pwdCon === "") {
            valid = false;
            this.setState({pwdConErr: 'Please fill in your confimation password!'});
        } else {
            if (values.pwd !== values.pwdCon) {
                valid = false;
                this.setState({pwdConErr: "Passwords don't match"});
            } else {
                this.setState({pwdConErr: ''});
            }
        }

        if (values.email === "") {
            valid = false;
            this.setState({emailErr: 'Please fill in your email!'});    
        } else {
            if (!values.email.match(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/)){
                valid = false;
                this.setState({emailErr: 'Invalid email address!'});  
            } else {
                this.setState({emailErr: ''});
            }
        }

        if (values.gender === "") {
            valid = false;
            this.setState({genderErr: 'Select your gender!'});    
        } else {
            this.setState({genderErr: ''});
        }
        return valid;
    }

    onSubmit = async e => {
            e.preventDefault();

            if (this.validateForm()) {
                let email = { email: this.state.email };
                axios.post(ip+"/users/email", email).then(res => { if (res.data.present !== 1) {
                        var gender = 0;
                        if (this.state.gender === 'f')
                            gender = 1;
                        if (this.state.gender === 'm')
                            gender = -1;
                        const dat = {
                            name: this.state.name,
                            last: this.state.surname,
                            password: this.state.pwd,
                            gender: gender,
                            age: this.state.age,
                            email: this.state.email,
                            sexual_pref: 0,
                            location: this.state.location
                        }
                        console.log(dat);
                        console.log(ip);
                        console.log(this.props.history);
                        axios.post(ip+"/users/add", dat).then( this.props.history.push('/invite')
                        ).catch(err => (console.log("Error adding user" + err)));
                    } else {
                        console.log("Email in use");
                        this.setState({emailErr: 'Email already in use!'});
                    }
             });
            }
            //test is email is available

        }
    render () {
        return (
        <section className="section hero">
        <nav className="navbar hero-head">
            <div className="container">
                <div className="navbar-brand">
                    <figure className="navbar-item image">
                        <img src={require('../images/logo.png')} className="logo_use" alt="Why is this logo broken"/>
                    </figure>
                    <span className="navbar-burger burger" data-target="navMenu">
                        <span></span>
                        <span></span>
                        <span></span>
                    </span>
                </div>
                <div id="navMenu" className="navbar-menu">
                    <div className="navbar-end">
                        <Link to="/login" className="navbar-item has-text-info">Login</Link>
                    </div>
                </div>
            </div>
        </nav>
        {/* <div className="container"> */}
            <div className="columns is-centered shadow">
                <div className="column is-half bg_white">
                    <div className="column center">

                        <div className="field">
                            <label className="label">Name</label>
                            <div className="control">
                                <input className="input" type="text" placeholder="Name" value={this.state.name} onChange={this.onChangeName} required/>
                            </div>
                            <p className="help is-danger">{this.state.nameErr}</p>
                        </div>

                        <div className="field">
                            <label className="label">Surname</label>
                            <div className="control">
                                <input className="input" type="text" placeholder="Surname" value={this.state.surname} onChange={this.onChangeSurname} required/>
                            </div>
                            <p className="help is-danger">{this.state.surnameErr}</p>
                        </div>

                        <div className="field">
                            <label className="label">Age</label>
                            <div className="control">
                                <input className="input" type="text" placeholder="Age" value={this.state.age} onChange={this.onChangeAge} required/>
                            </div>
                            <p className="help is-danger">{this.state.ageErr}</p>
                        </div>

                        <div className="field">
                            <label className="label">Password</label>
                            <div className="control has-icons-left">
                                <input className="input" type="password" placeholder="Password" value={this.state.pwd} onChange={this.onChangePwd} required/>
                                <span className="icon is-small is-left">
                                    <i className="fa fa-user"></i>
                                </span>
                            </div>
                            <p className="help is-danger">{this.state.pwdErr}</p>
                        </div>

                        <div className="field">
                            <label className="label">Password Comfirm</label>
                            <div className="control has-icons-left">
                                <input className="input" type="password" placeholder="Confirm Password" value={this.state.pwdCon} onChange={this.onChangePwdCon} required/>
                                <span className="icon is-small is-left">
                                    <i className="fa fa-user"></i>
                                </span>
                            </div>
                            <p className="help is-danger">{this.state.pwdConErr}</p>
                        </div>

                        <div className="field">
                            <label className="label">Email</label>
                            <div className="control has-icons-left has-icons-right">
                                <input className="input" type="email" pla
                                ceholder="Email input" value={this.state.email} onChange={this.onChangeEmail} required />
                                <span className="icon is-small is-left">
                                    <i className="fa fa-envelope"></i>
                                </span>
                                <span className="icon is-small is-right">
                                    <i className="fa fa-exclamation-triangle"></i>
                                </span>
                            </div>
                            <p className="help is-danger">{this.state.emailErr}</p>
                        </div>

                        <div className="field">
                            <label className="label">Gender</label>
                            <div className="control">
                                <label className="radio">
                                    <input type="radio" name="question" value="m" onChange={this.onChangeGender} checked={this.state.gender === 'm'}/>
                                    Male
                                </label>
                                <label className="radio">
                                    <input type="radio" name="question" value="f" onChange={this.onChangeGender} checked={this.state.gender === 'f'}/>
                                    Female
                                </label>
                            </div>
                            <p className="help is-danger">{this.state.genderErr}</p>
                        </div>

                        <div className="field is-grouped">
                            <div className="control">
                                <button className="button is-warning is-rounded" onClick={this.onSubmit}>Submit</button>
                            </div>
                            <div className="control">
                                <button className="button is-warning is-rounded is-light">Cancel</button>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            {/* </div> */}
    </section>
        )
    }
}
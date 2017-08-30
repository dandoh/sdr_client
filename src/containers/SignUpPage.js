import React from 'react';
import {withRouter} from "react-router";
import Paper from 'material-ui/Paper'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import TextField from 'material-ui/TextField'
import Divider from 'material-ui/Divider'
import Constants from '../constants';

class SignUpPage extends React.Component {

  constructor() {
    super();
    this.state = {
      email: "",
      username: "",
      password: "",
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render() {
    return (
      <div style={{
        backgroundImage: "url(./background_blur.jpg)",
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'
      }}>
        <div style={{width: '80vh', display: 'flex', flexDirection: 'row'}}>
          <Paper style={{flex: 3, height: '90vh', display: 'flex', flexDirection: 'column', radius: '10px'}}>
            <div style={{
              backgroundImage: "url(./background.jpg)",
              backgroundSize: '100% 100%',
              flex: 2,
              display: 'flex'
            }}>
              <div style={{
                backgroundColor: 'rgba(96, 95, 95, 0.6)',
                backgroundSize: '100% 100%',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                padding: '5vh'
              }}>
                <div style={{
                  font: 'roboto',
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '10vh'
                }}>SDR</div>
                <div style={{
                  font: 'roboto',
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontSize: '4vh'
                }}>Scoville Daily Reporting System</div>

              </div>
            </div>
            <Divider/>
            <div style={{
              flex: 3,
              display: 'flex',
              flexDirection: 'column',
              paddingLeft: '5vh',
              paddingRight: '5vh'
            }}>
              <TextField
                style={{marginTop: '2vh'}}
                value={this.state.email}
                name="email"
                onChange={(_, val) => this.setState({email: val})}
                floatingLabelText="Email"
                autoComplete="off"
                fullWidth={true}
              />
              <TextField
                value={this.state.username}
                name="username"
                onChange={(_, val) => this.setState({username: val})}
                floatingLabelText="Name"
                autoComplete="off"
                fullWidth={true}
              />
              <TextField
                floatingLabelText="Password"
                type="password"
                name="password"
                autoComplete="new-password"
                value={this.state.password}
                onChange={(_, val) => this.setState({password: val})}
                fullWidth={true}
                style={{marginBottom: '5vh'}}
              />
              <RaisedButton label="Sign Up" primary={true}
                            fullWidth={true}
                            onClick={this.handleSubmit}
                            style={{marginBottom: '2vh'}}/>
              <div style={{
                justifyContent: 'center',
                display: 'flex',
                color: '#969696',
                alignItems: 'center'
              }}>
                <div>
                  Already have an account? <a href="/sign-in">Sign in</a>
                </div>
              </div>
            </div>
          </Paper>
        </div>

      </div>
    )
  }


  handleSubmit(e) {
    fetch(Constants.SIGNUP_ENDPOINT, {
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      method: "POST",
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
        email: this.state.email,
      })
    }).then(res => {
      res.json().then(
        json => {
          if (json.status == 'success') {
            alert("Registering succeeded!");
            this.props.router.replace('/sign-in');
          } else {
            alert("Name or email existed!");
          }
        }
      )
    })
  }
}

export default withRouter(SignUpPage)
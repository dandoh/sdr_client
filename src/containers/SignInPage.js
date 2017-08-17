import React from 'react';
import {withRouter} from "react-router";
import {LinkContainer} from 'react-router-bootstrap'


class SignInPage extends React.Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
    };
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit} className="form-horizontal">
          <fieldset>
            <legend>Sign-in</legend>
            <div className="form-group">
              <label className="col-md-4 control-label" htmlFor="email">Email</label>
              <div className="col-md-4">
                <input id="email" name="email" type="text" placeholder="e.g dandoh"
                       className="form-control input-md" value={this.state.email}
                       onChange={this.handleChangeEmail}/>
              </div>
            </div>

            <div className="form-group">
              <label className="col-md-4 control-label" htmlFor="password">Password</label>
              <div className="col-md-4">
                <input id="password" name="password" type="password" placeholder="password"
                       className="form-control input-md" value={this.state.password}
                       onChange={this.handleChangePassword}/>

              </div>
            </div>

            <div className="form-group">
              <label className="col-md-4 control-label" htmlFor="sign-in"/>
              <div className="col-md-8">
                <button id="sign-in" name="sign-in" className="btn btn-primary">Sign in</button>
                <LinkContainer to={`/sign-up`}>
                  <button id="sign-up" name="sign-up" className="btn btn-default">Sign up</button>
                </LinkContainer>
              </div>
            </div>

          </fieldset>
        </form>

      </div>
    )
  }

  handleChangeEmail(event) {
    this.setState({email: event.target.value});
  }

  handleChangePassword(event) {
    this.setState({password: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    fetch("http://localhost:8080/signin", {
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      method: "POST",
      body: JSON.stringify({email: this.state.email, password: this.state.password})
    }).then(res => {
      if (res.status != 200) {
        alert("Can't sign in");
      } else {
        res.json().then(
          json => {
            console.log(json)
            localStorage.setItem('token', json.token);
            localStorage.setItem('userId', json.userId);
            this.props.router.replace("/");
          }
        )
      }
    })
  }

  responseFacebook(response) {
    console.log(response);
    fetch("http://localhost:8080/fblogin", {
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      method: "POST",
      body: JSON.stringify({accessToken: response.accessToken})
    })
  }
}

export default withRouter(SignInPage)
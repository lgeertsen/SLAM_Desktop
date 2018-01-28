import React from 'react';

export default class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    }
  }

  render() {
    return (
      <div id="loginContainer">
        <div id="login">
          <h2>LETS GO</h2>
          <div className="form-group">
            <label htmlFor="username">Email address</label>
            <input className="form-control"
              type="text"
              name="username"
              value={this.props.username}
              onChange={(e) => this.props.usernameChange(e)}/>
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input className="form-control"
                type="password"
                name="password"
                value={this.props.password}
                onChange={(e) => this.props.passwordChange(e)}/>
              </div>
              <button className="btn btn-danger" onClick={() => this.props.login()}>Login</button>
            </div>


            <style jsx>{`
              #loginContainer {
                z-index: 3;
                background: #fff;
                background-image: url(https://images.unsplash.com/photo-1479859546309-cd77fa21c8f6?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=e9dc05026011df8f69214c90dae7fc64);
                background-position: center;
                background-size: cover;
                position: absolute;
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
              }
              #login {
                padding: 20px 40px 30px;
                width: 50%;
                max-width: 350px;
                background: rgba(255, 255, 255, 0.7);
                text-align: center;
                border-radius: 5px;
              }

              `}</style>
            </div>
          );
        }
      }

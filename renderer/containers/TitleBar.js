import React from 'react';
import electron from 'electron';

export default class TitleBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isMaximized: false,
    }

    this.remote = electron.remote || false;

    this.minimize = this.minimize.bind(this);
    this.maximize = this.maximize.bind(this);
    this.close = this.close.bind(this);
  }

  minimize() {
    const window = this.remote.getCurrentWindow();
    window.minimize();
  }

  maximize() {
    const window = this.remote.getCurrentWindow();
    if(this.state.isMaximized) {
      this.setState({ isMaximized: false });
      window.unmaximize();
    } else {
      this.setState({ isMaximized: true });
      window.maximize();
    }
  }

  close() {
    const window = this.remote.getCurrentWindow();
    window.close();
  }

  render() {
    return (
      <div id="title-bar">
        <div id="title-bar-btns">
          <div id="min-btn" className="" onClick={this.minimize}></div>
          <div id="max-btn" className="" onClick={this.maximize}></div>
          <div id="close-btn" className="" onClick={this.close}></div>
        </div>

        <style jsx>{`
          div {
            height: auto;
          }
          #title-bar {
            background: #ecf0f1;
            width: 100%;
            height: 30px;
            -webkit-app-region: drag;
          }
          #title-bar-btns {
            position: absolute;
            right: 10px;
          }
          #title-bar-btns div {
            -webkit-app-region: no-drag;
            width: 15px;
            height: 15px;
            border: none
            border-radius: 100%;
            display: inline-block;
            margin-right: 5px;
            margin-top: 7.5px;
          }
          #title-bar-btns #min-btn {
            background: #f1c40f;
          }
          #title-bar-btns #min-btn:hover {
            background: #c19d0b;
          }
          #title-bar-btns #max-btn {
            background: #2ecc71;
          }
          #title-bar-btns #max-btn:hover {
            background: #24a35a;
          }
          #title-bar-btns #close-btn {
            background: #e74c3c;
          }
          #title-bar-btns #close-btn:hover {
            background: #cf2a19;
          }
        `}</style>
      </div>
    );
  }
}

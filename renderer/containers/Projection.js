import React from 'react';
import electron from 'electron';

import SplashScreen from '../components/SplashScreen';

export default class Projection extends React.Component {
  constructor(props) {
    super(props);

    this.ipcRenderer = electron.ipcRenderer || false;

    this.state = {
      started: false,
      tournament: null
    }
  }

  componentDidMount() {
    this.ipcRenderer.on('tournament', (event, tournament) => {
      console.log("Received tournament");
      this.setState({tournament: tournament});
    });
  }

  render() {
    return (
      <div id="projection">
        {!this.state.started ?
          <SplashScreen tournament={this.state.tournament}></SplashScreen>
          :
          <div>

          </div>
        }

        <style jsx>{`
          #projection {
            height: 100vh;
            width: 100vw;
            position: absolute;
            top: 0;
            left: 0;
            background-image: linear-gradient(rgba(255,255,255,0.7), rgba(255,255,255,0.7)), url('./static/img/tennis.jpg');
            background-position: center;
            background-repeat: no-repeat;
            background-size: cover;
          }
        `}</style>
      </div>
    );
  }
}

import React from 'react';

export default class SplashScreen extends React.Component {
  constructor(props) {
    super(props);


    this.state = {
    }
  }

  render() {
    return (
      <div id="splashScreen">
        <div id="splashContainer">
          <h1>{this.props.tournament != null ? this.props.tournament.name : ''}</h1>
        </div>

        <style jsx>{`
          #splashScreen {
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          #splashContainer {
            width: 50%;
          }
          #splashScreen h1 {
            text-align: center;
            font-size: 5em;
            font-weight: bold;
            color: #2c3e50;
          }
        `}</style>
      </div>
    );
  }
}

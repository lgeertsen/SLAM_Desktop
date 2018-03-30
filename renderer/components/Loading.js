import React from 'react';

export default class Loading extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    }
  }

  render() {
    return (
      <div id="loadingContainer">
        <h1>{this.props.text}</h1>
        <div className="progress">
          <div className="progress-bar progress-bar-striped progress-bar-animated bg-warning" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style={{width: 100 + '%'}}></div>
        </div>

        <style jsx>{`
          #loadingContainer {
            text-align: center;
            width: 50%;
            height: 50%;
            margin: 25%;
          }
        `}</style>
      </div>
    );
  }
}

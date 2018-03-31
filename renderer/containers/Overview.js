import React from 'react';

import Round from '../components/Round';

export default class Overview extends React.Component {
  constructor(props) {
    super(props);



    this.state = {

    }
  }

  render() {
    return (
      <div id="overview">
        <div className="container">
            {this.props.tree.map((round, index) => (
              <div key={index}>
                <Round roundId={index} round={round}></Round>
              </div>
            ))}
        </div>


        <style jsx>{`
          div {
            height: auto;
          }
          .container {
            padding-top: 20px;
          }
        `}</style>
      </div>
    );
  }
}

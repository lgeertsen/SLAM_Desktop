import React from 'react';

export default class TeamList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    }
  }

  render() {
    return (
      <div id="teamList">
          <div>
          {this.props.teams.map((team, index) => (
            <div className="player" key={team.id}>
              <div className="id"> {index+1} </div>
              <div className="flex3">
                <h5>{team.name()}</h5>
                {/* <ul>
                  {team.members.map((member) => (
                    <li key={member.id}>{member.name}</li>
                  ))}
                </ul> */}
              </div>
              <div>
                <h5>ELO: {team.elo}</h5>
              </div>
              <div>
                <button className="btn btn-light" onClick={() => this.props.teamPresent(index)}>
                  Present: {team.present == true ? "true" : "false"}
                </button>
              </div>
            </div>
          ))}
        </div>

        <style jsx>{`
          .player {
            display: flex;
            flex-direction: row;
            border-bottom: 1px solid rgba(0,0,0,0.125);
          }
          .player > div {
            padding: 5px 10px;
            display: flex;
            align-items: center;
          }
          .flex1 {
            flex-grow: 1;
          }
          .flex3 {
            flex-grow: 3;
          }
          h5 {
            margin-bottom: 0;
          }
        `}</style>
      </div>
    );
  }
}

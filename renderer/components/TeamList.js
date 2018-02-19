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
        <table>
          <tbody>
          {this.props.teams.map((team, index) => (
            <tr key={team.id}>
            <td> {index+1} </td>
            <td>
              <h5>{team.name}</h5>
              <ul>
                {team.members.map((member) => (
                  <li key={member.id}>{member.name}</li>
                ))}
              </ul>
            </td>
            <td> <button className="btn" onClick={() => this.props.teamPresent(index)}>Present: {team.present == true ? "true" : "false"}</button> </td>
            </tr>
          ))}
          </tbody>
      </table>


        <style jsx>{`

        `}</style>
      </div>
    );
  }
}

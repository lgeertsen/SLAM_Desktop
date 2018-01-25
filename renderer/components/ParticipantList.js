import React from 'react';

export default class ParticipantList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    }
  }

  render() {
    return (
      <div id="participantList">
        <table>
          <tbody>
          {this.props.participants.map((participant, index) => (
            <tr key={participant.id}>
            <td> {index+1} </td>
            <td>{participant.user.name}</td>
            <td> <button className="btn" onClick={() => this.props.participantPresent(index)}>Present: {participant.present == true ? "true" : "false"}</button> </td>
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

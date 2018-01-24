import React from 'react';
import Head from 'next/head';

import TitleBar from '../containers/TitleBar';
import Tournaments from '../containers/Tournaments';

export default class App extends React.Component {
  render() {
    return (
      <div id="container">
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta charSet="utf-8" />
          <link href="https://use.fontawesome.com/releases/v5.0.2/css/all.css" rel="stylesheet"/>
          <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.3/css/bootstrap.min.css"/>
          <link rel="stylesheet" type="text/css" href="/static/css/style.css" />
        </Head>

        <TitleBar/>
        <Tournaments/>
        <div id="bravoPaola">
          <h1>Bravo Paola!</h1>
          <h3>Tu as reussi de lancer le programme<br/>On est fière de toi :P</h3>
        </div>

        <style jsx>{`
          #bravoPaola {
            text-align: center;
            margin-top: 200px;
          }
        `}</style>
        <style jsx global>{`
          html, body {
            height: 100%;
          }
        `}</style>
      </div>
    );
  }
}

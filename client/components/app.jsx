import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Map from './Map.jsx';
// if you want to import a .jsx file, you must refer to it using the
// './' and '.jsx' extension

// import { Basemap } from './map';

class App extends React.Component{

  constructor(){
    super();
    this.state = {
      name: ''
    }

    this.getName();
  }
    getName() {
      var that = this.setState.bind(this);

      axios.get('/info')
        .then(function (result) {
          that({
            name: result.data.username
          });
        }, function failure(result) {
          console.log('in the failure section', result.error);
        });
  }

  render(){
    var floatright = {
      float: 'right',
      'font-size': '1.5em',
      'color': '#b4dbc0',
      'font-weight': 'bold'
    };

    return (
        <div>
          <h1>SOJOURNER | Hello, {this.state.name}!</h1><a href="/logout" style={floatright}>Logout</a>
        <Map />
        </div>
      );
  }
}

ReactDOM.render(<App />, document.getElementById('app'))

export default App;

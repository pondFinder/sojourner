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
      'color': '#E85A4f',
      'font-weight': 'bold',
      'margin-right': '1em',
      'margin-top': '1em'
    };

    return (
        <div>
          <h1 style={{"color": "#E85A4F", "font-weight": "bold", "display": "inline-block", "margin-right": ".25em"}}>SOJOURNER</h1>
          <h1 style={{"color": "#8E8D8A", "display": "inline-block", "margin-right": ".25em"}}>|</h1>
          <h1 style={{"color": "#E85A4F", "display": "inline-block"}}>Hello, {this.state.name}!</h1><a href="/logout" style={floatright}>Logout</a>
        <Map />
        </div>
      );
  }
}

ReactDOM.render(<App />, document.getElementById('app'))

export default App;

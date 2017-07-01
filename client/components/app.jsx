import React from 'react';
import ReactDOM from 'react-dom';
import Map from './map.jsx';
// if you want to import a .jsx file, you must refer to it using the
// './' and '.jsx' extension

// import { Basemap } from './map';

class App extends React.Component{

  constructor(){
    super();
    this.state = {
      test: 'string to be rendered for test purposes in this.state constructor'
    }
  }
  render(){
    return (
        <div>
          <nav className="topbar">
            {/*<span class="user-name">{{$ctrl.user}}</span>*/}
            <a href="/logout" className="logout">Logout</a>
          </nav>
          {/*<img src='http://www.pondclean.com/wp-content/uploads/2016/09/POND-1.jpg' />*/}
          {/*<Basemap />*/}
        {/* <MapWrapper /> */}
        <Map
          containerElement={<div style={{ height: `100%`}} />} 
          mapElement={<div style={{ height: `100%` }} />}
        />
        </div>
      );
  }
}

ReactDOM.render(<App />, document.getElementById('app'))

export default App;

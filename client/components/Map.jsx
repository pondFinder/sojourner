import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

class Map extends React.Component {
  constructor(props) {
    super(props);

    //Google API Variables
    this.KEY = '&key=AIzaSyCsdfp6u8miRapt5-lAIiUzyznhRM_xKss';
    this.geoAddress = 'https://maps.googleapis.com/maps/api/geocode/json?';
    this.roads = 'https://roads.googleapis.com/v1/snapToRoads?';
    this.places = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?';

    //State Variables
    this.state = {
      destination: '',
      lat: 29.9559601,
      long: -90.1205441,
      formatted_address: '',
      places: [],
      zoom: 12,
      map: null,
      infowindow: new google.maps.InfoWindow(),
      interest1: null,
      interest2: null,
      interest3: null
    };
    this.renderMapOnToPage();
    this.getInterests();
  }
  
  handleMapChange(event) {
    this.setState({
      destination: event.target.value
    });
  }

  renderMapOnToPage() {
    this.state.map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: this.state.lat, lng: this.state.long},
      zoom: this.state.zoom
    });
  }

  getInterests() {
    this.setState({
      places: []
    });

    axios.get('/interests')
    .then((res) => {
    
      this.setState({
        interest1: res.data.interest_1,
        interest2: res.data.interest_2,
        interest3: res.data.interest_3
      });
      
      var place = 'location=' + this.state.lat + ',' + this.state.long + '&radius=5000';
      this.getMarkers(this.places + place + '&keyword=' + this.state.interest1 + this.KEY, this.state.interest1);
      this.getMarkers(this.places + place + '&keyword=' + this.state.interest2 + this.KEY, this.state.interest2);
      this.getMarkers(this.places + place + '&keyword=' + this.state.interest3 + this.KEY, this.state.interest3);
    })
    .catch((err) => {
      console.log(err);
    });
  }

  getMarkers(address, keyword) {
    axios.post('/places', {
      address: address
    })
    .then((res) => {
      var innerResults = this.state.places;

      for(var i=0; i<5; i++) {

        var item = res.data.results[i];


        innerResults.push({
            name: item.name,
            rating: item.rating,
            lat: item.geometry.location.lat,
            long: item.geometry.location.lng,
            keyword: keyword
          });
        
        this.createMarker(item);
      }
        this.setState({
          places: innerResults
        });
    })
    .catch((err) => {
      console.log(err);
    });
  }

  createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
      map: this.state.map,
      position: place.geometry.location
    });
  }

  handleMapSubmit(event) {
    event.preventDefault();

    var destination = 'address=' + this.state.destination;
    var that = this.setState.bind(this);

    axios.get(this.geoAddress+destination+this.KEY)
    .then((res) => {
      that({
        lat: res.data.results[0].geometry.location.lat,
        long: res.data.results[0].geometry.location.lng,
        formatted_address: res.data.results[0].formatted_address
      })
      this.renderMapOnToPage();
      this.getInterests();
    })
    .catch((err) => {
      console.log(err);
    });

    this.setState({
      destination: ''
    });
    
  }

  render () {
    return (
      <div>
        <h3>{this.state.formatted_address}</h3>
        <h3>Lat:{this.state.lat} Lng:{this.state.long}</h3>
        <br />
        <ul>
          { 
            this.state.places.map((place, index) => 
            <li key={index}>
                { place.keyword + ': ' + place.name + ' (' + place.rating + ')' + '\n' }
            </li>)
          }
        </ul>
       <form onSubmit={this.handleMapSubmit.bind(this)} action="POST">
        <label>
          Location:
        <input type="text" name="msg" size="50" value={this.state.destination} onChange={this.handleMapChange.bind(this)} />
        </label>
        <input type="submit" value="Enter" />
      </form>
      </div>
    );
  }
}

export default Map;

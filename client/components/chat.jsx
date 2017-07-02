import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

class Chat extends React.Component{

  constructor(){
    super();
    this.state = {
        socket: window.io(),
        msg: '',
        chat: [],
        username: ''
    }
    
    this.state.socket.on('msg', (msg) => {
      this.handleChat(msg);
    }); 

    this.getUsername();
  }

  getUsername() {
    var that = this.setState.bind(this);

    axios.get('/info')
    .then(function (result) {
      that({
        username: result.data.username
      });
    }, function failure(result) {
      console.log('in the failure section', result.error);
    });

  }

  handleSubmit(event) {
    event.preventDefault();
    this.state.socket.emit('msg', this.state.msg, this.state.username);
    this.setState({
      msg: ''
    });
  }

  handleChat(msg) {

    var newChat = this.state.chat.slice();

    if(newChat.length >= 10) {
      newChat.shift();
    }
    
    newChat.push(msg);

    this.setState({
      chat: newChat
    });
  }

  handleChange(event) {
    this.setState({
      msg: event.target.value
    });
  }

  render(){
    return (
        <div>
        <br />
        <div id='ctext'>Chat: </div>
        <form id='chatbox' onSubmit={this.handleSubmit.bind(this)} action="POST">
            <input type="text" name="msg" size="50" value={this.state.msg} onChange={this.handleChange.bind(this)} />
            <input type="submit" value="Enter" />
        </form>
        <ul id="chat">
          { 
          this.state.chat.map((msg, index) => 
          <li className='message' key={index}>
              { msg + '\n' }
          </li>)
          }
        </ul>
        <br />
        </div>
      );
  }
}
export default Chat;

ReactDOM.render(<Chat />, document.getElementById('chat'));

import React, { Component } from "react";
import socketIOClient from "socket.io-client";
const socket = socketIOClient(`http://localhost:${process.env.REACT_APP_IO_SERVER}`);
class Menu extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  subcribeExc = () => {
    socket.emit("sayHello");
  }

  render() {
    return (
      <div className="menu">
        <input type="text" className="input" placeholder="Nhập mã CP" />
        <button className="add button-menu">
          <i className="fas fa-plus"></i>
        </button>

        <button className="btn-menu active">HOSE</button>
        <button className="btn-menu">HNX</button>
        <button className="btn-menu">UPCOM</button>
        <button className="btn-menu order" onClick={this.subcribeExc}>
          Đặt lệnh <i className="fas fa-plus"></i>
        </button>
      </div>
    );
  }
}

export default Menu;

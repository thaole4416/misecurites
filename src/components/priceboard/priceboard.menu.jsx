import React, { Component } from "react";

class Menu extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div className="menu">
        <input type="text" className="input" placeholder="Nhập mã CP" />
        <button className="add button-menu">
          <i className="fas fa-plus"></i>
        </button>

        <button className="btn-menu  btn-exchange">HOSE</button>
        <button className="btn-menu  btn-exchange">HNX</button>
        <button className="btn-menu btn-exchange">UPCOM</button>
        <button className="btn-menu order">
          Đặt lệnh <i className="fas fa-plus"></i>
        </button>
      </div>
    );
  }
}

export default Menu;

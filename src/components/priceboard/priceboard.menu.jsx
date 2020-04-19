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

        <button className="btn-menu">HOSE</button>
        <button className="btn-menu">HNX</button>
        <button className="btn-menu">UPCOM</button>
        <button className="btn-menu order">
          Đặt lệnh <i className="fas fa-plus"></i>
        </button>
      </div>
    );
  }
}

export default Menu;

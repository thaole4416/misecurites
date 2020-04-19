import React, { Component } from "react";
import  Thead from "./priceboard.thead";
import Tbody from "./priceboard.tbody";

class StocksTable extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
        <div className="full-width-div" id="stocks_list">
            <Thead/>
            <Tbody/>
        </div>
    );
  }
}

export default StocksTable;

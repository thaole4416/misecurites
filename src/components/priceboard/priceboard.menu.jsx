import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import { connect } from "react-redux";
import { setStocks } from "../../redux/index";
import { emitter } from "../../emitter";
import OrderPopup from "../popup/order.popup";
import SkyLight from "react-skylight";

const socket = socketIOClient(
  `http://localhost:${process.env.REACT_APP_IO_SERVER}`
);
class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      exchange: "HOSE",
    };
  }

  listenEvent = () => {
    emitter.on("subcribeExchange", (exchange) => {
      socket.emit(`subcribeExchange`, exchange);
    });
    socket.on(`getStocks`, (stocksData) => {
      console.log(stocksData)
      this.props.setStocks(stocksData);
      emitter.emit("loadingStocks",true)
    });
  };

  initData = () => {
    socket.emit("initData");
  };

  changeExchange = (exchange) => {
    this.setState({ exchange: exchange });
    localStorage.setItem("activeExchange",exchange)
    emitter.emit(`subcribeExchange`, exchange);
    emitter.emit("loadingStocks",false)
  };

  componentDidMount() {
    this.listenEvent();
    emitter.emit(`subcribeExchange`, localStorage.getItem("activeExchange") || this.state.exchange);

  }

  componentWillUnmount() {}

  render() {
    let orderPopupStyle = {
      width: "20%",
      minHeight: "400px",
      position: "fixed",
      top: "50%",
      left: "105%",
      height: "75%",
      marginTop: "-200px",
      marginLeft: "-25%",
      backgroundColor: "rgb(33,32,39)",
      color: "white",
      font: "roboto",
      "font-size": "1rem",
    };
    const  exchange  =  localStorage.getItem("activeExchange") || this.state.exchange;
    return (
      <div className="menu">
        <input type="text" className="input" placeholder="Nhập mã CP" />
        <button className="add button-menu">
          <i className="fas fa-plus"></i>
        </button>

        <button
          className={`btn-menu ${exchange === "HOSE" ? "active" : ""}`}
          onClick={() => this.changeExchange("HOSE")}
        >
          HOSE
        </button>
        <button
          className={`btn-menu ${exchange === "HNX" ? "active" : ""}`}
          onClick={() => this.changeExchange("HNX")}
        >
          HNX
        </button>
        <button
          className={`btn-menu ${exchange === "UPCOM" ? "active" : ""}`}
          onClick={() => this.changeExchange("UPCOM")}
        >
          UPCOM
        </button>
        <button className="btn-menu order" onClick={this.initData}>
          Sổ lệnh <i className="fas fa-book"></i>
        </button>
        <button
          className="btn-menu order"
          onClick={() => this.orderPopup.show()}
        >
          Đặt lệnh <i className="fas fa-plus"></i>
        </button>
        <SkyLight
          dialogStyles={orderPopupStyle}
          hideOnOverlayClicked
          ref={(ref) => (this.orderPopup = ref)}
          title="Đặt lệnh"
        >
          <OrderPopup />
        </SkyLight>
      </div>
    );
  }
}

const mapStateToProps = ({ stocks }) => ({
  stocks: stocks,
});

const mapDispatchToProps = (dispatch) => ({
  setStocks: (stocksData) => {
    dispatch(setStocks(stocksData));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Menu);

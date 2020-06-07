import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import { connect } from "react-redux";
import {
  setStocks,
  order,
  genOtp,
  verifyOtp,
  changeExchange,
  getDanhMuc,
  getHistory,
} from "../../redux/index";
import { emitter } from "../../emitter";
import OrderPopup from "../popup/order.popup";
import SkyLight from "react-skylight";
import { getAll } from "../../services/userService";
import HistoryPopup from "../popup/history.popup";
import OtpPopup from "../popup/otp.popup";
import DanhMuc from "../popup/danhMuc.popup";
import { toast } from "react-toastify";

const socket = socketIOClient(
  `http://localhost:${process.env.REACT_APP_IO_SERVER}`
);
class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      exchange: "HOSE",
      order: {},
      changePassword: {},
    };
  }

  listenEvent = () => {
    socket.on(`getStocks`, (stocksData) => {
      this.props.setStocks(stocksData);
      emitter.emit("loadingStocks", true);
    });
    emitter.on(`verifySuccess`, () => {
      this.otpPopup.hide();
      this.props.order(this.state.order);
    });
    emitter.on(`verifyFail`, (message) => {
      toast.error(message);
    });
  };

  initData = () => {
    getAll();
  };

  changeExchange = (exchange) => {
    this.setState({ exchange: exchange });
    this.props.changeExchange(exchange);
    localStorage.setItem("activeExchange", exchange);
    socket.emit(`getExchangeData`);
    emitter.emit("loadingStocks", false);
  };

  componentDidMount() {
    this.listenEvent();
    setTimeout(() => {
      console.log("get exchange data");
      socket.emit(`getExchangeData`);
    }, 1000);
  }

  checkOtpCode = (order) => {
    this.otpPopup.show();
    // this.props.genOtp(this.props.user.token);
    this.setState({ order });
  };

  verifyOtp = (otpCode, event) => {
    event.preventDefault();
    emitter.emit(`verifySuccess`);
    // this.props.verifyOtp({ otpCode: otpCode, token: this.props.user.token });
  };

  clickHistory = () => {
    if (this.props.user.token) {
      this.props.getHistory(this.props.user.token);
      this.historyPopup.show();
    } else toast.info("Đăng nhập để thực hiện");
  };

  clickDanhMuc = () => {
    if (this.props.user.token) {
      this.props.getDanhMuc(this.props.user.token);
      this.danhMucPopup.show();
    } else toast.info("Đăng nhập để thực hiện");
  };

  reSendOtp() {
    this.props.genOtp(this.props.user.token);
  }

  getDanhMuc = () => {
    this.props.getDanhMuc(this.props.user.token);
  };

  componentWillUnmount() {}

  render() {
    let otpPopupStyle = {
      backgroundColor: "rgb(255, 255, 255)",
      boxShadow: "rgba(0, 0, 0, 0.4) 0px -4px 10px",
      width: "30%",
      marginLeft: "-35%",
      left: "70%",
    };
    let orderPopupStyle = {
      width: "25%",
      minHeight: "400px",
      position: "fixed",
      top: "150px",
      left: "100%",
      height: "100%",
      marginLeft: "-25%",
      marginTop: 0,
      backgroundColor: "rgb(255, 255, 255)",
      boxShadow: "rgba(0, 0, 0, 0.4) 0px -4px 10px",
      font: "roboto",
      fontSize: "1rem",
      padding: 0,
      maxHeight: "calc(100% - 150px)",
      overflowY: "auto",
    };
    let historyPopupStyle = {
      width: "25%",
      minHeight: "400px",
      position: "fixed",
      left: "100%",
      height: "100%",
      top: "150px",
      marginTop: "-0",
      marginLeft: "-25%",
      font: "roboto",
      fontSize: "1rem",
      padding: 0,
      backgroundColor: "rgb(255, 255, 255)",
      boxShadow: "rgba(0, 0, 0, 0.4) 0px -4px 10px",
      maxHeight: "calc(100% - 150px)",
      overflowY: "auto",
    };
    const exchange =
      localStorage.getItem("activeExchange") || this.state.exchange;
    return (
      <div className="menu">
        {/* <input type="text" className="input" placeholder="Nhập mã CP" />
        <button className="add button-menu">
          <i className="fas fa-plus"></i>
        </button> */}

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

        <button className="btn-menu order" onClick={this.clickHistory}>
          Lịch sử GD
          {/* <i className="fas fa-book"></i> */}
        </button>
        <button className="btn-menu order" onClick={this.clickDanhMuc}>
          Danh mục
          {/* <i className="fas fa-book"></i> */}
        </button>
        <button
          className="btn-menu order"
          onClick={() => {
            if (this.props.user.token) this.orderPopup.show();
            else toast.info("Đăng nhập để thực hiện");
          }}
        >
          Đặt lệnh
          {/* <i className="fas fa-plus"></i> */}
        </button>
        <SkyLight
          dialogStyles={orderPopupStyle}
          hideOnOverlayClicked
          ref={(ref) => (this.orderPopup = ref)}
          title="Đặt lệnh"
        >
          <OrderPopup callback={this.checkOtpCode} />
        </SkyLight>
        <SkyLight
          dialogStyles={orderPopupStyle}
          hideOnOverlayClicked
          ref={(ref) => (this.danhMucPopup = ref)}
          title="Danh mục"
        >
          <DanhMuc
            getDanhMuc={this.getDanhMuc}
            danhMuc={
              this.props.user
                ? this.props.user.danhMuc
                  ? this.props.user.danhMuc
                  : []
                : []
            }
          />
        </SkyLight>
        <SkyLight
          dialogStyles={historyPopupStyle}
          hideOnOverlayClicked
          ref={(ref) => (this.historyPopup = ref)}
          title="Lịch sử giao dịch"
        >
          <HistoryPopup history={this.props.history} />
        </SkyLight>
        <SkyLight
          dialogStyles={otpPopupStyle}
          hideOnOverlayClicked
          ref={(ref) => (this.otpPopup = ref)}
          title="Check mã OTP"
        >
          <OtpPopup
            verifyOtp={this.verifyOtp}
            reSendOtp={this.reSendOtp}
            otp={this.props.otp}
          />
        </SkyLight>
      </div>
    );
  }
}

const mapStateToProps = ({ stocks, user, otp, history }) => ({
  stocks: stocks,
  user: user,
  otp: otp,
  history: history,
});

const mapDispatchToProps = (dispatch) => ({
  setStocks: (stocksData) => {
    dispatch(setStocks(stocksData));
  },
  order: (payload) => dispatch(order(payload)),
  genOtp: (payload) => dispatch(genOtp(payload)),
  verifyOtp: (payload) => dispatch(verifyOtp(payload)),
  changeExchange: (exchange) => dispatch(changeExchange(exchange)),
  getDanhMuc: (payload) => dispatch(getDanhMuc(payload)),
  getHistory: (payload) => dispatch(getHistory(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Menu);

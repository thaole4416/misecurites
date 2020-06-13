import React, { Component } from "react";
import { connect } from "react-redux";
import { emitter } from "../../emitter";
import { getOrderTypes } from "../../helpers/orderTypes";
import ReCAPTCHA from "react-google-recaptcha";
class OrderPopup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      symbol: {
        value: "",
        errors: [],
      },
      orderStock: {
        value: {
          floor: "",
          ceiling: "",
          reference: "",
          exchange: "",
        },
        errors: [],
      },
      price: {
        value: "",
        errors: [],
      },
      volume: {
        value: "",
        errors: [],
      },
      type: "",
      recaptcha: "",
      isBuy : false
    };
    this.recaptchaRef = React.createRef();
  }

  listenEvent = () => {
    emitter.on(`verifySuccess`, () => {
      this.setState({
        symbol: {
          value: "",
          errors: [],
        },
        orderStock: {
          value: {
            floor: "",
            ceiling: "",
            reference: "",
            exchange: "",
          },
          errors: [],
        },
        price: {
          value: "",
          errors: [],
        },
        volume: {
          value: "",
          errors: [],
        },
        type: "",
      });
    });
    emitter.on(`orderSuccess`, () => {
      this.recaptchaRef.current.reset();
    });
    emitter.on(`orderFail`, (message) => {
      this.recaptchaRef.current.reset();
    });
    emitter.on("danhMuctoOrder", (param) => {
      const { symbol, isBuy , gia = "", khoiLuong = "" } = param;
      this.state.symbol.value = symbol;
      this.state.price.value = gia;
      this.state.volume.value = khoiLuong;
      this.state.isBuy = isBuy;
      const orderStock = this.props.allStocks.find(
        (stock) => stock._id === symbol
      );
      if (orderStock) {
        this.state.orderStock.value.ceiling = orderStock.giaTran;
        this.state.orderStock.value.floor = orderStock.giaSan;
        this.state.orderStock.value.reference = orderStock.giaThamChieu;
        this.state.orderStock.value.exchange = orderStock.maSan;
      }
      this.setState({ ...this.state });
    });
  };

  changeSymbol = (event) => {
    let symbol = event.target.value.toUpperCase();
    this.state.orderStock.value = {
      floor: "",
      ceiling: "",
      reference: "",
      exchange: "",
    };
    this.state.symbol = {
      value: symbol,
      errors: [],
    };
    if (symbol.length === 3) {
      const orderStock = this.props.allStocks.find(
        (stock) => stock._id === symbol
      );
      if (orderStock) {
        this.state.orderStock.value.ceiling = orderStock.giaTran;
        this.state.orderStock.value.floor = orderStock.giaSan;
        this.state.orderStock.value.reference = orderStock.giaThamChieu;
        this.state.orderStock.value.exchange = orderStock.maSan;
      } else {
        this.state.symbol.errors.push("Mã cổ phiếu không tồn tại");
      }
    }
    this.setState((state) => ({ ...state }));
  };

  changePrice = (event) => {
    const price = event.target.value;
    const { orderStock } = this.state;
    this.state.price = { value: price, errors: [] };
    if (price > orderStock.value.ceiling) {
      this.state.price.errors.push("Giá không được lớn hơn giá trần");
    }
    if (price < orderStock.value.floor) {
      this.state.price.errors.push("Giá không được nhỏ hơn giá sàn");
    }
    this.setState((state) => ({ ...state }));
  };

  changeVolume = (event) => {
    const volume = event.target.value;
    const price = this.state.price.value;
    let isBuy = document.getElementsByClassName("toggle btn btn-success")
      .length;
    this.state.volume = { value: volume, errors: [] };
    if (isBuy && price * volume > this.props.user.soDu) {
      this.state.volume.errors.push("Số dư không đủ");
    }
    const soDu = this.props.user.danhMuc.find(
      (x) => x.maCoPhieu == this.state.symbol.value
    )
      ? this.props.user.danhMuc.find(
          (x) => x.maCoPhieu == this.state.symbol.value
        ).khoiLuong
      : 0;
    if (!isBuy && volume > soDu) {
      this.state.volume.errors.push("Cổ phiếu không đủ");
    }
    this.setState((state) => ({ ...state }));
  };

  changeType = (event) => {
    this.setState({ type: event.target.value });
  };

  handleSubmit = (event) => {
    let isBuy = document.getElementsByClassName("toggle btn btn-success")
      .length;
    const { symbol, orderStock, price, volume, type } = this.state;
    this.state.orderStock.errors = [];
    this.state.price.errors = [];
    this.state.volume.errors = [];
    if (symbol.value.length === 0) {
      this.state.symbol.errors.push("Chưa chọn mã cổ phiếu");
    }
    if (symbol.value.length === 3) {
      const orderStock = this.props.allStocks.find(
        (stock) => stock._id === symbol.value
      );
      if (orderStock) {
        this.state.orderStock.value.ceiling = orderStock.giaTran;
        this.state.orderStock.value.floor = orderStock.giaSan;
        this.state.orderStock.value.reference = orderStock.giaThamChieu;
        this.state.orderStock.value.exchange = orderStock.maSan;
      } else {
        this.state.symbol.errors.push("Mã cổ phiếu không tồn tại");
      }
    }
    if (price.value > orderStock.value.ceiling) {
      this.state.price.errors.push("Giá không được lớn hơn giá trần");
    }
    if (price.value < orderStock.value.floor) {
      this.state.price.errors.push("Giá không được nhỏ hơn giá sàn");
    }
    if (isBuy && price.value * volume.value > this.props.user.soDu) {
      this.state.volume.errors.push("Số dư không đủ");
    }
    const soDu = this.props.user.danhMuc.find(
      (x) => x.maCoPhieu == this.state.symbol.value
    )
      ? this.props.user.danhMuc.find(
          (x) => x.maCoPhieu == this.state.symbol.value
        ).khoiLuong
      : 0;
    if (!isBuy && volume.value > soDu) {
      this.state.volume.errors.push("Cổ phiếu không đủ");
    }
    let count = 0;
    Object.values(this.state).forEach((state) => {
      if (typeof state == "object" && state.errors.length != 0) count++;
    });
    if (!count)
      this.props.callback({
        token: this.props.user.token,
        maCoPhieu: symbol.value,
        loaiLenh: `${isBuy ? "mua" : "bán"} ${type}`,
        khoiLuong: volume.value,
        gia: price.value,
        maSan: orderStock.value.exchange,
        captcha: this.recaptchaRef.current.getValue(),
      });
    else {
      event.preventDefault();
      this.setState((state) => ({ ...state }));
    }
  };

  componentDidMount() {
    this.listenEvent();
  }

  render() {
    const { symbol, orderStock, price, volume, type } = this.state;
    return (
      <div className="orderPopup popup" style={{ padding: 15, paddingTop: 0 }}>
        <hr />
        {/* <input
          type="checkbox"
          data-toggle="toggle"
          data-on="Mua"
          data-off="Bán"
          data-onstyle="success"
          data-offstyle="danger"
          ref = {this.toggleRef}
        /> */}
        <button className={this.state.isBuy ?  "toggle btn btn-danger" :"toggle btn btn-success"} onClick={()=> this.setState({isBuy : !this.state.isBuy})}>{this.state.isBuy ? "Bán" : "Mua"}</button>
        <hr />
        <div class="form-group">
          <input
            type="text"
            class="form-control"
            placeholder="Nhập mã cổ phiếu"
            style={{ textTransform: "uppercase" }}
            value={symbol.value}
            onChange={this.changeSymbol}
          />
        </div>
        {symbol.errors.map((error) => (
          <div className="text-danger p-2">{error}</div>
        ))}
        <hr />
        <div style={{ marginBottom: "8px" }}>
          <span className="black">Cổ phiếu: {symbol.value}</span>
        </div>
        <div>
          <span className="purple" style={{ display: "block" }}>
            Trần: {orderStock.value.ceiling}
          </span>
          <span className="blue" style={{ display: "block" }}>
            Sàn: &nbsp;{orderStock.value.floor}
          </span>
          <span className="yellow" style={{ display: "block" }}>
            TC: &nbsp;&nbsp;{orderStock.value.reference}
          </span>
        </div>
        <div className="form-group">
          <div className="row">
            <div className="col-12 p-2">
              <input
                type="number"
                className="form-control"
                placeholder="Giá"
                required="required"
                value={price.value}
                onChange={this.changePrice}
              />
              {price.errors.map((error) => (
                <div className="text-danger p-2">{error}</div>
              ))}
            </div>
            <div className="col-12 p-2">
              <input
                type="number"
                className="form-control"
                placeholder="KL"
                required="required"
                value={volume.value}
                onChange={this.changeVolume}
              />
              {volume.errors.map((error) => (
                <div className="text-danger p-2">{error}</div>
              ))}
            </div>
            <div className="col-12 p-2">
              <select
                type="text"
                className="form-control"
                placeholder="Loại lệnh"
                required="required"
                value={type}
                onChange={this.changeType}
              >
                {getOrderTypes(orderStock.value.exchange).map((type) => (
                  <option value={type} >{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <hr />
        {/* <div
          class="g-recaptcha"
          data-sitekey="6LcLKwEVAAAAAGJpBc6qEdBHMdgJRARWJx_NIkP0"
        ></div> */}
        <ReCAPTCHA
          sitekey="6LcLKwEVAAAAAGJpBc6qEdBHMdgJRARWJx_NIkP0"
          ref={this.recaptchaRef}
          onChange={() =>
            this.setState({
              captcha: this.recaptchaRef.current
                ? this.recaptchaRef.current.getValue()
                : null,
            })
          }
        />
        <button
          className="btn btn-block button"
          onClick={this.handleSubmit}
          disabled={symbol.value ? (this.state.captcha ? false : true) : true}
        >
          Đặt lệnh
        </button>
      </div>
    );
  }
}

const mapStateToProps = ({ allStocks, user, symbol }) => ({
  allStocks: allStocks,
  user: user,
  symbol: symbol,
});

// const mapDispatchToProps = (dispatch) => ({
//   checkSymbol: (payload) => dispatch(checkSymbol(payload)),
// });

export default connect(mapStateToProps, null)(OrderPopup);

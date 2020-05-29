import React, { Component } from "react";
import { connect } from "react-redux";

import { getOrderTypes } from "../../helpers/orderTypes";
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
      type: "LO",
    };
  }

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
    this.state.volume.value = volume;
    this.setState((state) => ({ ...state }));
  };

  changeType = (event) => {
    this.setState({ type: event.target.value });
  };

  handleSubmit = () => {
    let isBuy = document.getElementsByClassName("toggle btn btn-success")
      .length;
    const { symbol, orderStock, price, volume, type } = this.state;
    this.props.callback({
      token: this.props.user.token,
      maCoPhieu: symbol.value,
      loaiLenh: `${isBuy ? "mua" : "bán"} ${type}`,
      khoiLuong: volume.value,
      gia: price.value,
      maSan: orderStock.value.exchange
    });
  };

  render() {
    const { symbol, orderStock, price, volume, type } = this.state;
    return (
      <div className="orderPopup" style={{ padding: 15 }}>
        <input
          type="checkbox"
          checked
          data-toggle="toggle"
          data-on="Mua"
          data-off="Bán"
          data-onstyle="success"
          data-offstyle="danger"
        />
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
          <div className="bg-danger text-white p-2">{error}</div>
        ))}
        <hr />
        <div style={{ marginBottom: "8px" }}>
          <span className="white">Cổ phiếu: {symbol.value}</span>
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
                <div className="bg-danger text-white p-2">{error}</div>
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
                  <option value={type} >
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <hr />
        <button className="btn btn-block button" onClick={this.handleSubmit}>
          Đặt lệnh
        </button>
      </div>
    );
  }
}

const mapStateToProps = ({ allStocks, user }) => ({
  allStocks: allStocks,
  user: user,
});

// const mapDispatchToProps = (dispatch) => ({
//   order: (payload) => dispatch(order(payload)),
// });

export default connect(mapStateToProps, null)(OrderPopup);

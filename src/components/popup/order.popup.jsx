import React, { Component } from "react";

class OrderPopup extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div className="orderPopup" style={{padding: 15}}>
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
            id=""
            placeholder="Nhập mã cổ phiếu"
          />
        </div>
        <hr />
        <div style={{ marginBottom: "8px" }}>
          <span
            className="white"
          >
            Cổ phiếu:{" "}
          </span>
        </div>
        <div>
          <span
            className="purple"
            style={{ width: "30%", display: "inline-block" }}
          >
            Trần:{" "}
          </span>
          <span
            className="blue"
            style={{ width: "30%", display: "inline-block" }}
          >
            Sàn:{" "}
          </span>
          <span
            className="yellow"
            style={{ width: "40%", display: "inline-block" }}
          >
            Tham chiếu:{" "}
          </span>
        </div>
        <hr />
        <div className="form-group">
          <div className="row">
            <div className="col-4">
              <input
                type="number"
                className="form-control"
                placeholder="Giá"
                required="required"
              />
            </div>
            <div className="col-4">
              <input
                type="number"
                className="form-control"
                placeholder="Khối lượng"
                required="required"
              />
            </div>
            <div className="col-4">
              <input
                type="text"
                className="form-control"
                placeholder="Loại lệnh"
                required="required"
                value="LO"
                readOnly
              />
            </div>
          </div>
        </div>
        <hr />
        <button className="btn btn-block button">Đặt lệnh</button>
      </div>
    );
  }
}

export default OrderPopup;

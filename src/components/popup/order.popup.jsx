import React, { Component } from 'react'

class OrderPopup extends Component {
    constructor(props) {
        super(props)

        this.state = {
                 
        }
    }

    render() {
        return (
            <div className="orderPopup">
                <input  type="checkbox" checked data-toggle="toggle" data-on="Mua" data-off="Bán" data-onstyle="success" data-offstyle="danger" />
                <input type="text" placeholder="Nhập mã cổ phiếu"/>
                <div>
                    <span className="purple">Trần: </span>
                    <span className="blue">Sàn: </span>
                    <span className="yellow">Tham chiếu: </span>
                </div>
                <div className="form-group">
              <div className="row">
                <div className="col-4">
                  <input
                    type="number"
                    className="form-control"
                    name="name"
                    placeholder="Giá"
                    required="required"
                  />
                </div>
                <div className="col-4">
                  <input
                    type="number"
                    className="form-control"
                    name="matKhau"
                    placeholder="Khối lượng"
                    required="required"
                  />
                </div>
                <div className="col-4">
                  <input
                    type="text"
                    className="form-control"
                    name=""
                    placeholder="Loại lệnh"
                    required="required"
                    value="LO"
                  />
                </div>
              </div>
            </div>
                <button className="btn btn-block btn-light">Đặt lệnh</button>
            </div>
        )
    }
}

export default OrderPopup

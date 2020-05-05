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
                <input type="text" placeholder="Nhập mã cổ phiếu"/>
                <table>
                    <thead>
                        <tbody></tbody>
                    </thead>
                </table>
                <input  type="checkbox" checked data-toggle="toggle" data-on="Mua" data-off="Bán" data-onstyle="success" data-offstyle="danger" />
            </div>
        )
    }
}

export default OrderPopup

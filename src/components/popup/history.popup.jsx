import React, { Component } from "react";

class HistoryPopup extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div className="historyPopup" style={{ paddingTop: 15 }}>
        <table className="table-top" style={{ background: "black" }}>
          <thead style={{ color: "white", fontWeight: "100" }}>
            <tr>
              <th className={`th `} style={{ width: "3%" }}>
                Mã CP
              </th>
              <th className={`th `} style={{ width: "4.5%" }}>
                Giá
              </th>
              <th className={`th `} style={{ width: "3%" }}>
                KL
              </th>
              <th className={`th `} style={{ width: "4.5%" }}>
                Thời gian
              </th>
              <th className={`th `} style={{ width: "3%" }}>
                Tình trạng
              </th>
              <th className={`th `} style={{ width: "3%" }}></th>
            </tr>
          </thead>
          <tbody className="table-row">
            <tr className="highlight">
              <td className={`td`}>
                <span>1</span>
              </td>
              <td className={`td`}>
                <span>1</span>
              </td>
              <td className={`td`}>
                <span>1</span>
              </td>
              <td className={`td`}>
                <span>1</span>
              </td>
              <td className={`td`}>
                <span>1</span>
              </td>
              <td className={`td`}>
                <a className="fa fa-pencil-alt"></a>
                <a className="fa fa-times"></a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default HistoryPopup;

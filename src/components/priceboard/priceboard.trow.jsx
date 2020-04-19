import React, { Component } from "react";

class TRow extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  checkColor(a, b) {
    const { CL, FL } = this.props.stock_data;
    if (b < a && b !== 0 && b > FL) {
      return "red";
    }
    if (b > a && b < CL) {
      return "green";
    }
    if (a === b) {
      return "yellow";
    }
    if (b === 0 || b === null) {
      return "yellow";
    }
    if (b === CL || b > CL) {
      return "purple";
    }
    if (b === FL || b < FL) {
      return "blue";
    }
    return "";
  }
  checkDate(date) {
    if (date) {
      let result = date.substr(0, 6) + date.substr(8, 2);
      return result;
    } else {
      return "";
    }
  }

  checkKL(value) {
    return value;
  }
  checkEmpty(value) {
    if (value && value !== 0) {
      // if(b==='CV')
      if (Number.isInteger(value)) {
        return (value / 1000).toFixed(2);
      } else {
        return (value / 1000).toFixed(2);
      }
    } else {
      return "";
    }
  }
  render() {
    let colorRow = this.props.key % 2 === 0 ? "#111" : "";
    let color = this.props.key % 2 === 0 ? "color1" : "color2";
    const {
      SB,
      CL,
      FL,
      RE,
      B3,
      B2,
      B1,
      V3,
      V2,
      V1,
      S3,
      S2,
      S1,
      U3,
      U2,
      U1,
      CP,
      CV,
      TD,
      PC,
      TT,
      TV
    } = this.props.stock_data;
    return (
      <tr className="stock-row highlight" style={{ backgroundColor: colorRow }}>
        <td
          onClick={() => this.handleClick(SB)}
          className={`${this.checkColor(RE, CP)} rs-colum`}
          style={{
            width: "5%",
            fontWeight: "600",
            paddingLeft: "2px",
            textAlign: "left",
            fontSize: "12px",
            cursor: "pointer",
          }}
        >
          {SB}
        </td>

        {/* hidden */}
        <td className={`rs-colum`} style={{ width: "4.25%", display: "none" }}>
          {this.checkDate(TD)}
        </td>
        <td className={`purple td ${color}`} style={{ width: "3%" }}>
          {this.checkEmpty(CL)}
        </td>
        <td className={`blue td ${color}`} style={{ width: "3%" }}>
          {this.checkEmpty(FL)}
        </td>
        <td className={`yellow td ${color}`} style={{ width: "3%" }}>
          {this.checkEmpty(RE)}
        </td>
        <td className={`white td`} style={{ width: "5%" }}>
          {TT}
        </td>
        <td className={`white td`} style={{ width: "5%" }}>
          {TV}
        </td>

        <td
          className={`${this.checkColor(RE, B3)} td rs-hidden-2`}
          style={{ width: "3%" }}
        >
          {this.checkEmpty(B3)}
        </td>
        <td
          className={`${this.checkColor(RE, B3)} td rs-hidden-2`}
          style={{ width: "4.5%" }}
        >
          {this.checkEmpty(V3)}
        </td>
        <td
          className={`${this.checkColor(RE, B2)} rs-hidden-3 td`}
          style={{ width: "3%" }}
        >
          {this.checkEmpty(B2)}
        </td>
        <td
          className={`${this.checkColor(RE, B2)} rs-hidden-3 td`}
          style={{ width: "4.5%" }}
        >
          {this.checkEmpty(V2)}
        </td>
        <td
          className={`${this.checkColor(RE, B1)} rs-hidden-3 td`}
          style={{ width: "3%" }}
        >
          {this.checkEmpty(B1)}
        </td>
        <td
          className={`${this.checkColor(RE, B1)} rs-hidden-3 td`}
          style={{ width: "4.5%" }}
        >
          {this.checkEmpty(V1)}
        </td>

        <td
          className={`${this.checkColor(RE, CP)} td ${color}`}
          style={{ width: "3%" }}
        >
          {this.checkEmpty(CP)}
        </td>
        <td
          className={`${this.checkColor(RE, CP)} td ${color}`}
          style={{ width: "4%" }}
        >
          {this.checkKL(CV)}
        </td>
        <td
          className={`${this.checkColor(RE, CP)} td ${color}`}
          style={{ width: "3.5%" }}
        >
          {PC}
        </td>

        <td
          className={`${this.checkColor(RE, S1)} rs-hidden-3 td`}
          style={{ width: "3%" }}
        >
          {this.checkEmpty(S1)}
        </td>
        <td
          className={`${this.checkColor(RE, S1)} rs-hidden-3 td`}
          style={{ width: "4.5%" }}
        >
          {this.checkEmpty(U1)}
        </td>
        <td
          className={`${this.checkColor(RE, S2)} rs-hidden-3 td`}
          style={{ width: "3%" }}
        >
          {this.checkEmpty(S2)}
        </td>
        <td
          className={`${this.checkColor(RE, S2)} rs-hidden-3 td`}
          style={{ width: "4.5%" }}
        >
          {this.checkEmpty(U2)}
        </td>
        <td
          className={`${this.checkColor(RE, S3)} td rs-hidden-2`}
          style={{ width: "3%" }}
        >
          {this.checkEmpty(S3)}
        </td>
        <td
          className={`${this.checkColor(RE, S3)} td rs-hidden-2`}
          style={{ width: "4.5%" }}
        >
          {this.checkEmpty(U3)}
        </td>
      </tr>
    );
  }
}

export default TRow;

import React, { Component } from "react";
import HighlighRow from "./priceboard.td";
let mount = false;
let checkHighlight;
class TRow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stock_data: {
        SB: "",
        CL: "",
        FL: "",
        RE: "",
        B3: "",
        B2: "",
        B1: "",
        V3: "",
        V2: "",
        V1: "",
        S3: "",
        S2: "",
        S1: "",
        U3: "",
        U2: "",
        U1: "",
        CP: "",
        CV: "",
        PC: "",
        TT: "",
        TV: "",
      },
      previous_stock_data: {
        SB: "",
        CL: "",
        FL: "",
        RE: "",
        B3: "",
        B2: "",
        B1: "",
        V3: "",
        V2: "",
        V1: "",
        S3: "",
        S2: "",
        S1: "",
        U3: "",
        U2: "",
        U1: "",
        CP: "",
        CV: "",
        PC: "",
        TT: "",
        TV: "",
      },
      B2_highlight: "",
    };
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

  static getDerivedStateFromProps(nextProps, prevState) {
    if (mount) {
      if (nextProps.stock_data !== prevState.stock_data) {
        return {
          stock_data: { ...nextProps.stock_data },
          previous_stock_data: { ...prevState.stock_data },
        };
      }
    }
  }

  componentDidMount() {
    mount = true;
    this.setState({
      stock_data: { ...this.props.stock_data },
      previous_stock_data: { ...this.props.stock_data },
    });
  }

  render() {
    let colorRow = this.props.index % 2 === 0 ? "#111" : "";
    let color = this.props.index % 2 === 0 ? "color1" : "color2";
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
      PC,
      TT,
      TV,
    } = this.state.stock_data;
    const {
      P_SB,
      P_CL,
      P_FL,
      P_RE,
      P_B3,
      B2: P_B2,
      P_B1,
      P_V3,
      P_V2,
      P_V1,
      P_S3,
      P_S2,
      P_S1,
      P_U3,
      P_U2,
      P_U1,
      P_CP,
      P_CV,
      P_PC,
      P_TT,
      P_TV,
    } = this.state.previous_stock_data;

    return (
      SB && (
        <tr
          className="stock-row highlight"
          style={{ backgroundColor: colorRow }}
        >
          <td
            onClick={this.props.click}
            // onClick={() => this.handleClick(SB)}
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
            className={`${this.checkColor(RE, B3)} td rs-hidden-2  change${B3}`}
            style={{
              width: "3%",
              animation: `${this.checkColor(RE, B3)}-change 2s forwards`,
            }}
          >
            <i className="fa fa-arrow-up"></i>
            <span>{this.checkEmpty(B3)}</span>
          </td>
          <td
            className={`${this.checkColor(RE, B3)} td rs-hidden-2 `}
            style={{ width: "4.5%" }}
          >
            <i className="fa fa-arrow-up"></i>
            <span>{this.checkEmpty(V3)}</span>
          </td>
          {/* <td
            className={`${this.checkColor(RE, B2)} rs-hidden-3 td `}
            style={{
              width: "3%",
            }}
          >
            <span>{this.checkEmpty(B2)}</span>
          </td> */}
          <HighlighRow
            className={`${this.checkColor(RE, B2)} rs-hidden-3 td`}
            style={{
              width: "3%",
            }}
            span={this.checkEmpty(B2)}
            isHighlight ={B2 - P_B2}
          />
          <td
            className={`${this.checkColor(RE, B2)} rs-hidden-3 td `}
            style={{ width: "4.5%" }}
          >
            <span>{this.checkEmpty(V2)}</span>
          </td>
          <td
            className={`${this.checkColor(RE, B1)} rs-hidden-3 td `}
            style={{ width: "3%" }}
          >
            <span>{this.checkEmpty(B1)}</span>
          </td>
          <td
            className={`${this.checkColor(RE, B1)} rs-hidden-3 td `}
            style={{ width: "4.5%" }}
          >
            <span>{this.checkEmpty(V1)}</span>
          </td>

          <td
            className={`${this.checkColor(RE, CP)} td ${color} `}
            style={{ width: "3%" }}
          >
            <span>{this.checkEmpty(CP)}</span>
          </td>
          <td
            className={`${this.checkColor(RE, CP)} td ${color} `}
            style={{ width: "4%" }}
          >
            <span> {this.checkKL(CV)}</span>
          </td>
          <td
            className={`${this.checkColor(RE, CP)} td ${color} `}
            style={{ width: "3.5%" }}
          >
            <span>{PC}</span>
          </td>

          <td
            className={`${this.checkColor(RE, S1)} rs-hidden-3 td `}
            style={{ width: "3%" }}
          >
            <span> {this.checkEmpty(S1)}</span>
          </td>
          <td
            className={`${this.checkColor(RE, S1)} rs-hidden-3 td `}
            style={{ width: "4.5%" }}
          >
            <span>{this.checkEmpty(U1)}</span>
          </td>
          <td
            className={`${this.checkColor(RE, S2)} rs-hidden-3 td `}
            style={{ width: "3%" }}
          >
            <span> {this.checkEmpty(S2)}</span>
          </td>
          <td
            className={`${this.checkColor(RE, S2)} rs-hidden-3 td `}
            style={{ width: "4.5%" }}
          >
            <span>{this.checkEmpty(U2)}</span>
          </td>
          <td
            className={`${this.checkColor(RE, S3)} td rs-hidden-2 `}
            style={{ width: "3%" }}
          >
            <span>{this.checkEmpty(S3)}</span>
          </td>
          <td
            className={`${this.checkColor(RE, S3)} td rs-hidden-2 `}
            style={{ width: "4.5%" }}
          >
            <span>{this.checkEmpty(U3)}</span>
          </td>
        </tr>
      )
    );
  }
}

export default TRow;

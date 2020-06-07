import React, { Component } from "react";
import HighlightRow from "./priceboard.td";
let mount = false;
let checkHighlight;
class TRow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stock_data: {
        symbol: "",
        ceiling: "",
        floor: "",
        reference: "",
        buy_1: "",
        buy_2: "",
        buy_3: "",
        bVol_1: "",
        bVol_2: "",
        bVol_3: "",
        match: "",
        mVol: "",
        sell_1: "",
        sell_2: "",
        sell_3: "",
        sVol_1: "",
        sVol_2: "",
        sVol_3: "",
        totalVal: "",
        totalVol: "",
      },
      previous_stock_data: {
        symbol: "",
        ceiling: "",
        floor: "",
        reference: "",
        buy_1: "",
        buy_2: "",
        buy_3: "",
        bVol_1: "",
        bVol_2: "",
        bVol_3: "",
        match: "",
        mVol: "",
        sell_1: "",
        sell_2: "",
        sell_3: "",
        sVol_1: "",
        sVol_2: "",
        sVol_3: "",
        totalVal: "",
        totalVol: "",
      },
    };
  }

  checkColor(a, b) {
    let { ceiling, floor } = this.props.stock_data;
    if (b == "ATC" || b == "ATO") return "";
    else if (b == "") return "";
    else b = b * 1;
    if (b < a && b !== 0 && b > floor) {
      return "red";
    }
    if (b > a && b < ceiling) {
      return "green";
    }
    if (a === b) {
      return "yellow";
    }
    if (b === 0 || b === null) {
      return "yellow";
    }
    if (b === ceiling || b > ceiling) {
      return "purple";
    }
    if (b === floor || b < floor) {
      return "blue";
    }
    return "";
  }

  checkKL(value) {
    let index = 0;
    let result = "";
    if (value) {
      value = (value / 10).toFixed(1).toString().split(".");
      for (let i = value[0].length - 1; i >= 0; i--) {
        if (index === 2) {
          result = value[0][i] + "," + result;
          index = 0;
        } else {
          result = value[0][i] + result;
          index++;
        }
      }
      return value[1] * 1 ? result + "." + value[1] : result;
    } else return result;
  }
  checkEmpty(value, isTotalVal = false) {
    if (value && value !== 0) {
      if (value == "ATO") return "ATO";
      if (value == "ATC") return "ATC";
      if (Number.isInteger(value)) {
        return isTotalVal
          ? (value / 1000000).toFixed(2)
          : (value / 1000).toFixed(2);
      } else {
        return isTotalVal
          ? (value / 1000000).toFixed(2)
          : (value / 1000).toFixed(2);
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
    return null;
  }

  componentDidMount() {
    mount = true;

    this.setState({
      stock_data: { ...this.props.stock_data },
      previous_stock_data: { ...this.props.stock_data },
    });
  }

  render() {
    let color = this.props.index % 2 === 0 ? "color1" : "color2";
    const {
      symbol,
      ceiling,
      floor,
      reference,
      buy_1,
      buy_2,
      buy_3,
      bVol_1,
      bVol_2,
      bVol_3,
      sell_1,
      sell_2,
      sell_3,
      sVol_1,
      sVol_2,
      sVol_3,
      match,
      mVol,
      totalVal,
      totalVol,
    } = this.state.stock_data;
    const {
      P_reference,
      buy_1: P_buy_1,
      buy_2: P_buy_2,
      buy_3: P_buy_3,
      sell_1: P_sell_1,
      sell_2: P_sell_2,
      sell_3: P_sell_3,
      sVol_1: P_sVol_1,
      sVol_2: P_sVol_2,
      sVol_3: P_sVol_3,
      bVol_1: P_bVol_1,
      bVol_2: P_bVol_2,
      bVol_3: P_bVol_3,
      match: P_match,
      mVol: P_mVol,
      // P_TT,
      // P_TV,
    } = this.state.previous_stock_data;
    // let PC = CP - reference;
    const { isCheckHighLight } = this.props;
    return (
      symbol && (
        <tr className="stock-row highlight">
          <td
            onClick={() => this.props.click(symbol)}
            // onClick={() => this.handleClick(symbol)}
            className={`${this.checkColor(reference, match)} rs-colum`}
            style={{
              width: "5%",
              fontWeight: "600",
              paddingLeft: "2px",
              textAlign: "left",
              fontSize: "12px",
              cursor: "pointer",
            }}
          >
            <span>{symbol}</span>
          </td>

          {/* hidden */}
          <td className={`purple td ${color}`} style={{ width: "3%" }}>
            <span>{this.checkEmpty(ceiling)}</span>
          </td>
          <td className={`blue td ${color}`} style={{ width: "3%" }}>
            <span>{this.checkEmpty(floor)}</span>
          </td>
          <td className={`yellow td ${color}`} style={{ width: "3%" }}>
            <span>{this.checkEmpty(reference)}</span>
          </td>
          <td className={`black td`} style={{ width: "5%" }}>
            <span>{this.checkKL(totalVol)}</span>
          </td>
          <td className={`black td`} style={{ width: "5%" }}>
            <span>{this.checkEmpty(totalVal, true)}</span>
          </td>
          <HighlightRow
            className={`${this.checkColor(reference, buy_1)}  td`}
            style={{
              width: "3%",
            }}
            span={this.checkEmpty(buy_1)}
            isHighlight={buy_1 - P_buy_1}
            isCheckHighLight={isCheckHighLight}
          />
          <HighlightRow
            className={`${this.checkColor(reference, buy_1)}  td`}
            style={{ width: "4.5%" }}
            span={this.checkKL(bVol_1)}
            isHighlight={buy_1 - P_buy_1 || bVol_1 - P_bVol_1}
            isCheckHighLight={isCheckHighLight}
          />
          {/* <td
            className={`${this.checkColor(RE, B2)}  td `}
            style={{
              width: "3%",
            }}
          >
            <span>{this.checkEmpty(B2)}</span>
          </td> */}
          <HighlightRow
            className={`${this.checkColor(reference, buy_2)}  td`}
            style={{
              width: "3%",
            }}
            span={this.checkEmpty(buy_2)}
            isHighlight={buy_2 - P_buy_2}
            isCheckHighLight={isCheckHighLight}
          />
          <HighlightRow
            className={`${this.checkColor(reference, buy_2)}  td`}
            style={{ width: "4.5%" }}
            span={this.checkKL(bVol_2)}
            isHighlight={buy_2 - P_buy_2 || bVol_2 - P_bVol_2}
            isCheckHighLight={isCheckHighLight}
          />
          <HighlightRow
            className={`${this.checkColor(reference, buy_3)}  td`}
            style={{
              width: "3%",
            }}
            span={this.checkEmpty(buy_3)}
            isHighlight={buy_3 - P_buy_3}
            isCheckHighLight={isCheckHighLight}
          />
          <HighlightRow
            className={`${this.checkColor(reference, buy_3)}  td`}
            style={{ width: "4.5%" }}
            span={this.checkKL(bVol_3)}
            isHighlight={buy_3 - P_buy_3 || bVol_3 - P_bVol_3}
            isCheckHighLight={isCheckHighLight}
          />
          <HighlightRow
            className={`${this.checkColor(reference, match)}  td ${color}`}
            style={{
              width: "3%",
            }}
            span={this.checkEmpty(match)}
            isHighlight={match - P_match}
            isCheckHighLight={isCheckHighLight}
          />
          <HighlightRow
            className={`${this.checkColor(reference, match)}  td ${color}`}
            style={{
              width: "4%",
            }}
            span={this.checkKL(mVol)}
            isHighlight={match - P_match || mVol - P_mVol}
            isCheckHighLight={isCheckHighLight}
          />
          <HighlightRow
            className={`${this.checkColor(reference, match)}  td ${color}`}
            style={{ width: "3.5%" }}
            span={match ? this.checkEmpty(match - reference) : ""}
            isHighlight={match - reference - (P_match - P_reference)}
            isCheckHighLight={isCheckHighLight}
          />
          <HighlightRow
            className={`${this.checkColor(reference, sell_1)}  td`}
            style={{ width: "3%" }}
            span={this.checkEmpty(sell_1)}
            isHighlight={sell_1 - P_sell_1}
            isCheckHighLight={isCheckHighLight}
          />
          <HighlightRow
            className={`${this.checkColor(reference, sell_1)}  td`}
            style={{ width: "4.5%" }}
            span={this.checkKL(sVol_1)}
            isHighlight={sell_1 - P_sell_1 || sVol_1 - P_sVol_1}
            isCheckHighLight={isCheckHighLight}
          />
          <HighlightRow
            className={`${this.checkColor(reference, sell_2)}  td`}
            style={{ width: "3%" }}
            span={this.checkEmpty(sell_2)}
            isHighlight={sell_2 - P_sell_2}
            isCheckHighLight={isCheckHighLight}
          />
          <HighlightRow
            className={`${this.checkColor(reference, sell_2)}  td`}
            style={{ width: "4.5%" }}
            span={this.checkKL(sVol_2)}
            isHighlight={sell_2 - P_sell_2 || sVol_2 - P_sVol_2}
            isCheckHighLight={isCheckHighLight}
          />
          <HighlightRow
            className={`${this.checkColor(reference, sell_3)}  td`}
            style={{ width: "3%" }}
            span={this.checkEmpty(sell_3)}
            isHighlight={sell_3 - P_sell_3}
            isCheckHighLight={isCheckHighLight}
          />
          <HighlightRow
            className={`${this.checkColor(reference, sell_3)}  td`}
            style={{ width: "4.5%" }}
            span={this.checkKL(sVol_3)}
            isHighlight={sell_3 - P_sell_3 || sVol_3 - P_sVol_3}
            isCheckHighLight={isCheckHighLight}
          />
        </tr>
      )
    );
  }
}

export default TRow;

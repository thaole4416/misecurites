import React, { Component } from "react";
import TRow from "./priceboard.trow";
import { connect } from "react-redux";
import { changeStocks } from "../../redux/index";
import { emitter } from "../../emitter";
import Scrollbar from "../scrollbar";

import DetailPopup from "../popup/detail.popup";
import SkyLight from "react-skylight";
class Tbody extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      isLoadEnd: false,
      isCheckHighLight: false,
      symbol: "",
    };
  }

  listenEvent = () => {
    emitter.on("loadingStocks", (isLoadEnd) => {
      if (isLoadEnd) {
        this.setState({ isLoadEnd: true });
        setTimeout(() => {
          this.setState({ isCheckHighLight: true });
        }, 1000);
      } else this.setState({ isLoadEnd: false, isCheckHighLight: false });
    });
  };

  componentDidMount() {
    this.listenEvent();
    this.setState({ data: this.props.stocks });
  }

  componentWillUnmount() {}

  click = (symbol) => {
    this.setState({ symbol: symbol });
    // this.detailPopup.show();
  };

  render() {
    let index = 0;
    let detailPopuppStyle = {
      width: "25%",
      minHeight: "400px",
      position: "fixed",
      top: "150px",
      marginTop: "-0",
      left: "100%",
      height: "100%",
      marginLeft: "-25%",
      backgroundColor: "rgb(255, 255, 255)",
      boxShadow: "rgba(0, 0, 0, 0.4) 0px -4px 10px",
      font: "roboto",
      fontSize: "1rem",
      padding: 0,
    };
    return (
      <div
        style={{
          height: `calc(100vh - 175px)`,
          overflow: "hidden",
          marginTop: "4px",
        }}
      >
        <Scrollbar>
          <table className="table-row">
            <tbody>
              {this.state.isLoadEnd ? (
                this.props.stocks.find(
                  (x) => x.exchange === this.props.exchange
                ) ? (
                  this.props.stocks.map((stockData) =>
                    stockData.exchange == this.props.exchange ? (
                      <TRow
                        key={index}
                        index={index++}
                        stock_data={stockData}
                        click={this.click}
                        isCheckHighLight={this.state.isCheckHighLight}
                      />
                    ) : null
                  )
                ) : (
                  this.props.allStocks.map((stockData) =>
                    stockData.maSan == this.props.exchange ? (
                      <TRow
                        key={index}
                        index={index++}
                        stock_data={{
                          symbol: stockData._id,
                          ceiling: stockData.giaTran,
                          floor: stockData.giaSan,
                          reference: stockData.giaSan,
                          exchange: stockData.maSan,
                        }}
                        click={this.click}
                        isCheckHighLight={this.state.isCheckHighLight}
                      />
                    ) : null
                  )
                )
              ) : (
                <tr colSpan="21">
                  <td>
                    <span>LOADING...</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Scrollbar>
        <SkyLight
          dialogStyles={detailPopuppStyle}
          hideOnOverlayClicked
          ref={(ref) => (this.detailPopup = ref)}
          title={`Chi tiết mã ${this.state.symbol}`}
        >
          <DetailPopup click={this.props.user.info} />
        </SkyLight>
      </div>
    );
  }
}

const mapStateToProps = ({allStocks, stocks, exchange, user, otp }) => ({
  stocks: stocks,
  allStocks: allStocks,
  exchange: exchange,
  user: user,
  otp: otp,
});

const mapDispatchToProps = (dispatch) => ({
  changeStocks: () => {
    dispatch(changeStocks());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Tbody);

import React, { Component } from "react";
import TRow from "./priceboard.trow";
import { connect } from "react-redux";
import { changeStocks } from "../../redux/index";
import { emitter } from "../../emitter";
import Scrollbar from "../scrollbar";
class Tbody extends Component {
  constructor(props) {
    super(props);
    this.listenEvent();
    this.state = {
      data: null,
      isLoadEnd: false,
      isCheckHighLight: false,
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
    this.setState({ data: this.props.stocks });
  }

  componentWillUnmount() {}

  click = () => {
    console.log("click");
    this.props.changeStocks();
  };

  render() {
    let index = 0;
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
                <tr colSpan="21">
                  <td>
                    <span>LOADING...</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Scrollbar>
      </div>
    );
  }
}

const mapStateToProps = ({ stocks, exchange }) => ({
  stocks: stocks,
  exchange: exchange,
});

const mapDispatchToProps = (dispatch) => ({
  changeStocks: () => {
    dispatch(changeStocks());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Tbody);

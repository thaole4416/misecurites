import React, { Component } from "react";
import TRow from "./priceboard.trow";
import { connect } from "react-redux";
import { changeStocks } from "../../redux/index";
import { emitter } from "../../emitter";
class Tbody extends Component {
  constructor(props) {
    super(props);
    this.listenEvent();
    this.state = {
      data: null,
      isLoadEnd: false,
    };
  }

  listenEvent = () => {
    emitter.on("loadingStocks", (isLoadEnd) => {
      if (isLoadEnd) {
        this.setState({ isLoadEnd: true });
      } else this.setState({ isLoadEnd: false });
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
    return (
      <table className="table-row">
        <tbody>
          {this.state.isLoadEnd
            ? this.props.stocks.map((stockData, index) => (
                <TRow
                  key={index}
                  index={index}
                  stock_data={stockData}
                  click={this.click}
                />
              ))
            : 
          <tr colSpan="21">
            <td>
            <span>
              LOADING...
            </span>
            </td>
          </tr>
          }
        </tbody>
      </table>
    );
  }
}

const mapStateToProps = ({ stocks }) => ({
  stocks: stocks,
});

const mapDispatchToProps = (dispatch) => ({
  changeStocks: () => {
    dispatch(changeStocks());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Tbody);

import React, { Component } from "react";
import TRow from "./priceboard.trow";
import { connect } from "react-redux";
import { getStocks, changeStocks } from "../../redux/index";
class Tbody extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    this.setState({ data: this.props.stocks });
  }

  click = () =>{
    console.log('click')
    this.props.changeStocks()
  }

  render() {
    // setInterval(()=>{
    //   data[0].B2= data[0].B2 +  500;
    //   this.forceUpdate()
    // },1000)
    return (
     this.state.data ? <table className="table-row">
        <tbody>
          {this.state.data.map((stockData, index) => (
            <TRow key={index} index={index} stock_data={stockData} click={this.click}/>
          ))}
        </tbody>
      </table>: null
    );
  }
}

const mapStateToProps = ({stocks}) => ({
  stocks: stocks,
});

const mapDispatchToProps = (dispatch) => ({
  getStocks: () => {dispatch(getStocks())},
  changeStocks: () => {dispatch(changeStocks())},
});

export default connect(mapStateToProps,mapDispatchToProps)(Tbody);

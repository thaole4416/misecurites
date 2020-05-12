import React from "react";
import moment from "moment";

class Clock extends React.Component {
  state = { curTime: moment().format("DD/MM/YYYY LTS")};
  setCurrentTIme = () => {
        setInterval(() => {
      this.setState({
        curTime: moment().format("DD/MM/YYYY LTS")
      });
    }, 1000);
  };
  componentDidMount() {
    this.setCurrentTIme();
  }

  render() {
    let time = this.state.curTime;
    return <div className="div">{time} </div>;
  }
}

export default Clock;
import React, { Component } from "react";

let highlightIcon = "";
class HighlightRow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      highlightClass: "no-change",
      highlightIcon: "",
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isCheckHighLight && nextProps.isHighlight > 0) {
      this.setState({ highlightClass: "up-change", highlightIcon: "up" });
      setTimeout(() => this.setState({ highlightClass: "no-change" }), 1000);
    } else if (nextProps.isCheckHighLight && nextProps.isHighlight < 0) {
      this.setState({ highlightClass: "down-change", highlightIcon: "down" });
      setTimeout(() => this.setState({ highlightClass: "no-change" }), 1000);
    }
  }

  render() {
    const { className, style, span, isHighlight } = this.props;
    const { highlightClass, highlightIcon } = this.state;
    return (
      <td className={`${className} ${highlightClass}`} style={style}>
        <span>{span}</span>
      </td>
    );
  }
}

export default HighlightRow;

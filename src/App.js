import React, { Component } from "react";
import Header from "./components/header.page";
import Footer from "./components/footer.page";
import PriceBoard from "./components/priceboard/priceboard.page";
import { Provider } from "react-redux";
import dataStore from "./redux";
import { toast } from "react-toastify";

toast.configure({
  position: toast.POSITION.BOTTOM_RIGHT,
  hideProgressBar: true,
  closeButton: false,
});
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <Provider store={dataStore}>
        <div>
          <Header />
          <PriceBoard />
          <Footer />
        </div>
      </Provider>
    );
  }
}

export default App;

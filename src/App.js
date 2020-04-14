import React, { Component } from 'react'
import Header from './components/header.page'
import Footer from "./components/footer.page";
import PriceBoard from "./components/priceboard/priceboard.page";

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
         
    }
  }

  render() {
    return (
      <div>
        <Header/>
        <PriceBoard/>
        <Footer/>
      </div>
    )
  }
}

export default App


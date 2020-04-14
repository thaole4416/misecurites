import React, { Component } from 'react'
import Menu from "./priceboard.menu";
import StocksTable from "./priceboard.table"

class Priceboard extends Component {
    constructor(props) {
        super(props)

        this.state = {
                 
        }
    }

    render() {
        return (
            <div className="container-priceboard">
                <Menu/>
                <StocksTable/>
            </div>
        )
    }
}

export default Priceboard

import React, { Component } from 'react'

class Footer extends Component {
    constructor(props) {
        super(props)

        this.state = {
                 
        }
    }

    render() {
        return (
            <div className='footer'>
                <p className="td-ft" colSpan='27'>Giá: <span className='green'>x1000</span> Khối lượng: <span className='green'>x10</span></p>
            </div>
        )
    }
}

export default Footer

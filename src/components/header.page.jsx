import React, { Component } from 'react'

class Header extends Component {
    constructor(props) {
        super(props)

        this.state = {
                 
        }
    }

    render() {
        return (
            <div className="header">
            <div className="login div">
              <a href="javascipt:void(0)">
                <span className="glyphicon glyphicon-log-in"></span>
                Đăng nhập
              </a>
            </div>
            <div className="flag">
              <span
                className="vi"
              />
            </div>
          </div>
        )
    }
}

export default Header

/* eslint-disable */
import React from 'react'


class Thead extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }



  render() {

    return (
      <table className='table-top' style={{ border: '1px solid #eee' }} >
        <thead style={{ color: 'white', fontWeight: '100' }}>
          <tr>
            <th className={`th`} rowSpan='2' style={{ width: '5%' }}>Mã CP</th>
            {/* hidden */}
            <th className={`th`} rowSpan='2' style={{ width: '3%' }}>Trần</th>
            <th className={`th`} rowSpan='2' style={{ width: '3%' }}>Sàn</th>
            <th className={`th`} rowSpan='2' style={{ width: '3%' }}>TC</th>
            <th className={`th`} rowSpan='2' style={{ width: '5%' }}>
             

              <p style={{ width: '80%', float: 'left', paddingTop: '10px', fontSize: '12px' }}>
                Tổng KL
              </p>
            </th>
            <th className={`th`} rowSpan='2' style={{ width: '5%' }}>
             

              <p style={{ width: '80%', float: 'left', paddingTop: '10px', fontSize: '12px' }}>
                Giá trị
              </p>
            </th>
            {/* hidden */}

            <th className={``} colSpan='6' style={{ width: '22.5%' }}>Dư mua</th>
            <th colSpan='3' style={{ width: '10.5%' }}>Khớp lệnh</th>
            <th className={``} colSpan='6' style={{ width: '22.5%' }}>Dư bán</th>

          </tr>
          <tr>
            <th className={`th `} style={{ width: '3%' }}>Giá 3</th>
            <th className={`th `} style={{ width: '4.5%' }}>KL 3</th>
            <th className={`th `} style={{ width: '3%' }}>Giá 2</th>
            <th className={`th `} style={{ width: '4.5%' }}>KL2</th>
            <th className={`th `} style={{ width: '3%' }}>Giá 1</th>
            <th className={`th `} style={{ width: '4.5%' }}>KL 1</th>

            <th className={`th`} style={{ width: '3%' }}>Giá</th>
            <th className={`th`} style={{ width: '4%' }}>KL</th>
            <th className={`th`} style={{ width: '3.5%' }}>
              <p style={{ width: '60%', float: 'left', paddingTop: '10px' }}>+/-</p>
            </th>

            <th className={`th `} style={{ width: '3%' }}>Giá 3</th>
            <th className={`th `} style={{ width: '4.5%' }}>KL 3</th>
            <th className={`th `} style={{ width: '3%' }}>Giá 2</th>
            <th className={`th `} style={{ width: '4.5%' }}>KL2</th>
            <th className={`th `} style={{ width: '3%' }}>Giá 1</th>
            <th className={`th `} style={{ width: '4.5%' }}>KL 1</th>


          </tr>
        </thead>
        <tbody></tbody>
      </table>
    );
  }
}


export default Thead;

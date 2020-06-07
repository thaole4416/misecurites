import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'bootstrap/dist/css/bootstrap.css'; 
import './css/app.css'
import './css/header.css'
import './css/footer.css'
import './css/priceboard.css'
import './css/orderPopup.css'
import './css/scrollbar.css'
import 'react-toastify/dist/ReactToastify.min.css'
import 'react-datez/dist/css/react-datez.css';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);


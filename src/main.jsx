import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import GameBoard from './components/GameBoard.jsx'
import { Bounce, ToastContainer } from "react-toastify";

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <GameBoard />
        <ToastContainer
            position="top-center"
            autoClose={1000}
            hideProgressBar
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
            transition={Bounce}
        />
    </React.StrictMode>,
)

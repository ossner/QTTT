import RuleModal from './components/RuleModal'
import React, { useState } from 'react';
import GameBoard from './components/GameBoard';
import { Bounce, toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

const App = () => {
    const [player1, setPlayer1] = useState('');
    const [player2, setPlayer2] = useState('');
    const [startGame, setStartGame] = useState(false);

    const handlePlayerChange = (e, playerNumber) => {
        if (playerNumber === 1) {
            setPlayer1(e.target.value);
        } else {
            setPlayer2(e.target.value);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (player1 && player2) {
            if (player1 === player2) {
                toast.error('The players can\'t have the same name!', {
                    position: "top-center",
                    autoClose: 1000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: 0,
                    theme: "colored",
                    transition: Bounce,
                });
            } else {
                setStartGame(true);

            }
        } else {
            toast.error('Please enter a name for both players', {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: 0,
                theme: "colored",
                transition: Bounce,
            });
        }
    };

    return (
        <div className="app">
            {!startGame ? (
                <Box
                    component="form"
                    sx={{
                        '& > :not(style)': { m: 1, width: '25ch' },
                    }}
                    noValidate
                    onSubmit={handleSubmit}
                    autoComplete="off"
                >
                    <TextField id="outlined-basic" label="Player 1" variant="outlined" value={player1}
                        onChange={(e) => handlePlayerChange(e, 1)} />
                    <TextField id="outlined-basic" label="Player 1" variant="outlined" value={player2}
                        onChange={(e) => handlePlayerChange(e, 2)} />
                    <Button variant="contained" type="submit">Play</Button>
                </Box>

            ) : (
                <GameBoard player1={player1} player2={player2} />
            )
            }
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

            <RuleModal></RuleModal>
        </div>
    )
        ;
};

export default App;

import React, {useState, useEffect} from 'react';
import './GameBoard.css'
import ConfettiExplosion from 'react-confetti-explosion';
import Button from "@mui/material/Button";

const GameBoard = ({player1, player2}) => {
    const [board, setBoard] = useState(Array(3).fill(null).map(() => Array(3).fill(null)));
    const [currentPlayer, setCurrentPlayer] = useState(player1);
    const [isExploding, setIsExploding] = React.useState(false);
    const [winner, setWinner] = useState(null);

    const checkWinner = (newBoard) => {
        // Check rows, columns, and diagonals for a winner
        for (let i = 0; i < 3; i++) {
            if (newBoard[i][0] && newBoard[i][0] === newBoard[i][1] && newBoard[i][0] === newBoard[i][2]) {
                return newBoard[i][0];
            }
            if (newBoard[0][i] && newBoard[0][i] === newBoard[1][i] && newBoard[0][i] === newBoard[2][i]) {
                return newBoard[0][i];
            }
        }
        if (newBoard[0][0] && newBoard[0][0] === newBoard[1][1] && newBoard[0][0] === newBoard[2][2]) {
            return newBoard[0][0];
        }
        if (newBoard[2][0] && newBoard[2][0] === newBoard[1][1] && newBoard[2][0] === newBoard[0][2]) {
            return newBoard[2][0];
        }
        return null;
    };

    const handleClick = (row, col) => {
        if (!board[row][col] && !winner) {
            const newBoard = board.map((r, i) => (i === row ? r.map((c, j) => (j === col ? (currentPlayer === player1 ? 'X' : 'O') : c)) : r));
            setBoard(newBoard);
            const win = checkWinner(newBoard);
            if (win) {
                setWinner(win);
                setIsExploding(true)
            } else {
                setCurrentPlayer(currentPlayer === player1 ? player2 : player1);
            }
        }
    };

    const resetGame = () => {
        setBoard(Array(3).fill(null).map(() => Array(3).fill(null)));
        setCurrentPlayer(player1);
        setWinner(null);
        setIsExploding(false);
    };

    return (
        <div>
            <h2>Game Board</h2>
            {winner ? <h3>Winner: {winner}</h3> : <h3>Current Player: {currentPlayer}</h3>}
            <div className="game-board">
                {board.map((row, i) => (
                    <div key={i} className="board-row">
                        {row.map((cell, j) => (
                            <button key={j} className="cell" onClick={() => handleClick(i, j)}>
                                {cell}
                            </button>
                        ))}
                    </div>
                ))}
            <>{isExploding && <ConfettiExplosion />}</>
            </div>
            <Button variant="contained" onClick={resetGame}>Reset Game</Button>
        </div>
    );
};

export default GameBoard;

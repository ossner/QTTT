// GameBoard.js
import React, { useState } from 'react';
import './GameBoard.css'
import RuleModal from './RuleModal';
import Button from "@mui/material/Button";
import { Bounce, toast } from "react-toastify";

// Cell component to display the state of each cell and handle clicks
const Cell = ({ value, onClick, selected, collapsable }) => {
    // Display the most recent move or an empty space if no moves
    const MovesDisplay = ({ moves }) => {
        return (
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start', maxWidth: '100%' }}>
                {moves.map((move, index) => (
                    <div key={index} style={{ minWidth: '33%', textAlign: 'center', padding: '5px' }}>
                        {move.player}<sub>{move.moveNumber}</sub>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <button className={`cell ${selected ? (collapsable ? "collapsable" : "glow") : ""}`} onClick={onClick}>
            <MovesDisplay moves={value}></MovesDisplay>
        </button>
    );
};

// Function to create the initial board state
const createInitialBoard = () => {
    const size = 3; // 3x3 board
    const board = [];
    for (let row = 0; row < size; row++) {
        const currentRow = [];
        for (let col = 0; col < size; col++) {
            currentRow.push([]); // Each cell starts as an empty array
        }
        board.push(currentRow);
    }
    return board;
};

// Main GameBoard component
const GameBoard = () => {
    const [board, setBoard] = useState(createInitialBoard());
    const [moves, setMoves] = useState([]);
    const [gameGraph, setGameGraph] = useState(new Map());
    const [collapsable, setCollapsable] = useState(false)

    // Function to handle cell clicks
    const handleCellClick = (rowIndex, colIndex) => {
        if (!Array.isArray(board[rowIndex][colIndex])) {
            // If the cell is not an array of moves, but rather a single move, it was already observed and is final
            toast.error('This cell is observed and therefore final!', {
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
            return
        }
        if (!collapsable) {
            if (moves.some(move => move.rowIndex === rowIndex && move.colIndex === colIndex)) {
                const newMoves = moves.filter(move => move.rowIndex !== rowIndex || move.colIndex !== colIndex);

                setMoves(newMoves);
            } else {
                if (moves.length === 2) {
                    toast.error('You can only select two cells!', {
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
                    return
                }
                const nextMoveNumber = getNextMoveNumber(board); // Calculate the next move number

                setMoves([...moves, { rowIndex: rowIndex, colIndex: colIndex, moveNumber: nextMoveNumber }])
            }
        } else {
            if (!moves.some(move => move.rowIndex === rowIndex && move.colIndex === colIndex)) {
                toast.error('You must collapse one of the glowing cells!', {
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
                collapse()

                setCollapsable(false)
                setMoves([])
            }
        }
    };

    // Function to determine the next move number
    const getNextMoveNumber = (board) => {
        const moveNumbers = board.flat().reduce((acc, cell) => {
            const cellMoveNumbers = cell.map(move => move.moveNumber);
            return acc.concat(cellMoveNumbers);
        }, []);

        return moveNumbers.length > 0 ? Math.max(...moveNumbers) + 1 : 1;
    };

    const addEdge = (prevGraph, node1, node2) => {
        const newGraph = new Map(prevGraph);

        if (!newGraph.has(node1)) newGraph.set(node1, new Set());
        if (!newGraph.has(node2)) newGraph.set(node2, new Set());

        newGraph.get(node1).add(node2);
        newGraph.get(node2).add(node1);

        return newGraph;
    };

    const submitMoves = () => {
        if (!collapsable) {
            // If the board is not collapsable yet, simply add the moves made
            const newBoard = board.map(row => row.slice()); // Create a copy of the board
            for (var i = 0; i < moves.length; i++) {
                newBoard[moves[i].rowIndex][moves[i].colIndex].push(
                    { player: moves[i].moveNumber % 2 === 1 ? 'X' : 'O', moveNumber: moves[i].moveNumber}
                ); // Add the move to the selected cells
            }
            const newGraph = addEdge(gameGraph, moves[0].rowIndex * 3 + moves[0].colIndex, moves[1].rowIndex * 3 + moves[1].colIndex)

            if (hasLoop(newGraph)) {
                setCollapsable(true);
            } else {
                setMoves([]);
            }

            setGameGraph(newGraph);
            setBoard(newBoard);
        } else {
            setCollapsable(false);
            // Collapse
            setMoves([]);
        }

    }

    const collapse = () => {
        console.log(moves);
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {board.map((row, rowIndex) => (
                <div key={rowIndex} style={{ display: 'flex' }}>
                    {row.map((cell, colIndex) => {
                        // Check if this cell should glow
                        const isGlowing = moves.some(move => move.rowIndex === rowIndex && move.colIndex === colIndex);
                        return (
                            <Cell
                                key={`${rowIndex}-${colIndex}`}
                                value={cell}
                                selected={isGlowing}
                                collapsable={collapsable}
                                onClick={() => handleCellClick(rowIndex, colIndex)}
                            />
                        );
                    })}
                </div>
            ))}

            <Button variant="contained" disabled={moves.length !== 2 || collapsable} onClick={() => { submitMoves() }}>Submit Move</Button>
            <Button variant="contained" onClick={() => { setBoard(createInitialBoard()), setMoves([]), setGameGraph(new Map()), setCollapsable(false) }}>Reset</Button>
            <a href="https://en.wikipedia.org/wiki/Quantum_tic-tac-toe#Gameplay" target="_blank" rel="noopener noreferrer">
                <Button variant="contained">Rules</Button>
            </a>
        </div>
    );
};

function hasLoop(graph) {
    // Helper function for DFS that includes a parent node to avoid immediate backtracking
    function dfs(node, visited, parent) {
        visited.add(node);

        for (let neighbor of graph.get(node)) {
            // If the neighbor is visited and not the parent, a loop is detected
            if (visited.has(neighbor) && neighbor !== parent) {
                return true;
            }

            // If the neighbor is not visited, recursively visit it, setting the current node as the parent
            if (!visited.has(neighbor)) {
                if (dfs(neighbor, visited, node)) {
                    return true;
                }
            }
        }

        return false;
    }

    const visited = new Set();

    // Iterate over all nodes in the graph to handle disconnected components
    for (let [node] of graph.entries()) {
        // If the node is unvisited, start a DFS from it
        if (!visited.has(node)) {
            if (dfs(node, visited, null)) { // Passing null as there's no parent for the first node
                return true; // Loop detected
            }
        }
    }

    return false; // No loops found
}

export default GameBoard;

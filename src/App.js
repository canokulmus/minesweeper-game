import React, { useState, useEffect } from 'react'
import { create2dCells, difficulties } from './helper'

import LevelCard from './components/LevelCard'
import "./style/main.scss"

//minesweeper game
const App = () => {
    const [bombCount, setBombCount] = useState(150);
    const [cells, setCells] = useState(create2dCells(20, 40, bombCount))
    const [isGameOver, setIsGameOver] = useState(false)
    const [time, setTime] = useState(0)
    const [isGameStarted, setIsGameStarted] = useState(false)
    const [flags, setFlags] = useState(bombCount)
    const [gameResult, setGameResult] = useState("")
    const [isGameWon, setIsGameWon] = useState(false)

    //select difficulty
    const [difficultySelected, setDifficultySelected] = useState(false)
    const [activeDifficulty, setActiveDifficulty] = useState(null)


    //interval set and clear for timer in case of isGameStarted and isGameOver
    useEffect(() => {
        let interval = null
        if (isGameStarted && !isGameOver) {
            interval = setInterval(() => {
                setTime(prevTime => prevTime + 1)
            }, 1000)
        } else if (!isGameStarted || isGameOver) {
            clearInterval(interval)
        }
        return () => clearInterval(interval)
    }, [isGameStarted, isGameOver])

    //game result useEffect
    useEffect(() => {
        if (isGameOver) {
            if (checkIfAllCellsAreRevealed()) {
                setGameResult("You Won")
                setIsGameWon(true)
            } else {
                setGameResult("You Lost")
                setIsGameWon(false)
            }
            revealAllCells()
        }
    }, [isGameOver])


    //reset game
    const resetGame = (row, cell, bomb) => {
        setCells(create2dCells(row, cell, bomb))
        setIsGameOver(false)
        setTime(0)
        setIsGameStarted(false)
        setFlags(bomb)
        setBombCount(bomb)
        setGameResult("")
        setIsGameWon(false)
        setDifficultySelected(true)
    }

    const clickHandler = (r, c) => {

        if (!isGameStarted) {
            setIsGameStarted(true)
        }

        //if flag is clicked
        if (cells[r][c].isFlagged) return;

        //if mine is clicked
        if (cells[r][c].isMine) {
            setIsGameOver(true);
            removeAllFlags();
            revealAllCells();
            setGameResult("Game Over")
        };

        //if surrounding mines is 0
        if (cells[r][c].surroundingMines === 0) {
            revealEmptyCells(r, c);
        }

        //if surrounding mines is not 0
        if (cells[r][c].surroundingMines > 0) {
            revealCell(r, c);
        }

        //if all cells are revealed
        if (checkIfAllCellsAreRevealed()) {
            setIsGameOver(true);
        }
    }

    const checkIfAllCellsAreRevealed = () => {
        let count = 0;
        for (let i = 0; i < cells.length; i++) {
            for (let j = 0; j < cells[i].length; j++) {
                if (cells[i][j].isRevealed) {
                    count++;
                }
            }
        }

        return count === (cells.length * cells[0].length) - bombCount;
    }

    const revealCell = (r, c) => {

        const newCells = [...cells];
        newCells[r][c].isRevealed = true;
        setCells(newCells);
    }

    //most important function of the logic
    const revealEmptyCells = (r, c) => {
        //if cell is already revealed
        if (cells[r][c].isRevealed) return;

        //if cell is flagged
        if (cells[r][c].isFlagged) return;

        //if cell is mine
        if (cells[r][c].isMine) return;

        //if cell is not empty
        if (cells[r][c].surroundingMines !== 0) return;

        //reveal cell
        cells[r][c].isRevealed = true;

        //if cell is not on the edge
        if (r > 0 && r < cells.length - 1 && c > 0 && c < cells[0].length - 1) {
            revealEmptyCells(r - 1, c - 1);
            revealEmptyCells(r - 1, c);
            revealEmptyCells(r - 1, c + 1);
            revealEmptyCells(r, c - 1);
            revealEmptyCells(r, c + 1);
            revealEmptyCells(r + 1, c - 1);
            revealEmptyCells(r + 1, c);
            revealEmptyCells(r + 1, c + 1);
        }

        //if cell is on the edge
        if (r === 0 && c === 0) {
            revealEmptyCells(r, c + 1);
            revealEmptyCells(r + 1, c);
            revealEmptyCells(r + 1, c + 1);
        }

        if (r === 0 && c === cells[0].length - 1) {
            revealEmptyCells(r, c - 1);
            revealEmptyCells(r + 1, c - 1);
            revealEmptyCells(r + 1, c);
        }

        if (r === cells.length - 1 && c === 0) {
            revealEmptyCells(r - 1, c);
            revealEmptyCells(r - 1, c + 1);
            revealEmptyCells(r, c + 1);
        }

        if (r === cells.length - 1 && c === cells[0].length - 1) {
            revealEmptyCells(r - 1, c - 1);
            revealEmptyCells(r - 1, c);
            revealEmptyCells(r, c - 1);
        }

        if (r === 0 && c > 0 && c < cells[0].length - 1) {
            revealEmptyCells(r, c - 1);
            revealEmptyCells(r, c + 1);
            revealEmptyCells(r + 1, c - 1);
            revealEmptyCells(r + 1, c);
            revealEmptyCells(r + 1, c + 1);
        }

        if (r === cells.length - 1 && c > 0 && c < cells[0].length - 1) {
            revealEmptyCells(r - 1, c - 1);
            revealEmptyCells(r - 1, c);
            revealEmptyCells(r - 1, c + 1);
            revealEmptyCells(r, c - 1);
            revealEmptyCells(r, c + 1);
        }

        if (c === 0 && r > 0 && r < cells.length - 1) {
            revealEmptyCells(r - 1, c);
            revealEmptyCells(r - 1, c + 1);
            revealEmptyCells(r, c + 1);
            revealEmptyCells(r + 1, c);
            revealEmptyCells(r + 1, c + 1);
        }

        if (c === cells[0].length - 1 && r > 0 && r < cells.length - 1) {
            revealEmptyCells(r - 1, c - 1);
            revealEmptyCells(r - 1, c);
            revealEmptyCells(r, c - 1);
            revealEmptyCells(r + 1, c - 1);
            revealEmptyCells(r + 1, c);
        }

        //reveal numbered cells around empty cells
        if (r > 0 && r < cells.length - 1 && c > 0 && c < cells[0].length - 1) {
            if (cells[r - 1][c - 1].surroundingMines !== 0) {
                cells[r - 1][c - 1].isRevealed = true;
            }
            if (cells[r - 1][c].surroundingMines !== 0) {
                cells[r - 1][c].isRevealed = true;
            }
            if (cells[r - 1][c + 1].surroundingMines !== 0) {
                cells[r - 1][c + 1].isRevealed = true;
            }
            if (cells[r][c - 1].surroundingMines !== 0) {
                cells[r][c - 1].isRevealed = true;
            }
            if (cells[r][c + 1].surroundingMines !== 0) {
                cells[r][c + 1].isRevealed = true;
            }
            if (cells[r + 1][c - 1].surroundingMines !== 0) {
                cells[r + 1][c - 1].isRevealed = true;
            }
            if (cells[r + 1][c].surroundingMines !== 0) {
                cells[r + 1][c].isRevealed = true;
            }
            if (cells[r + 1][c + 1].surroundingMines !== 0) {
                cells[r + 1][c + 1].isRevealed = true;
            }
        }

        //reveal numbered cells around empty cells on the edge
        if (r === 0 && c === 0) {
            if (cells[r][c + 1].surroundingMines !== 0) {
                cells[r][c + 1].isRevealed = true;
            }
            if (cells[r + 1][c].surroundingMines !== 0) {
                cells[r + 1][c].isRevealed = true;
            }
            if (cells[r + 1][c + 1].surroundingMines !== 0) {
                cells[r + 1][c + 1].isRevealed = true;
            }
        }

        if (r === 0 && c === cells[0].length - 1) {
            if (cells[r][c - 1].surroundingMines !== 0) {
                cells[r][c - 1].isRevealed = true;
            }
            if (cells[r + 1][c - 1].surroundingMines !== 0) {
                cells[r + 1][c - 1].isRevealed = true;
            }
            if (cells[r + 1][c].surroundingMines !== 0) {
                cells[r + 1][c].isRevealed = true;
            }
        }

        if (r === cells.length - 1 && c === 0) {
            if (cells[r - 1][c].surroundingMines !== 0) {
                cells[r - 1][c].isRevealed = true;
            }
            if (cells[r - 1][c + 1].surroundingMines !== 0) {
                cells[r - 1][c + 1].isRevealed = true;
            }
            if (cells[r][c + 1].surroundingMines !== 0) {
                cells[r][c + 1].isRevealed = true;
            }
        }

        if (r === cells.length - 1 && c === cells[0].length - 1) {
            if (cells[r - 1][c - 1].surroundingMines !== 0) {
                cells[r - 1][c - 1].isRevealed = true;
            }
            if (cells[r - 1][c].surroundingMines !== 0) {
                cells[r - 1][c].isRevealed = true;
            }
            if (cells[r][c - 1].surroundingMines !== 0) {
                cells[r][c - 1].isRevealed = true;
            }
        }

        if (r === 0 && c > 0 && c < cells[0].length - 1) {
            if (cells[r][c - 1].surroundingMines !== 0) {
                cells[r][c - 1].isRevealed = true;
            }
            if (cells[r][c + 1].surroundingMines !== 0) {
                cells[r][c + 1].isRevealed = true;
            }
            if (cells[r + 1][c - 1].surroundingMines !== 0) {
                cells[r + 1][c - 1].isRevealed = true;
            }
            if (cells[r + 1][c].surroundingMines !== 0) {
                cells[r + 1][c].isRevealed = true;
            }
            if (cells[r + 1][c + 1].surroundingMines !== 0) {
                cells[r + 1][c + 1].isRevealed = true;
            }
        }

        if (r === cells.length - 1 && c > 0 && c < cells[0].length - 1) {
            if (cells[r - 1][c - 1].surroundingMines !== 0) {
                cells[r - 1][c - 1].isRevealed = true;
            }
            if (cells[r - 1][c].surroundingMines !== 0) {
                cells[r - 1][c].isRevealed = true;
            }
            if (cells[r - 1][c + 1].surroundingMines !== 0) {
                cells[r - 1][c + 1].isRevealed = true;
            }
            if (cells[r][c - 1].surroundingMines !== 0) {
                cells[r][c - 1].isRevealed = true;
            }
            if (cells[r][c + 1].surroundingMines !== 0) {
                cells[r][c + 1].isRevealed = true;
            }
        }

        if (c === 0 && r > 0 && r < cells.length - 1) {
            if (cells[r - 1][c].surroundingMines !== 0) {
                cells[r - 1][c].isRevealed = true;
            }
            if (cells[r - 1][c + 1].surroundingMines !== 0) {
                cells[r - 1][c + 1].isRevealed = true;
            }
            if (cells[r][c + 1].surroundingMines !== 0) {
                cells[r][c + 1].isRevealed = true;
            }
            if (cells[r + 1][c].surroundingMines !== 0) {
                cells[r + 1][c].isRevealed = true;
            }
            if (cells[r + 1][c + 1].surroundingMines !== 0) {
                cells[r + 1][c + 1].isRevealed = true;
            }
        }

        if (c === cells[0].length - 1 && r > 0 && r < cells.length - 1) {
            if (cells[r - 1][c - 1].surroundingMines !== 0) {
                cells[r - 1][c - 1].isRevealed = true;
            }
            if (cells[r - 1][c].surroundingMines !== 0) {
                cells[r - 1][c].isRevealed = true;
            }
            if (cells[r][c - 1].surroundingMines !== 0) {
                cells[r][c - 1].isRevealed = true;
            }
            if (cells[r + 1][c - 1].surroundingMines !== 0) {
                cells[r + 1][c - 1].isRevealed = true;
            }
            if (cells[r + 1][c].surroundingMines !== 0) {
                cells[r + 1][c].isRevealed = true;
            }
        }

        if (r > 0 && r < cells.length - 1 && c > 0 && c < cells[0].length - 1) {
            if (cells[r - 1][c - 1].surroundingMines !== 0) {
                cells[r - 1][c - 1].isRevealed = true;
            }
            if (cells[r - 1][c].surroundingMines !== 0) {
                cells[r - 1][c].isRevealed = true;
            }
            if (cells[r - 1][c + 1].surroundingMines !== 0) {
                cells[r - 1][c + 1].isRevealed = true;
            }
            if (cells[r][c - 1].surroundingMines !== 0) {
                cells[r][c - 1].isRevealed = true;
            }
            if (cells[r][c + 1].surroundingMines !== 0) {
                cells[r][c + 1].isRevealed = true;
            }
            if (cells[r + 1][c - 1].surroundingMines !== 0) {
                cells[r + 1][c - 1].isRevealed = true;
            }
            if (cells[r + 1][c].surroundingMines !== 0) {
                cells[r + 1][c].isRevealed = true;
            }
            if (cells[r + 1][c + 1].surroundingMines !== 0) {
                cells[r + 1][c + 1].isRevealed = true;
            }
        }

        //if cell are flagged and surrounding mines are 0, reveal all surrounding cells
        if (cells[r][c].isFlagged && cells[r][c].surroundingMines === 0) {
            if (r === 0 && c === 0) {
                cells[r][c + 1].isRevealed = true;
                cells[r + 1][c].isRevealed = true;
                cells[r + 1][c + 1].isRevealed = true;
            }
            if (r === 0 && c === cells[0].length - 1) {
                cells[r][c - 1].isRevealed = true;
                cells[r + 1][c - 1].isRevealed = true;
                cells[r + 1][c].isRevealed = true;
            }
            if (r === cells.length - 1 && c === 0) {
                cells[r - 1][c].isRevealed = true;
                cells[r - 1][c + 1].isRevealed = true;
                cells[r][c + 1].isRevealed = true;
            }
            if (r === cells.length - 1 && c === cells[0].length - 1) {
                cells[r - 1][c - 1].isRevealed = true;
                cells[r - 1][c].isRevealed = true;
                cells[r][c - 1].isRevealed = true;
            }

            if (r === 0 && c > 0 && c < cells[0].length - 1) {
                cells[r][c - 1].isRevealed = true;
                cells[r][c + 1].isRevealed = true;
                cells[r + 1][c - 1].isRevealed = true;
                cells[r + 1][c].isRevealed = true;
                cells[r + 1][c + 1].isRevealed = true;
            }

            if (r === cells.length - 1 && c > 0 && c < cells[0].length - 1) {
                cells[r - 1][c - 1].isRevealed = true;
                cells[r - 1][c].isRevealed = true;
                cells[r - 1][c + 1].isRevealed = true;
                cells[r][c - 1].isRevealed = true;
                cells[r][c + 1].isRevealed = true;
            }

            if (c === 0 && r > 0 && r < cells.length - 1) {
                cells[r - 1][c].isRevealed = true;
                cells[r - 1][c + 1].isRevealed = true;
                cells[r][c + 1].isRevealed = true;
                cells[r + 1][c].isRevealed = true;
                cells[r + 1][c + 1].isRevealed = true;
            }

            if (c === cells[0].length - 1 && r > 0 && r < cells.length - 1) {
                cells[r - 1][c - 1].isRevealed = true;
                cells[r - 1][c].isRevealed = true;
                cells[r][c - 1].isRevealed = true;
                cells[r + 1][c - 1].isRevealed = true;
                cells[r + 1][c].isRevealed = true;
            }

            if (r > 0 && r < cells.length - 1 && c > 0 && c < cells[0].length - 1) {
                cells[r - 1][c - 1].isRevealed = true;
                cells[r - 1][c].isRevealed = true;
                cells[r - 1][c + 1].isRevealed = true;
                cells[r][c - 1].isRevealed = true;
                cells[r][c + 1].isRevealed = true;
                cells[r + 1][c - 1].isRevealed = true;
                cells[r + 1][c].isRevealed = true;
                cells[r + 1][c + 1].isRevealed = true;
            }
        }


        //set cells
        setCells([...cells]);

    }

    const revealAllCells = () => {
        const newCells = cells.slice()
        for (let i = 0; i < newCells.length; i++) {
            for (let j = 0; j < newCells[i].length; j++) {
                newCells[i][j].isRevealed = true
            }
        }
        setCells(newCells)
    }

    const removeAllFlags = () => {
        const newCells = cells.slice()
        for (let i = 0; i < newCells.length; i++) {
            for (let j = 0; j < newCells[i].length; j++) {
                newCells[i][j].isFlagged = false
            }
        }
        setCells(newCells)
    }

    const flagHandler = (r, c) => {

        if (cells[r][c].isRevealed) return;

        //if cell is not flagged and there is no flag left to place then return
        if (!cells[r][c].isFlagged && flags === 0) return;

        //toggle flag
        cells[r][c].isFlagged = !cells[r][c].isFlagged;


        //if cell is flagged then decrement flags
        if (cells[r][c].isFlagged) {

            setFlags(flags - 1);

        }
        //if cell is unflagged then increment flags
        else {

            setFlags(flags + 1);

        }

        //set cells
        setCells([...cells]);




    }

    const backToMenu = () => {
        setDifficultySelected(false);
    }
    const replay = () => {
        let { rows, cols, bombs } = activeDifficulty;
        resetGame(rows, cols, bombs)
    }

    return (
        <div className='top-container container-fluid '>

            {difficultySelected &&
                <div className=' p-3 game-container '>
                    <div
                        className='cell-container'
                    >
                        {/* print cells with map */}
                        {cells.map((row, rowIndex) => {
                            return (
                                <div key={rowIndex} className='row d-flex justify-content-center p-0 m-0 b'>
                                    {row.map((cell, columnIndex) => (
                                        <button
                                            key={cell.id}
                                            className={`single-cell ${cell.isRevealed ? 'revealed' : ''} ${cell.isMine ? 'mine' : ''} ${isGameWon ? "won" : ""}`}
                                            onClick={() => clickHandler(rowIndex, columnIndex)}
                                            //right click
                                            onContextMenu={(e) => {
                                                e.preventDefault()
                                                flagHandler(rowIndex, columnIndex);
                                            }}
                                        >
                                            {cell.isFlagged ? <i className="fa-solid fa-flag"></i> :
                                                cell.isRevealed ?
                                                    cell.isMine ? <i className="fa-solid fa-bomb"></i> :
                                                        `${cell.surroundingMines == 0 ? '' : cell.surroundingMines}` : ""
                                            }
                                        </button>
                                    ))}
                                </div>
                            )
                        })}

                    </div>

                    <div className="container mt-4 ">
                        <div className="row d-flex">

                            <div className="col-12 col-md-2 time ">
                                <h3 className=' text-white'>Time: {time}</h3>
                            </div>
                            <div className="col-12 col-md-2 ">
                                <h3 className=' text-white'>
                                    <i className="fa-solid fa-flag"></i> : {flags}
                                </h3>
                            </div>
                            <div className="col-12 col-md-3 ">
                                <h3 className=' text-white'>
                                    Size: {cells.length} x {cells[0].length}
                                </h3>
                            </div>
                            <div className="col-12 col-md-4  d-flex justify-content-end  ms-auto">
                                <button className='btn btn-dark w-100 me-3' onClick={backToMenu}>
                                    <i className="fa-solid fa-arrow-left me-2"></i>
                                    Back To Menu
                                </button>
                                <button className='btn btn-dark w-100' onClick={replay}>
                                    <i className="fa-solid fa-redo me-2"></i>
                                    Replay
                                </button>
                            </div>
                        </div>
                        <h1 className='text-center text-white my-1 display-4'>{gameResult}</h1>
                    </div>
                </div>
            }

            {!difficultySelected &&

                <div className="container">
                    <h2 className='text-white display-4 text-center mb-5'>Choose Difficulty:</h2>
                    <div className="row d-flex justify-content-center">
                        {difficulties.map((difficulty, index) => {
                            return (
                                <LevelCard
                                    key={index}
                                    difficulty={difficulty}
                                    setDifficultySelected={setDifficultySelected}
                                    resetGame={resetGame}
                                    setActiveDifficulty={setActiveDifficulty}
                                />
                            )
                        }
                        )}
                    </div>
                </div>
            }
        </div >
    )
}

export default App
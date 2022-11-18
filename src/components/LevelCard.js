import React from 'react'
import "../style/main.scss"

const LevelCard = ({ difficulty, setDifficultySelected, resetGame, setActiveDifficulty }) => {

    let { rows, cols, bombs } = difficulty;
    return (

        <div
            className={`card col-3  border-0 m-2 p-0 bg-transparent`}
            onClick={() => {
                resetGame(rows, cols, bombs);
                setActiveDifficulty(difficulty);
            }}
        >
            <img src={`/levels/${difficulty.level}.png`} className="card-img-top" alt="..." />
        </div>



    )
}

export default LevelCard
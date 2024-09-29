import React, { useState } from "react";
import "./grid.css";

const Grid = () => {
  const initialGrid = Array.from({ length: 20 }, () => Array(20).fill(0));
  const [grid, setGrid] = useState(initialGrid);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [path, setPath] = useState([]);

  const handleTileClick = (row, col) => {
    if (start === null) {
      setStart([row, col]);
      const newGrid = [...grid];

      //start point
      newGrid[row][col] = 2;

      setGrid(newGrid);
    } else if (end === null) {
      setEnd([row, col]);
      const newGrid = [...grid];

      // end point
      newGrid[row][col] = 3;

      setGrid(newGrid);
    } else {
      const newGrid = [...grid];

      // obstacle point
      newGrid[row][col] = newGrid[row][col] === 1 ? 0 : 1;

      setGrid(newGrid);
    }
  };

  const handleSubmit = async () => {
    const response = await fetch("https://shortest-path-backend-cdja.onrender.com/api/find-path", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        grid: grid,
        start: start,
        end: end,
      }),
    });

    const data = await response.json();
    setPath(data.path);
  };

  const handleClear = () => {
    setGrid(initialGrid);
    setStart(null);
    setEnd(null);
    setPath([]);
  };

  return (
    <div className="app-container">
      <h1 className="title">Shortest Path Finder</h1>
      <div className="controls">
        <button
          className="submit-button"
          onClick={handleSubmit}
          disabled={start === null || end === null}
        >
          Find Path
        </button>
        <button className="clear-button" onClick={handleClear}>
          Clear Grid
        </button>
      </div>
      <div className="grid-container">
        <div className="grid">
          {grid.map((row, rowIndex) => (
            <div key={rowIndex} className="row">
              {row.map((cell, colIndex) => (
                <div
                  key={colIndex}
                  className={`cell 
                                        ${cell === 1 ? "obstacle" : ""} 
                                        ${
                                          path.some(
                                            (p) =>
                                              p[0] === rowIndex &&
                                              p[1] === colIndex
                                          )
                                            ? "path"
                                            : ""
                                        }
                                        ${cell === 2 ? "start" : ""} 
                                        ${cell === 3 ? "end" : ""}`}
                  onClick={() => handleTileClick(rowIndex, colIndex)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Grid;

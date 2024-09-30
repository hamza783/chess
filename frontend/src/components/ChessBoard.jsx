import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'

const BoardContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Board = styled.div`
  display: grid;
  grid-template-columns: repeat(8, ${props => props.cellSize}px);
  grid-template-rows: repeat(8, ${props => props.cellSize}px);
`

const Square = styled.div`
  background-color: ${props => (props.isLight ? '#d4d4d4' : '#64748b')};
`

const ChessBoard = ({ socket, board, isBlack }) => {
  const [from, setFrom] = useState(null)
  const [cellSize, setCellSize] = useState(0);
  const boardRef = useRef(null);

  const getChessPositionFromIndex = (i, j) => {
    if (i < 0 || i > 7 || j < 0 || j > 7) {
      return "Invalid position";
    }
    
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
    
    return files[j] + ranks[i];
  }

  const handleSquareClick = (square, rowIndex, columnIndex) => {
    if (!from) {
      // set square that needs to move
      setFrom(square?.square)
      return
    }

    const moveTo = getChessPositionFromIndex(rowIndex,columnIndex)
    console.log('debug move', from, moveTo)
    try {
      socket.send(JSON.stringify({
        type: 'move',
        payload: {
          move: {
            from: from,
            to: moveTo
          }
        }
      }))
    } catch (e) {
      console.log('error occurred', e)
    } finally {
      console.log('inside finally')
      setFrom(null)
    }
  }

  const renderBoard = () => {
    console.log('debug', board)
    let rows = board ? [ ...board ] : []
    if (isBlack) {
      // flip the board if not white
      rows = rows.reverse()
    }

    return rows?.map((row, rowIndex) => {
      let squares = row ? [ ...row ] : []
      if (isBlack) {
        squares = squares.reverse()
      }

      return squares?.map((square, colIndex) => (
        <Square 
          key={`${rowIndex}-${colIndex}`} 
          isLight={(rowIndex + colIndex) % 2 === 0}
          cellSize={cellSize}
          style={{ border: `${(from && square?.square === from) ? '2px solid red' : 'none'} `}}
          // onClick={() => handleSquareClick(square, rowIndex, colIndex)}
          onClick={() => handleSquareClick(square, isBlack ? 7 - rowIndex : rowIndex, isBlack ? 7 - colIndex : colIndex)}
        >
          {square ? <img src={`/src/assets/${square.color+square.type}.png`} /> : ''}
        </Square>
      ))
    })
  }

  useEffect(() => {
    const updateSize = () => {
      if (boardRef.current) {
        const boardWidth = boardRef.current.offsetWidth;
        const boardHeight = boardRef.current.offsetHeight;
        const size = Math.floor(Math.min(boardWidth, boardHeight) / 8);
        setCellSize(size);
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [])

  return (
    <BoardContainer ref={boardRef}>
      <Board cellSize={cellSize}>
        {/* {board?.map((row, rowIndex) => (
          row?.map((square, colIndex) => (
            <Square 
              key={`${rowIndex}-${colIndex}`} 
              isLight={(rowIndex + colIndex) % 2 === 0}
              cellSize={cellSize}
              style={{ border: `${(from && square?.square === from) ? '2px solid red' : 'none'} `}}
              onClick={() => handleSquareClick(square, rowIndex, colIndex)}
            >
              {square ? <img src={`/src/assets/${square.color+square.type}.png`} /> : ''}
            </Square>
          ))
        ))} */}
        {renderBoard()}
      </Board>
    </BoardContainer>
  )
}

export default ChessBoard
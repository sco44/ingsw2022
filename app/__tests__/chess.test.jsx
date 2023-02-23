/**
 * @jest-environment node
 */
import '@testing-library/jest-dom'
import { verifyMove, makeMove } from '../pages/api/game' 
import { Chess } from 'chess.js'

test('verify if move is legal', async () => {
  const game = new Chess()
  const legalMove = {from: 'b2', to: 'b3'};
  const result = verifyMove(legalMove, game.fen())
  expect(result).toBeTruthy();
})

test('verify if move is illegal', async () => {
const game = new Chess()
const illegalMove = {from: 'b2', to: 'b5'};
const result = verifyMove(illegalMove, game.fen())
expect(result).toBeFalsy();
})

test('make move', async () => {
  const game = new Chess()
  const move = 'b2b3';
  const newFen = makeMove(move, game.fen())
  expect(newFen).toMatch("rnbqkbnr/pppppppp/8/8/8/1P6/P1PPPPPP/RNBQKBNR b KQkq - 0 1");
})

test('check move is not made', async () => {
  const game = new Chess()
  const move = 'b2b5';
  const newFen = makeMove(move, game.fen())
  expect(newFen).toBeFalsy();
})
/**
 * @jest-environment node
 */
import '@testing-library/jest-dom'
import { fetchFantacitorioScore } from '../services/twitter'
import { fetchFantacitorioTeams } from './../services/twitter';
import clientPromise from '../services/mongo'

test('raccolta punti', async () => {
  // Arrange
  const date = new Date("December 9, 2022 20:00:00")
  const res = {
    newest_id: '1601369919718707201',
    oldest_id: '1601331424732188672',
    result_count: 4
  } 
  // Act
  await new Promise(r => setTimeout(r, 1000));
  const score = await fetchFantacitorioScore(date) 
  // Assert
  expect(score.meta).toMatchObject(res)
})

test('raccolta squadre', async () =>{
const res={
    newest_id: '1585959198885806080',
    oldest_id: '1585947937053577217',
    result_count: 127
}
await new Promise(r => setTimeout(r, 2000));
const team= await fetchFantacitorioTeams()
expect(team.meta).toMatchObject(res)
})

test('classifica', async () => {
  const client = await clientPromise;
  const gamesTable = client.db().collection('fantacitorio');
  let fantaRows = await gamesTable.find({}).toArray();
  let parsedFantaRows = JSON.parse(JSON.stringify(fantaRows))
  expect(parsedFantaRows.length).toBe(68)
})
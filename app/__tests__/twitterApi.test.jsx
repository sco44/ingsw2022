/**
 * @jest-environment node
 */

// import dependencies
import '@testing-library/jest-dom'
import { fetchGhigliottinaWord, fetchTweet, fetchUser, fetchExactTweet, postTweet, fetchReplies } from '../services/twitter'

test('authenticate with app account', async () => {
  // Arrange
  let accountInfo = {
    id: '1593754418310221824',
    name: 'Team11_ingSW',
    username: 'Team11_ingSW'
  }

  // Act
  await new Promise(r => setTimeout(r, 1000));
  let { data } = await fetchUser();

  // Assert
  expect(data).toMatchObject(accountInfo)
})


test('indovinare la ghigliottina', async () => {
  // Arrange
  const date = new Date("2023-01-02T19:00:00.000Z")
  let parola = "GIORNO";
  // Act
  await new Promise(r => setTimeout(r, 1000));
  let data = await fetchGhigliottinaWord(date.getTime());
  // Assert
  expect(data.text.trim()).toMatch(parola)
})


test('tweet relativi ghigliottina', async () => {
  // Arrange
  const date = new Date("2023-01-02T19:00:00.000Z")
  const res = {
    newest_id: '1609986053661761540',
    oldest_id: '1609984165683896320',
    result_count: 86
  }
  // Act
  await new Promise(r => setTimeout(r, 1000));
  let data = await fetchTweet('ghigliottina', date);
  // Assert
  expect(data.meta).toMatchObject(res)
})

test('return a correct tweet', async () => {
  // Arrange
  let id = "1613953871839203350"

  // Act
  await new Promise(r => setTimeout(r, 1000));
  const singleTweet = await fetchExactTweet(id)

  // Assert
  expect(singleTweet.data.id).toMatch(id)
})

test('post a tweet', async () => {
  // Arrange
  let text = "Are you excited for the weekend? " + new Date().toString()

  // Act
  await new Promise(r => setTimeout(r, 1000));
  const singleTweet = await postTweet(text)

  // Assert
  expect(singleTweet.data.text).toMatch(text)
})


test('check tweet replies', async () => {
  //Arrange
  let id = "1612930877952069632"
  const res = {
    newest_id: '1612931385563529220',
    oldest_id: '1612931047641214988',
    result_count: 2
  }
  const date = new Date("2023-01-10T22:00:00.000Z")

  //Act
  await new Promise(r => setTimeout(r, 1000));
  const tweets = await fetchReplies(id, date, "all")

  //Assert
  expect(tweets.meta).toMatchObject(res)
})
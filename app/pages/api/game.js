import clientPromise from '../../services/mongo'
import { ObjectId } from "mongodb";
import { postTweet, fetchReplies } from "../../services/twitter";
import logger from '../../logger/logger'
import { Chess } from 'chess.js'
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export const verifyMove = (move, fen) => {
  const gameCopy = new Chess(fen);
  const result = gameCopy.move(move, { sloppy: true });
  return result; // null if the move was illegal, the move object if the move was legal
}

export const makeMove = (move, fen) => {

  const gameCopy = new Chess(fen);
  const result = gameCopy.move(move.toString(),{ sloppy: true });
  if(result)
    return gameCopy.fen();
  return result; // null if the move was illegal, the move object if the move was legal
}

export default async function handler(req, res) {
  logger.info( req, `${req.method} ${req.url}`)
  const client = await clientPromise;
  const gamesTable = client.db().collection('games');
  switch (req.method) {
    case 'GET':
      if (!(req.query === null)) {
        try {
          let dbRow = await gamesTable.findOne({ _id: ObjectId(req.query.id) })
          res.status(200).json(dbRow)
        } catch (e) {
          console.error('/api/game GET catch ',e)
          logger.error(e, `${req.method} ${req.url} findOne mongo`)
          res.status(500).send();
        }
      }
      res.status(400).send();
      break;

    case 'POST':
      if (!(req.body === null)) {
        try {
          let newFen;
          let dbRow = await gamesTable.findOne({ _id: ObjectId(req.body.id) })
          let now = new Date();
          let tenSecs = new Date(now.setSeconds(now.getSeconds()-15))
          const { data, meta } = await fetchReplies(dbRow.tweetId, tenSecs)
          if (meta.result_count) {
            let counter = {};

            data.map((el => {
              let text = el.text;
              const rule = /(?:[a-h][1-8])/gmi;
              let tmpMove = text.match(rule);
              if(tmpMove !== null){
                let move = { from: tmpMove[0].toLowerCase(), to: tmpMove[1].toLowerCase() }
                if (verifyMove(move, dbRow.fen)) {
                  if (counter.hasOwnProperty(`${tmpMove[0].toLowerCase()}${tmpMove[1].toLowerCase()}`)) {
                    counter[`${tmpMove[0].toLowerCase()}${tmpMove[1].toLowerCase()}`] += 1
                  }
                  else {
                    Object.defineProperty(counter, `${tmpMove[0].toLowerCase()}${tmpMove[1].toLowerCase()}`, {
                      enumerable: true,
                      configurable: false,
                      writable: true,
                      value: 1
                    })
                  }
                }
              }
            }))

            let max = Object.entries(counter).reduce((max, entry) => entry[1] >= max[1] ? entry : max, [0, -Infinity])
            newFen = makeMove(max[0], dbRow.fen)
          }
          else {
            const moves = new Chess(dbRow.fen).moves()
            const move = moves[Math.floor(Math.random() * moves.length)]
            newFen = makeMove(move, dbRow.fen)
          }

          if (newFen === null) {
            const moves = new Chess(dbRow.fen).moves()
            const move = moves[Math.floor(Math.random() * moves.length)]
            newFen = makeMove(move, dbRow.fen)
          }

          let tmpText;
          if (new Chess(newFen).isGameOver()) {
            tmpText =
              `Partita Terminata!
http://prod-team11.snakes.wtf:3000/chess/game/${dbRow._id}`
            global.timerScheduler.removeById(dbRow._id);
          }
          else {
            tmpText =
              `Nuovo turno!
Nuovo FEN:
${newFen}
Rispondi a questo tweet con la mossa che vuoi giocare
http://prod-team11.snakes.wtf:3000/chess/game/${dbRow._id}`
          }
          const tweetPost = await postTweet(tmpText, dbRow.tweetId)
          const updateData = {
            $set: {
              fen: newFen,
              tweetId: tweetPost.data.id
            }
          }
          const filter = { _id: ObjectId(dbRow._id) }
          const update = await gamesTable.findOneAndUpdate(filter, updateData, { returnDocument: "after" })
          res.status(200).json(update.value)
        } catch (e) {
          console.log(e)
          logger.error(e, `${req.method} ${req.url} catch`)
          res.status(500).send();
        }
      }
      res.status(400).send();
      break;

    case 'PUT':
      try {
        const gameData = { fen: new Chess().fen(), tweetId: '' }
        const insert = await gamesTable.insertOne(gameData)

        let tmpText =
          `Nuova partita creata!
Rispondi a questo tweet con la mossa che vuoi giocare
http://prod-team11.snakes.wtf:3000/chess/game/${insert.insertedId}`
        const tweetPost = await postTweet(tmpText)
        const updateData = {
          $set: {
            tweetId: tweetPost.data.id
          }
        }
        const filter = { _id: ObjectId(insert.insertedId) }
        const update = await gamesTable.findOneAndUpdate(filter, updateData, { returnDocument: "after" })
        res.status(200).json(update.value)
      } catch (e) {
        logger.error(e, `${req.method} ${req.url} catch`)
        res.status(500).send();
      }
      break;

    case 'DELETE':
      const drop = await gamesTable.deleteMany({})
      res.status(200).json({ status: 'ok' })
      break;

    default:
      res.status(500).send();
      break;
  }
}

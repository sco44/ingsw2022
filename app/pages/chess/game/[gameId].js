import { useEffect, useRef, useState } from "react";
import { useRouter } from 'next/router'
import { Chessboard } from "react-chessboard";
import clientPromise from '../../../services/mongo';
import { fetchExactTweet } from "../../../services/twitter";
import { Chess } from 'chess.js'
import { ObjectId } from "mongodb";
import Countdown, { zeroPad } from 'react-countdown';
import Link from 'next/link'
import logger from '../../../logger/logger'

export default function Game({ isConnected, gameData, created_at, turnInterval, ...props }) {
  const router = useRouter()
  const countdownRef = useRef(null);
  const { gameId } = router.query
  const [game, setGame] = useState(new Chess(gameData.fen))
  const [gameRow, setGameRow] = useState(gameData);
  const [countdownDate, setCountdownDate] = useState(created_at)

  const updateGame = async () => {
    if (!game.isGameOver()) {
      console.log('called')
      await new Promise(r => setTimeout(r, 5000));
      const rawRes = await fetch(`/api/game?id=${gameId}`)
      const gameRowUpdated = await rawRes.json();
      const rawRes2 = await fetch(`/api/twitter?tweetId=${gameRowUpdated.tweetId}`)
      const { created_at } = await rawRes2.json();
      setGameRow(gameRowUpdated);
      setGame(new Chess(gameRowUpdated.fen));
      setCountdownDate(new Date(created_at).getTime() + (60 * 1000 * turnInterval))
      countdownRef.current.getApi().start()
    }
  }


  const renderer = ({ completed, minutes, seconds }) => {
    if (completed)
      return <><p className="text-center" suppressHydrationWarning={true} >Carico nuovo turno...</p></>;
    else
      return <><p className="text-center" suppressHydrationWarning={true} >{zeroPad(minutes)}:{zeroPad(seconds)} { minutes !== 1 ? "rimanenti" : "rimanente" }</p></>;
  };

  return (
    <>
      <h1 className="display-4"></h1>
      <div className='row'>
        <div className='col-6' style={{width: 100+"%"}}>
          <Chessboard
            areArrowsAllowed={false}
            arePiecesDraggable={false}
            boardOrientation={game.turn() === 'w' ? "white" : "black"}
            position={game.fen()} />
        </div>
        <div className='col'>
          {
            game.isGameOver() ?
              <>
                <p>
                  Partita Terminata
                </p>
              </>
              :<>
              <Countdown
                ref={countdownRef}
                date={countdownDate}
                renderer={renderer}
                // autoStart={false}
                zeroPadTime={2}
                onComplete={() => { updateGame() }}
              />
              <p className="text-center">Turno: {game.turn() === 'w' ? "bianco" : "nero"}</p>
              </>
          }
          <p><Link target={'_blank'} href={`https://twitter.com/Team11_ingSW/status/${gameRow.tweetId}`}>Segui su twitter la partita</Link></p>
          <h4>Come giocare: </h4>
          <p>Clicca sul link e rispondi al tweet con la mossa che vorresti effettuare.</p>
          <p>Esempio: <pre>b2 b3</pre></p>
        </div>
      </div>
    </>)
}

export async function getServerSideProps(context) {
  logger.info( context.req, `${context.req.method} ${context.req.url}`) // https://nextjs.org/docs/basic-features/data-fetching/get-server-side-props
  try {
    const turnInterval = parseInt(process.env.DEFAULT_TURN_DURATION);
    const client = await clientPromise;
    const gamesTable = client.db().collection('games');
    const gameRow = await gamesTable.findOne({ _id: ObjectId(context.query.gameId) });
    let parsedGameRow = JSON.parse(JSON.stringify(gameRow))
    const { data } = await fetchExactTweet(parsedGameRow.tweetId)
    const countdownInitTime = new Date(data.created_at).getTime() + (60 * 1000 * turnInterval)
    return {
      props: {
        isConnected: true,
        gameData: parsedGameRow,
        created_at: countdownInitTime,
        turnInterval: turnInterval
      },
    }
  } catch (e) {
    console.error(e)
    return {
      notFound: true,
    }
  }
}
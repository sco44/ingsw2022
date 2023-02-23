import { useState } from "react";
import Link from 'next/link';
import clientPromise from '../../services/mongo'
import logger from '../../logger/logger'

export default function Chess1({ isConnected, games, ...props }) {
  const [gamesList, setGamesList] = useState(games)

  const handleNewGame = async () => {
    const req = await fetch("/api/game", { method: "PUT" })
    const data = await req.json();

    const timerReq = await fetch("/api/timer", {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: data._id
      }),
    })

    const timerData = await timerReq.json();

    setGamesList([].concat(gamesList, data))

  }

  const dropGamesList = async () => {
    const req = await fetch("/api/game",{ method: "DELETE" })
    const data = await req.json();
    setGamesList([])
  }

  return (
    <>
      <div class="row">
      <h1 className="display-4 col-4">Scacchi #1</h1>
      { process.env.NODE_ENV === 'development' ? <div class="alert alert-success col-4 mt-2" role="alert">
         <h4>{isConnected ? "connesso mongodb" : 'non connesso'}</h4>
      </div> : <></> } 
      <div class="col col-4"></div>
      </div>
      <div className='row'>

        <div className='col'>
          <button type="button" className="btn btn-outline-primary" onClick={() => { handleNewGame() }}>New game</button>
          { process.env.NODE_ENV === 'development' ? <button type="button" className="btn btn-outline-primary" onClick={() => { dropGamesList() }}>Drop list</button> : <></> } 
          

          <ul>
            {gamesList.map((el, index) => 
              <li key={el._id}><Link href={`chess/game/${el._id}`}>Partita {index+1}</Link></li>
            )}
          </ul>
        </div>
      </div>
    </>)
}

export async function getServerSideProps(context) { // https://nextjs.org/docs/basic-features/data-fetching/get-server-side-props
  logger.info( context.req, `${context.req.method} ${context.req.url}`)
  try {
    const client = await clientPromise;
    const gamesTable = client.db().collection('games');
    let gamesRows = await gamesTable.find({}).toArray();
    let parsedGamesRows = JSON.parse(JSON.stringify(gamesRows))
    return {
      props: {
        isConnected: true,
        games: parsedGamesRows,
      },
    }
  } catch (e) {
    console.error(e)
    return {
      props: { isConnected: false },
    }
  }
}
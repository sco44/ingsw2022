import { useState, useEffect, useMemo } from 'react';
import {CustomTable} from '../../components/customTable';
import clientPromise from '../../services/mongo'
// import logger from '../../logger/logger'


export default function Classifica(props) {
  const [rows, setRows] = useState(props.rows);
  const [skipPageReset, setSkipPageReset] = useState(false)

  const data = useMemo(() => rows, [rows])
  const columns  = useMemo(() => [{ Header: 'Nome', accessor: 'nome', width: 450 },{ Header: 'Punteggio', accessor: 'punti', width: 130 }], [])

 // When our cell renderer calls updateMyData, we'll use
  // the rowIndex, columnId and new value to update the
  // original data
  const updateMyData = (rowIndex, columnId, value) => {
    // We also turn on the flag to not reset the page
    let id = rows[rowIndex]['id'];
    setSkipPageReset(true)
    setRows(old =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            [columnId]: value,
          }
        }
        return row
      })
    )
    
  }


  // After data chagnes, we turn the flag back off
  // so that if data actually changes when we're not
  // editing it, the page is reset
  useEffect(() => {
    setSkipPageReset(false)
  }, [data])

  return(<>
  <CustomTable
    columns={columns}
    data={data}
    updateMyData={updateMyData}
    skipPageReset={skipPageReset}

  />
  </>)
}

export async function getServerSideProps(context) {
  // logger.info( context.req, `${context.req.method} ${context.req.url}`)
  try {
    const client = await clientPromise;
    const gamesTable = client.db().collection('fantacitorio');
    let fantaRows = await gamesTable.find({}).toArray();
    let parsedFantaRows = JSON.parse(JSON.stringify(fantaRows))
    let sortedRows = parsedFantaRows.sort((a, b) => b.punti - a.punti )
    return {
      props: {
        isConnected: true,
        rows: sortedRows
      }
    }
  } catch (e) {
    console.error(e)
    return {
      props: { isConnected: false },
    }
  }
}
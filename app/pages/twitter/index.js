import { fetchTweet, fetchGhigliottinaWord } from '../../services/twitter'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import TwitterCard from '../../components/twitterCard';
import { Bar} from 'react-chartjs-2'
import Chart from 'chart.js/auto';
import Link from 'next/link';
import logger from '../../logger/logger'

const Datepicker = dynamic(() => import('../../components/customDatepicker'), {
  ssr: false,
})

export default function Twitter(props) {
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState(props.date);
  const [showMatches, setShowMatches] = useState(false);
  const [PlotData, setPlotData] = useState(null);
  const [PlotDataTemp, setPlotDataTemp] = useState(null);
  const [ShowStats, setShowStats] = useState(false);


  let rightTweet = props.data?.filter(
    (el) => {
      return el.text.search(new RegExp(props.parola, 'i')) >= 0 ? true : false;
    })
  let rightCount = rightTweet.length;

  let wrongTweet = props.data?.filter(
    (el) => {
      return el.text.search(new RegExp(props.parola, 'i')) === -1 ? true : false;
    })

  useEffect(() => {
    router.push(`${router.pathname}?date=${selectedDay}`)
  }, [selectedDay])

  //Tweet corretti e sbagliati
  useEffect(() => {
    setPlotData({
      labels: [
        'tweet ghigliottina'
      ],
      datasets: [{
        label: "Tweet Esatti",
        data: [rightCount],
        backgroundColor: [
          '#FF6384',
        ],
        hoverBackgroundColor: [
          '#FF6384',
        ]
      }
        , {
        label: "Tweet Sbagliati",
        data: [props.data.length - rightCount],
        backgroundColor: [
          '#36A2EB'
        ],
        hoverBackgroundColor: [
          '#36A2EB'
        ]
      }
      ]
    })

  }, [props.data])

  //N tweet nel tempo
  useEffect(() => {
    let tmpSet = new Set();
    let tmpRCount = {};
    let tmpWCount = {};

    props.data.map(x => {
      let tmpDate = new Date(x.created_at)
      let tmpHour = tmpDate.getHours();
      let tmpMin = tmpDate.getMinutes();

      tmpSet.add(`${tmpHour}:${tmpMin < 10 ? '0' : ''}${tmpMin}`)
    })
    let labels1 = [...tmpSet]
    labels1.reverse();

    rightTweet.map((x) => {
      let tmpDate = new Date(x.created_at)
      let tmpHour = tmpDate.getHours();
      let tmpMin = tmpDate.getMinutes();

      if (tmpRCount.hasOwnProperty(`${tmpHour}:${tmpMin < 10 ? '0' : ''}${tmpMin}`)) {
        tmpRCount[`${tmpHour}:${tmpMin < 10 ? '0' : ''}${tmpMin}`] += 1
      }
      else {
        Object.defineProperty(tmpRCount, `${tmpHour}:${tmpMin < 10 ? '0' : ''}${tmpMin}`, {
          enumerable: true,
          configurable: false,
          writable: true,
          value: 1
        })
      }
    })

    wrongTweet.map((x) => {
      let tmpDate = new Date(x.created_at)
      let tmpHour = tmpDate.getHours();
      let tmpMin = tmpDate.getMinutes();

      if (tmpWCount.hasOwnProperty(`${tmpHour}:${tmpMin < 10 ? '0' : ''}${tmpMin}`)) {
        tmpWCount[`${tmpHour}:${tmpMin < 10 ? '0' : ''}${tmpMin}`] += 1
      }
      else {
        Object.defineProperty(tmpWCount, `${tmpHour}:${tmpMin < 10 ? '0' : ''}${tmpMin}`, {
          enumerable: true,
          configurable: false,
          writable: true,
          value: 1
        })
      }
    })

    setPlotDataTemp({
      labels: labels1,
      datasets: [{
        label: "Tweet Esatti",
        data: labels1.map((x) => {
          if (tmpRCount.hasOwnProperty(x))
            return tmpRCount[x];
          else
            return 0
        }),
        backgroundColor: [
          '#008000  '
        ],
        hoverBackgroundColor: [
          '#008000'
        ]
      },
      {
        label: "Tweet Sbagliati",
        data: labels1.map((x) => {
          if (tmpWCount.hasOwnProperty(x))
            return tmpWCount[x];
          else
            return 0
        }),
        backgroundColor: [
          '#FF0000'
        ],
        hoverBackgroundColor: [
          '#FF0000'
        ]
      }]
    })

  }, [props.data])

  return (
    <>
      <h1 className="display-4">#ghigliottina</h1>
      <h1 className="display-6">La ghigliottina  del giorno {new Date(parseInt(props.date)).toLocaleDateString()} è: {props.parola}</h1>
      <p> Tweet Giusti: {rightCount}, Tweet Sbagliati: {props.data.length - rightCount}</p>
      <div className='row justify-content-center g-4 text-center'>
        <div className=' sm col-2 col-4 justify-content-center d-flex'>
          <Datepicker selectedDate={props.date} onSelected={(date) => { setSelectedDay(date) }} />
        </div>
        <div class="row mt-2">
         <div className=' align-self-center justify-content-center d-flex sm col-12'>
          {ShowStats ? "" :
            <button className='btn btn-outline-primary' onClick={() => setShowMatches(!showMatches)}>Mostra {showMatches ? 'tutti' : 'tweet esatti'}</button>}
          <button className='btn btn-outline-primary' onClick={() => setShowStats(!ShowStats)}>Mostra {ShowStats ? 'tweet' : 'grafico'}</button>
          <Link href={'/twitter/stats'}><button className='btn btn-outline-primary' >Statistiche Settimanali</button></Link>
         </div>
      </div>
      </div>

      {ShowStats ?
        <>
          <h2>Statistiche parola Ghigliottina</h2>
          <div className="row mt-3 g-4">
            <div className='col'>

              {PlotData && <Bar
                data={PlotData}
              // width={400}
              // height={400}
              />}
            </div>
            <div className='col'>
              {PlotData && <Bar
                data={PlotDataTemp}
                options={{
                  scales: {
                    y: {
                      ticks: { stepSize: 1 },
                      gridLines: { display: false }
                    }
                  }
                }}
              // width={400}
              // height={400}
              />}
            </div>
          </div>
        </> :
        <div className="row row-cols  row-cols-sm-2 row-cols-md-3 row-cols-lg-4  mt-3 g-4">
          {showMatches ?
            props.data?.filter(
              (el) => {
                return el.text.search(new RegExp(props.parola, 'i')) >= 0 ? true : false;
              })
              .map(
                (singleTweet) => (
                  <TwitterCard
                    key={singleTweet.id}
                    tweetInfo={singleTweet}
                    authorInfo={props.includes?.users.find(
                      (singleUser) =>
                        singleUser['id'] === singleTweet['author_id']
                    )}
                    geoInfo={props.includes?.places?.find(
                      (singlePlace) =>
                        singlePlace['id'] === singleTweet.geo?.place_id
                    )}

                  />
                )
              )
            :
            props.data?.map(
              (singleTweet) => (
                <TwitterCard
                  key={singleTweet.id}
                  tweetInfo={singleTweet}
                  authorInfo={props.includes?.users.find(
                    (singleUser) =>
                      singleUser['id'] === singleTweet['author_id']
                  )}
                  geoInfo={props.includes?.places?.find(
                    (singlePlace) =>
                      singlePlace['id'] === singleTweet.geo?.place_id
                  )}
                />
              )
            )
          }
        </div>
      }
    </>
  )
}

export async function getServerSideProps(context) { // https://nextjs.org/docs/basic-features/data-fetching/get-server-side-props
  logger.info( context.req, `${context.req.method} ${context.req.url}`)
  let date = new Date().getTime();
  if (context.query.hasOwnProperty('date')) {
    let tmpQueryDate = parseInt(context.query.date);
    if (tmpQueryDate < date) {
      date = tmpQueryDate;
    }
  }
  const wordTweet = await fetchGhigliottinaWord(date);
  if (!wordTweet || wordTweet?.meta?.result_count === 0 ) {
    let tmp = new Date(date);
    tmp.setDate(tmp.getDate()-1);
    date = new Date(tmp).getTime()
    return {
      redirect: {
        destination: `/twitter?date=${date}`,
        permanent: false,
      },
    }
  }
  const endTime = new Date(wordTweet.data[0].created_at);
  let words;
  if (wordTweet.hasOwnProperty('text')) {
    words = [ wordTweet.text.trim() ]
  }
  else {
    words = wordTweet.data[0].text.match(/[A-Z]+\p{Lu}/gmu);
  }
  const fullRes = await fetchTweet('ghigliottina', endTime);
  const { data, includes } = fullRes

  return {
    props: {
      "data": data,
      "includes": includes,
      "parola": words[0] || '',
      "date": date
    },
  }
}

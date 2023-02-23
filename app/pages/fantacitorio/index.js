import { useState, useEffect } from "react";
import { fetchFantacitorioScore } from "../../services/twitter";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";
import Link from "next/link";
import clientPromise from '../../services/mongo'
import logger from '../../logger/logger'

export default function Fantacitorio(props) {
  const [PlotData, setPlotData] = useState(null);

  useEffect(() => {
    let pippo = {};

    props.raw?.map((el) => {
      if (pippo.hasOwnProperty(el[2])) {
        pippo[el[2]] += parseInt(el[1]);
      } else {
        Object.defineProperty(pippo, el[2], {
          enumerable: true,
          configurable: false,
          writable: true,
          value: parseInt(el[1]),
        });
      }
    });

    setPlotData({
      labels: Object.keys(pippo),
      datasets: [
        {
          label: ["punti"],
          data: Object.values(pippo),
          backgroundColor: ["#ffb44b"],
          hoverBackgroundColor: ["#FF6384"],
        }
      ]
    });
  }, [props.raw]);

  return (
    <>
      <h1 className="display-4">#fantacitorio del {new Date(props?.date).toLocaleDateString()}</h1>
      <div>
        <Link href="fantacitorio/classifica">
          <button type="button" className="btn btn-outline-primary">
            {" "}
            visualizza Classifica
          </button>
        </Link>
        <Link href="fantacitorio/squadre">
          <button type="button" className="btn btn-outline-primary">
            {" "}
            visualizza squadre
          </button>
        </Link>

      </div>
      {PlotData && (
        <Bar
          data={PlotData}
          // width={400}
          // height={400}
        />
      )}
    </>
  );
}

export async function getServerSideProps(context) {
  logger.info( context.req, `${context.req.method} ${context.req.url}`)
  function myXOR(a, b) {
    return (a ? 1 : 0) ^ (b ? 1 : 0);
  }
  try {
    const client = await clientPromise;
    const episodesTable = client.db().collection('fantacitorioGiornate');
    let episodesRows = await episodesTable.find().sort({seq:-1}).limit(1).toArray();
    let parsedEpisodesRows = JSON.parse(JSON.stringify(episodesRows))

  const score = await fetchFantacitorioScore(parsedEpisodesRows[0]['date']);
  // console.log(score)
  let tmp = "";

  score.data.map((el) => {
    tmp += `${el.text}\n`; //.slice(0,el.entities.hashtags[0].start)
  });

  let str = tmp.split("\n").filter((el) => {
    if (myXOR(el.length > 0, el.match(/[\#]/g)) && el.match(/PUNTI/g))
      return true;
    else return false;
  });

  let reg = new RegExp(/(\d+)\s?\w*\s?\W?\s?([a-zA-Z]+(\s?[a-zA-Z]*)*)/, "gm");
  const array = [...str.toString().matchAll(reg)].map((el) => [
    el[0],
    el[1],
    el[2],
  ]);
  // console.log("m", array);


    return {
      props: {
        isConnected: true,
      // "score": score.data,
      includes: score.includes,
      raw: array,
      date: parsedEpisodesRows[0]['date']
      },
    }
  } catch (e) {
    console.error(e)
    return {
      props: { isConnected: false },
    }
  }

}

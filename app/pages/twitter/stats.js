import { fetchGhigliottinaWord, fetchTweet } from '../../services/twitter';
import logger from '../../logger/logger'

export default function Stats(props) {

  return (
    <>
      <h1>I migliori ghigliottinisti della settimana</h1>
      <p>Dal {new Date(props.lastDay).toLocaleDateString()} al {new Date().toLocaleDateString()}</p>
      <ul>
        {props.standing.map((el, i) => <li key={i}>{el[0]}: {el[1] > 1 ? `${el[1]} corrette` : `${el[1]} corretta`}</li>)}
      </ul>
    </>
  )
}

export async function getServerSideProps(context) {
  logger.info( context.req, `${context.req.method} ${context.req.url}`)
  let date = new Date().getTime();
  let standing = {};

  for (let i = 0; i < 7; i++) {
    const wordTweet = await fetchGhigliottinaWord(date, "recent");
    if (!wordTweet || wordTweet?.meta?.result_count === 0) {
      let tmp = new Date(date);
      tmp.setDate(tmp.getDate() - 1);
      date = new Date(tmp).getTime()
      continue;
    }
    const endTime = new Date(wordTweet.data[0].created_at);
    let word;
    if (wordTweet.hasOwnProperty('text')) {
      word = wordTweet.text.trim()
    }
    else {
      word = wordTweet.data[0].text.match(/[A-Z]+\p{Lu}/gmu)[0].trim();
    }
    const fullRes = await fetchTweet('ghigliottina', endTime, "recent");
    const { data, includes } = fullRes

    data.map((el) => {
      if (el.text.search(new RegExp(word, 'i')) >= 0) {
        let user = includes.users.find(
          (singleUser) =>
            singleUser['id'] === el['author_id']
        )
        if (standing.hasOwnProperty(user.username)) {
          standing[user.username] += 1;
        }
        else {
          Object.defineProperty(standing, user.username, {
            enumerable: true,
            configurable: false,
            writable: true,
            value: 1
          })
        }
      }
    })
    let tmp = new Date(date);
    tmp.setDate(tmp.getDate() - 1);
    date = new Date(tmp).getTime()
  }

  const sortable = Object.entries(standing).sort(([, a], [, b]) => b - a)
  return {
    props: {
      standing: sortable,
      lastDay: date
    }
  }
}
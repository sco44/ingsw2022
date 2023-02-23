import logger from '../../logger/logger'
import { fetchExactTweet } from "../../services/twitter";

export default async function handler(req, res) {
  logger.info( req, `${req.method} ${req.url}`)
  switch (req.method) {
    case 'GET':
      if (!(req.query === null)) {
        try {
          let { data } = await fetchExactTweet(req.query.tweetId)
          res.status(200).json(data)
        } catch (e) {
          logger.error(e, `${req.method} ${req.url} fetchExactTweet fetch`)
          res.status(500).send();
        }
      }
      res.status(400).send();
      break;
    default:
      break;
  }
}
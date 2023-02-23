import logger from '../../logger/logger'
import { ToadScheduler, SimpleIntervalJob, AsyncTask } from 'toad-scheduler';
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  logger.info( req, `${req.method} ${req.url}`)
  if (!global.timerScheduler) {
    global.timerScheduler = new ToadScheduler();
  }

  const task = new AsyncTask(`cambio turno id: ${req.body.id}`, async () => {
    logger.debug( req.body.id, `${req.url} AsyncTask triggered`);
    try {
      const action = await fetch("http://localhost:3000/api/game", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: req.body.id
        })
      })
    } catch (e) {
      logger.error( e, `${req.url} AsyncTask fetch`)
    }
  }, (err) => {
    logger.error(err, `${req.url} AsyncTask error`)
  });

  switch (req.method) {
    case "GET":
      res.status(200).send({ status: 'ok' })
      break;
    case "POST":
      if (!(req.body === null)) {
        logger.debug( req.body, `${req.method} ${req.url} Timer`)
      }
      res.status(200).send({ status: 'ok' })
      break;
    case "PUT":
      if (!(req.body === null)) {
        logger.debug( req.body, `${req.method} ${req.url} Timer`)

        const job = new SimpleIntervalJob(
          { minutes: parseInt(process.env.DEFAULT_TURN_DURATION), runImmediately: false },
          task,
          { id: req.body.id }
        );

        global.timerScheduler.addSimpleIntervalJob(job)

        // console.log('job', job)

        res.status(200).send({ status: 'ok' })
      }
      res.status(400).send();
      break;
    case "DELETE":
      if (!(req.body === null)) {
        try {
          global.timerScheduler.removeById(req.body.id)
          // console.log(res)
          res.status(200).send({ status: req.body.id })
        } catch (e) {
          logger.error( e, `${req.method} ${req.url} Timer`)
          res.send(500).send()
        }
      }
      res.status(400).send();
      break;
    default:
      break;

  }

}

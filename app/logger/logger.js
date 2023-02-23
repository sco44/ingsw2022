import pino from 'pino'
import { createPinoBrowserSend, createWriteStream } from 'pino-logflare'

// create pino-logflare stream
const stream = createWriteStream({
    apiKey: process.env.PINO_APIKEY,
    sourceToken: process.env.PINO_SOURCETOKEN
});

// create pino-logflare browser stream
const send = createPinoBrowserSend({
    apiKey: process.env.PINO_APIKEY,
    sourceToken: process.env.PINO_SOURCETOKEN
});

// create pino logger
const logger = pino({
    browser: {
        transmit: {
            send: send,
        }
    },
    base: {
        env: process.env.NODE_ENV,
    },
}, stream);

export default logger
import Twitter from '@team11ingsw/twitter-lite';
import { createWorker, PSM } from 'tesseract.js';
import logger from '../logger/logger'

let worker; 
(async () => {
  worker = await createWorker();
  await worker.loadLanguage('ita');
  await worker.initialize('ita');
  await worker.setParameters({
    tessedit_pageseg_mode: PSM.SPARSE_TEXT
  })
})();

const client = new Twitter({
  version: "2",
  extension: false,
  bearer_token: process.env.TWITTER_BEARER_TOKEN
});

const team11UserClient = new Twitter({
  version: "2",
  extension: false,
  consumer_key: process.env.TWITTER_TEAM11_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_TEAM11_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_TEAM11_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_TEAM11_ACCESS_TOKEN_SECRET
});

const rateLimit = (response, name) => {
  logger.error(`${name} Rate: ${response._headers.get('x-rate-limit-remaining')} remaining out of ${response._headers.get('x-rate-limit-limit')}`);
  const delta = (response._headers.get('x-rate-limit-reset') * 1000) - Date.now()
  logger.error(`${name} Reset: ${Math.ceil(delta / 1000 / 60)} minutes, at ${new Date(response._headers.get('x-rate-limit-reset') * 1000)}`);
}

export const postTweet = async (text, parentId = "") => {
  let options;
  if (parentId !== "") {
    options = {
      text: text,
      quote_tweet_id: parentId
    }
  } else {
    options = {
      text: text
    }
  }
  try {
    const response = await team11UserClient.post('tweets', options);
    return response;
  }
  catch (e) {
    rateLimit(e, `/services/twitter.js: postTweet()`)
    logger.error(e, `/services/twitter.js: postTweet()`)
    console.log('postTweet',e)
    return null;
  }
}

export const fetchReplies = async (parentId, end=new Date(), type="recent", after="") => {
  try {
    const tweets = await client.get(`tweets/search/${type}`, {
      query: `(in_reply_to_tweet_id:${parentId} OR quotes_of_tweet_id:${parentId}) -is:retweet`,
      // since_id: parentId,
      expansions: "referenced_tweets.id",
      max_results: 100,
      end_time: end.toISOString(),
      "tweet.fields": "referenced_tweets",
      // "user.fields": "description,profile_image_url"
    });
    return tweets;
  }
  catch (e) {
    rateLimit(e, `/services/twitter.js: fetchReplies()`)
    logger.error(e, `/services/twitter.js: fetchReplies()`)
    console.log('fetchReplies',e)
    return null;
  }
}

export const fetchUser = async () => {
  try {
    const response = await team11UserClient.get('users/me')
    return response;
  }
  catch (e) {
    rateLimit(e, `/services/twitter.js: fetchUser()`)
    logger.error(e, `/services/twitter.js: fetchUser()`)
    return null;
  }
}

export const fetchExactTweet = async (id) => {
  try {
    const response = await client.get(`tweets/${id}`, {
      "tweet.fields": "created_at"
    })
    return response;
  }
  catch (e) {
    rateLimit(e, `/services/twitter.js: fetchExactTweet()`)
    logger.error(e, `/services/twitter.js: fetchExactTweet()`)
    return null;
  }
}

export const fetchTweet = async (what, endTime, type = "all") => {
  let end = new Date(endTime.getTime() - (60 * 6 * 1000));
  let start = new Date(endTime.getTime() - (60 * 60 * 1000))

  try {
    if( type === "all")
      await new Promise(r => setTimeout(r, 1000));
    const tweets = await client.get(`tweets/search/${type}`, {
      query: `#${what} -is:retweet -is:reply -(from:quizzettone) -(from:QuizTimeGame) -(from:birdazzone)`,
      expansions: "author_id,geo.place_id,referenced_tweets.id",
      max_results: 100,
      start_time: start.toISOString(),
      end_time: end.toISOString(),
      "place.fields": "id",
      "tweet.fields": "entities,created_at",
      "user.fields": "description,profile_image_url"
    });

    // rateLimit(tweets, 'fetchTweet')
    return tweets;
  } catch (e) {
    if ('errors' in e) {
      //   // Twitter API error
      rateLimit(e, `/services/twitter.js: fetchTweet()`)
      logger.error(e, `/services/twitter.js: fetchTweet()`)
    }
  }
}

export const fetchGhigliottinaWord = async (date = new Date(), type = "all") => {
  let now = new Date();
  let selectedDay = new Date(parseInt(date));
  let end;

  const date1 = new Date('December 18, 2022 00:00:00');


  if ((selectedDay.getDate() !== now.getDate()) || (selectedDay.getMonth() !== now.getMonth()))
    end = new Date(new Date(date).setHours(23, 59, 0, 0))
  else
    end = new Date(now.getTime() - 30 * 1000)
  let start = new Date(new Date(date).setHours(0, 0, 0, 0))

  if (selectedDay.getTime() < date1.getTime()) {
    try {
      if (type === "all")
        await new Promise(r => setTimeout(r, 500));
      const tweets = await client.get(`tweets/search/${type}`, {
        query: "(from:quizzettone) #parola -is:retweet",
        start_time: start.toISOString(),
        end_time: end.toISOString(),
        "tweet.fields": "entities,created_at"
      })
      // rateLimit(tweets, 'fetchGhigliottinaWord')
      return tweets;
    } catch (e) {
        rateLimit(e, `/services/twitter.js: fetchGhigliottinaWord()`)
        logger.error(e, `/services/twitter.js: fetchGhigliottinaWord()`)
    }
  }
  else {
    if (type === "all")
      await new Promise(r => setTimeout(r, 800));
    try {
      const tweets = await client.get(`tweets/search/${type}`, {
        query: "(from:quizzettone) #ghigliottina #ereditiers has:media -is:retweet",
        expansions: 'attachments.media_keys',
        start_time: start.toISOString(),
        end_time: end.toISOString(),
        "tweet.fields": "entities,created_at",
        "media.fields": "url,height",
      })
      let rectangle;
      if (tweets.includes?.media[0].height > 1200) {
        rectangle = { left: 110, top: 1019, width: 630, height: 120 };
      }
      else if (tweets.includes?.media[0].height > 600) {
        rectangle = { left: 55, top: 509, width: 320, height: 60 };
      }
      else {
        return tweets
      }
      const { data: { text } } = await worker.recognize(tweets.includes.media[0].url, { rectangle });
      return { ...tweets, text };
    } catch (e) {
      rateLimit(e, `/services/twitter.js: fetchGhigliottinaWord()`)
      logger.error(e, `/services/twitter.js: fetchGhigliottinaWord()`)
    }
  }

}


export const fetchFantacitorioScore = async (date) => {
  const dateObj =  new Date(date);
  const endTime = new Date(new Date(new Date(date).setDate(dateObj.getDate()+1)).setHours(2,0,0,0))

  try {
    await new Promise(r => setTimeout(r, 500));
    const tweets = await client.get('tweets/search/all', {
      query: "(from:fanta_citorio) #fantacitorio -is:retweet",
      expansions: "author_id",
      start_time: dateObj.toISOString(),
      end_time: endTime.toISOString(),
      "tweet.fields": "entities,created_at",
      "user.fields": "description,profile_image_url",
      max_results: 100
    })
    return tweets;
  } catch (e) {
    rateLimit(e, `/services/twitter.js: fetchFantacitorioScore()`)
    logger.error(e, `/services/twitter.js: fetchFantacitorioScore()`)
  }

}

export const fetchFantacitorioTeams = async () => {

  const startDate = new Date("October 28, 2022 00:00:00")
  const endDate = new Date("October 29, 2022 00:00:00")

  try {
    await new Promise(r => setTimeout(r, 500));
    const tweets = await client.get('tweets/search/all', {
      query: "(from:fanta_citorio) is:retweet has:media has:images",
      expansions: "author_id,attachments.media_keys",
      start_time: startDate.toISOString(),
      end_time: endDate.toISOString(),
      "tweet.fields": "entities,created_at",
      "user.fields": "description,profile_image_url",
      "media.fields": "url,width,height",
      max_results: 500
    })
    // rateLimit(tweets, 'fetchGhigliottinaWord')
    return tweets;
  } catch (e) {
    rateLimit(e, `/services/twitter.js: fetchFantacitorioTeams()`)
    logger.error(e, `/services/twitter.js: fetchFantacitorioTeams()`)
  }

}
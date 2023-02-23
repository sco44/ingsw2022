import { useState } from "react";
import { fetchFantacitorioTeams } from "../../services/twitter";
import logger from '../../logger/logger'
import Carousel from 'react-bootstrap/Carousel';

export default function Squadre(props) {
  const [ itemList ] = useState(props.tweets) 
  const [filteredList, setFilteredList] = useState(props.tweets);
  const match = /RT \@(\w+)/;

  const filterBySearch = (event) => {
    // Access input value
    const query = event.target.value;
    // Create copy of item list
    let updatedList = [...itemList];
    // Include all elements which includes the search query
    updatedList = updatedList.filter((tweetEl) => {
      let user = match.exec(tweetEl.text)[1];
      return user.toLowerCase().indexOf(query.toLowerCase()) !== -1;
    });
    // Trigger render with updated values
    setFilteredList(updatedList);
  };
  return (
    <>
    { filteredList.length > 0 &&
      <Carousel>
        {filteredList.map((tweetEl, i) =>
          <Carousel.Item key={i}>
            <img
              alt={`Squadra di ${match.exec(tweetEl.text)[1]}`}
              className="d-block w-100"
              src={props.media?.find((mediaEl) => mediaEl['media_key'] === tweetEl.attachments?.media_keys[0])?.url} />
            <Carousel.Caption>
              <h3>{match.exec(tweetEl.text)[1]}</h3>
            </Carousel.Caption>
          </Carousel.Item>
        )}
      </Carousel>
      }
      <div className="search-text">Cerca squadra per utente:</div>
      <input id="search-box" onChange={filterBySearch} />
    </>
  );
}

export async function getServerSideProps(context) {
  logger.info(context.req, `${context.req.method} ${context.req.url}`)
  try {
    const score = await fetchFantacitorioTeams();
    return {
      props: {
        isConnected: true,
        media: score.includes.media,
        tweets: score.data
      },
    }
  } catch (e) {
    console.error(e)
    return {
      props: { isConnected: false },
    }
  }

}

// import dependencies
import React from 'react'
// import react-testing methods
import {render, fireEvent, waitFor, screen} from '@testing-library/react'
// add custom jest matchers from jest-dom
import '@testing-library/jest-dom'
import TwitterCard from '../components/twitterCard'

test('loads twitterCard', async () => {
  // Arrange
  let props = {
    tweetInfo: {
      text: "mock tweet",
      id: 1
    },
    authorInfo: {
      name: 'nome',
      username: 'user',
      id: 2,
      profile_image_url: 'https://abs.twimg.com/sticky/default_profile_images/default_profile.png'
    },
    geoInfo: {
      full_name: 'Bologna',
      id: 3
    }
  }
  const {container} = render(<TwitterCard {...props} />);

  // Act
  // Assert
})

test('loads charts', async () => {
  // Arrange
  // Act
  // Assert
})
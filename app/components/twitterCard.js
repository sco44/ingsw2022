export default function TwitterCard(props) {
  let profileImageURL = props.authorInfo?.profile_image_url.replace(/_normal/g, "");
  return (
    <div className="col">
      <div role="card" className="card shadow-lg p-3 mb-5 bg-white rounded">
        <img style={{objectFit:'contain'}} alt={`@${props.authorInfo?.username} profile picture`} height={240} className="card-img-top rounded-full h-24 w-24" src={profileImageURL} />
        <div className="card-body">
          <p className="text-truncate card-text">{props.authorInfo?.name} @{props.authorInfo?.username}</p>
          <blockquote className="blockquote">
          <p className="">{props.tweetInfo.text}</p>
          </blockquote>
        </div>
        <div className="card-footer text-muted">
          <p>{new Date(props.tweetInfo?.created_at).toString()}</p>
        {props.geoInfo &&
        <>
          <p className="">📍 {props.geoInfo?.full_name}</p>
          {/* <p className="d-inline-block">user id: {props.authorInfo?.id}</p>
          <p className="d-inline-block">tweet id: {props.tweetInfo.id}</p> */}
        </>}
        </div>
      </div>
    </div>
  )
}
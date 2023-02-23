import logger from '../../../logger/logger'

export default function GameIndex() {
  return (<></>)
}

export async function getServerSideProps(context) { // https://nextjs.org/docs/basic-features/data-fetching/get-server-side-props
  logger.info( context.req, `${context.req.method} ${context.req.url}`)
  return {
    redirect: {
      destination: "/chess",
      permanent: true,
    },
  }
}
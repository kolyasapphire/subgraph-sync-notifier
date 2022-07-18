import dotenv from 'dotenv'
import { request, gql } from 'graphql-request'

process.on('SIGINT', () => {
  console.info('Shutting down')
  process.exit(0)
})

dotenv.config()
const { ENDPOINT, TG_TOKEN, TG_CHAT, SLEEP } = process.env

const query = gql`
  {
    indexingStatuses {
      subgraph
      health
      synced
    }
  }
`

const sleep = (sec) => new Promise((resolve) => setTimeout(resolve, sec * 1000))

const tgBase = `https://api.telegram.org/bot${TG_TOKEN}/`
const tgMessage = tgBase + 'sendMessage'

const sendMessage = async (text) =>
  await fetch(tgMessage, {
    method: 'POST',
    body: JSON.stringify({ chat_id: TG_CHAT, text: text }),
    headers: { 'Content-Type': 'application/json' },
  })

const notify = async (...args) => {
  console.log(...args)
  await sendMessage(args.join(' '))
}

let state = {}

do {
  const isFirstRun = Object.keys(state).length === 0
  try {
    const res = await request(ENDPOINT, query)

    if (res.ok) {
      console.error('res not ok')
      await sleep(60 * 1000)
      continue
    }

    for (const { subgraph, synced, health } of res.indexingStatuses) {
      if (!state.hasOwnProperty(subgraph)) {
        if (!isFirstRun) {
          await notify('new version', subgraph)
        }

        state[subgraph] = { synced, health }
        continue
      }

      const current = state[subgraph]

      if (current.synced !== synced) {
        await notify('sync', current.synced, '->', synced, subgraph)
        current.synced = synced
      }

      if (current.health !== health) {
        await notify('health', current.health, '->', health, subgraph)
        current.health = health
      }
    }
  } catch (e) {
    console.error(e)
    await sleep(60 * 1000)
  }

  await sleep(SLEEP)
} while (true)

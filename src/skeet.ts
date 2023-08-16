import * as TE from 'fp-ts/TaskEither'
import { ErrorMsg } from './decoders'
import { Do } from 'fp-ts-contrib/lib/Do'
import { getJWT } from './auth'
import { getEnvTE } from './env'
import axios from 'axios'
import { Url } from './consts'

type Response = {
  status: number
  data: unknown
}

const requestBody = (did: string) => ({
  collection: 'app.bsky.feed.post',
  repo: did,
  record: {
    text: 'Graças a deus é sexta-feira, hein!',
    createdAt: new Date().toISOString(),
    embed: {
      $type: 'app.bsky.embed.images',
      images: [
        {
          image: {
            $type: 'blob',
            ref: {
              $link:
                'bafkreibdrd3vjhqaxxomr3prbc65lrx3a6ycl5xfvcolsgl76sdpbv23am',
            },
            mimeType: 'image/heic',
            size: 580222,
          },
          alt: 'Cena do filme Shrek 2, onde Shrek diz "Graças a deus é sexta-feira, hein!"',
        },
      ],
    },
  },
})

type ApiCall = (jwt: string, did: string) => () => Promise<Response>
const apiCall: ApiCall = (jwt, did) => () =>
  axios(Url.createRecord, {
    method: 'post',
    headers: {
      'Authorization': `Bearer ${jwt}`,
      'Content-Type': 'application/json',
    },
    data: requestBody(did),
  }).then(({ status, data }) => ({ status, data }))

type Skeet = TE.TaskEither<ErrorMsg, Response>
export const skeet: Skeet = Do(TE.Monad)
  .bind('jwt', getJWT)
  .bind('did', getEnvTE('DID'))
  .bindL('res', ({ jwt, did }) =>
    TE.tryCatch(apiCall(jwt, did), JSON.stringify),
  )
  .return(({ res }) => res)

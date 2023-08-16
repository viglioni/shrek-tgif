import * as TE from 'fp-ts/TaskEither'
import { ErrorMsg } from './decoders'
import { getEnvTE } from './env'
import { Do } from 'fp-ts-contrib/lib/Do'
import axios from 'axios'
import { Url } from './consts'

type CreateSessionRes = {
  accessJwt: string
}

type GetSession = (
  did: string,
  token: string,
) => TE.TaskEither<ErrorMsg, string>

const getSession: GetSession = (did, token) => {
  const payload = {
    identifier: did,
    password: token,
  }

  return TE.tryCatch(
    () =>
      axios
        .post<CreateSessionRes>(Url.createSession, payload)
        .then(res => res.data.accessJwt),
    JSON.stringify,
  )
}

type GetJWT = TE.TaskEither<ErrorMsg, string>
export const getJWT: GetJWT = Do(TE.Monad)
  .bind('token', getEnvTE('TOKEN'))
  .bind('did', getEnvTE('DID'))
  .bindL('jwt', ({ token, did }) => getSession(did, token))
  .return(({ jwt }) => jwt)

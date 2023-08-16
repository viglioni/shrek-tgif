import 'dotenv/config'
import * as TE from 'fp-ts/TaskEither'
import * as E from 'fp-ts/Either'
import { flow, pipe } from 'fp-ts/lib/function'
import * as D from 'io-ts/Decoder'
import { ErrorMsg, ioDecoder } from './decoders'

const envDecoder = pipe(
  D.string,
  D.refine((str): str is string => str.length > 0, 'non empty string'),
)

type GetEnv = (key: string) => E.Either<ErrorMsg, string>
export const getEnv: GetEnv = key =>
  pipe(
    process.env[key],
    ioDecoder(envDecoder),
    E.mapLeft(e => `EnvError: ${key}: ${e}`),
  )

export const getEnvTE = flow(getEnv, TE.fromEither)

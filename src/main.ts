import * as E from 'fp-ts/Either'
import * as IO from 'fp-ts/IO'
import 'dotenv/config'
import { skeet } from './skeet'
import { ErrorMsg } from './decoders'

const throwOrLog: (obj: E.Either<ErrorMsg, unknown>) => void = E.fold(
  (e: ErrorMsg) => {
    throw new Error(e)
  },
  console.info,
)

const main: IO.IO<void> = async () => {
  const res = await skeet()

  throwOrLog(res)
}

main()

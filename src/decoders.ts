import * as D from 'io-ts/Decoder'
import * as E from 'fp-ts/Either'

export type ErrorMsg = string

/**
 * Decodes an object using io-ts
 * @param {D.Decoder} decoder a decoder to be used to decode the object
 * @param {unknown} obj an object to be decoded
 * @returns Either an ErrorMessage (string) or the obj
 */
export const ioDecoder =
  <T>(decoder: D.Decoder<unknown, T>) =>
  (obj: unknown): E.Either<ErrorMsg, T> =>
    E.mapLeft(D.draw)(decoder.decode(obj))

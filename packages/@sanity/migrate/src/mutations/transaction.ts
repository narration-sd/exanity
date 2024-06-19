import {type Mutation} from './types'

export interface Transaction {
  type: 'transaction'
  id?: string
  mutations: Mutation[]
}

/**
 * @public
 *
 * Wraps a set of mutations in a transaction.
 * Note: use with caution. Transactions cannot be optimized and will be submitted one-by-one, which means they will make
 * your migration run slower and produce more API requests.
 * @param transactionId - The transaction ID. This is optional and should usually be omitted, as it will be auto-generated by the server if not provided.
 * @param mutations - The mutations to include in the transaction.
 *
 * {@link https://www.sanity.io/docs/http-mutations#afccc1b9ef78}
 */
export function transaction(transactionId: string, mutations: Mutation[]): Transaction
export function transaction(mutations: Mutation[]): Transaction
export function transaction(
  idOrMutations: string | Mutation[],
  _mutations?: Mutation[],
): Transaction {
  const [id, mutations] =
    typeof idOrMutations === 'string'
      ? [idOrMutations, _mutations as Mutation[]]
      : [undefined, idOrMutations as Mutation[]]
  return {type: 'transaction', id, mutations}
}

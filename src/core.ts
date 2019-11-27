import { Bytes } from '@graphprotocol/graph-ts'

import { SetTokenCreated } from '../generated/Core/Core'

import { Set } from '../generated/schema'

export function handleSetTokenCreated(event: SetTokenCreated): void {
  let set = new Set(event.params._setTokenAddress.toHexString())
  set.address = event.params._setTokenAddress
  set.factory = event.params._factory
  set.components = event.params._components as Array<Bytes>
  set.units = event.params._units
  set.naturalUnit = event.params._naturalUnit
  set.name = event.params._name.toString()
  set.symbol = event.params._symbol.toString()

  set.created = event.block.timestamp
  set.createdAtBlock = event.block.number
  set.createdAtTransaction = event.transaction.hash

  set.save()
}

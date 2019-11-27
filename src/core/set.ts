import { Bytes, log } from '@graphprotocol/graph-ts'

import { SetIssued, SetTokenCreated, SetRedeemed, SetDisabled, SetReenabled } from '../../generated/Core/Core'

import { Set } from '../../generated/schema'

export function handleSetTokenCreated(event: SetTokenCreated): void {
  let set = new Set(event.params._setTokenAddress.toHexString())
  set.address = event.params._setTokenAddress
  set.factory = event.params._factory
  set.components = event.params._components as Array<Bytes>
  set.units = event.params._units
  set.naturalUnit = event.params._naturalUnit
  set.name = event.params._name.toString()
  set.symbol = event.params._symbol.toString()

  set.disabled = false

  set.created = event.block.timestamp
  set.createdAtBlock = event.block.number
  set.createdAtTransaction = event.transaction.hash

  set.save()
}

export function handleSetIssued(event: SetIssued): void {
  let set = Set.load(event.params._setAddress.toHexString())

  if (set != null) {
    log.warning('Set issued, set_address: {}, quantity={}', [
      event.params._setAddress.toHexString(),
      event.params._quantity.toString(),
    ])
  }
}

export function handleSetRedeemed(event: SetRedeemed): void {
  let set = Set.load(event.params._setAddress.toHexString())

  if (set != null) {
    log.warning('Set redeemed, set_address: {}, quantity={}', [
      event.params._setAddress.toHexString(),
      event.params._quantity.toString(),
    ])
  }
}

export function handleSetDisabled(event: SetDisabled): void {
  let set = Set.load(event.params._set.toHexString())

  if (set != null) {
    set.disabled = true
  }
}

export function handleSetReenabled(event: SetReenabled): void {
  let set = Set.load(event.params._set.toHexString())

  if (set != null) {
    set.disabled = false
  }
}

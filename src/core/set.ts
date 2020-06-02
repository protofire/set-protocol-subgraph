import { Bytes, log } from '@graphprotocol/graph-ts'

import { SetIssued, SetTokenCreated, SetRedeemed, SetDisabled, SetReenabled } from '../../generated/Core/Core'
import { SetToken, RebalancingSetTokenV1, RebalancingSetToken } from '../../generated/templates'
import { SetToken as Token } from '../../generated/templates/SetToken/SetToken'

import { IssuanceEvent, RedemptionEvent, Set, SetFactory } from '../../generated/schema'

import { ONE, ZERO, toDecimal } from '../utils/decimal'

export function handleSetTokenCreated(event: SetTokenCreated): void {
  let factory = SetFactory.load(event.params._factory.toHexString())

  if (factory != null) {
    let set = new Set(event.params._setTokenAddress.toHexString())
    set.address = event.params._setTokenAddress
    set.components = event.params._components as Array<Bytes>
    set.factory = factory.id
    set.units = event.params._units
    set.naturalUnit = event.params._naturalUnit
    set.name = event.params._name.toString()
    set.symbol = event.params._symbol.toString()

    set.disabled = false
    set.state = 'DEFAULT'
    set.supply = toDecimal(ZERO)

    set.created = event.block.timestamp
    set.createdAtBlock = event.block.number
    set.createdAtTransaction = event.transaction.hash

    factory.setCount = factory.setCount.plus(ONE)

    factory.save()
    set.save()

    // Start indexing token events
    if (factory.name == 'SetTokenFactory') {
      SetToken.create(event.params._setTokenAddress)
    }
    if (factory.name == 'RebalancingSetTokenFactory') {
      RebalancingSetTokenV1.create(event.params._setTokenAddress)
    } /* RebalancingSetTokenV2Factory or RebalancingSetTokenV3Factory */ else {
      RebalancingSetToken.create(event.params._setTokenAddress)
    }
  } else {
    log.warning('Unknown Set token factory, factory: {}', [event.params._factory.toHexString()])
  }
}

export function handleSetIssued(event: SetIssued): void {
  let set = Set.load(event.params._setAddress.toHexString())

  if (set != null) {
    let token = Token.bind(event.params._setAddress)
    let eventId = set.id + '-ISSUANCE-' + event.transaction.hash.toHex() + '-' + event.logIndex.toString()

    let issuance = new IssuanceEvent(eventId)
    issuance.setToken = set.id
    issuance.amount = toDecimal(event.params._quantity, token.decimals())

    issuance.timestamp = event.block.timestamp
    issuance.block = event.block.number
    issuance.transaction = event.transaction.hash

    issuance.save()
  }
}

export function handleSetRedeemed(event: SetRedeemed): void {
  let set = Set.load(event.params._setAddress.toHexString())

  if (set != null) {
    let token = Token.bind(event.params._setAddress)
    let amount = toDecimal(event.params._quantity, token.decimals())

    let eventId = set.id + '-REDEEM-' + event.transaction.hash.toHex() + '-' + event.logIndex.toString()

    let redeem = new RedemptionEvent(eventId)
    redeem.setToken = set.id
    redeem.amount = amount

    redeem.timestamp = event.block.timestamp
    redeem.block = event.block.number
    redeem.transaction = event.transaction.hash

    redeem.save()
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

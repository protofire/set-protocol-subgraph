import { Address } from '@graphprotocol/graph-ts/index'

import {
  EntryFeePaid,
  NewEntryFee,
  NewFeeRecipient,
  NewLiquidatorAdded,
  NewManagerAdded,
  RebalanceSettled,
  RebalanceStarted,
} from '../../../generated/templates/RebalancingSetToken/RebalancingSetToken'

import { IncentiveFeePaid } from '../../../generated/templates/RebalancingSetToken/RebalancingSetTokenV3'

import { RebalancingSetToken } from '../../../generated/templates/RebalancingSetToken/RebalancingSetToken'

import {
  EntryFeePaymentEvent,
  IncentiveFeePaymentEvent,
  RebalanceSettlementEvent,
  RebalanceStartEvent,
  Set,
  SetFactory,
} from '../../../generated/schema'

import { toDecimal } from '../../utils/decimal'

export { handleTransfer } from './set-token'

export function handleEntryFeePaid(event: EntryFeePaid): void {
  let set = Set.load(event.address.toHexString())

  if (set != null) {
    let feePaid = new EntryFeePaymentEvent(
      set.id + '-ENTRY_FEE_PAID-' + event.transaction.hash.toHex() + '-' + event.logIndex.toString(),
    )

    feePaid.setToken = set.id

    feePaid.feeRecipient = event.params.feeRecipient
    feePaid.feeQuantity = toDecimal(event.params.feeQuantity)

    feePaid.timestamp = event.block.timestamp
    feePaid.block = event.block.number
    feePaid.transaction = event.transaction.hash

    feePaid.save()
  }
}

export function handleIncentiveFeePaid(event: IncentiveFeePaid): void {
  let set = Set.load(event.address.toHexString())

  if (set != null) {
    let feePaid = new IncentiveFeePaymentEvent(
      set.id + '-INCENTIVE_FEE_PAID-' + event.transaction.hash.toHex() + '-' + event.logIndex.toString(),
    )

    feePaid.setToken = set.id

    feePaid.feeRecipient = event.params.feeRecipient
    feePaid.feeQuantity = toDecimal(event.params.feeQuantity)
    feePaid.feePercentage = toDecimal(event.params.feePercentage)
    feePaid.newUnitShares = event.params.newUnitShares

    feePaid.timestamp = event.block.timestamp
    feePaid.block = event.block.number
    feePaid.transaction = event.transaction.hash

    feePaid.save()
  }
}

export function handleNewEntryFee(event: NewEntryFee): void {
  let set = Set.load(event.address.toHexString())

  if (set != null) {
    set.entryFee = toDecimal(event.params.newEntryFee)

    set.save()
  }
}

export function handleNewFeeRecipient(event: NewFeeRecipient): void {
  let set = Set.load(event.address.toHexString())

  if (set != null) {
    set.feeRecipient = event.params.newFeeRecipient

    set.save()
  }
}

export function handleNewLiquidatorAdded(event: NewLiquidatorAdded): void {
  let set = Set.load(event.address.toHexString())

  if (set != null) {
    set.liquidator = event.params.newLiquidator

    set.save()
  }
}

export function handleNewManagerAdded(event: NewManagerAdded): void {
  let set = Set.load(event.address.toHexString())

  if (set != null) {
    set.manager = event.params.newManager

    set.save()
  }
}

export function handleRebalanceSettle(event: RebalanceSettled): void {
  let set = Set.load(event.address.toHexString())

  if (set != null) {
    let factory = SetFactory.load(set.factory)

    if (factory != null) {
      let token = RebalancingSetToken.bind(set.address as Address)

      // Update Set state
      set.state = 'DEFAULT'
      set.units = token.getUnits()

      set.save()

      // Log event
      let eventId = set.id + '-REBALANCE_SETTLE-' + event.transaction.hash.toHex() + '-' + event.logIndex.toString()

      let settlement = new RebalanceSettlementEvent(eventId)
      settlement.setToken = set.id

      settlement.newUnits = set.units

      settlement.rebalanceIndex = event.params.rebalanceIndex
      settlement.issueQuantity = toDecimal(event.params.issueQuantity, token.decimals())
      settlement.unitShares = event.params.unitShares

      if (factory.name == 'RebalancingSetTokenV2Factory') {
        settlement.feeRecipient = event.params.feeRecipient
        settlement.feeQuantity = event.params.feeQuantity
        settlement.feePercentage = event.params.feePercentage
      }

      settlement.timestamp = event.block.timestamp
      settlement.block = event.block.number
      settlement.transaction = event.transaction.hash

      settlement.save()
    }
  }
}

export function handleRebalanceStart(event: RebalanceStarted): void {
  let set = Set.load(event.params.oldSet.toHexString())

  if (set != null) {
    let token = RebalancingSetToken.bind(set.address as Address)

    // Update Set state
    set.state = 'REBALANCE'
    set.components = [event.params.newSet]

    set.save()

    // Log event
    let eventId = set.id + '-REBALANCE_START-' + event.transaction.hash.toHex() + '-' + event.logIndex.toString()

    let rebalanceStart = new RebalanceStartEvent(eventId)
    rebalanceStart.setToken = set.id

    rebalanceStart.oldSet = event.params.oldSet
    rebalanceStart.newSet = event.params.newSet
    rebalanceStart.rebalanceIndex = event.params.rebalanceIndex
    rebalanceStart.currentSetQuantity = toDecimal(event.params.currentSetQuantity, token.decimals())

    rebalanceStart.timestamp = event.block.timestamp
    rebalanceStart.block = event.block.number
    rebalanceStart.transaction = event.transaction.hash

    rebalanceStart.save()
  }
}

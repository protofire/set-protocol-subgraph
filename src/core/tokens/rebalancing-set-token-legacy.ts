import { Address } from '@graphprotocol/graph-ts'

import {
  RebalancingSetToken,
  RebalanceProposed,
  RebalanceStarted,
  SettleRebalanceCall,
} from '../../../generated/templates/RebalancingSetTokenV1/RebalancingSetToken'

import { RebalanceProposalEvent, RebalanceSettlementEvent, RebalanceStartEvent, Set } from '../../../generated/schema'

export { handleTransfer } from './set-token'

export function handleRebalanceProposal(event: RebalanceProposed): void {
  let set = Set.load(event.params.nextSet.toHexString())

  if (set != null) {
    // Update Set state
    set.state = 'PROPOSAL'

    set.save()

    // Log event
    let rebalanceProposal = new RebalanceProposalEvent(
      set.id + '-REBALANCE_PROPOSAL-' + event.transaction.hash.toHex() + '-' + event.logIndex.toString(),
    )

    rebalanceProposal.setToken = set.id

    rebalanceProposal.auctionLibrary = event.params.auctionLibrary
    rebalanceProposal.proposalPeriodEndTime = event.params.proposalPeriodEndTime

    rebalanceProposal.timestamp = event.block.timestamp
    rebalanceProposal.block = event.block.number
    rebalanceProposal.transaction = event.transaction.hash

    rebalanceProposal.save()
  }
}

export function handleRebalanceStart(event: RebalanceStarted): void {
  let set = Set.load(event.params.oldSet.toHexString())

  if (set != null) {
    // Update Set state
    set.state = 'REBALANCE'
    set.components = [event.params.newSet]

    set.save()

    // Log event
    let rebalanceStart = new RebalanceStartEvent(
      set.id + '-REBALANCE_START-' + event.transaction.hash.toHex() + '-' + event.logIndex.toString(),
    )

    rebalanceStart.setToken = set.id

    rebalanceStart.oldSet = event.params.oldSet
    rebalanceStart.newSet = event.params.newSet

    rebalanceStart.timestamp = event.block.timestamp
    rebalanceStart.block = event.block.number
    rebalanceStart.transaction = event.transaction.hash

    rebalanceStart.save()
  }
}

export function handleRebalanceSettle(call: SettleRebalanceCall): void {
  let set = Set.load(call.to.toHexString())

  if (set != null) {
    let token = RebalancingSetToken.bind(set.address as Address)

    // Update Set state
    set.state = 'DEFAULT'
    set.units = token.getUnits()

    set.save()

    // Log event
    let settlement = new RebalanceSettlementEvent(
      set.id + '-REBALANCE_SETTLE-' + call.transaction.hash.toHex() + '-' + call.transaction.index.toString(),
    )

    settlement.setToken = set.id

    settlement.newUnits = set.units

    settlement.timestamp = call.block.timestamp
    settlement.block = call.block.number
    settlement.transaction = call.transaction.hash

    settlement.save()
  }
}

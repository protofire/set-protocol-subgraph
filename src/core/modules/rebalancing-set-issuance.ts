import {
  LogRebalancingSetIssue,
  LogRebalancingSetRedeem,
} from '../../../generated/RebalancingSetIssuanceModule/RebalancingSetIssuanceModule'

import { RebalancingSetIssue, RebalancingSetRedeem } from '../../../generated/schema'

export function handleLogRebalancingSetIssue(event: LogRebalancingSetIssue): void {
  let issue = new RebalancingSetIssue(event.transaction.hash.toHexString() + '-' + event.logIndex.toString())
  issue.rebalancingSetAddress = event.params.rebalancingSetAddress
  issue.callerAddress = event.params.callerAddress
  issue.rebalancingSetQuantity = event.params.rebalancingSetQuantity

  issue.timestamp = event.block.timestamp
  issue.block = event.block.number
  issue.transaction = event.transaction.hash

  issue.save()
}

export function handleLogRebalancingSetRedeem(event: LogRebalancingSetRedeem): void {
  let redeem = new RebalancingSetRedeem(event.transaction.hash.toHexString() + '-' + event.logIndex.toString())
  redeem.rebalancingSetAddress = event.params.rebalancingSetAddress
  redeem.callerAddress = event.params.callerAddress
  redeem.rebalancingSetQuantity = event.params.rebalancingSetQuantity

  redeem.timestamp = event.block.timestamp
  redeem.block = event.block.number
  redeem.transaction = event.transaction.hash

  redeem.save()
}

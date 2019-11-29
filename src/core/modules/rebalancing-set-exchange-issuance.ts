import {
  LogPayableExchangeIssue,
  LogPayableExchangeRedeem,
} from '../../../generated/RebalancingSetExchangeIssuanceModule/RebalancingSetExchangeIssuanceModule'

import { PayableExchangeIssue, PayableExchangeRedeem } from '../../../generated/schema'

export function handleLogPayableExchangeIssue(event: LogPayableExchangeIssue): void {
  let issue = new PayableExchangeIssue(event.transaction.hash.toHexString() + '-' + event.logIndex.toString())
  issue.rebalancingSetAddress = event.params.rebalancingSetAddress
  issue.callerAddress = event.params.callerAddress
  issue.paymentTokenAddress = event.params.paymentTokenAddress
  issue.rebalancingSetQuantity = event.params.rebalancingSetQuantity
  issue.paymentTokenReturned = event.params.paymentTokenReturned

  issue.timestamp = event.block.timestamp
  issue.block = event.block.number
  issue.transaction = event.transaction.hash

  issue.save()
}

export function handleLogPayableExchangeRedeem(event: LogPayableExchangeRedeem): void {
  let redeem = new PayableExchangeRedeem(event.transaction.hash.toHexString() + '-' + event.logIndex.toString())
  redeem.rebalancingSetAddress = event.params.rebalancingSetAddress
  redeem.callerAddress = event.params.callerAddress
  redeem.outputTokenAddress = event.params.outputTokenAddress
  redeem.rebalancingSetQuantity = event.params.rebalancingSetQuantity
  redeem.outputTokenQuantity = event.params.outputTokenQuantity

  redeem.timestamp = event.block.timestamp
  redeem.block = event.block.number
  redeem.transaction = event.transaction.hash

  redeem.save()
}

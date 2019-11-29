import { Bytes } from '@graphprotocol/graph-ts'

import { BidPlaced } from '../../generated/RebalanceAuctionModule/RebalanceAuctionModule'

import { Bid } from '../../generated/schema'

export function handleBidPlaced(event: BidPlaced): void {
  let bid = new Bid(event.transaction.hash.toHexString() + '-' + event.logIndex.toString())
  bid.rebalancingSetToken = event.params.rebalancingSetToken
  bid.bidder = event.params.bidder
  bid.executionQuantity = event.params.executionQuantity
  bid.combinedTokenAddresses = event.params.combinedTokenAddresses as Array<Bytes>
  bid.inflowTokenUnits = event.params.inflowTokenUnits
  bid.outflowTokenUnits = event.params.outflowTokenUnits

  bid.timestamp = event.block.timestamp
  bid.block = event.block.number
  bid.transaction = event.transaction.hash

  bid.save()
}

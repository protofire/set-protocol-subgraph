import { ExchangeAdded, ExchangeRemoved } from '../../generated/Core/Core'

import { Exchange } from '../../generated/schema'

export function handleExchangeAdded(event: ExchangeAdded): void {
  let exchangeId = event.params._exchangeId

  let exchange = new Exchange(exchangeId.toString())
  exchange.address = event.params._exchange

  exchange.created = event.block.timestamp
  exchange.createdAtBlock = event.block.number
  exchange.createdAtTransaction = event.transaction.hash

  exchange.save()
}

export function handleExchangeRemoved(event: ExchangeRemoved): void {
  let exchangeId = event.params._exchangeId
  let exchange = Exchange.load(exchangeId.toString())

  if (exchange != null) {
    exchange.removed = event.block.timestamp
    exchange.removedAtBlock = event.block.number
    exchange.removedAtTransaction = event.transaction.hash

    exchange.save()
  }
}

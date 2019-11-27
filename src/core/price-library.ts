import { PriceLibraryAdded, PriceLibraryRemoved } from '../../generated/Core/Core'

import { PriceLibrary } from '../../generated/schema'

export function handlePriceLibraryAdded(event: PriceLibraryAdded): void {
  let priceLibrary = new PriceLibrary(event.params._priceLibrary.toHexString())
  priceLibrary.address = event.params._priceLibrary

  priceLibrary.created = event.block.timestamp
  priceLibrary.createdAtBlock = event.block.number
  priceLibrary.createdAtTransaction = event.transaction.hash

  priceLibrary.save()
}

export function handlePriceLibraryRemoved(event: PriceLibraryRemoved): void {
  let priceLibrary = PriceLibrary.load(event.params._priceLibrary.toHexString())

  if (priceLibrary != null) {
    priceLibrary.removed = event.block.timestamp
    priceLibrary.removedAtBlock = event.block.number
    priceLibrary.removedAtTransaction = event.transaction.hash

    priceLibrary.save()
  }
}

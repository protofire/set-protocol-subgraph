import { FactoryAdded, FactoryRemoved } from '../../generated/Core/Core'

import { Factory } from '../../generated/schema'

export function handleFactoryAdded(event: FactoryAdded): void {
  let factory = new Factory(event.params._factory.toHexString())
  factory.address = event.params._factory

  factory.created = event.block.timestamp
  factory.createdAtBlock = event.block.number
  factory.createdAtTransaction = event.transaction.hash

  factory.save()
}

export function handleFactoryRemoved(event: FactoryRemoved): void {
  let factory = Factory.load(event.params._factory.toHexString())

  if (factory != null) {
    factory.removed = event.block.timestamp
    factory.removedAtBlock = event.block.number
    factory.removedAtTransaction = event.transaction.hash

    factory.save()
  }
}

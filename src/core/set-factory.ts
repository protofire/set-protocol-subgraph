import { TypedMap } from '@graphprotocol/graph-ts'

import { FactoryAdded, FactoryRemoved } from '../../generated/Core/Core'
import { SetFactory } from '../../generated/schema'

import { ZERO } from '../utils/decimal'

let factories = new TypedMap<string, string>()
factories.set('0xe1cd722575801fe92eeef2ca23396557f7e3b967', 'SetTokenFactory')
factories.set('0x15518cdd49d83471e9f85cdcfbd72c8e2a78dde2', 'RebalancingSetTokenFactory')
factories.set('0x7b636d4102b85a13c3e1d9ad30a4e705423fb65e', 'RebalancingSetTokenV2Factory')
factories.set('0xa367a2513cbd5be1c75a745914521a93e011549c', 'RebalancingSetTokenV3Factory')

function getFactoryType(address: string): string | null {
  if (factories.isSet(address)) {
    return factories.get(address) as string
  }

  return null
}

export function handleFactoryAdded(event: FactoryAdded): void {
  let factory = new SetFactory(event.params._factory.toHexString())
  factory.address = event.params._factory
  factory.name = getFactoryType(factory.id)
  factory.setCount = ZERO

  factory.created = event.block.timestamp
  factory.createdAtBlock = event.block.number
  factory.createdAtTransaction = event.transaction.hash

  factory.save()
}

export function handleFactoryRemoved(event: FactoryRemoved): void {
  let factory = SetFactory.load(event.params._factory.toHexString())

  if (factory != null) {
    factory.removed = event.block.timestamp
    factory.removedAtBlock = event.block.number
    factory.removedAtTransaction = event.transaction.hash

    factory.save()
  }
}

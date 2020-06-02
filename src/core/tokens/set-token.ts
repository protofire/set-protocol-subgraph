import { SetToken, Transfer } from '../../../generated/templates/SetToken/SetToken'

import { Set, TransferEvent } from '../../../generated/schema'

import { toDecimal } from '../../utils/decimal'

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export function handleTransfer(event: Transfer): void {
  let set = Set.load(event.address.toHexString())

  if (set != null) {
    let token = SetToken.bind(event.address)
    let amount = toDecimal(event.params.value, token.decimals())

    if (event.params.from.toHexString() == ZERO_ADDRESS) {
      // Mint event
      set.supply = set.supply.plus(amount)
    } else if (event.params.to.toHexString() == ZERO_ADDRESS) {
      // Burn event
      set.supply = set.supply.minus(amount)
    } else {
      // Transfer event
      let source = Set.load(event.params.from.toHexString())
      let destination = Set.load(event.params.from.toHexString())

      if (source != null) {
        source.supply = source.supply.minus(amount)
      }

      if (destination != null) {
        destination.supply = destination.supply.plus(amount)
      }

      // Log event
      let transfer = new TransferEvent(
        set.id + '-TRANSFER-' + event.transaction.hash.toHex() + '-' + event.logIndex.toString(),
      )

      transfer.setToken = set.id

      transfer.from = event.params.from
      transfer.to = event.params.to
      transfer.amount = amount

      transfer.timestamp = event.block.timestamp
      transfer.block = event.block.number
      transfer.transaction = event.transaction.hash

      transfer.save()
    }
  }
}

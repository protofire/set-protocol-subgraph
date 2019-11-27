import { ModuleAdded, ModuleRemoved } from '../../generated/Core/Core'

import { Module } from '../../generated/schema'

export function handleModuleAdded(event: ModuleAdded): void {
  let module = new Module(event.params._module.toHexString())
  module.address = event.params._module

  module.created = event.block.timestamp
  module.createdAtBlock = event.block.number
  module.createdAtTransaction = event.transaction.hash

  module.save()
}

export function handleModuleRemoved(event: ModuleRemoved): void {
  let module = Module.load(event.params._module.toHexString())

  if (module != null) {
    module.removed = event.block.timestamp
    module.removedAtBlock = event.block.number
    module.removedAtTransaction = event.transaction.hash

    module.save()
  }
}

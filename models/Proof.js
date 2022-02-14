import { types, process, decorate } from "mobx-state-tree"

import { T } from '../localize/localizer';

const Proof = types.model('Proof', {
    hash:               types.identifier(types.string),
    msg:                types.string,
    signature:          types.string,
    counterSignature:   types.optional(types.string, ""), // deafult state is waiting for counter-party signature
})
// .actions(self => ({
//     },
// }))


export default Proof;
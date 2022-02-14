import { types, process, decorate } from "mobx-state-tree"

import { T } from '../localize/localizer';
import KeyPair from './KeyPair';

const Wallet = types.model('Wallet', {
    keys: KeyPair,
})
.actions( self => ({
    signMessage(msg) { return self.keys.signMessage(msg) },
}));

export default Wallet;
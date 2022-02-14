import { types, process, decorate } from "mobx-state-tree"

import { T } from '../localize/localizer';

var uuidv4 = require("uuid/v4");
var ec = new (require("elliptic").eddsa)("ed25519");

function array2str(uint8) {
    var res = "";
    for( var i = 0; i < uint8.length; i++) {
        res += ("0"+uint8[i].toString(16)).slice(-2);
    }
    return res;
}

export function newKeyPair () {
    var array = new Uint8Array(32);
    for( var i = 0; i < 32; i++ ) {
        array[i] = Math.ceil(Math.random() * 255);
    }
    var privateKey = array2str(array);
    var key = ec.keyFromSecret(privateKey);
    var publicKey = array2str(key.getPublic());
    return { public: publicKey, private: privateKey }
}

const KeyPair = types.model('KeyPair', {
    public: types.identifier(types.string),
    private: types.string,
})
.actions( self => ({
    signMessage(msg) { },
}));

export default KeyPair;
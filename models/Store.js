import { SecureStore } from 'expo';
import { types, destroy, decorate } from "mobx-state-tree"

import { T } from '../localize/localizer';
import { Keys } from '../config';

import Wallet from './Wallet'
import Home from './Home'
import Profile from './Profile'
import Contact from './Contact'
import dApp from './dApp'

import { Options } from './Options'
import { LockSettings } from './LockSettings'
import { Preferences } from './Preferences';

// console.log(Options);

export const Store = types.model('Store', {
    wallet:      types.maybe(Wallet),
    homes:       types.array(Home),
    profiles:    types.array(Profile),
    dapps:       types.array(dApp),
    options:     types.maybe(Options),
    preferences: types.maybe(Preferences),
    lockSettings: types.maybe(LockSettings),
})
.actions(self => ({
    setOptions(options) { self.options = options },
    setLockSettings(settings) { self.lockSettings = settings },
    setPreferences(preferences) { self.preferences = preferences },
    setWallet(wallet) { self.wallet = wallet },
    // profiles
    addProfile(profile) { self.profiles.push(profile) },
    removeProfile(profile) { destroy(profile); },
    // homes
    addHome(home) { self.homes.push(home) },
    removeHome(home) { destroy(home); },
    // dApps
    addDApp(dapp) { self.dapps.push(dapp) },
    removeDApp(dapp) { destroy(dapp); },
}))
.views(self => ({
    get allContacts() {
        var jagged = self.profiles.map(p => [...p.contacts]);
        return [].concat.apply([], jagged);
    },
}));

export default Store;
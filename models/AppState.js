import { Store } from './Store';
import { Options, initialOptions } from './Options';
import { newPreferences } from './Preferences';
import { newLockSettings } from './LockSettings'

const AppState = Store.create({
    wallet: null,
    homes: [],
    profiles: [],
    dapps: [],
    options: Options.create(initialOptions),
    preferences: newPreferences(),
    lockSettings: newLockSettings(),
});

export { Store }
export default { AppState }
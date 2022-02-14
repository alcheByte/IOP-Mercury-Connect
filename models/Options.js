import { types, process, decorate } from "mobx-state-tree"

import { T, SupportedLocales, getLocale, setLocale } from '../localize/localizer';

export const Locale = types.model('Locale', {
    value: types.identifier(types.string),
    label: types.string,
})

export const Network = types.model('Network', {
    value: types.identifier(types.string),
    label: types.string,
})

const _SupportedLocales = SupportedLocales.map( loc => Locale.create({label: loc.lang, value: loc.code}));
const _Networks = [
        {label: T('settings.net_prod'),    value: 'prod'},
        {label: T('settings.net_staging'), value: 'staging'}
    ].map( n => Network.create(n));

export const initialOptions = {
    curNetwork: _Networks.find(l => l.value === 'prod'),
    curLocale: _SupportedLocales.find(l => l.value === 'en'),
    supportedLocales: _SupportedLocales,
    networks: _Networks,
    loginOption: 'PIN',
    loginPIN: '4321',
}

export const Options = types.model('Options', {
    curNetwork: types.reference(types.late(() => Network)),
    curLocale: types.reference(types.late(() => Locale)),
    supportedLocales: types.array(Locale),
    networks: types.array(Network),
    loginOption: types.enumeration("LoginType", ["Automatic", "PIN", "Password", "Fingerprint", "Face"]),
    loginPIN: types.optional(types.string, ""),
})
.actions(self => ({
    isTestnet() { return self.curNetwork === 'staging'},
    setLocale(locale) { console.log(`setLocale: ${locale}`);self.curLocale = locale; setLocale(locale.code); },
    setNetwork(network) { console.log(`setNetwork: ${network}`); self.curNetwork = network; }
}))

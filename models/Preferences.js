import { types } from "mobx-state-tree"

export const Preferences = types.model('Preferences', {
    curLocale: types.maybe(types.string),
    lastInactiveTime: types.maybe(types.number),
})
.actions(self => ({
    setLocale(locale) {
        self.curLocale = locale;
        setLocale(locale);
        console.log(`setLocale: ${locale}`);
    },
    setInactive() {
        self.lastInactiveTime = (new Date()).valueOf();
    },
}));

newPreferences = () => { 
    return Preferences.create({
        curLocale: 'en',
    })
};

export { newPreferences }
export default { Preferences }

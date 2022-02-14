import { types, process, decorate } from "mobx-state-tree"

import { T } from '../localize/localizer';

const Home = types.model('Home', {
    address: types.identifier(types.string),
})
.actions(self => ({
    addProfile(profile) {
        // self.profiles.push(profile)
    },
}))


export default Home;
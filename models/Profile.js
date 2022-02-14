import { types, destroy, decorate } from "mobx-state-tree"

import { T } from '../localize/localizer';

import KeyPair from "./KeyPair";

import Home from '../models/Home';
import Contact from './Contact'

export const ProfileTypes = [
    {
        key: 'personal',
        value: T('profile-types.personal'),
    },
    { 
        key: 'business',
        value: T('profile-types.business'),
    },
    { 
        key: 'alias',
        value: T('profile-types.alias'),
    }
]

export const Profile = types.model('Profile', {
    public: false,
    key: KeyPair,
    type: types.enumeration('profile_type', ProfileTypes.map(pt => pt.key)),
    name: "",
    description: "",
    avatarUri: "",
    home: "", // homeRef.address
    contacts: types.array(Contact),
})
.actions( self => ({
    togglePublic() { self.public = !self.public },
    setKey(key) { self.key = key },
    setType(typeKey) { self.type = typeKey },
    setName(name) { self.name = name },
    setDescription(desc) { self.description = desc },
    setHome(home) { self.home = home.address },
    // connections
    addContact(contact) { self.contacts.push(contact) },
    removeContact(contact) { destroy(contact) },
}))
.views( self => ({

}))

export default Profile;
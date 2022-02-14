import { types, process, decorate } from "mobx-state-tree"

import { T } from '../localize/localizer';
import { Proof } from './Proof';

export const ContactTypes = [
    { 
        key: 'family',
        value: T('contact-types.family.label'),
        subTypes : [
            {
                key: 'spouse',
                value: T('contact-types.family.spouse'),
            },
            {
                key: 'sibling',
                value: T('contact-types.family.sibling'),
            },
            {
                key: 'child',
                value: T('contact-types.family.child'),
            },
            {
                key: 'cousin',
                value: T('contact-types.family.cousin'),
            },
            {
                key: 'parent',
                value: T('contact-types.family.parent'),
            },
            {
                key: 'parent-sibling',
                value: T('contact-types.family.parent-sibling'),
            },
        ]
    },
    { 
        key: 'business',
        value: T('contact-types.business.label'),
    },
    { 
        key: 'social',
        value: T('contact-types.social'),
    }
]

const Contact = types.model('Contact', {
    public: types.boolean,
    address: types.identifier(types.string), // from a key.address
    name: types.optional(types.string, ""),
    type: types.string,
    avatarUri: "",
    // proof: types.reference(types.late(() => Proof)),
})
.actions(self => ({
    setName(name) { self.name = name },
    prove(proof) { self.Proof = proof; },
}))


export default Contact;
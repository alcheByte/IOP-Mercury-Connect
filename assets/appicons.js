import {
    createIconSet
} from 'react-native-vector-icons';

const glyphMap = {
    "connections":          57345, // E001
    "home":                 57346, // E002
    "dapps":                57347, // E003
    "profile":              57348, // E004
    "settings":             57349, // E005
    "profile-add":          57350, // E006
    "profile-personal":     57351, // E007
    "profile-alias":        57352, // E008
    "connection-personal":  57353, // E009
    "connection-private":   57354, // E00A
    "starred":              57355, // E00B
    "loved":                57356, // E00C
    "connection-business":  57357, // E00D
    "contacts":             57358, // E00E
}

export const AppIcon = createIconSet(glyphMap, 'mercury-connect', require('../assets/fonts/mercury-connect.ttf'));

export const getImageSource = AppIcon.getImageSource;
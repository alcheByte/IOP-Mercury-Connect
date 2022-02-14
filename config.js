import { Platform, StatusBar, StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';

/**
 * Utility
 */
export function isiPhoneX() {
    const dimen = Dimensions.get('window');
    return (
        Platform.OS === 'ios' &&
        !Platform.isPad &&
        !Platform.isTVOS &&
        (dimen.height === 812 || dimen.width === 812)
    );
}

export function ifiPhoneX(iphoneXStyle, regularStyle) {
    if (isiPhoneX()) {
        return iphoneXStyle;
    }
    return regularStyle;
}

export function getStatusBarHeight(safe) {
    return Platform.select({
        ios: ifiPhoneX(safe ? 44 : 30, 20),
        android: StatusBar.currentHeight
    });
}

/**
 * Colors
 */
const mercury = '#4385AA';
const select = '#0F72CC'; // blue
const go = '#4f721a'; // green
const stop = '#872929'; // red
const action = '#5487ab' // cyan

export const Colors = {
  libertaria: '#CF9A31',
  app: mercury,
  selected: select,
  bodyBG: '#101010',
  bodyFG: '#CCCCCC',
  headerBG: '#202020',
  headerFG: '#808080',
  itemBG: '#181818',
  itemFG: '#AAAAAA',
  categoryBG: '#181818',
  categoryFG: '#B2B96E',
  tabIconDefault: '#808080',
  tabIconSelected: select,
  tabBar: '#202020',
  errorBG: stop,
  errorText: '#fff',
  warningBG: '#EAEB5E',
  warningText: '#666804',
  noticeBG: "#52DFFF",
  noticeText: '#202020',
  buttonBG: action,
  buttonFG: '#202020',
  hintText: '#404040',
  go: go,
  action: action,
};

/**
 * Sizes
 */

export const Sizes = {
  profIcon: 20,
  navIcon: 24,
  navTabWidth: 100,
  navBarHeight: 60,
  cardCornerRadius: 5,
  statusbarHeight: getStatusBarHeight(false),
};

/**
 * Storage Keys
 */

 export const Keys = {
    LockSettings: 'mercury-connect.lock_settings',
    Preferences: 'mercury-connect.preferences',
    Wallet:  'mercury-connect.wallet',
    Homes: 'mercury-connect.homes',
    Profiles: 'mercury-connect.profiles',
 };

 /**
  * images
  */

export const Images = {
    MissingAvatar: 'data:image/png;base64,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',
}
import { SecureStore } from 'expo';
import React from 'react';
import { observer, inject } from 'mobx-react'
import { Actions } from 'react-native-router-flux';
import { StyleSheet, Text, TextInput, View, Alert, Platform, NativeModules, Modal, Clipboard, AsyncStorage } from 'react-native';
import { Container, Content, Row, Header } from 'native-base';
import { Select, Option } from "react-native-chooser";
import PinInput from '../../components/pininput';

import { PopHeader } from '../../components/popheader';
import { T, setLocale } from '../../localize/localizer';

import { newPreferences } from '../../models/Preferences'
import { LockSettings, LockSchedules, LoginOptions } from '../../models/LockSettings'

import { Colors, Keys } from '../../config';

@inject('AppState') @observer
export class Settings extends React.Component {
    constructor(props) {
        super(props);
        this.onConfirmPIN = this.onConfirmPIN.bind(this);
        this.onRecordPIN = this.onRecordPIN.bind(this);
        this.onConfirmPassword = this.onConfirmPassword.bind(this);
        this.onRecordPassword = this.onRecordPassword.bind(this);
        this.state = {
            lockOption: null, deviceHasFaceID: false, deviceHasFingerprint: false,
            msgEnter: null, msgConfirm: null, msgError: null,
            confirmLogin: false, confirmError: false,
            pinCode: null, getPinCode: false,
            password: null, getPassword: false,
            reLaunchOnPop: false, verifyDetach: false,
            savePrefsOnPop: false,
        }
    }

    async componentDidMount() {
        var hasBiometrics = await Expo.Fingerprint.hasHardwareAsync();
        var isEnrolled = await Expo.Fingerprint.isEnrolledAsync();
    }
    
    onPop = async () => {
        if(this.state.savePrefsOnPop) {

        }
        if(this.state.reLaunchOnPop) {
            Actions.jump('launch');
            return;
        }
        Actions.pop();
    }

    setLocale = async (val) => {
        var prefs = this.props.AppState.preferences;
        prefs.setLocale(val);
        await this.savePreferences();
        this.setState({reLaunchOnPop: true});
    }
    
    beginSetLockOption = async (val) => {
        switch(val) {
            case 'none': this.setState({
                lockOption: val
            }, this.finalizeLockOption ); break;
            case 'pin': this.setState({
                lockOption: val,
                getPinCode: true, 
                msgEnter: T('lock_screen.pin_enter'), 
                msgConfirm: T('lock_screen.pin_confirm'), 
                msgError: T('lock_screen.pin_error')
            }); break;
            case 'password': this.setState({
                lockOption: val,
                getPassword: true, 
                msgEnter: T('lock_screen.pwd_enter'), 
                msgConfirm: T('lock_screen.pwd_confirm'), 
                msgError: T('lock_screen.pwd_error')
            }); break;
            case 'biometric': this.setState({
                lockOption: val
            }, this.verifyBiometric ); break;
        }
    }

    finalizeLockOption = async () => {
        var lockSettings = LockSettings.create({...this.props.AppState.lockSettings, option: this.state.lockOption, pin: this.state.pinCode, password: this.state.password})
        console.log(`finalizeLockOption: ${JSON.stringify(lockSettings)}`)
        await SecureStore.setItemAsync(Keys.LockSettings, JSON.stringify(lockSettings));
        this.props.AppState.setLockSettings(lockSettings);
    }

    setLockSchedule = async (val) => {
        var lockSettings = LockSettings.create({...this.props.AppState.lockSettings, schedule: val})
        console.log(`setLockSchedule: ${JSON.stringify(lockSettings)}`)
        await SecureStore.setItemAsync(Keys.LockSettings, JSON.stringify(lockSettings));
        this.props.AppState.setLockSettings(lockSettings);
    }

    setLockAfter = async ({nativeEvent}) => {
        var wait = parseInt(nativeEvent.text);
        var lockSettings = LockSettings.create({...this.props.AppState.lockSettings, lockAfterMinutes: wait})
        console.log(`setLockAfter: ${JSON.stringify(lockSettings)}`)
        await SecureStore.setItemAsync(Keys.LockSettings, JSON.stringify(lockSettings));
        this.props.AppState.setLockSettings(lockSettings);
    }

    savePreferences = async () => {
        var prefs = JSON.stringify(this.props.AppState.preferences);
        console.log(`savePreferences: ${prefs}`);
        await AsyncStorage.setItem(Keys.Preferences, prefs);
    }

    onRecordPIN = async (pins) => {
        let code = pins.map(c => c).join('');
        this.refs._pinInput.clear();
        this.setState({confirmLogin: true, pinCode: code});
    }

    onConfirmPIN = async (pins) => {
        let code = pins.map(c => c).join('');
        if(this.state.pinCode !== code) {
            this.refs._pinInput.clear();
            this.setState({confirmError: true});
        }
        else {
            await this.finalizeLockOption();
            this.setState({getPinCode: false, confirmLogin: false, confirmError: false, reLaunchOnPop: true});
        }
    }

    cancelPIN = () => {
        this.setState({getPinCode: false, confirmLogin: false, confirmError: false});
    }

    onRecordPassword = async ({nativeEvent}) => {
        this.setState({confirmLogin: true, password: nativeEvent.text}, () => {
            this.refs._pwdInput.clear()
        });
    }

    onConfirmPassword = async ({nativeEvent}) => {
        if(this.state.password !== nativeEvent.text) {
            this.refs._pwdInput.clear();
            this.setState({confirmError: true});
        }
        else {
            await this.finalizeLockOption();
            this.setState({getPassword: false, confirmLogin: false, confirmError: false, reLaunchOnPop: true});
        }
    }

    cancelPassword = () => {
        this.setState({getPassword: false, confirmLogin: false, confirmError: false});
    }

    verifyBiometric = async () => {
        console.log(`verifyBiometric >> authenticateAsync()`);
        let authResult = null;
        if (Platform.OS === 'ios') {
            // authResult = await Expo.Fingerprint.authenticateAsync(T('lock_screen.biometric')); // broken workaround follows
            authResult = await NativeModules.ExponentFingerprint.authenticateAsync(T('lock_screen.biometric'));
        } else {
            // authResult = await Expo.Fingerprint.authenticateAsync(); // broken workaround follows
            authResult = await NativeModules.ExponentFingerprint.authenticateAsync();
        }
        console.log(`verifyBiometric >> authResult: ${JSON.stringify(authResult)}`);
        if(authResult.success) {
            this.finalizeLockOption();
            this.setState({reLaunchOnPop: true});
        }
        else {
            Alert.alert(authResult.message);
        }
    }

    detachDevice = async (copyKey) => {
        // TODO: get and copy key to clipboard
        // delete persisted settings
        await SecureStore.deleteItemAsync(Keys.Wallet);
        await SecureStore.deleteItemAsync(Keys.LockSettings);
        await AsyncStorage.removeItem(Keys.Preferences);
        // clear model in case user tries to restore or create new account without exiting app
        this.props.AppState.setPreferences(newPreferences());
        setLocale(this.props.AppState.preferences.curLocale);
        this.setState({verifyDetach: false}, Actions.jump('launch'));
    }

    render() {
        var options = this.props.AppState.options;
        var prefs = this.props.AppState.preferences;
        var lockSettings = this.props.AppState.lockSettings;
        var curLocale = options.supportedLocales.find(l => l.value === prefs.curLocale);
        return (
            <Container style={{backgroundColor: Colors.bodyBG}}>
                <PopHeader title={T('common.settings')} onPop={this.onPop}/>
                <Content style={_styles.page}>
                    <Row style={_styles.row}>
                        <Text style={_styles.label}>{T('settings.current_lang')}</Text>
                        <View style={{flex: 1}}>
                            <Select style={{backgroundColor: Colors.headerBG, alignItems: 'center', alignSelf: 'flex-end', borderWidth: 0}}
                                    selected={curLocale.value}
                                    defaultText={curLocale.label}
                                    textStyle={{color: Colors.action, fontSize: 19, textAlign: 'right'}}
                                    backdropStyle={{backgroundColor: Colors.bodyBG}}
                                    optionListStyle={{backgroundColor: Colors.headerBG, flexGrow: 1, padding: 5, marginTop: 30, marginBottom: 30, alignItems: 'center', borderWidth: 0}}
                                    onSelect={(val, lbl) => this.setLocale(val)}
                                    transparent={true}>
                                    {options.supportedLocales.map( o => 
                                        <Option value={o.value} key={o.value} styleText={{color: Colors.action, fontSize: 19}}>{o.label}</Option>
                                    )}
                            </Select>
                        </View>
                    </Row>
                    <Row style={_styles.row}>
                        <Text style={_styles.label}>{T('settings.lock_option')}</Text>
                        <View style={{flex: 1}}>
                            <Select style={{backgroundColor: Colors.headerBG, alignItems: 'center', alignSelf: 'flex-end', borderWidth: 0}}
                                    defaultText={LoginOptions.find(o => o.value === lockSettings.option).display}
                                    textStyle={{color: Colors.action, fontSize: 19, textAlign: 'right'}}
                                    backdropStyle={{backgroundColor: Colors.bodyBG}}
                                    optionListStyle={{backgroundColor: Colors.headerBG, flexGrow: 1, padding: 5, marginTop: 30, marginBottom: 30, alignItems: 'center', borderWidth: 0}}
                                    onSelect={(val, lbl) => this.beginSetLockOption(val)}
                                    transparent={true}>
                                    { LoginOptions.map( t => 
                                        <Option value={t.value} key={t.value} styleText={{color: Colors.action, fontSize: 19}}>{t.display}</Option>
                                    )}
                            </Select>
                        </View>
                    </Row>
                { lockSettings.option !== 'none' &&
                    <Row style={_styles.row}>
                        <Text style={_styles.label}>{T('settings.lock_schedule')}</Text>
                        <View style={{flex: 1}}>
                            <Select style={{backgroundColor: Colors.headerBG, alignItems: 'center', alignSelf: 'flex-end', borderWidth: 0}}
                                    defaultText={LockSchedules.find(o => o.value === lockSettings.schedule).display}
                                    textStyle={{color: Colors.action, fontSize: 19, textAlign: 'right'}}
                                    backdropStyle={{backgroundColor: Colors.bodyBG}}
                                    optionListStyle={{backgroundColor: Colors.headerBG, flexGrow: 1, padding: 5, marginTop: 30, marginBottom: 30, alignItems: 'center', borderWidth: 0}}
                                    onSelect={(val, lbl) => this.setLockSchedule(val)}
                                    transparent={true}>
                                    { LockSchedules.map( t => 
                                        <Option value={t.value} key={t.value} styleText={{color: Colors.action, fontSize: 19}}>{t.display}</Option>
                                    )}
                            </Select>
                        </View>
                    </Row>
                }
                { lockSettings.schedule === 'inactiveFor' &&
                    <Row style={_styles.row}>
                        <View style={{flex: 1}}/>
                        <View style={{flex: 1, flexDirection: 'row', alignContent: 'stretch'}}>
                            <Text style={_styles.subtext}>{T('common.for')}</Text>
                            <TextInput style={_styles.input} keyboardType='numeric' keyboardAppearance='dark' underlineColorAndroid='transparent'
                                    onEndEditing={this.setLockAfter}>{lockSettings.lockAfterMinutes}</TextInput>
                            <Text style={_styles.subtext}>{T('common.minutes')}</Text>
                        </View>
                    </Row>
                }
                    <Row style={_styles.row}>
                        <Text style={_styles.link} onPress={() => Actions.push('support')}>{T('settings.support')}</Text>
                    </Row>
                    <Row style={_styles.row}>
                        <Text style={_styles.link} onPress={() => this.setState({verifyDetach: true})}>{T('common.detach')}</Text>
                    </Row>
                </Content>
            { this.state.getPinCode && // PIN code recorder
                <Modal animationType={'none'} onRequestClose={() => {}}>
                    <View style={{backgroundColor: Colors.bodyBG, flex: 1, flexDirection: 'column', alignItems: 'center', paddingTop: 30}}>
                        <Text style={_styles.message}>{this.state.confirmLogin ? this.state.msgConfirm : this.state.msgEnter}</Text>
                    { this.state.confirmError && 
                        <Text style={_styles.error}>{this.state.msgError}</Text>
                    }
                        <PinInput ref={"_pinInput"} empty=' ' mask='*' caret='|'
                            onCancel={this.cancelPIN}
                            onPinsCompleted={this.state.confirmLogin ? this.onConfirmPIN : this.onRecordPIN}
                        />
                    </View>
                </Modal>
            }
            { this.state.getPassword && // password
                <Modal animationType={'none'} onRequestClose={() => {}}>
                    <View style={{backgroundColor: Colors.bodyBG, flex: 1, flexDirection: 'column', alignItems: 'center', paddingTop: 30}}>
                        <Text style={_styles.message}>{this.state.confirmLogin ? this.state.msgConfirm : this.state.msgEnter}</Text>
                    { this.state.confirmError && 
                        <Text style={_styles.error}>{this.state.msgError}</Text>
                    }
                        <TextInput ref={"_pwdInput"} secureTextEntry={true} keyboardAppearance={'dark'} textContentType='password'
                            autoFocus={true} clearTextOnFocus={true}
                            style={{alignSelf: 'stretch', textAlign: 'center', color: Colors.headerFG, height: 35, backgroundColor: Colors.headerBG}}
                            onSubmitEditing={this.state.confirmLogin ? this.onConfirmPassword : this.onRecordPassword} />
                    </View>
                </Modal>
            }
            { this.state.verifyDetach && // detaching
                <Modal animationType={'none'} onRequestClose={() => {}}>
                    <View style={{backgroundColor: Colors.bodyBG, flex: 1, flexDirection: 'column', alignItems: 'center', paddingTop: 30}}>
                        <Text style={{fontSize: 30, marginTop: 30, color: Colors.warningBG, textAlign: 'center'}}>{T('app.detach_alert')}</Text>
                        <Text style={{fontSize: 20, margin: 25, color: Colors.warningBG}}>{T('app.detach_message')}</Text>
                        <Text style={{fontSize: 18, margin: 15, color: Colors.errorBG}} onPress={() => this.setState({verifyDetach: false})}>{T('app.detach_confirm_cancel')}</Text>
                        <Text style={{fontSize: 18, margin: 15, color: Colors.action}} onPress={() => this.detachDevice(true)}>{T('app.detach_confirm_copy')}</Text>
                        <Text style={{fontSize: 18, margin: 15, color: Colors.selected}} onPress={() => this.detachDevice(false)}>{T('app.detach_confirm_have')}</Text>
                    </View>
                </Modal>
            }
            </Container>
        );
    }
}

const _styles = StyleSheet.create({
    page: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: Colors.bodyBG,
    },
    header_logo: {
        width: 400,
        resizeMode: 'contain',
    },
    row: {
        flex: 0,
        margin: 5,
        flexDirection: "row",
        alignItems: 'center',
        alignContent: 'flex-end',
    },
    label: {
        flex: 1,
        color: Colors.bodyFG,
        fontSize: 18,
        textAlign: 'left',
        padding: 10,
    },
    subtext: {
        color: Colors.bodyFG,
        fontSize: 18,
        textAlign: 'center',
        margin: 10,
        height: 30
    },
    message: {
        color: Colors.bodyFG,
        fontSize: 18,
        textAlign: 'center',
        padding: 10,
        alignSelf: 'stretch'
    },
    input: {
        color: Colors.action, 
        backgroundColor: Colors.headerBG, 
        flex: 1, 
        height: 30, 
        marginVertical: 5, 
        fontSize: 16,
        alignSelf: 'stretch',
        textAlign: 'center',
    },
    error: {
        flex: 0,
        margin: 10,
        fontSize: 16,
        color: Colors.errorBG,
        textAlign: 'center',
        alignContent: 'center',
    },
    link: {
        color: Colors.buttonBG,
        textAlign: 'center',
        alignContent: 'flex-end',
        margin: 5,
        padding: 5,
        fontSize: 20,
        textDecorationLine: 'underline',
    },
});


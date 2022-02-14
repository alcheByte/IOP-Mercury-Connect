import 'es6-symbol/implement';
import { SecureStore } from 'expo';
import React from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react/native'
import { Provider } from "mobx-react/native";
import { Font } from 'expo';
import { StyleSheet } from 'react-native';
import { Router, Scene, Tabs, Drawer, Modal, Actions, Lightbox } from 'react-native-router-flux';
import { Root, Footer, FooterTab, Button, Text, StyleProvider } from 'native-base';
import getTheme from './native-base-theme/components/index';
import appTheme from './native-base-theme/variables/commonColor'

import { Colors, Keys, Sizes } from './config';
import { T } from './localize/localizer';
import { AppIcon } from './assets/appicons';
import { AppStateMonitor } from './components/appstatemonitor';
// models
import stores from './models/AppState';
import Home from './models/Home';
import Profile from './models/Profile';
import * as Mock from './models/_mockup/_mockup'
// screens
import Launch from './screens/launch'
import { LockScreen } from './screens/auth/LockScreen'
// screens (onboard)
import Welcome from './screens/onboard/welcome'
import Intro from './screens/onboard/intro'
import Create from './screens/onboard/create'
import Restore from './screens/onboard/restore'
// screens (app)
import Sidebar from './components/sidebar';
import Homes from './screens/app/homes';
import Profiles from './screens/app/profiles';
import Contacts from './screens/app/contacts';
import dApps from './screens/app/dapps';
import { Settings } from './screens/app/settings';
import Support from './screens/app/support';
// screens (detail)
import ProfileDetail from './screens/details/profiledetail';
import ContactDetail from './screens/details/contactdetail';

TabBar = props => {
    return (
        <Footer style={{backgroundColor: Colors.headerBG, borderTopWidth: 0, paddingBottom: appTheme.isIPhoneX ? appTheme.Inset.portrait.bottomInset : 0}}>
            <FooterTab locked>
                <Button vertical active={props.navigation.state.index === 0} onPress={()=> Actions.jump("profiles")} style={{flex: 1, justifyContent: 'center', alignSelf: 'stretch'}}>
                    <AppIcon name="profile" size={24} color={props.navigation.state.index === 0 ? Colors.app : Colors.headerFG} style={{alignSelf: 'center'}} />
                    <Text style={[_styles.tabBtn,{color: props.navigation.state.index === 0 ? Colors.app : Colors.headerFG}]}>{T('profiles.tab')}</Text>
                </Button>
                <Button vertical active={props.navigation.state.index === 1} onPress={()=> Actions.jump("contacts")} style={{flex: 1, justifyContent: 'center', alignSelf: 'stretch'}}>
                    <AppIcon name="contacts" size={27} color={props.navigation.state.index === 1 ? Colors.app : Colors.headerFG} style={{alignSelf: 'center'}} />
                    <Text style={[_styles.tabBtn,{color: props.navigation.state.index === 1 ? Colors.app : Colors.headerFG}]}>{T('contacts.tab')}</Text>
                </Button>
                <Button vertical active={props.navigation.state.index === 2} onPress={()=> Actions.jump("homes")} style={{flex: 1, justifyContent: 'center', alignSelf: 'stretch'}}>
                    <AppIcon name="home" size={27} color={props.navigation.state.index === 2 ? Colors.app : Colors.headerFG} style={{alignSelf: 'center'}}/>
                    <Text style={[_styles.tabBtn,{color: props.navigation.state.index === 2 ? Colors.app : Colors.headerFG}]}>{T('homes.tab')}</Text>
                </Button>
                <Button vertical active={props.navigation.state.index === 3} onPress={()=> Actions.jump("dapps")} style={{flex: 1, justifyContent: 'center', alignSelf: 'stretch'}}>
                    <AppIcon name="dapps" size={24} color={props.navigation.state.index === 3 ? Colors.app : Colors.headerFG} style={{alignSelf: 'center'}} />
                    <Text style={[_styles.tabBtn,{color: props.navigation.state.index === 3 ? Colors.app : Colors.headerFG}]}>{T('dapps.tab')}</Text>
                </Button>
            </FooterTab>
        </Footer>
    );
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            initialized: false,
        }
    }

    componentWillMount() {
        this.init();
    }

    init = async () => {
        console.log(`App >> init`)
        // load icon and text fonts
        await Font.loadAsync({
            'mercury-connect': require('./assets/fonts/mercury-connect.ttf'),
            'gothambook': require('./assets/fonts/GothamBook.otf'),
        });
        var appState = stores.AppState;

        // load secure persisted settings
        var lockSettings = await SecureStore.getItemAsync(Keys.LockSettings);
        if( lockSettings !== null ) {
            console.log(`App >> lock settings loaded: ${lockSettings}`);
            appState.setLockSettings(JSON.parse(lockSettings));
        }

        // load preferences
        var preferences = await SecureStore.getItemAsync(Keys.Preferences);
        if(preferences) {
            console.log(`App >> preferences loaded: ${preferences}`);
            preferences = JSON.parse(preferences);
            const locale = appState.options.supportedLocales.find(l => l.code === preferences.curLocale);
            appState.options.setLocale(locale);
            appState.setPreferences(preferences);
        }
        // load homes
        var homes = await SecureStore.getItemAsync(Keys.Homes);
        if(homes) {
            console.log(`App >> init...Homes Found`);
            homes.map(p => {
                const home = Home.create(p);
                appState.addHome(home)
            })
        }
        // load profiles
        // await SecureStore.deleteItemAsync(Keys.Profiles); // uncomment to clear profiles
        var profiles = await SecureStore.getItemAsync(Keys.Profiles);
        if(!profiles) {
            // fill with mock profiles
            profiles = Mock.profiles;
            // await SecureStore.setItemAsync(Keys.Profiles, JSON.stringify(profiles));
        }
        else { // test block, uncomment to iterate mock data
            await SecureStore.deleteItemAsync(Keys.Profiles);
            profiles = Mock.profiles;
        }
        profiles.map(p => {
            // const pdata = JSON.stringify(p);
            // console.log(`creating profile(p) => ${pdata}`);
            const profile = Profile.create(p);
            appState.addProfile(profile)
        });
        
        this.setState({initialized: true});
    }

    onAppStateChanged = (newState) => {
        var lockSettings = stores.AppState.lockSettings;
        var prefs = stores.AppState.preferences;
        // console.log(`onAppStateChanged: ${newState}, schedule: ${lockSettings.schedule}`);
        if( newState === 'active' ) {
            switch (lockSettings.schedule)
            {
                case 'onactivate':
                    Actions.jump('lock');
                    return;
                case 'inactiveFor':
                    if(prefs.lastInactiveTime !== null) {
                        var now =  (new Date()).valueOf();
                        var diff = now - prefs.lastInactiveTime;
                        var minutes = diff / 1000 / 60;
                        console.log(`App inactive >> minutes: ${minutes}`);
                        if(minutes >= lockSettings.lockAfterMinutes)
                            Actions.jump('lock');
                    }
                    break;
            }
        }
        else {
            prefs.setInactive();
            // console.log(`Going inactive at ${prefs.lastInactiveTime}`);
        }
    }

    render() {
        if(!this.state.initialized) return <Root/>
        return (
            <Root>
                <AppStateMonitor onStateChanged={this.onAppStateChanged}/>
                <StyleProvider style={getTheme(appTheme)}>
                    <Provider AppState={stores.AppState}>
                        <Router uriPrefix='connect.libertaria.world' wrapBy={observer}>
                            <Modal key='root' headerMode="screen">
                                <Scene key='launch' component={Launch} hideNavBar/>
                                <Scene key='onboard'>
                                    <Scene key='intro' component={Intro} hideNavBar/>
                                    <Scene key='welcome' component={Welcome} hideNavBar/>
                                    <Scene key='create-wallet' component={Create} hideNavBar/>
                                    <Scene key='restore-wallet' component={Restore} hideNavBar/>
                                </Scene>
                                <Scene key='lock' component={LockScreen} hideNavBar/>
                                <Drawer key='app' hideNavBar contentComponent={Sidebar}>
                                    {/* wrapper scene for RNRF tabs bug - https://github.com/aksonov/react-native-router-flux/blob/master/Example/Example.js */}
                                    <Scene hideNavBar panHandlers={null}>
                                        <Tabs key='tabs' lazy={true}
                                            tabBarPosition='bottom'
                                            swipeEnabled={false}
                                            animationEnabled={false}
                                            activeBackgroundColor={Colors.headerBG}
                                            activeTintColor={Colors.app}
                                            inactiveTintColor={Colors.headerFG} 
                                            tabBarComponent={TabBar}>
                                            <Scene key='profiles' component={Profiles} hideNavBar/>
                                            <Scene key='contacts' component={Contacts} hideNavBar/>
                                            <Scene key='homes' component={Homes} hideNavBar/>
                                            <Scene key='dapps' component={dApps} hideNavBar/>
                                        </Tabs>
                                    </Scene>
                                </Drawer>
                                <Scene key='settings' component={Settings} hideNavBar title={T('common.settings')}/>
                                <Scene key='support' component={Support} hideNavBar title={T('common.support')}/>
                                <Scene key='profile-detail' component={ProfileDetail} hideNavBar/>
                                <Scene key='contact-detail' component={ContactDetail} hideNavBar/>
                            </Modal>
                        </Router>
                    </Provider>
                </StyleProvider>
            </Root>
        );
    }
}
export default observer(App);

const _styles = StyleSheet.create({
    tabBtn: {
        textAlign: 'center',
        paddingLeft: 0,
        paddingRight: 0,
        lineHeight: 25,
        paddingTop: 3
    },

})
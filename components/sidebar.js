import React from 'react';
import { Image } from 'react-native';
import { Container, Button, Title } from 'native-base';
import { Actions } from 'react-native-router-flux';

import { AppIcon } from '../assets/appicons';
import { T } from '../localize/localizer';
import { Colors, Sizes } from '../config';

export default class Sidebar extends React.Component {
    render() {
        return (
            <Container style={{backgroundColor: Colors.headerBG, flexDirection: 'column'}}>
                <Image source={require('../assets/Splash-half.png')} resizeMode='contain' 
                        style={{height: 150, width: 150, alignSelf: 'center', margin: 30}}/>
                <Button transparent onPress={() => Actions.push('support')} 
                        style={{alignSelf: 'stretch', padding: 10}}>
                    <Image source={require('../assets/Logo-half.png')} resizeMode='contain' 
                            style={{height: Sizes.navIcon, width: Sizes.navIcon}}/>
                    <Title style={{flex: 1, textAlign: 'left', color: Colors.app, paddingLeft: 10, alignSelf: 'center'}}>{T('common.support')}</Title>
                </Button>
                <Button transparent onPress={() => Actions.push('settings')}
                        style={{alignSelf: 'stretch', padding: 10}}>
                    <AppIcon name="settings" size={Sizes.navIcon} color={Colors.buttonBG}/>
                    <Title style={{flex: 1, textAlign: 'left', color: Colors.app, paddingLeft: 10, alignSelf: 'center'}}>{T('common.settings')}</Title>
                </Button>
           </Container>
        );
    }
}


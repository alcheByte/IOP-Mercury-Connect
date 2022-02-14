import React from 'react';
import { Image, StatusBar, Platform } from 'react-native';
import { Header, Left, Right, Button, Title, Body } from 'native-base';
import { Actions } from 'react-native-router-flux';

import { AppIcon } from '../assets/appicons';
import { T } from '../localize/localizer';
import { Colors, Sizes } from '../config';

export class AppHeader extends React.Component {
    render() {
        return (
            <Header noright style={{borderBottomWidth: 0, flexDirection: 'column', paddingTop: Platform.OS === 'ios' ? StatusBar.currentHeight :  StatusBar.currentHeight + 10}}>
                <Body style={{flexDirection: 'row', alignSelf: 'stretch', alignItems: 'flex-end'}}>
                    <Button transparent onPress={() => Actions.drawerOpen()} 
                            style={{flex: 0, alignSelf: 'flex-end', padding: 10}}>
                        <Image source={require('../assets/Logo-half.png')} resizeMode='contain' 
                               style={{height: 32, width: 32}}/>
                    </Button>
                    <Title style={{flex: 1, textAlign: 'left', marginLeft: 10, paddingBottom: 5, fontSize: 23, color: Colors.app}}>{this.props.title}</Title>
                </Body>
            </Header>
        );
    }
}


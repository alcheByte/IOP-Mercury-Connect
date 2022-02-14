import React from 'react';
import { inject, observer } from 'mobx-react/native';
import { View, Image, StyleSheet } from 'react-native';
import { Container, Content, Text } from 'native-base';
import { Actions } from 'react-native-router-flux';

import { T } from '../../localize/localizer';
import { Colors, Sizes } from '../../config';
import { AppIcon } from '../../assets/appicons';
import { AppHeader } from '../../components/appheader'

@inject('AppState') @observer
export default class dApps extends React.Component {
    render() {
        const dapps = this.props.AppState.dapps;
        console.log(`dApps >> ${dapps}`);
        return (
            <Container style={{backgroundColor: Colors.bodyBG}}>
                <AppHeader title={T('dapps.tab')}/>
                <Content contentContainerStyle={_styles.fill}>
                    <Text style={_styles.intro}>My dApps</Text>
                </Content>
            </Container>
        );
    }
}

const _styles = StyleSheet.create({
    fill: {
        flex: 1,
        justifyContent: 'center',
    },
    intro: {
        flex: 0,
        fontSize: 24,
        color: Colors.app,
        textAlign: 'center',
        alignContent: 'center',
        margin: 4,
    },
    subtext: {
        flex: 0,
        fontSize: 16,
        color: Colors.headerFG,
        textAlign: 'center',
        alignContent: 'center',
    },
    small: {
        flex: 0,
        fontSize: 10,
        color: Colors.headerFG,
        textAlign: 'center',
        alignContent: 'center',
        margin: 4,
    }
});


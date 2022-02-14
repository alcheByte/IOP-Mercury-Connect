import React from 'react';
import { inject, observer } from 'mobx-react/native';
import { View, Image, StyleSheet } from 'react-native';
import { Container, Content, Text } from 'native-base';
import { Actions } from 'react-native-router-flux';

import { T } from '../../localize/localizer';
import { Colors, Sizes } from '../../config';
import { AppIcon } from '../../assets/appicons';
import { AppHeader } from '../../components/appheader'

import Home from '../../models/Home';
import { findHome } from '../../models/Home';

@inject('AppState') @observer
export default class Homes extends React.Component {
    render() {
        const homes = this.props.AppState.homes;
        console.log(`Homes >> ${homes}`);
        return (
            <Container style={{backgroundColor: Colors.bodyBG}}>
                <AppHeader title={T('homes.tab')}/>
                <Content contentContainerStyle={_styles.fill}>
                    <Text style={_styles.intro}>My Homes</Text>
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


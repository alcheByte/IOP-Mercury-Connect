import React from 'react';
import { StyleSheet } from 'react-native';
import { inject, observer } from 'mobx-react/native';
import { Actions } from 'react-native-router-flux';
import { Container, Header, Button, Text, Content, Spinner } from 'native-base';
import { SecureStore } from 'expo';

import { Colors, Keys } from '../config';
import { T, SupportedLocales, setLocale, getLocale } from '../localize/localizer';
// models
import Wallet from '../models/Wallet'
import KeyPair from '../models/KeyPair'

@inject('AppState') @observer
export default class Launch extends React.Component {
    async componentDidMount() {
        var keyPair = await SecureStore.getItemAsync(Keys.Wallet);
        // no wallet on device
        if(!keyPair) {
            Actions.jump('onboard')
            return;
        }
        console.log(`Launch >> keyPair: ${keyPair}`)
        // wallet keyPair found
        keyPair = JSON.parse(keyPair);

        const wallet = Wallet.create({keys: KeyPair.create(keyPair)});
        this.props.AppState.setWallet(wallet);

        Actions.jump('lock');
    }

    render() {
        console.log(`Launch >> render`)
        return (
            <Container style={_styles.page}>
                <Content containerStyle={_styles.fill}>
                    <Spinner color={Colors.action} />
                    <Text style={_styles.subtext}>Loading wallet...</Text>
                </Content>
            </Container>
        );
    }
}

const _styles = StyleSheet.create({
    page: {
        flexDirection: "column",
        flex: 1,
        alignItems: 'center',
        alignContent: 'center',
        backgroundColor: Colors.bodyBG,
    },
    fill: {
        flex: 1,
        justifyContent: 'center',
    },
    subtext: {
        flex: 0,
        fontSize: 16,
        color: Colors.headerFG,
        textAlign: 'center',
        alignContent: 'center',
    },
});


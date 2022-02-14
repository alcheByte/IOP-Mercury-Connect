import React from 'react';
import { StyleSheet, TouchableOpacity, View, TextInput } from 'react-native';
import { SecureStore } from 'expo';
import { Actions } from 'react-native-router-flux';
import { Container, Content, DeckSwiper, Text, Header, Left, Body, Title, Right, Card, CardItem, H2, H1, Footer, Button } from 'native-base';
import Onboarding from 'react-native-onboarding-swiper';
import appTheme from '../../native-base-theme/variables/commonColor'

import { AppIcon } from '../../assets/appicons'
import { Colors, Keys } from '../../config';
import { T } from '../../localize/localizer';

import { newKeyPair } from '../../models/KeyPair'
import { seedWords, seedCount } from '../../models/_mockup/_mockup'

const _topHeight = 375;

const RestoreBtn = (props) => (
    <TouchableOpacity onPress={props.onDone} {...props} style={{paddingRight: 20}}>
        <Text style={{color: Colors.app, fontSize: 18, textAlign: 'center'}}>{T('restore.done')}</Text>
    </TouchableOpacity>
)

export default class Restore extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pages: this.pages(),
        }
    }

    restoreWallet = async () => {
        // TODO: restore from seed input, instead of creating a new key pair
        keyPair = newKeyPair();
        console.log(`Restore >> restoreWallet: ${keyPair}`)
        await SecureStore.setItemAsync(Keys.Wallet, JSON.stringify(keyPair));
        Actions.jump('app');
    }

    captureWord = (n, word) => {

    }

    pages = () => {
        var pages = [];
        for(i = 1; i <= seedCount; i++) pages.push(i.toString());
        pages = pages.map(n => { 
            if(n === '0')
                return ({
                    backgroundColor: Colors.headerBG,
                    image: <AppIcon name='profile' style={{alignSelf: 'center'}} size={180} color={Colors.app}/>,
                    title: <Text style={{color: Colors.app, fontSize: 24, textAlign: 'center', marginBottom: 20}}>{T('create.created')}</Text>,
                    subtitle: <Text style={{color: Colors.warningBG, fontSize: 14, textAlign: 'center', marginBottom: 20}}>{T('restore.description', {seedCount})}</Text>,
                });
            var subtitle = (n === seedCount.toString()) ? T('restore.last_word', {num: n}) : T('restore.enter_word', {num: n});
            return ({
                backgroundColor: Colors.headerBG,
                image: <AppIcon name='profile' size={180} color={Colors.app}/>,
                title: <Text style={{color: Colors.warningBG, fontSize: 13, textAlign: 'center', marginBottom: 20}}>{T('create.warning')}</Text>,
                subtitle: 
                    <View style={{flexDirection: 'column'}}>
                        <TextInput style={{color: Colors.warningBG, backgroundColor: Colors.bodyBG, fontSize: 27, textAlign: 'center', height: 50, padding: 10}} value={seedWords[n-1]}/>
                        <Text style={{textAlign: 'center', color: Colors.headerFG, margin: 20}}>{subtitle}</Text>
                    </View>
            });
        });
        return pages;
    }

    render() {
        return (
            <Container style={{backgroundColor: Colors.bodyBG}}>
                <Onboarding imageContainerStyles={{alignItems: 'flex-start', padding: 15}}
                    DoneButtonComponent={RestoreBtn}
                    pages={this.state.pages}
                    showSkip={false} 
                    nextLabel={T('common.next')}
                    onDone={this.restoreWallet} />
            </Container>
        );
    }
}

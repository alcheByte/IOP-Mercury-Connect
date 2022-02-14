import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { SecureStore } from 'expo';
import { Actions } from 'react-native-router-flux';
import { Container, Text } from 'native-base';
import Onboarding from 'react-native-onboarding-swiper';
import appTheme from '../../native-base-theme/variables/commonColor'

import { AppIcon } from '../../assets/appicons'
import { Colors, Keys } from '../../config';
import { T } from '../../localize/localizer';

import { newKeyPair } from '../../models/KeyPair'

const _topHeight = 375;

import { seedWords, seedCount } from '../../models/_mockup/_mockup'

const CreateBtn = (props) => (
    <TouchableOpacity onPress={props.onDone} {...props} style={{paddingRight: 20}}>
        <Text style={{color: Colors.app, fontSize: 18, textAlign: 'center'}}>{T('create.done')}</Text>
    </TouchableOpacity>
)

export default class Create extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pages: this.pages(),
        }
    }

    createWallet = async () => {
        // TODO: create from seed, instead of creating a new key pair
        keyPair = newKeyPair();
        console.log(`Create >> createWallet: ${keyPair}`)
        await SecureStore.setItemAsync(Keys.Wallet, JSON.stringify(keyPair));
        Actions.jump('app');
    }

    pages = () => {
        var pages = [];
        for(i = 0; i <= seedCount; i++) pages.push(i.toString());
        pages = pages.map(n => { 
            if(n === '0')
                return ({
                    backgroundColor: Colors.headerBG,
                    image: <AppIcon name='profile' style={{alignSelf: 'center'}} size={180} color={Colors.app}/>,
                    title: <Text style={{color: Colors.app, fontSize: 24, textAlign: 'center', marginBottom: 20}}>{T('create.created')}</Text>,
                    subtitle: <Text style={{color: Colors.warningBG, fontSize: 14, textAlign: 'center', marginBottom: 20}}>{T('create.description', {seedCount})}</Text>,
                });
            return ({
                backgroundColor: Colors.headerBG,
                image: <AppIcon name='profile' size={180} color={Colors.app}/>,
                title: <Text style={{color: Colors.warningBG, fontSize: 13, textAlign: 'center', marginBottom: 20}}>{T('create.warning')}</Text>,
                subtitle: 
                    <View style={{flexDirection: 'column'}}>
                        <Text style={{textAlign: 'center'}}>{T('create.word_num', {num: n})}</Text>
                        <Text style={{color: Colors.app, fontSize: 27, textAlign: 'center', padding: 10}}>{seedWords[n-1]}</Text>
                        <Text style={{textAlign: 'center', color: Colors.headerFG}}>{T('create.continue')}</Text>
                    </View>
            });
        })
        // console.log(pages);
        return pages;
    }

    render() {
        return (
            <Container style={{backgroundColor: Colors.bodyBG}}>
                <Onboarding imageContainerStyles={{alignItems: 'flex-start', padding: 15}}
                    DoneButtonComponent={CreateBtn}
                    pages={this.state.pages}
                    showSkip={false} 
                    nextLabel={T('common.next')}
                    onDone={this.createWallet} />
            </Container>
        );
    }
}

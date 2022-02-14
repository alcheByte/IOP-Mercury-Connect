import React from 'react';
import { StyleSheet, Image, View } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Container, Footer, Button, Text, Content, Col, Spinner } from 'native-base';

import { Colors } from '../../config';

import { T } from '../../localize/localizer';

export default class Welcome extends React.Component {
    render() {
        return (
            <Container style={{backgroundColor: Colors.bodyBG}}>
                <Content contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}>
                    <Image source={require('../../assets/Splash-half.png')} resizeMode='contain' style={{height: 180, alignSelf: 'center'}}/>
                    <Text style={_styles.headline}>{T('welcome.headline')}</Text>
                    <Text style={_styles.subtext}>{T('welcome.intro')}</Text>
                    <Text style={_styles.hint}>{T('welcome.create_hint')}</Text>
                    <Text style={_styles.hint}>{T('welcome.restore_hint')}</Text>
                    <View height={20}/>
                    <Button full onPress={() => Actions.jump('create-wallet')} style={{margin: 7, height: 57}}>
                        <Text style={{fontSize: 22, textAlign: 'center', marginTop: 5}}>{T('welcome.btn_create')}</Text>
                    </Button>
                    <Button full onPress={() => Actions.jump('restore-wallet')} style={{margin: 7, height: 57}}>
                        <Text style={{fontSize: 22, textAlign: 'center', marginTop: 5}}>{T('welcome.btn_restore')}</Text>
                    </Button>
                </Content>
            </Container>
        );
    }
}

const _styles = StyleSheet.create({
    fill: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'cyan'
    },
    headline: {
        flex: 0,
        fontSize: 36,
        color: Colors.app,
        textAlign: 'center',
        margin: 20,
    },
    subtext: {
        flex: 0,
        fontSize: 20,
        color: Colors.warningBG,
        textAlign: 'center',
        alignContent: 'center',
        margin: 20,
    },
    hint: {
        flex: 0,
        fontSize: 14,
        color: Colors.headerFG,
        textAlign: 'center',
        alignContent: 'center',
        margin: 5,
        marginHorizontal: 20,
    }
});

import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Container, Footer, Button, H2, H3, Text, Content, Grid, Row } from 'native-base';
import Onboarding from 'react-native-onboarding-swiper';

import { Colors } from '../../config';
import { T } from '../../localize/localizer';

const intro_pages = [
    {
        backgroundColor: Colors.bodyBG,
        image: <Image source={require('../../assets/Splash-half.png')} resizeMode='contain' style={{height: 250}}/>,
        title: 'True P2P',
        subtitle: 'Connect with anyone, anywhere with no middlemen or censorship.',
    },
    {
        backgroundColor: Colors.bodyBG,
        image: <Image source={require('../../assets/Splash-half.png')} resizeMode='contain' style={{height: 250}}/>,
        title: 'Optimized',
        subtitle: 'Unlike other peer-to-peer systems, Mercury minimizes connections for use on smart devices.',
    },
    {
        backgroundColor: Colors.bodyBG,
        image: <Image source={require('../../assets/Splash-half.png')} resizeMode='contain' style={{height: 250}}/>,
        title: 'No central servers',
        subtitle: 'Fully decentralized connection, search, messaging and storage.',
    },
    {
        backgroundColor: Colors.bodyBG,
        image: <Image source={require('../../assets/Splash-half.png')} resizeMode='contain' style={{height: 250}}/>,
        title: 'True dApps',
        subtitle: 'Fully decentralized apps designed with users as the target, not the product.',
    },
    {
        backgroundColor: Colors.bodyBG,
        image: <Image source={require('../../assets/Splash-half.png')} resizeMode='contain' style={{height: 250}}/>,
        title: 'Easy-to-use',
        subtitle: 'The layered architecture provides simple, intuitive app development.',
    },
  ];

export default class Intro extends React.Component {
    render() {
        return (
            <Container style={{backgroundColor: Colors.bodyBG}}>
                <Onboarding pages={intro_pages}
                            onSkip={() => Actions.jump('welcome')}
                            onDone={() => Actions.jump('welcome')}/>
            </Container>
        );
    }
}

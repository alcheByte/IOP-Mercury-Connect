import React from 'react';
import { StyleSheet, Text, Alert, Clipboard, Linking } from 'react-native';
import { Container, Content, Row } from 'native-base';

import { PopHeader } from '../../components/popheader';

import { Colors } from '../../config';

import { T } from '../../localize/localizer';

const _Link_Terms = 'https://connect.libertaria.world/terms-and-conditions.html';
const _Link_Privacy = 'https://connect.libertaria.world/privacy-policy.html';
const _Link_Help = 'https://discord.gg/pnUhbut';
const _Link_Discord = 'https://discord.gg/xENSXwk';

export default class Support extends React.Component {
    render() {
        return (
            <Container style={{backgroundColor: Colors.bodyBG}}>
                <PopHeader title={T('common.support')}/>
                <Content style={_styles.page}>
                    <Row style={_styles.row}>
                        <Text style={_styles.link} onPress={() => Linking.openURL(_Link_Discord)}>{T('support.discord')}</Text>
                    </Row>
                    <Row style={_styles.row}>
                        <Text style={_styles.link} onPress={() => Linking.openURL(_Link_Terms)}>{T('support.terms')}</Text>
                    </Row>
                    <Row style={_styles.row}>
                        <Text style={_styles.link} onPress={() => Linking.openURL(_Link_Privacy)}>{T('support.privacy')}</Text>
                    </Row>
                    <Row style={_styles.row}>
                        <Text style={_styles.link} onPress={() => Linking.openURL(_Link_Help)}>{T('support.help')}</Text>
                    </Row>
                </Content>
            </Container>
        );
    }
}

const _styles = StyleSheet.create({
    page: {
        flex: 1,
        flexDirection: "column",
        alignContent: "flex-start",
        backgroundColor: Colors.bodyBG,
    },
    row: {
        flex: 0,
        margin: 5,
        flexDirection: "row",
        alignItems: 'center',
        alignContent: 'flex-end',
    },
    label: {
        flex: 1,
        color: Colors.bodyFG,
        fontSize: 18,
        textAlign: 'left',
        padding: 10,
    },
    link: {
        color: Colors.buttonBG,
        textAlign: 'center',
        alignContent: 'flex-end',
        margin: 5,
        padding: 5,
        fontSize: 20,
        textDecorationLine: 'underline',
    },
});


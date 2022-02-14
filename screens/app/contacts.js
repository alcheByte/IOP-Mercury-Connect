import React from 'react';
import { inject, observer } from 'mobx-react/native';
import { SectionList, StyleSheet, Image } from 'react-native';
import { Container, Content, Text, Col, ListItem, Button, Icon } from 'native-base';
import { Actions } from 'react-native-router-flux';

import { T } from '../../localize/localizer';
import { Colors, Images } from '../../config';
import { AppIcon } from '../../assets/appicons';
import { AppHeader } from '../../components/appheader'
import { ContactItem } from '../details/contactitem'

connectionDivider = ({item, index, section}) => {
    // console.log(`profileDivider(item): ${JSON.stringify(item)}`);
    var icon = "";
    var size = 0;
    switch(section.title) {
        case 'Family':   icon = 'profile-personal'; size = 17; break;
        case 'Business': icon = 'connection-business'; size = 23; break;
        case 'Social':   icon = 'profile-alias'; size = 20; break;
    }

    return (
        <ListItem style={{backgroundColor: Colors.categoryBG, marginLeft: 0, borderColor: Colors.headerBG}}>
            <Text style={{flex: 1, color: Colors.categoryFG, fontSize: 13, textAlign: 'right', marginRight: 10}}>{section.title}</Text>
            <AppIcon color={Colors.categoryFG} size={size} name={icon} />
        </ListItem>
    );
}

connectionItem = ({item, index, section}) => {
    // console.log(`profileItem(item): ${JSON.stringify(obj)}`);
    return ( <ContactItem contact={item}/> );
}

@inject('AppState') @observer
export default class Contacts extends React.Component {
    connectItems = () => {
        var results = _.chain(this.props.AppState.allContacts)
            .groupBy((p) => T(`contact-types.${p.type.split('.')[0]}.label`))
            .map((items, g) => ({ title: g, data: items }))
            .value();
        // console.log(results);
        return results;
    }

    render() {
        const connections = this.connectItems();
        // console.log(`Connect >> Store.allConnections: ${connections.length}`);
        return (
            <Container style={{backgroundColor: Colors.bodyBG}}>
                <AppHeader title={T('contacts.tab')}/>
                <Content contentContainerStyle={_styles.fill}>
                    <SectionList
                        style={{flex: 1}}
                        sections={connections}
                        renderItem={connectionItem}
                        renderSectionHeader={connectionDivider}
                        keyExtractor={(item, index) => item + index}
                        renderLeftHiddenRow={ c =>
                            <Button full onPress={() => alert(c)}>
                                <Icon active name="information-circle" />
                            </Button>
                        }
                        renderRightHiddenRow={ (c, secId, rowId, rowMap) =>
                            <Button full danger onPress={_ => this.props.AppState.removeContact(c) }>
                                <Icon active name="trash" />
                            </Button>
                        }
                        leftOpenValue={75}
                        rightOpenValue={-75}
                    />
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

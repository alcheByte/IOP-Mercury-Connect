import _ from 'lodash';
import React from 'react';
import { inject, observer } from 'mobx-react/native';
import { SectionList, Image, StyleSheet } from 'react-native';
import { Container, Content, Text, ListItem, Button, Icon, SwipeRow, Col } from 'native-base';
import { Actions } from 'react-native-router-flux';

import { T } from '../../localize/localizer';
import { Colors } from '../../config';
import { AppIcon } from '../../assets/appicons';
import { AppHeader } from '../../components/appheader'
import { ProfileItem } from '../details/profileitem'

import Profile from '../../models/Profile';
import KeyPair from '../../models/KeyPair'
import { newKeyPair } from '../../models/KeyPair'

profileDivider = ({item, index, section}) => {
    // console.log(`profileDivider(item): ${JSON.stringify(item)}`);
    var icon = "";
    var size = 0;
    switch(section.title) {
        case 'personal': icon = 'profile-personal'; size = 17; break;
        case 'business': icon = 'connection-business'; size = 23; break;
        case 'alias':    icon = 'profile-alias'; size = 20; break;
    }

    return (
        <ListItem style={{backgroundColor: Colors.categoryBG, marginLeft: 0, borderColor: Colors.headerBG}}>
            <Text style={{flex: 1, color: Colors.categoryFG, fontSize: 13, textAlign: 'right', marginRight: 10}}>{_.capitalize(section.title)}</Text>
            <AppIcon color={Colors.categoryFG} size={size} name={icon} />
        </ListItem>
    );
}

profileItem = ({item, index, section}) => {
    return ( <ProfileItem profile={item}/> );
}

@inject('AppState') @observer
export default class Profiles extends React.Component {
    createProfile = () => {
        const key = newKeyPair();
        const created = Profile.create({key: key});
        this.props.AppState.addProfile(created);
    }

    deleteProfile(profile) {
        // TODO: remove from Store and persist change
        this.props.AppState.removeProfile(profile)
    }

    profileItems = () => {
        // console.log(items);
        var results = _.chain(this.props.AppState.profiles)
            .groupBy((p) => p.type)
            .map((items, type) => ({ title: type, data: items }))
            .value();
        // console.log(results);
        return results;
    }
    
    render() {
        // const profiles = Store.profiles;
        const profiles = this.profileItems();
        // console.log(`Profiles >> ${JSON.stringify(profiles)}`);
        return (
            <Container style={{backgroundColor: Colors.bodyBG}}>
                <AppHeader title={T('profiles.tab')}/>
                <Content contentContainerStyle={_styles.fill}>
                    <SectionList 
                        style={{flex: 1}}
                        sections={profiles}
                        renderItem={profileItem}
                        renderSectionHeader={profileDivider}
                        keyExtractor={(item, index) => item + index}
                        renderLeftHiddenRow={ p =>
                            <Button full onPress={() => alert(p)}>
                                <Icon active name="information-circle" />
                            </Button>
                        }
                        renderRightHiddenRow={ (p, secId, rowId, rowMap) =>
                            <Button full danger onPress={p => this.deleteProfile(p) }>
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


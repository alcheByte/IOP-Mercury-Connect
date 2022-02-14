import React from 'react';
import { observer } from 'mobx-react/native';
import { Image } from 'react-native';
import { Container, Content, Text, ListItem, Button, Icon, Col } from 'native-base';
import { Actions } from 'react-native-router-flux';

import { AppIcon } from '../../assets/appicons';
import { T } from '../../localize/localizer';
import { Colors, Sizes, Images } from '../../config';

@observer
export class ProfileItem extends React.Component {
    render() {
        const profile = this.props.profile;
        return (
            <ListItem button style={{backgroundColor: Colors.bodyBG, paddingLeft: 15, marginLeft: 0, borderColor: Colors.headerBG}}
                        onPress={()=> Actions.push('profile-detail', {profile})}>
            { profile.avatarUri.length > 0 ?
                <Image source={{uri: profile.avatarUri}} style={{ width: 50, height: 50}}/> : 
                <Image source={{uri: Images.MissingAvatar}} style={{ width: 50, height: 50}}/>
            }
                <Col style={{flex: 1, alignContent: 'stretch'}}>
                    <Text style={{flex: 1, color: Colors.bodyFG, marginLeft: 10, textAlign: 'left', alignSelf: 'flex-start'}}>{profile.name}</Text>
                    <Text style={{flex: 1, color: Colors.headerFG, marginLeft: 10, textAlign: 'left', alignSelf: 'flex-start', fontSize: 11}}>{profile.description}</Text>
                </Col>
            </ListItem>
        );
    }
}


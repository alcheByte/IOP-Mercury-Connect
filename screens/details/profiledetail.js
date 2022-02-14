import React from 'react';
import { inject, observer } from 'mobx-react/native';
import { Image } from 'react-native';
import { Container, Content, Form, Item, Button, Label, Input, Text, Picker, Left, Right, CheckBox } from 'native-base';
import { Actions } from 'react-native-router-flux';
import { Select, Option } from "react-native-chooser";

import { PopHeader } from '../../components/popheader';
import { ProfileTypes } from '../../models/Profile';

import { T } from '../../localize/localizer';
import { Colors, Sizes, Images } from '../../config';

@observer
export default class ProfileDetail extends React.Component {

    onPop = async () => {
        // save the options
        // const settings = JSON.stringify(Store.options);
        // console.log(this.props.profile);
        Actions.pop();
    }

    editAvatar = async () => {
        alert(this.props.profile.name);
    }

    render() {
        const profile = this.props.profile;
        // console.log(profile);
        return (
            <Container style={{backgroundColor: Colors.bodyBG, flex: 1}}>
                <PopHeader title={profile.name} onPop={this.onPop}/>
                <Content style={{flex: 1}}>
                    <Form style={{flex: 1}}>
                        <Item inlineLabel style={{marginTop: 10}}>
                            <Label>{T('profile-detail.public')}</Label>
                            <CheckBox checked={this.props.profile.public} color={Colors.go}
                                      onPress={() => this.props.profile.togglePublic() }/>
                        </Item>
                        <Item inlineLabel style={{marginVertical: 10}}>
                            <Label>{T('profile-detail.type')}</Label>
                            <Select style={{backgroundColor: Colors.headerBG, borderWidth: 0, marginRight: 5}}
                                    defaultText={this.props.profile.type.value}
                                    selected={this.props.profile.type}
                                    textStyle={{color: Colors.action, fontSize: 14}}
                                    backdropStyle={{backgroundColor: Colors.bodyBG}}
                                    optionListStyle={{flex: 1, backgroundColor: Colors.bodyBG, padding: 10, justifyContent: 'center',
                                                      marginTop: 30, marginBottom: 30, alignItems: 'center', borderWidth: 0}}
                                    onSelect={(key) => this.props.profile.setType(key)}>
                            { ProfileTypes.map( p => 
                                <Option value={p.key} key={p.key} styleText={{color: Colors.action, fontSize: 17}}>{p.value}</Option>
                            )}
                            </Select>
                        </Item>
                        <Item style={{justifyContent: 'center', padding: 15}} onPress={this.editAvatar}>
                        { profile.avatarUri.length > 0 ?
                            <Image source={{uri: profile.avatarUri}} style={{ width: 250, height: 250}}/> : 
                            <Image source={{uri: Images.MissingAvatar}} style={{ width: 250, height: 250}}/>
                        }
                        </Item>
                        <Item>
                            <Label>{T('profile-detail.name')}</Label>
                            <Input placeholder={T('profile-detail.name')} onChangeText={(t) => profile.setName(t)}>{profile.name}</Input>
                        </Item>
                        <Item stackedLabel>
                            <Label>{T('profile-detail.description')}</Label>
                            <Input placeholder={T('profile-detail.description')} onChangeText={(t) => profile.setDescription(t)}>{profile.description}</Input>
                        </Item>
                    </Form>
                </Content>
            </Container>
        );
    }
}


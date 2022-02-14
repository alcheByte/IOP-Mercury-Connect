import React from 'react';
import { Image, Switch } from 'react-native';
import { inject, observer } from 'mobx-react/native';
import { Container, Content, Form, Item, Button, Label, Input, Text, Picker, Left, Right } from 'native-base';
import { Actions } from 'react-native-router-flux';
import { Select, Option } from "react-native-chooser";

import { PopHeader } from '../../components/popheader';
import { ProfileTypes } from '../../models/Profile';

import { T } from '../../localize/localizer';
import { Colors, Sizes, Images } from '../../config';

@observer
export default class ContactDetail extends React.Component {

    onPop = async () => {
        // save the options
        // const settings = JSON.stringify(Store.options);
        // console.log(contact);
        Actions.pop();
    }

    editAvatar = async () => {
        alert(this.props.contact.name);
    }

    render() {
        const contact = this.props.contact;
        return (
            <Container style={{backgroundColor: Colors.bodyBG, flex: 1}}>
                <PopHeader title={contact.name} onPop={this.onPop}/>
                <Content style={{flex: 1}}>
                    <Form style={{flex: 1}}>
                        <Item inlineLabel style={{marginVertical: 10}}>
                            <Label>{T('contact-detail.type')}</Label>
                            <Text>{T(`contact-types.${contact.type.split('.')[0]}.label`)}</Text>
                            <Text>, </Text>
                            <Text>{T(`contact-types.${contact.type.split('.')[0]}.${contact.type.split('.')[1]}`)}</Text>
                        </Item>
                        <Item style={{justifyContent: 'center', padding: 15}} onPress={this.editAvatar}>
                        { contact.avatarUri.length > 0 ?
                            <Image source={{uri: contact.avatarUri}} style={{ width: 250, height: 250}}/> : 
                            <Image source={{uri: Images.MissingAvatar}} style={{ width: 250, height: 250}}/>
                        }
                        </Item>
                        <Item>
                            <Label>{T('contact-detail.name')}</Label>
                            <Input placeholder={T('contact-detail.name')} onChangeText={(t) => contact.setName(t)}>{contact.name}</Input>
                        </Item>
                    </Form>
                </Content>
            </Container>
        );
    }
}


import React, { Component } from "react";
// import { View, Text, TextInput, Button, StyleSheet, Picker, Alert } from 'react-native';
import { TextInput, StyleSheet, Picker, Alert } from "react-native";

import {
  Container,
  Content,
  Header,
  Title,
  Text,
  Button,
  Icon,
  Footer,
  FooterTab,
  Left,
  Right,
  Body,
  H1,
  H2,
  View,
  Form,
  Item,
  Input
} from "native-base";
import firebase from "firebase/app";
import "firebase/firestore";

require("../../config");
const db = firebase.firestore();

const INITIAL_STATE = {
  name: "",
  instructions: "",
  entryType: "image"
};

const ERROR_TASK_EXISTS =
  "A task with this name already exists. Please try a different name.";

export default class CreateTask extends Component {
  state = { ...INITIAL_STATE };

  onCreateTask = () => {
    const { name, instructions, entryType } = this.state;

    let taskData = {
      name,
      instructions,
      entryType
    };

    const accessCode = this.props.ac;
    db.collection("scavengerHunts")
      .doc(accessCode)
      .collection("tasks")
      .doc(name)
      .get()
      .then(doc => {
        if (doc.exists) {
          Alert.alert(ERROR_TASK_EXISTS);
        } else {
          db.collection("scavengerHunts")
            .doc(accessCode)
            .collection("tasks")
            .doc(name)
            .set(taskData)
            .then(() => {
              db.collection("scavengerHunts")
                .doc(accessCode)
                .update({
                  numOfTasks: firebase.firestore.FieldValue.increment(1)
                })
                .then(() => {
                  // console.log("Document successfully written!");
                  Alert.alert("Task Successfully Created");
                  this.setState({ ...INITIAL_STATE });
                })
                .catch(error => {
                  // console.error("Error writing document: ", error);
                  Alert.alert("Creating Task Unsuccessful");
                });
            })
            .catch(error => {
              // console.error("Error writing document: ", error);
              Alert.alert("Creating Task Unsuccessful");
            });
        }
      });
  };
  render() {
    //   console.log(accessCode)
    const isInvalid = this.state.name === "" || this.state.instructions === "";

    return (
      <Content>
        <H1>Create Task</H1>
        <Form style={{ marginBottom: 10 }}>
          <Item>
            <Input
              placeholder="Task Name"
              autoCapitalize="none"
              onChangeText={name => this.setState({ name })}
              value={this.state.name}
            />
          </Item>
          <Item>
            <Input
            placeholder="Task Instructions"
            autoCapitalize="none"
            onChangeText={instructions => this.setState({ instructions })}
            value={this.state.instructions}
            />
          </Item>
        </Form>

        <H1>Select Entry Type</H1>
        <Picker
          selectedValue={this.state.entryType}
          onValueChange={(itemValue, itemIndex) =>
            this.setState({ entryType: itemValue })
          }
        >
          <Picker.Item label="Image" value="image" />
          <Picker.Item label="Text" value="text" />
        </Picker>
        <Button
          block
          danger
          onPress={this.onCreateTask}
          disabled={isInvalid}
        > 
        <Text>Add Task</Text>
        </Button>
      </Content>
    );
  }
}

const styles = StyleSheet.create({
  container: {
  
  }

});

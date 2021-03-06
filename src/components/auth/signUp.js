// SignUp.js
import React from "react";
import { StyleSheet } from "react-native";
import {
  Container,
  Content,
  Button,
  Item,
  Label,
  Input,
  Form,
  Text,
  H1,
  View
} from "native-base";
import firebase from "firebase";
import "firebase/firestore";
require("../../config");
const db = firebase.firestore();

export default class SignUp extends React.Component {
  state = {
    email: "",
    passwordOne: "",
    passwordTwo: "",
    userType: "student",
    firstName: "",
    lastName: "",
    studentID: "",
    errorMessage: null
  };
  handleSignUp = () => {
    const {
      firstName,
      lastName,
      studentID,
      userType,
      email,
      passwordOne
    } = this.state;
    // TODO: Firebase stuff...
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, passwordOne)
      .then(() => {
        var user = firebase.auth().currentUser;
        // user.updateProfile({
        //   displayName: firstName,
        // })
        db.collection("users")
          .doc(user.email)
          .set(
            userType === "student"
              ? {
                  firstName: firstName,
                  lastName: lastName,
                  email: email,
                  studentID: studentID,
                  uid: user.uid,
                  userType: userType
                }
              : {
                  firstName: firstName,
                  lastName: lastName,
                  email: email,
                  uid: user.uid,
                  userType: userType
                }
          )
          .catch(function(error) {
            console.error("Error writing document: ", error);
          });
      })
      .then(() => {
        if (this.state.userType === "student") {
          this.props.navigation.navigate("StudentDash");
        } else {
          this.props.navigation.navigate("InstructorDash");
        }
      })

      .catch(error => this.setState({ errorMessage: error.message }));

    console.log("handleSignUp");
  };

  onClickStudent = () => {
    this.setState({
      userType: "student"
    });
  };

  onClickInstructor = () => {
    this.setState({
      userType: "instructor"
    });
  };

  render() {
    const isInvalid =
      this.state.passwordOne !== this.state.passwordTwo ||
      this.state.passwordOne === "" ||
      this.state.email === "" ||
      this.state.firstName === "" ||
      this.state.lastName === "";

    return (
      <Container style={styles.container}>
        <Content>
          <H1 style={{ marginTop: 100, textAlign: "center" }}>Sign up</H1>

          <View
            style={{
              flexDirection: "row",
              marginRight: 50,
              marginLeft: 50,
              marginTop: 10
            }}
          >
            <Button
              style={{ marginLeft: 55, marginRight: 10 }}
              bordered
              rounded
              success
              onPress={this.onClickStudent}
            >
              <Text>Student</Text>
            </Button>
            <Button onPress={this.onClickInstructor} bordered rounded warning>
              <Text>Instructor</Text>
            </Button>
          </View>

          <Form style={{ marginLeft: 35, marginRight: 35 }}>
            {this.state.errorMessage && (
              <Text style={{ color: "red" }}>{this.state.errorMessage}</Text>
            )}
            <Item floatingLabel>
              <Label>First Name</Label>
              <Input
                autoCapitalize="none"
                style={styles.textInput}
                onChangeText={firstName => this.setState({ firstName })}
                value={this.state.firstName}
              />
            </Item>
            <Item floatingLabel>
              <Label>Last Name</Label>
              <Input
                autoCapitalize="none"
                style={styles.textInput}
                onChangeText={lastName => this.setState({ lastName })}
                value={this.state.lastName}
              />
            </Item>

            {this.state.userType === "student" && (
              <Item floatingLabel>
                <Label>Student ID</Label>
                <Input
                  autoCapitalize="none"
                  style={styles.textInput}
                  onChangeText={studentID => this.setState({ studentID })}
                  value={this.state.studentID}
                />
              </Item>
            )}

            <Item floatingLabel>
              <Label>Email</Label>
              <Input
                autoCapitalize="none"
                style={styles.textInput}
                onChangeText={email => this.setState({ email })}
                value={this.state.email}
              />
            </Item>
            <Item floatingLabel last>
              <Label>Password</Label>
              <Input
                secureTextEntry
                autoCapitalize="none"
                style={styles.textInput}
                onChangeText={passwordOne => this.setState({ passwordOne })}
                value={this.state.passwordOne}
              />
            </Item>
            <Item floatingLabel last>
              <Label>ReType Password</Label>
              <Input
                secureTextEntry
                autoCapitalize="none"
                style={styles.textInput}
                onChangeText={passwordTwo => this.setState({ passwordTwo })}
                value={this.state.passwordTwo}
              />
            </Item>
          </Form>

          <Button
            disabled={isInvalid}
            block
            onPress={this.handleSignUp}
            style={styles.marginBtn}
          >
            <Text>Sign Up</Text>
          </Button>
          <Button
            block
            transparent
            onPress={() => this.props.navigation.navigate("Login")}
            style={styles.marginBtn}
          >
            <Text>Already have an account? Sign in</Text>
          </Button>
        </Content>
      </Container>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F4FFF8"
  },
  marginBtn: {
    marginTop: 25,
    marginRight: 50,
    marginLeft: 50
  }
});

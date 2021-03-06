import React, { Component } from "react";
import { Alert, StyleSheet } from "react-native";

import {
  Container,
  Header,
  Title,
  Left,
  Right,
  Body,
  Button,
  Icon,
  Text,
  Content,
  Footer,
  FooterTab,
  Form,
  Item,
  Input,
  H2
} from "native-base";
import TimePicker from "react-native-simple-time-picker";
// import DateTimePicker from "react-native-modal-datetime-picker";
import DatePicker from "react-native-datepicker";
import firebase from "firebase/app";
import "firebase/firestore";
require("../../config");
const db = firebase.firestore();

const ERROR_AC_TAKEN =
  "This access code is already in use. Please try another.";

export default class CreateSH extends Component {
  state = {
    name: "",
    accessCode: "",
    closed: false,
    dateStart: null,
    dateEnd: null,
    description: "",
    courses: "",
    error: null,
    dateError: null
  };

  onCreateEvent = () => {
    const {
      name,
      accessCode,
      dateStart,
      dateEnd,
      instructions,
      selectedStartHours,
      selectedStartMinutes,
      selectedEndHours,
      selectedEndMinutes
    } = this.state;

    let start = `${dateStart.toString()} ${selectedStartHours}:${selectedStartMinutes}`;
    let end = `${dateEnd.toString()} ${selectedEndHours}:${selectedEndMinutes}`;
    // firebase.firestore.Timestamp.fromDate(new Date(start))
    db.collection("scavengerHunts")
      .doc(accessCode)
      .get()
      .then(doc => {
        if (doc.exists) {
          Alert.alert(ERROR_AC_TAKEN);
        } else {
          firebase.auth().onAuthStateChanged(user => {
            const eventData = {
              name,
              accessCode,
              dateStart: start,
              dateEnd: end,
              instructions,
              email: user.email
            };

            db.collection("scavengerHunts")
              .doc(accessCode)
              .set(eventData)
              .then(() => {
                console.log("Document successfully written!");
                Alert.alert("Event Created");
              })
              .catch(function(error) {
                console.error("Error writing document: ", error);
                // this.setState({error})
              });
          });
        }
      });
  };

  render() {
    return (
      <Container style={styles.container}>
        <Header>
          <Left>
            <Button
              transparent
              onPress={() => this.props.navigation.navigate("DashboardT")}
            >
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Create Hunt</Title>
          </Body>
          <Right />
        </Header>
        <Content style={styles.content}>
          <H2>Event Name</H2>
          <Form style={styles.lineMargin}>
            <Item>
              <Input
                onChangeText={name => this.setState({ name })}
                value={this.state.name}
                placeholder="Input event name"
              />
            </Item>
          </Form>

          <H2>Access Code</H2>
          <Form style={styles.lineMargin}>
            <Item>
              <Input
                onChangeText={accessCode => this.setState({ accessCode })}
                value={this.state.accessCode}
                placeholder="Input access code"
              />
            </Item>
          </Form>

          <H2>Assignment Name</H2>
          <Form style={styles.lineMargin}>
            <Item>
              <Input
                onChangeText={instructions => this.setState({ instructions })}
                value={this.state.instructions}
                placeholder="Input assignment name"
              />
            </Item>
          </Form>

          <H2>Course(s) Participating</H2>
          <Form style={styles.lineMargin}>
            <Item>
              <Input
                onChangeText={courses => this.setState({ courses })}
                value={this.state.courses}
                placeholder="Input course(s) participating"
              />
            </Item>
          </Form>

          <H2>Start Date & Time </H2>

          <DatePicker
            style={styles.lineMargin}
            style={{ width: 200 }}
            date={this.state.dateStart}
            mode="date"
            placeholder="Select start date"
            format="YYYY-MM-DD"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={{
              dateIcon: {
                position: "absolute",
                left: 0,
                top: 4,
                marginLeft: 0
              },
              dateInput: {
                marginLeft: 36
              }
              // ... You can check the source to find the other keys.
            }}
            onDateChange={date => {
              this.setState({ dateStart: date });
            }}
          />
          <TimePicker
            // style={styles.lineMargin}

            selectedHours={this.state.selectedStartHours}
            //initial Hourse value
            selectedMinutes={this.state.selectedStartMinutes}
            //initial Minutes value
            onChange={(hours, minutes) =>
              this.setState({
                selectedStartHours: hours,
                selectedStartMinutes: minutes
              })
            }
          />
          <H2>End Date & Time </H2>

          <DatePicker
            style={{ width: 200 }}
            date={this.state.dateEnd}
            mode="date"
            placeholder="Select end date"
            format="YYYY-MM-DD"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={{
              dateIcon: {
                position: "absolute",
                left: 0,
                top: 4,
                marginLeft: 0
              },
              dateInput: {
                marginLeft: 36
              }
              // ... You can check the source to find the other keys.
            }}
            onDateChange={date => {
              this.setState({ dateEnd: date });
            }}
          />
          <TimePicker
            style={styles.lineMargin}
            selectedHours={this.state.selectedEndHours}
            //initial Hourse value
            selectedMinutes={this.state.selectedEndMinutes}
            //initial Minutes value
            onChange={(hours, minutes) =>
              this.setState({
                selectedEndHours: hours,
                selectedEndMinutes: minutes
              })
            }
          />
          <Button
            style={{ marginTop: 25 }}
            full
            danger
            onPress={this.onCreateEvent}
          >
            <Text>Create Event</Text>
          </Button>
        </Content>

        <Footer>
          <FooterTab>
            <Button
              onPress={() => this.props.navigation.navigate("DashboardT")}
            >
              <Icon name="home" />
              <Text>Home</Text>
            </Button>
            <Button onPress={() => this.props.navigation.navigate("ProfileT")}>
              <Icon name="person" />
              <Text>Profile</Text>
            </Button>
            <Button
              onPress={() => this.props.navigation.navigate("EventCreate")}
            >
              <Icon name="ios-create" />
              <Text>Create</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff"
  },
  content: {
    margin: 10
  },
  lineMargin: {
    marginBottom: 10
  }
});

import React, { Component } from "react";
import { StyleSheet } from "react-native";
import {
  Container,
  Header,
  Title,
  Content,
  Text,
  Button,
  Icon,
  Footer,
  FooterTab,
  Left,
  Right,
  Body,
  H2,
  Tabs,
  Tab
} from "native-base";
import { withNavigation } from "react-navigation";
import firebase from "firebase/app";
import "firebase/firestore";
require("../../config");
const db = firebase.firestore();
import SubmitText from "./submitText";
import SubmitImage from "./submitImage";
import TaskResult from "./taskResult";
import ViewSubmission from "./viewSubmission";

class TaskItem extends Component {
  state = {
    task: {},
    closed: false
  };
  componentDidMount() {
    let task = this.props.navigation.state.params.taskName;
    let ac = this.props.navigation.state.params.accessCode;
    db.doc(`scavengerHunts/${ac}`)
      .collection("tasks")
      .doc(task)
      .get()
      .then(doc => {
        const data = doc.data();
        this.setState({
          task: data
        });

        // console.log(this.props)
        // on componentDidMount, if the event has ended, close submissions by no rendering the submission elements
        db.doc(`scavengerHunts/${ac}`)
          .get()
          .then(doc => {
            // console.log("Document data:", doc.data());
            const sh = doc.data();
            const closed = sh.closed;
            const endDate = sh.dateEnd.seconds;
            // converting from millisec to sec to compare to endDate
            const today = (Date.now() / 1000).toFixed(0);

            if (today > endDate || closed) {
              this.setState({
                closed: true
              });
            } else {
              this.setState({
                closed: false
              });
            }
          })
          .catch(error => {
            this.setState({
              error: error,
              scavengerHunt: null
            });
            // console.log("Error getting document:", error);
          });
      });
  }

  render() {
    const { task, closed } = this.state;

    let ac = this.props.navigation.state.params.accessCode;
    let taskName = this.props.navigation.state.params.taskName;

    // console.log(task)
    return (
      <Container style={styles.container}>
        <Header>
          <Left>
            <Button
              transparent
              onPress={() => {
                this.props.navigation.navigate("SEventItem", {
                  accessCode: ac
                });
              }}
            >
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>{taskName}</Title>
          </Body>
          <Right />
        </Header>
        <Content>
          <Tabs>
            <Tab heading="Submission">
              <Content style={{ margin: 10 }}>
                <H2 style={styles.textSpacing}>
                  Instructions: {task.instructions}
                </H2>
                <H2 style={styles.textSpacing}>Type: {task.entryType}</H2>
                {task.entryType === "text" && !closed && (
                  <Button
                    block
                    success
                    title={"Submit Text"}
                    onPress={() =>
                      this.props.navigation.navigate("SubmitText", {
                        ac: ac,
                        task: taskName
                      })
                    }
                  >
                    <Text>Submit Text</Text>
                  </Button>
                )}
                {task.entryType === "image" && !closed && (
                  <Button
                    style={styles.textSpacing}
                    success
                    block
                    title={"Submit Image"}
                    onPress={() =>
                      this.props.navigation.navigate("SubmitImage", {
                        ac: ac,
                        task: taskName
                      })
                    }
                  >
                    <Text>Submit Image</Text>
                  </Button>
                )}
              </Content>
            </Tab>
            <Tab heading="Review">
              <Content style={{ margin: 10 }}>
                <TaskResult task={taskName} ac={ac} />
                <ViewSubmission ac={ac} task={taskName} />
              </Content>
            </Tab>
          </Tabs>
        </Content>
        <Footer>
          <FooterTab>
            <Button
              onPress={() => this.props.navigation.navigate("DashboardS")}
            >
              <Icon name="home" />
              <Text>Home</Text>
            </Button>
            <Button onPress={() => this.props.navigation.navigate("ProfileS")}>
              <Icon name="person" />
              <Text>Profile</Text>
            </Button>
            <Button
              onPress={() => this.props.navigation.navigate("EventSearch")}
            >
              <Icon name="search" />
              <Text>Search</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

export default withNavigation(TaskItem);

const styles = StyleSheet.create({
  container: {},
  textSpacing: {
    marginBottom: 10
  }
});

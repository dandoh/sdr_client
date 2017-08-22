/**
 * Created by Dandoh on 8/21/17.
 */
import React from "react";
import {withRouter} from "react-router";
import {graphql, compose} from "react-apollo";
import gql from "graphql-tag";
import Paper from 'material-ui/Paper'
import muiThemeable from "material-ui/styles/muiThemeable";
import Divider from "material-ui/Divider";
import MyReportButton from '../components/MyReportButton'
import ReportIcon from 'material-ui/svg-icons/av/playlist-add-check'
import muiTheme from '../mui/muiTheme'
import {List, ListItem} from "material-ui/List";
import TextField from 'material-ui/TextField';
import ChipInput from 'material-ui-chip-input'
import RaisedButton from 'material-ui/RaisedButton'
import Snackbar from 'material-ui/Snackbar';
import CircularProgress from 'material-ui/CircularProgress';
import Subheader from 'material-ui/Subheader';

const styles = {
  wrapper: {
    // Avoid IE bug with Flexbox, see #467
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  bar: {
    height: '10vh',
    display: 'flex',
    alignItems: 'center',
  },

  title: {
    paddingLeft: '2vh',
    color: muiTheme.palette.primary1Color,
    fontSize: 24,
    textDecorationStyle: 'bold'
  },

  space: {
    flex: 8,
  },

  reportButtonWrapper: {
    display: 'flex',
    alignItems: 'flex-end',
    padding: '2vh'
  },

  reportButton: {},

  body: {
    marginTop: '1vh',
    display: 'flex',
    paddingLeft: '2vh',
    paddingRight: '2vh',
    flexDirection: 'column',
    minHeight: '100vh',
    flex: 1,
  },

  divider: {
    backgroundColor: '#969696'
  }
};
class CreateGroupPage extends React.Component {

  _createdGroupId = 0;
  state = {
    nameError: "",
    name: "",
    purpose: "",
    loading: false,
    purposeError: "",
    emails: [],
    snackbarOpen: false,
    snackbarMessage: ""
  };


  handleRequestClose = () => {
    this.setState({
      snackbarOpen: false,
    });
  };

  componentWillMount() {
    const myUserId = localStorage.getItem('userId');
    this.setState({myUserId});
  }

  render() {
    let autocompleteEmails = [];
    if (this.props.data.users) {
      autocompleteEmails = this.props.data.users
        .filter(_ => _.userId != this.state.myUserId)
        .map(_ => _.email);
    }
    return (
      <div>
        <Snackbar
          open={this.state.snackbarOpen}
          message={this.state.snackbarMessage}
          autoHideDuration={2000}
          onRequestClose={this.handleRequestClose}
        />
        <div style={styles.wrapper}>
          <Paper style={styles.bar}>
            <div style={styles.title}>
              Create a group
            </div>
            <div style={styles.space}></div>
            <div style={styles.reportButtonWrapper}>
              <MyReportButton/>
            </div>
          </Paper>
          <Paper style={styles.body}>
            <TextField
              hintText="E.g Internship"
              fullWidth={true}
              value={this.state.name}
              errorText={this.state.nameError}
              onChange={(_, val) => {
                if (val != "") this.setState({nameError: ""});
                this.setState({name: val})
              }}
              floatingLabelText="Group Name (*)"
            /><br />
            <TextField
              hintText="E.g Learn programming and make useful product"
              fullWidth={true}
              value={this.state.subtitle}
              errorText={this.state.purposeError}
              onChange={(_, val) => {
                if (val != "") this.setState({purposeError: ""});
                this.setState({purpose: val})
              }}
              floatingLabelText="Purpose"
            /><br />
            <div style={{marginTop: '3vh'}}>
              <ChipInput fullWidth={true}
                         value={this.state.emails}
                         onRequestAdd={this._addEmail}
                         dataSource={autocompleteEmails}
                         onRequestDelete={this._deleteEmail}
                         hintText="Add users by email, you will be automatically added into this group"
              />
            </div>
            <div style={{display: 'flex', alignItems: 'flex-end', marginTop: '2vh'}}>
              <div style={{flex: 1}}></div>
              {this.state.loading &&
              <div>
                <CircularProgress />
              </div>
              }
              <RaisedButton label="Create new group" secondary={true}
                            onClick={this._submitGroup}
                            disabled={this.state.loading}
                            style={{marginBottom: '1vh'}}/>
            </div>
          </Paper>
        </div>
      </div>
    )
  }

  _submitGroup = () => {
    const {name, purpose, emails} = this.state;
    if (name == "") {
      this.setState({nameError: "Name cannot be empty"});
      return;
    }
    if (purpose == "") {
      this.setState({purposeError: "Purpose cannot be empty"});
      return;
    }

    this.setState({loading: true});
    this.props.addGroup({
      variables: {
        name: name,
        subtitle: purpose
      }
    }).then(res => {
      const groupId = res.data.addGroup;
      this._createdGroupId = groupId;
      return this.props.addUsers({
        variables: {
          emails: emails,
          groupId: this._createdGroupId
        }
      })
    }).then(res => {
      this.setState({loading: false});
      this.props.reload();
      this.props.router.replace(`/group/${this._createdGroupId}`);
    }).catch(err => {
      this.setState({loading: false,
        snackbarOpen: true,
        snackbarMessage: JSON.stringify(err)
      })
    })
  };

  _addEmail = (email) => {
    this.setState({emails: [...this.state.emails, email]})
  };

  _deleteEmail = (email, index) => {
    this.setState({emails: this.state.emails.filter((_, i) => i != index)})
  };
}


const getUsersQuery = gql` query {
  users {
    userId
    email
  }
}`;

const withData = graphql(getUsersQuery, {
  options: {
    forceFetch: true,
  }
});

const createGroupMutation = gql`mutation
  AddGroup($name: String!, $purpose: String!) {
    addGroup(name: $name, purpose: $purpose)
  }
`;

const addUsersMutation = gql`mutation
  AddUsersToGroup($emails: [String!], $groupId: Int!) {
    addUsersToGroup(emails: $emails, groupId: $groupId)
  }
`;

const withMutation = compose(
  graphql(createGroupMutation, {name: 'addGroup'}),
  graphql(addUsersMutation, {name: 'addUsers'})
);

export default withMutation(withData(withRouter(CreateGroupPage)));

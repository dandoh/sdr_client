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
class EditGroupPage extends React.Component {

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

  componentDidMount() {
    const myUserId = localStorage.getItem('userId');
    this.setState({myUserId});
  }

  componentWillReceiveProps(newProps) {
    if (newProps.groupInfoQuery.group) {
      const {group} = newProps.groupInfoQuery;
      this.setState({
        name: group.name,
        purpose: group.subtitle,
        emails: group.users.map(_ => _.email)
      })
    }
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
              Edit Group
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
              <RaisedButton label="Save" secondary={true}
                            onClick={this._saveInfoGroup}
                            disabled={this.state.loading}
                            style={{marginBottom: '1vh'}}/>
            </div>
          </Paper>
        </div>
      </div>
    )
  }

  _saveInfoGroup = () => {
    const {name, purpose, emails} = this.state;
    if (name == "") {
      this.setState({nameError: "Name cannot be empty"});
      return;
    }
    if (purpose == "") {
      this.setState({purposeError: "Name cannot be empty"});
      return;
    }

    this.setState({loading: true});
    this.props.updateGroup({
      variables: {
        groupId: this.props.params.groupId,
        groupName: name,
        subtitle: purpose,
        emails: emails
      }
    }).then(res => {
      this.setState({loading: false});
      this.props.reload();
      this.props.router.replace(`/group/${this.props.params.groupId}`);
    }).catch(err => {
      this.setState({
        loading: false,
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
const getGroupQuery = gql`query GetGroup($groupId: Int!){
  group(id: $groupId) {
    groupId
    name
    purpose
    users {
      email
    }
  }
}`;

const withData = compose(
  graphql(getUsersQuery, {
    options: {
      forceFetch: true,
    }
  }),
  graphql(getGroupQuery, {
    name: 'groupInfoQuery',
    options: (ownProps) => {
      return {
        variables: {
          groupId: ownProps.params.groupId
        },
        forceFetch: true,
      }
    }
  })
);
const updateGroupMutation = gql`mutation
  ChangeGroupInfo($emails: [String!], $groupId: Int!, $groupName: String!, $purpose: String!) {
    changeGroupInfo(emails: $emails, groupId: $groupId, groupName: $groupName, purpose: $purpose)
  }
`;

const withMutation = graphql(updateGroupMutation, {name: 'updateGroup'});

export default withMutation(withData(withRouter(EditGroupPage)));

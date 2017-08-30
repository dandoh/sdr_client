import React from "react";
import {withRouter} from "react-router";
import Paper from 'material-ui/Paper'
import muiThemeable from "material-ui/styles/muiThemeable";
import Divider from "material-ui/Divider";
import EditIcon from 'material-ui/svg-icons/editor/mode-edit'
import MyReportButton from '../components/MyReportButton'
import muiTheme from '../mui/muiTheme'
import {List, ListItem} from "material-ui/List";
import {graphql, compose} from "react-apollo";
import gql from "graphql-tag";
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Error from '../components/Error'
import Loading from '../components/Loading'
import UserList from '../components/UserList'

import FeedItem from '../components/FeedItem';

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
  groupName: {
    fontSize: 22,
    color: muiTheme.palette.primary1Color,
  },

  purpose: {
    fontSize: 12,
    color: '#969696'
  },
  userInfoBox: {
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: '2vh',
  },

  space: {
    flex: 8,
  },

  reportButtonWrapper: {
    display: 'flex',
    alignItems: 'flex-end',
    padding: '2vh'
  },

  headerList: {
    paddingTop: '1vh',
    fontSize: 18,
    color: muiTheme.palette.primary1Color,
  },

  reportButton: {},

  body: {
    marginTop: '1vh',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    overflowY: 'hidden',
    overflowX: 'scroll',
  },

  divider: {
    backgroundColor: '#969696'
  },
  userStyle: {
    padding: 0,
  }
};
class GroupPage extends React.Component {
  render() {
    let {loading, error, group} = this.props.data;
    if (error) {
      return (<Error/>)
    } else if (loading) {
      return (<Loading/>)
    } else {
      return this.renderGroupPage(group);
    }
  }

  renderGroupPage(group) {
    return (
      <div style={styles.wrapper}>
        <Paper style={styles.bar}>
          <div style={styles.userInfoBox}>
            <div style={styles.groupName}>{group.name}</div>
            <div style={styles.purpose}>{group.purpose}</div>          
          </div>
          <div style={styles.space}></div>
          <div style={styles.reportButtonWrapper}>
            <MyReportButton/>
          </div>
        </Paper>
        <div style={styles.body}>
          <div style={{display: 'flex', alignItems: 'flex-end'}}>
            <FlatButton label="Edit Group" secondary={true}
                          labelPosition="before"
                          onClick={this._goToEditGroup}
                          icon={<EditIcon />}
                          style={{marginBottom: '1vh'}}/>
            <div style={{flex: 1}}></div>
          </div>
          <UserList users={group.users} onUserClick={this._handleUserClick}/>
        </div>
      </div>
    );
  }

  _handleUserClick = (user) => {
    this.props.router.replace(`/user/${user.userId}/report/${user.todayReport.reportId}`);
  };

  _goToEditGroup = () => {
    this.props.router.replace(`/group/${this.props.params.groupId}/edit`);
  }

}

// DATA
const getGroupQuery = gql`query GetGroup($groupId: Int!){
  group(id: $groupId) {
    groupId
    name
    purpose
    users {
      avatar
      userId
      name
      todayReport {
        reportId
      }
    }
  }
}
`;
const withData = graphql(getGroupQuery, {
    options: (ownProps) => {
      return {
        variables: {
          groupId: ownProps.params.groupId
        },
        forceFetch: true,
      }
    }
  }
);

const withStuffs = compose(
  withData,
  withRouter,
  muiThemeable()
);

export default withStuffs(GroupPage);

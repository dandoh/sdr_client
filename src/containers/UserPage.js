/**
 * Created by Dandoh on 8/18/17.
 */
import React from "react";
import {withRouter} from "react-router";
import {graphql, compose} from "react-apollo";
import gql from "graphql-tag";

import RaisedButton from 'material-ui/RaisedButton'
import Paper from 'material-ui/Paper'
import muiTheme from '../mui/muiTheme'
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import FontIcon from 'material-ui/FontIcon';
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';
import MyReportButton from '../components/MyReportButton'
import ArchiveIcon from 'material-ui/svg-icons/content/archive';
import Avatar from 'material-ui/Avatar';
import ReportIcon from 'material-ui/svg-icons/av/playlist-add-check'
import Error from '../components/Error'
import Loading from '../components/Loading'

const archiveIcon = <ArchiveIcon />;
const todayReportIcon = <ReportIcon />;

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
    fontSize: 20,
    color: '#000000'
  },

  subtitle: {
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
    overflowY: 'auto'
  },

  divider: {
    backgroundColor: '#969696'
  },
  userStyle: {
    padding: 0,
  },
  dropDownMenu: {
    width: 200
  },
  subMenu: {
    display: 'flex'
  }
};

const ARCHIVES = 1;
const REPORT = 0;

class UserPage extends React.Component {
  state = {
    pageState: 0,
    subtitle: "",
  };

  render() {
    console.log(this.props);
    let {loading, error, user} = this.props.data;
    if (error) {
      return (<Error/>)
    } else if (loading) {
      return (<Loading/>)
    } else {
      const childrenWithProps = React.cloneElement(this.props.children, {
        user,
        changeSubtitle: this._changeSubtitle,
      });
      return (
        <div style={styles.wrapper}>
          <Paper style={styles.bar}>
            <div>
              <Avatar
                src={user.avatar}
                size={50}
                style={{marginLeft: '1vh'}}
              />
            </div>
            <div style={styles.userInfoBox}>
              <div style={styles.groupName}>{user.name}</div>
              <div style={styles.subtitle}>{this.state.subtitle}</div>
            </div>
            <div style={styles.space}>
            </div>
            <div style={styles.reportButtonWrapper}>
              <MyReportButton/>
            </div>
          </Paper>
          <Paper zDepth={1} style={{}}>
            <BottomNavigation selectedIndex={this.state.pageState}>
              <BottomNavigationItem
                label="Today Report"
                onClick={() => this._setPageState(0)}
                icon={todayReportIcon}
              />
              <BottomNavigationItem
                label="Archives"
                onClick={() => this._setPageState(1)}
                icon={archiveIcon}
              />
            </BottomNavigation>
          </Paper>
          <div style={styles.body}>
            {childrenWithProps}
          </div>
        </div>
      )
    }
  }


  _setPageState = (pageState) => {
    this.setState({pageState});

    if (pageState == ARCHIVES) {
      // Go to user archives pageState
      const {userId} = this.props.params;
      this.props.router.replace(`/user/${userId}/report/archives`)
    } else if (pageState == REPORT) {
      const {user} = this.props.data;
      const userId = user.userId;
      const reportId = user.todayReport.reportId;
      this.props.router.replace(`/user/${userId}/report/${reportId}`);
    }
  };


  _changeSubtitle = (subtitle) => {
    this.setState({subtitle})
  }

}


const getUserInfoQuery = gql`query GetUserQuery($userId: Int) {
  user(userId: $userId) {
    userId
    avatar
    name
    todayReport {
      reportId
    }
  }
}`;

const withData = compose(
  graphql(getUserInfoQuery, {
    options: (ownProps) => {
      return {
        variables: {
          userId: parseInt(ownProps.params.userId)
        },
        forceFetch: true,
      }
    }
  }),
);
export default withData(withRouter(UserPage));

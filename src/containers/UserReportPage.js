/**
 * Created by Dandoh on 8/18/17.
 */
import React from "react";
import {withRouter} from "react-router";
import {graphql, compose} from "react-apollo";
import gql from "graphql-tag";

import ReportIcon from 'material-ui/svg-icons/av/playlist-add-check'
import RaisedButton from 'material-ui/RaisedButton'
import Paper from 'material-ui/Paper'
import muiTheme from '../mui/muiTheme'
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import FontIcon from 'material-ui/FontIcon';
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';
import IconLocationOn from 'material-ui/svg-icons/communication/location-on';
import Error from '../components/Error'
import Loading from '../components/Loading'
const nearbyIcon = <IconLocationOn />;
const recentsIcon = <FontIcon className="material-icons">restore</FontIcon>;
const favoritesIcon = <FontIcon className="material-icons">favorite</FontIcon>;

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
  userName: {
    fontSize: 20,
    color: '#000000'
  },

  date: {
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
    overflowY: 'scroll',
    overflowX: 'scroll',
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

class UserReportPage extends React.Component {
  state = {
    pageState: 1,
  };

  render() {
    const {children} = this.props;
    let {loading, error, user} = this.props.data;
    if (error) {
      return (<Error/>)
    } else if (loading) {
      return (<Loading/>)
    } else {
      return (
        <div style={styles.wrapper}>
          <Paper style={styles.bar}>
            <div style={styles.userInfoBox}>
              <div style={styles.userName}>{user.name}</div>
              <div style={styles.date}>{this.state.pageState == ARCHIVES ? "Archives" : "17/2/4"}</div>
            </div>
            <div style={styles.space}>
            </div>
            <div style={styles.reportButtonWrapper}>
              <RaisedButton
                style={styles.reportButton}
                label="Daily Report"
                labelPosition="before"
                primary={true}
                icon={<ReportIcon />}
              />
            </div>
          </Paper>
          {/*<div style={styles.subMenu}>*/}
          {/*<div style={{display: 'flex', flex: 1}}>*/}
          {/*</div>*/}
          {/*<div style={{display: 'flex', alignItems: 'flex-end'}}>*/}
          {/*</div>*/}
          {/*</div>*/}
          <div style={styles.body}>
            {children}
          </div>
          <Paper zDepth={1}>
            <BottomNavigation selectedIndex={this.state.pageState}>
              <BottomNavigationItem
                label="Today Report"
                onClick={() => this._setPageState(0)}
                icon={recentsIcon}
              />
              <BottomNavigationItem
                label="Archives"
                onClick={() => this._setPageState(1)}
                icon={nearbyIcon}
              />
            </BottomNavigation>
          </Paper>
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
      const {userId} = this.props.params;
      this.props.router.replace(`/user/${userId}/report/1`)
    }
  };

}

const getUserInfoQuery = gql`query GetUserQuery($userId: Int) {
  user(userId: $userId) {
    userId
    name
  }
}`;

const withData = graphql(getUserInfoQuery, {
  options: (ownProps) => {
    return {
      variables: {
        userId: parseInt(ownProps.params.userId)
      },
      forceFetch: true,
    }
  }
});
export default withData(withRouter(UserReportPage));

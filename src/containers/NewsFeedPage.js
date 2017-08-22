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
import RaisedButton from 'material-ui/RaisedButton'
import Subheader from 'material-ui/Subheader';
import Loading from '../components/Loading';
import Error from '../components/Error';

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
  },

  divider: {
    backgroundColor: '#969696'
  }
};
class NewsFeedPage extends React.Component {


  componentWillMount() {
    const myUserId = localStorage.getItem('userId');
    this.setState({myUserId});
  }

  componentWillReceiveProps(newProps) {
    if (this.props.data) {
      this.props.data.refetch();
    }
  }

  render() {
    return (
      <div style={styles.wrapper}>
        <Paper style={styles.bar}>
          <div style={styles.title}>News Feed</div>
          <div style={styles.space}></div>
          <div style={styles.reportButtonWrapper}>
            <MyReportButton/>
          </div>
        </Paper>
        <div style={styles.body}>
          <Subheader>Today reports</Subheader>
          {this.renderNewsFeedOfTodayReports()}
          <Subheader>Old reports</Subheader>
          {this.renderNewsFeedOfOldReports()}
        </div>
      </div>
    );
  }

  renderNewsFeedOfTodayReports() {
    let {loading, error, subscribes} = this.props.data;
    if (error) {
      return (<Error/>)
    } else if (loading) {
      return (<Loading/>)
    } else {
      return subscribes
        .filter(this._todayRelatedFeed)
        .map((feed, i) => (
          <FeedItem key={i} myUserId={this.state.myUserId} feed={feed} onFeedClick={this._goToReport}/>
        ))
    }
  }

  renderNewsFeedOfOldReports() {
    let {loading, error, subscribes} = this.props.data;
    if (error) {
      return (<Error/>)
    } else if (loading) {
      return (<Loading/>)
    } else {
      return subscribes
        .filter(feed => !this._todayRelatedFeed(feed))
        .map((feed, i) => (
          <FeedItem key={i} myUserId={this.state.myUserId} feed={feed} onFeedClick={this._goToReport}/>
        ))
    }
  }

  _goToReport = (report) => {
    this.props.router.replace(`/user/${report.user.userId}/report/${report.reportId}`);
  };

  _todayRelatedFeed(feed) {
    const reportDate = new Date(feed.report.createdAt.substring(0, 19));
    const today = new Date();

    return reportDate.setHours(0, 0, 0, 0) == today.setHours(0, 0, 0, 0);
  }

}

const getNewsFeedQuery = gql`query {
  subscribes {
    report {
      reportId
      createdAt
      user {
        name
        userId
      }
    }
    lastComment {
      content
      createdAt
      user {
        avatar
        name
        userId
      }
    }
    lastUpdatedAt
    numberCommentsNotSeen
  }
}`;

const withData = compose(
  graphql(getNewsFeedQuery)
);

export default withData(muiThemeable()(withRouter(NewsFeedPage)));
/**
 * Created by Dandoh on 8/15/17.
 */

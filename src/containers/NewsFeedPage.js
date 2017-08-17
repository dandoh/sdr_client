import React from "react";
import {withRouter} from "react-router";
import Paper from 'material-ui/Paper'
import muiThemeable from "material-ui/styles/muiThemeable";
import Divider from "material-ui/Divider";
import ReportIcon from 'material-ui/svg-icons/av/playlist-add-check'
import muiTheme from '../mui/muiTheme'
import {List, ListItem} from "material-ui/List";
import RaisedButton from 'material-ui/RaisedButton'

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
    overflowY: 'hidden',
    overflowX: 'scroll',
  },

  divider: {
    backgroundColor: '#969696'
  }
};
class NewsFeedPage extends React.Component {

  render() {
    return (
      <div style={styles.wrapper}>
        <Paper style={styles.bar}>
          <div style={styles.title}>News Feed</div>
          <div style={styles.space}></div>
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
        <div style={styles.body}>
          <div style={styles.headerList}>Today's reports</div>
          {this.renderNewsFeedOfTodayReports()}
          <div style={styles.headerList}>Old reports</div>
          {this.renderNewsFeedOfOldReports()}
        </div>
      </div>
    );
  }

  renderNewsFeedOfTodayReports() {
    let feeds = [1, 1, 1];
    return feeds.map(feed => (
      <FeedItem feed={feed}/>
    ))
  }

  renderNewsFeedOfOldReports() {
    let feeds = [1, 1, 1];
    return feeds.map(feed => (
      <FeedItem feed={feed}/>
    ))
  }
}

export default muiThemeable()(withRouter(NewsFeedPage));
/**
 * Created by Dandoh on 8/15/17.
 */

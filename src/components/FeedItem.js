/**
 * Created by Dandoh on 8/17/17.
 */
/**
 * Created by Dandoh on 7/21/17.
 */

import React from "react";
import moment from 'moment';
import {Card, CardHeader, CardTitle, CardText} from 'material-ui/Card'
import Paper from 'material-ui/Paper'
import TouchRipple from 'material-ui/internal/TouchRipple'
import RaisedButton from 'material-ui/FlatButton'
import {List, ListItem} from "material-ui/List";

const style = {
  marginTop: '0.5vh',
};
export default function FeedItem({feed, myUserId, onFeedClick}) {
  console.log(feed);

  const getTitle = () => {
    if (feed.report.user.userId == myUserId) {
      return `${feed.lastComment.user.name} commented on your report (${feed.numberCommentsNotSeen})`
    } else {
      return `${feed.lastComment.user.name} commented on a report of ${feed.report.user.name} that you're following
 (${feed.numberCommentsNotSeen})`
    }
  };

  const getSubtitle = () => {
    const timeAgo = moment(feed.lastComment.createdAt.substring(0, 19)).fromNow();
    return timeAgo
  };

  const getAvatar = () => {
    return feed.lastComment.user.avatar;
  };

  const getText = () => {
    return feed.lastComment.content;
  };

  return (
    <Card style={style}>
      <ListItem innerDivStyle={{padding: 0}} onClick={() => onFeedClick(feed.report)}>
        <CardHeader
          title={getTitle()}
          subtitle={getSubtitle()}
          avatar={getAvatar()}/>
        <CardText>
          {getText()}
        </CardText>
      </ListItem>
    </Card>
  )

}




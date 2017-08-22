/**
 * Created by Dandoh on 7/21/17.
 */
import React from "react";
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import moment from 'moment';


export default function CommentItem({comment}) {
  const timeAgo = moment(comment.createdAt.substring(0, 19)).fromNow();
  return (
    <Card>
      <CardHeader
        title={`${comment.user.name}`}
        subtitle={timeAgo}
        avatar={comment.user.avatar}
      />
      <CardText style={{paddingTop: 0}}>
        {comment.content}
      </CardText>
    </Card>
  )
}




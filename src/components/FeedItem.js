/**
 * Created by Dandoh on 8/17/17.
 */
/**
 * Created by Dandoh on 7/21/17.
 */

import React from "react";
import {Card, CardHeader, CardTitle, CardText} from 'material-ui/Card'
import Paper from 'material-ui/Paper'
import TouchRipple from 'material-ui/internal/TouchRipple'
import RaisedButton from 'material-ui/FlatButton'
import {List, ListItem} from "material-ui/List";

const style = {
  marginTop: '0.5vh',
};
export default function FeedItem(feed) {

  const getTitle = () => {
    return (
      <div><span>Shiki</span> commented on your report</div>
    )
  };

  const getSubtitle = () => {
    return '5 minutes ago'
  };

  const getAvatar = () => {
    return 'https://robohash.org/9i3KyRqXoWg4U2Ce.png?size=300x300';
  };

  const getText = () => {
    return `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
      Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
      Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio`
  };

  return (
    <Card style={style}>
      <ListItem innerDivStyle={{padding: 0}}>
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




/**
 * Created by Dandoh on 7/21/17.
 */
import React from "react";
import {LinkContainer} from "react-router-bootstrap";
import {Button} from "react-bootstrap";
import {ListItem} from 'material-ui/List'
import Paper from 'material-ui/Paper'
import {GridList, GridTile} from 'material-ui/GridList';

const style = {
  padding: 0,
};

const rippleStyle = {
  width: "100%",
  height: "100%"
};
export default function UserItem({user, onClick}) {
  return (
    <Paper>
      <ListItem onClick={() => {onClick(user)}} style={rippleStyle} innerDivStyle={style}>
        <GridTile
          key={user.userId}
          title={user.name}>
          <img src={user.avatar} maxLength="100%"/>
        </GridTile>
      </ListItem>
    </Paper>
  )
}




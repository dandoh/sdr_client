/**
 * Created by Dandoh on 7/21/17.
 */
import React from "react";
import {LinkContainer} from "react-router-bootstrap";
import {Button} from "react-bootstrap";
import {ListItem} from 'material-ui/List'
import Paper from 'material-ui/Paper'
import {GridList, GridTile} from 'material-ui/GridList';

const styles = {
  style: {
    padding: 0,
    position: 'relative'
  },
  nameBoxStyle: {}
};

const rippleStyle = {};
export default function UserItem({user, onClick}) {
  return (
    <Paper>
      <ListItem onClick={() => {
        onClick(user)
      }} style={rippleStyle} innerDivStyle={styles.style}>
        <GridTile title={user.name}>
          <div style={{backgroundImage: `url(${user.avatar})`,
            width: '30vh', height: '30vh',
            backgroundSize: 'cover'
          }}>

          </div>
        </GridTile>
      </ListItem>
    </Paper>
  )
}




/**
 * Created by Dandoh on 7/21/17.
 */
import React from "react";
import {GridList, GridTile} from 'material-ui/GridList';

import UserItem from "./UserItem";
const style = {

};
export default function UserList({users, onUserClick}) {
  return (
    <div>
      <GridList
        style={style}
        cols={3}>
        {users.map((user) => (
          <UserItem key={user.userId} user={user} onClick={onUserClick}/>
        ))}
      </GridList>
    </div>
  )
}
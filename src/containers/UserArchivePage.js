/**
 * Created by Dandoh on 8/18/17.
 */
import React from "react";
import {withRouter} from "react-router";
import {graphql, compose} from "react-apollo";
import gql from "graphql-tag";


class UserArchivePage extends React.Component {
  render() {
    return (
      <div>
        <h1>This is the user archive page</h1>
      </div>
    )
  }
}

export default withRouter(UserArchivePage);

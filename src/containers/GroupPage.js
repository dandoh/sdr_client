import React from 'react';
import {withRouter} from "react-router";
import {graphql} from 'react-apollo'
import gql from 'graphql-tag'
import ReportList from '../components/ReportList'
import Loading from '../components/Loading'
import Error from '../components/Error'
import {LinkContainer} from "react-router-bootstrap";
import {Button} from "react-bootstrap"

class GroupPage extends React.Component {

  render() {
    return (
      <Button>
        Hello World
      </Button>
    );
  }
}

export default withRouter(GroupPage);
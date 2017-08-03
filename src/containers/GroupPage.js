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
    let {groupId} = this.props.params;
    let {loading, error, reportsOfGroup} = this.props.data;
    if (error) {
      return (<Error/>)
    } else if (loading) {
      return (<Loading/>)
    } else {
      let reports = reportsOfGroup;
      return (
        <div>
          {function(){
            if (reports.length == 0) {
              return <h4>There is no daily report on this group yet, click to create one</h4>
            } else {
              return <h4>{`Daily reports of ${reports[0].group.name}`}</h4>
            }
          }()}
          <ReportList reports={reports}/>
          <LinkContainer to={`/group/${groupId}/create_report`}>
            <Button>Create new report</Button>
          </LinkContainer>
          <LinkContainer to={`/group/${groupId}/users`}>
            <Button>Users</Button>
          </LinkContainer>
        </div>
      )
    }
  }
}

const getReportsQuery = gql`query 
  GetReportsQuery($id: Int) {
    reportsOfGroup(id: $id) {
      reportId
      user {
        userId
        name
      }
      todoes {
        content
        state
      }
      group {
        groupId
        name
      }
    }
  }`;

const withData = graphql(getReportsQuery, {
  options: (ownProps) => {
    return {
      variables: {
        id: parseInt(ownProps.params.groupId)
      },
      forceFetch: true,
    }
  }
});


export default withData(withRouter(GroupPage));
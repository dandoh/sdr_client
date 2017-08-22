/**
 * Created by Dandoh on 8/21/17.
 */


import React from "react";
import {withRouter} from "react-router";
import {graphql, compose} from "react-apollo";
import gql from "graphql-tag";
import ReportIcon from 'material-ui/svg-icons/av/playlist-add-check'
import RaisedButton from 'material-ui/RaisedButton'

function MyReportButton({data, router}) {
  const _goToMyReport = () => {
    const {reportToday} = data;
    router.replace(`/user/${reportToday.user.userId}/report/${reportToday.reportId}`);
  };
  return (
    <RaisedButton
      label="My Report"
      onClick={_goToMyReport}
      labelPosition="before"
      primary={true}
      icon={<ReportIcon />}
    />
  )
}

const myTodayReport = gql`query TodayReport {
  reportToday {
    reportId
    user {
      userId
    }
  }
}`;

const withData = compose(
  graphql(myTodayReport)
);

export default withData(withRouter(MyReportButton))

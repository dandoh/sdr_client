/**
 * Created by Dandoh on 7/21/17.
 */
import React from "react";
import {graphql, compose} from "react-apollo";
import gql from "graphql-tag";
import {ListItem} from 'material-ui/List'
import Paper from 'material-ui/Paper'
import Loading from '../components/Loading'
import Error from '../components/Error'
import {GridList, GridTile} from 'material-ui/GridList';
const style = {};

class ReportList extends React.Component {

  render() {
    let {loading, error, oldReports} = this.props.data;
    let {goToReport} = this.props;
    if (error) {
      return (<Error/>)
    } else if (loading) {
      return (<Loading/>)
    } else {
      return (
        <div>
          <GridList
            style={style}
            cols={8}>
            {oldReports.map(report => {
              return (
                <Paper key={report.reportId}>
                  <ListItem
                    onClick={() => goToReport(report)}
                    innerDivStyle={{
                      padding: 0, height: '10vh',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <div style={{textAlign: 'center'}}>
                      {this._getDay(report.createdAt.substring(0, 19))}
                    </div>
                  </ListItem>
                </Paper>
              )
            })}
          </GridList>
        </div>
      )
    }
  }



  _getDay = (dateString) => {
    function ordinal_suffix_of(i) {
      const j = i % 10,
        k = i % 100;
      if (j == 1 && k != 11) {
        return i + "st";
      }
      if (j == 2 && k != 12) {
        return i + "nd";
      }
      if (j == 3 && k != 13) {
        return i + "rd";
      }
      return i + "th";
    }

    const date = new Date(dateString);
    const day = date.getDay();
    return day + ordinal_suffix_of(day);
  }
}

const getReportsQuery = gql` query OldReports($userId: Int, $fromDate: String, $toDate: String){
  oldReports(userId: $userId, fromDate: $fromDate, toDate: $toDate) {
    createdAt
    reportId
    user {
      userId
    }
  }
}`;

function formatDate(date) {
  let d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}

const withData = graphql(getReportsQuery, {
  options: ({userId, month, year}) => {
    const from = new Date(year, month - 1, 1); // month start from 0

    const to = new Date(
      month == 12 ? year + 1 : year,
      month == 12 ? 1 : month,
      1
    );
    return {
      variables: {
        userId: userId,
        fromDate: formatDate(from),
        toDate: formatDate(to)
      }
    }
  }
});

export default withData(ReportList)



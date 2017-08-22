/**
 * Created by Dandoh on 8/18/17.
 */
import React from "react";
import {withRouter} from "react-router";
import {graphql, compose} from "react-apollo";
import gql from "graphql-tag";
import Paper from 'material-ui/Paper'
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import ReportList from '../containers/ReportList'
import {GridList, GridTile} from 'material-ui/GridList';


class UserArchivePage extends React.Component {
  state = {
    month: 1,
    year: 2017
  };

  componentDidMount() {
    const date = new Date();
    this.setState({
      month: date.getMonth() + 1,
      year: date.getFullYear()
    });

    const {changeSubtitle} = this.props;
    if (changeSubtitle) {
      changeSubtitle("Archive")
    }
  };


  render() {
    return (
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <div style={{display: 'flex', paddingLeft: '2vh'}}>
          <SelectField
            style={{width: '15vh'}}
            floatingLabelText="Month"
            value={this.state.month}
            onChange={this._handleChangeMonth}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(month => (
              <MenuItem key={month} value={month} primaryText={month}/>
            ))}
          </SelectField>
          <SelectField
            style={{width: '15vh', marginLeft: '2vh'}}
            floatingLabelText="Year"
            value={this.state.year}
            onChange={this._handleChangeYear}
          >
            {[2017, 2018, 2019, 2020, 2021].map(year => (
              <MenuItem key={year} value={year} primaryText={year}/>
            ))}
          </SelectField>

        </div>
        <div style={{flex: 1, padding: '1vh'}}>
          <ReportList
            goToReport={this._goToReport}
            month={this.state.month}
            year={this.state.year}
            userId={this.props.user.userId}/>
        </div>
      </div>
    )
  }
  _goToReport = (report) => {
    this.props.router.replace(`/user/${report.user.userId}/report/${report.reportId}`);
  };
  _handleChangeMonth = (_event, _, month) => {
    this.setState({month: month})
  };
  _handleChangeYear = (_event, _, year) => {
    this.setState({year: year})
  };
}

export default withRouter(UserArchivePage);

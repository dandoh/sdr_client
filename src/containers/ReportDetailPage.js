import React from "react";
import {withRouter} from "react-router";
import {graphql, compose} from "react-apollo";
import gql from "graphql-tag";
import Subheader from 'material-ui/Subheader';
import TextField from 'material-ui/TextField'
import TodoList from '../components/TodoList';
import Paper from 'material-ui/Paper'
import Error from '../components/Error'
import Loading from '../components/Loading'
const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column'
  }
};

class ReportDetailPage extends React.Component {

  state = {};

  render() {
    console.log(this.props);
    let {loading, error, report} = this.props.data;
    if (error) {
      return (<Error/>)
    } else if (loading) {
      return (<Loading/>)
    } else {
      console.log("den day roi");
      return (
        <div style={styles.wrapper}>
          <Subheader>Tasks</Subheader>
          <TodoList todoes={report.todoes}
                    editable={true}
                    hasTick={true}
                    onTick={this._onTodoTick}
                    onDelete={this._onTodoDelete}
          />
          <Subheader>Note</Subheader>
          <Paper style={{padding: '1vh'}}>
            <TextField
              floatingLabelText={`${report.user.name}'s note`}
              multiLine={true}
              fullWidth={true}
              rows={2}
              value={report.note}
              rowsMax={10}
            />
          </Paper>
          <Subheader>Comments</Subheader>
        </div>
      );

    }

  }

  _onTodoTick = (todoId) => {

  };

  _onTodoDelete = (todoId) => {

  };
}

const getReportDetailQuery = gql`query 
  GetReportQuery($reportId: Int) {
    report(reportId: $reportId) {
      reportId
      user {
        userId
        name
      }
      todoes {
        todoId
        content
        state
      }
      note
      comments {
        user {
          name
          userId
        }
        commentId
        content
      }
    }
  }`;

const withData = graphql(getReportDetailQuery, {
  options: (ownProps) => {
    return {
      variables: {
        reportId: parseInt(ownProps.params.reportId)
      },
      forceFetch: true,
    }
  }
});


const createComment = gql`mutation
  CreateComment($content: String, $reportId: Int) {
    createComment(content: $content, reportId: $reportId)
  }`;


const withMutation = compose(
  graphql(createComment, {name: 'createComment'})
);

export default withData(withRouter(ReportDetailPage))

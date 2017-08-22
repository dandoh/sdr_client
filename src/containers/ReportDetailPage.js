import React from "react";
import {withRouter} from "react-router";
import {graphql, compose} from "react-apollo";
import gql from "graphql-tag";
import Subheader from 'material-ui/Subheader';
import TextField from 'material-ui/TextField'
import Divider from 'material-ui/Divider'
import Checkbox from 'material-ui/Checkbox';
import TodoList from '../components/TodoList';
import {ListItem} from 'material-ui/List'
import Paper from 'material-ui/Paper'
import Error from '../components/Error'
import Mousetrap from 'mousetrap'
import Loading from '../components/Loading'
import RaisedButton from 'material-ui/RaisedButton'
import CommentList from '../components/CommentList'
import IconButton from 'material-ui/IconButton';
import AddAction from 'material-ui/svg-icons/content/add';
const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'scroll'
  }
};

class ReportDetailPage extends React.Component {

  state = {
    report: null,
    stack1: [],
    stack2: [],
    newContent: "",
    comment: ""
  };

  componentWillReceiveProps(newProps) {
    if (newProps.data.report) {
      if (this.state.report == null) {
        // FIRST TIME IN
        this.setState({
          latestTodoes: newProps.data.report.todoes,
          report: newProps.data.report,
          stack1: [newProps.data.report.todoes]
        });

        // change subtitle
        const {changeSubtitle} = this.props;
        if (changeSubtitle) {
          changeSubtitle(this.dateToString(newProps.data.report.createdAt))
        }
      } else {
        let {stack1} = this.state;
        this.setState({
          latestTodoes: newProps.data.report.todoes,
          report: {
            ...newProps.data.report,
            todoes: stack1[stack1.length - 1]
          }
        })
      }
    }
  }

  componentWillMount() {
    const myUserId = localStorage.getItem('userId');
    this.setState({myUserId});
    Mousetrap.bind(['command+z', 'ctrl+z'], this._undoTodoAction);
    Mousetrap.bind(['command+shift+z', 'ctrl+y'], this._redoTodoAction);
    window.onbeforeunload = (e) => {
      this._syncToServer();
      this._updateNote();
    }
  }

  componentWillUnmount() {
    this._syncToServer();
    this._updateNote();
  }


  render() {
    let {loading, error} = this.props.data;
    if (error) {
      return (<Error/>)
    } else if (loading) {
      return (<Loading/>)
    } else {
      const {report, myUserId} = this.state;
      const isMine = myUserId == report.user.userId;
      return (
        <div style={styles.wrapper}>
          <div style={{display: 'flex'}}>
            <Subheader style={{flex: 8}}>Task</Subheader>
            <Subheader style={isMine ? {flex: 1.5} : {flex: 1.5}}>Estimated Time</Subheader>
            <Subheader style={isMine ? {flex: 2.5} : {flex: 1.5}}>Spent Time</Subheader>
          </div>
          <TodoList todoes={report.todoes}
                    editable={myUserId == report.user.userId}
                    onEstimateTimeChange={this._onEstimateTimeChange}
                    onSpentTimeChange={this._onSpentTimeChange}
                    onTick={this._onTodoTick}
                    onDelete={this._onTodoDelete}
          />
          {
            isMine &&
            <Paper style={{
              padding: '0.8vh',
              display: 'flex',
              paddingBottom: '3vh',
              paddingRight: '3vh'
            }}>
              <div style={{marginTop: '2.4vh'}}>
                <Checkbox
                  disabled={true}
                />
              </div>
              <TextField
                onKeyPress={this._addNewTodo}
                hintText="Add a new task"
                value={this.state.newContent}
                onChange={(_, value) => {
                  this.setState({newContent: value})
                }}
                fullWidth={true}
              />
            </Paper>
          }
          <Subheader>Note</Subheader>
          <Paper style={{padding: '1vh'}}>
            <TextField
              disabled={!isMine}
              value={report.note}
              onBlur={this._updateNote}
              onChange={this._onChangeNoteValue}
              fullWidth={true}
              multiLine={true}/>
          </Paper>
          <Subheader>Comments</Subheader>
          <CommentList comments={report.comments}/>
          <Paper
            style={{
              paddingLeft: '3vh',
              paddingRight: '1vh',
              marginTop: '1vh',
              marginBottom: '1vh'
            }}>
            <TextField
              multiLine={true}
              fullWidth={true}
              rows={1}
              value={this.state.comment}
              hintText="Add a comment"
              onChange={(_, value) => {
                this.setState({comment: value})
              }}
              rowsMax={10}
              underlineShow={false}
            />
          </Paper>
          <div style={{display: 'flex', alignItems: 'flex-end'}}>
            <div style={{flex: 1}}></div>
            <RaisedButton label="Comment" secondary={true}
                          onClick={this._handleComment}
                          style={{marginBottom: '1vh'}}/>
          </div>
        </div>
      );

    }

  }

  _onEstimateTimeChange = (todoId, val) => {
    const {report} = this.state;
    const newTodoes = report.todoes.map(todo => {
      if (todo.todoId != todoId) {
        return todo;
      } else {
        return {
          ...todo,
          estimateTime: val
        }
      }
    });
    this._commit(newTodoes)
  };

  _onSpentTimeChange = (todoId, val) => {
    const {report} = this.state;
    const newTodoes = report.todoes.map(todo => {
      if (todo.todoId != todoId) {
        return todo;
      } else {
        return {
          ...todo,
          spentTime: val
        }
      }
    });
    this._commit(newTodoes)
  };

  _handleComment = () => {
    this.props.addComment({
      variables: {
        reportId: this.state.report.reportId,
        content: this.state.comment
      }
    }).then(res => {
      this.props.data.refetch();
      this.setState({comment: ""});
    }).catch(err => {
      alert("Error adding new comment")
    });
  };

  _undoTodoAction = () => {
    const {report, stack1, stack2} = this.state;
    if (stack1.length > 1) {
      stack2.push(stack1.pop());
      this.setState({
        report: {
          ...report,
          todoes: stack1[stack1.length - 1]
        },
        stack1,
        stack2
      });
      this._commit()
    }

  };

  _updateNote = () => {
    this.props.updateNote({
      variables: {
        reportId: this.state.report.reportId,
        note: this.state.report.note
      }
    }).then(res => {
      this.props.data.refetch();
    }).catch(err => {
      console.log(err);
    });
  };

  _redoTodoAction = () => {
    const {report, stack1, stack2} = this.state;
    if (stack2.length >= 1) {
      stack1.push(stack2.pop());
      this.setState({
        report: {
          ...report,
          todoes: stack1[stack1.length - 1]
        },
        stack1,
        stack2
      });
      this._commit()
    }
  };

  _onTodoTick = (todoId) => {

    const {report} = this.state;
    const newTodoes = report.todoes.map(todo => {
      if (todo.todoId != todoId) {
        return todo;
      } else {
        return {
          ...todo,
          state: 1 - todo.state
        }
      }
    });
    this._commit(newTodoes);
  };

  _commit = (newTodoes) => {
    if (newTodoes) {
      const {report, stack1} = this.state;

      this.setState({
        report: {
          ...report,
          todoes: newTodoes
        },
        stack1: stack1.concat([newTodoes]),
        stack2: []
      });
      if (this.state.stack1.length % 3 == 0) {
        this._syncToServer(newTodoes)
      }
    } else {
      if (this.state.stack1.length % 3 == 0) {
        this._syncToServer()
      }
    }

  };

  _onTodoDelete = (todoId) => {
    const {report} = this.state;
    const newTodoes = report.todoes.filter(todo => {
      return todo.todoId != todoId
    });
    this._commit(newTodoes)
  };

  _onChangeNoteValue = (_, value) => {
    const updatedReport = {...this.state.report};
    updatedReport.note = value;

    this.setState({report: updatedReport});
  };

  _addNewTodo = (event) => {
    if (event.key == 'Enter') {
      const {report, newContent} = this.state;
      const lowestFakeId = report.todoes.reduce((acc, todo) => {
        return Math.min(acc, todo.todoId - 1)
      }, -1);
      const newTodo = {
        content: newContent,
        todoId: lowestFakeId,
        state: 0,
        estimateTime: 0,
        spentTime: 0
      };
      const newTodoes = [...report.todoes, newTodo];
      this.setState({newContent: ""});
      this._commit(newTodoes);
    }
  };

  _syncToServer = (newTodoes = this.state.stack1[this.state.stack1.length - 1]) => {
    const isIdentical = (todo1, todo2) => {
      return todo1.content == todo2.content &&
        todo1.state == todo2.state &&
        todo1.estimateTime == todo2.estimateTime &&
        todo1.spentTime == todo2.spentTime;
    };
    const {latestTodoes} = this.state;

    const uploadList = newTodoes.filter(
      todo => !latestTodoes.find(todoFromServer => isIdentical(todoFromServer, todo))
    );

    const deleteList = latestTodoes.filter(
      todoFromServer => !newTodoes.find(todo => isIdentical(todo, todoFromServer))
    );

    if (uploadList.length > 0 || deleteList.length > 0) {
      Promise.all(uploadList.map(todo =>
        this.props.addTodo({
          variables: {
            reportId: this.state.report.reportId,
            content: todo.content,
            state: todo.state,
            estimateTime: todo.estimateTime,
            spentTime: todo.spentTime
          }
        })
      )).then((res) => {
        return Promise.all(deleteList.map(todo =>
          this.props.deleteTodo({
            variables: {
              todoId: todo.todoId
            }
          }))
        )
      }).then((res) => {
        this.props.data.refetch();
      }).catch(err => {
        console.log("error sync");
        console.log(err);
      });
    }

  };

  dateToString = (createdAt) => {
    let d = new Date(createdAt.substring(0, 19)),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }
}


const getReportDetailQuery = gql`query 
  GetReportQuery($reportId: Int) {
    report(reportId: $reportId) {
      createdAt
      reportId
      user {
        userId
        name
      }
      todoes {
        todoId
        content
        state
        estimateTime
        spentTime
      }
      note
      comments {
        user {
          name
          userId
          avatar
        }
        commentId
        content
        createdAt
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


const addComment = gql`mutation
  AddComent($content: String, $reportId: Int) {
    addComment(content: $content, reportId: $reportId)
  }`;

const updateNote = gql`mutation
  UpdateNote($note: String, $reportId: Int) {
    updateNote(note: $note, reportId: $reportId)
  }
`;

const addTodo = gql`mutation
  AddTodo($reportId: Int!, $content: String!, $state: Int!, $estimateTime: Int!, $spentTime: Int!) {
    addTodo(reportId: $reportId, content: $content, state: $state, estimateTime: $estimateTime, spentTime: $spentTime)
  }
`;

const deleteTodo = gql`mutation
  DeleteTodo($todoId: Int!) {
    deleteTodo(todoId: $todoId)
  }
`;


const withMutation = compose(
  graphql(addComment, {name: 'addComment'}),
  graphql(updateNote, {name: 'updateNote'}),
  graphql(addTodo, {name: 'addTodo'}),
  graphql(deleteTodo, {name: 'deleteTodo'})
);

export default withData(withMutation(withRouter(ReportDetailPage)))

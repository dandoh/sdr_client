/**
 * Created by Dandoh on 7/21/17.
 */
import React from "react";
import Paper from 'material-ui/Paper'
import Checkbox from 'material-ui/Checkbox';
import TextField from 'material-ui/TextField'
import IconButton from 'material-ui/IconButton';
import ActionDelete from 'material-ui/svg-icons/content/clear';

const styles = {
  errorStyle: {
    margin: 0
  },
};
export default function TodoItem({todo, editable, onTick, onDelete, onEstimateTimeChange, onSpentTimeChange}) {
  return (
    <Paper style={{padding: '0.8vh', display: 'flex'}}>
      <div style={{marginTop: '2.4vh'}}>
        <Checkbox
          disabled={!editable}
          onCheck={() => onTick(todo.todoId)}
          checked={todo.state == 1}
        />
      </div>
      <div style={{flex: 5, marginTop: '3vh'}}>
        {todo.content}
      </div>
      <TextField
        style={{flex: 1, marginRight: '1vh'}}
        hintText="In minutes"
        value={todo.estimateTime}
        onChange={(_, val) => {onEstimateTimeChange(todo.todoId, val)}}
        disabled={!editable}
      />
      <TextField
        style={{flex: 1, marginRight: '1vh', marginBottom: '1vh'}}
        hintText="In minutes"
        errorText=""
        value={`${todo.spentTime}`}
        disabled={!editable}
        onChange={(_, val) => {onSpentTimeChange(todo.todoId, val)}}
        errorStyle={styles.errorStyle}
      />
      {editable &&
      <IconButton onClick={() => onDelete(todo.todoId)} tooltip="Delete this task">
        <ActionDelete color="black"/>
      </IconButton>}
    </Paper>
  )
}




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
export default function TodoItem({todo, editable, onTick, onDelete}) {
  return (
    <Paper style={{padding: '0.8vh', display: 'flex'}}>
      <div style={{marginTop: '1.7vh'}}>
        <Checkbox
          disabled={!editable}
          onCheck={() => onTick(todo.todoId)}
          checked={todo.state == 1}
        />
      </div>
      <div style={{flex: 5, marginTop: '2vh'}}>
        {todo.content}
      </div>
      <TextField
        style={{flex: 2, marginRight: '1vh'}}
        hintText="Estimated Time"
      />
      <TextField
        style={{flex: 2, marginRight: '1vh', marginBottom: '1vh'}}
        hintText="Spent Time"
        errorText=""
        errorStyle={styles.errorStyle}
      />
      {editable &&
      <IconButton onClick={() => onDelete(todo.todoId)} tooltip="Delete this task">
        <ActionDelete color="black"/>
      </IconButton>}
    </Paper>
  )
}




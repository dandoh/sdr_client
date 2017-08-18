/**
 * Created by Dandoh on 7/21/17.
 */
import React from "react";
import TodoItem from './TodoItem';

export default function TodoList({
  todoes, editable,
  onTick, onDelete
}) {
  return (
    <div>
      {todoes.map((todo) => (<TodoItem
        key={todo.todoId}
        todo={todo}
        editable={editable}
        onTick={onTick}
        onDelete={onDelete}/>))}
    </div>
  )
}




<template>
  <section class="todoapp">
    <header class="header">
      <h1>todos</h1>
      <input
        class="new-todo"
        placeholder="What needs to be done?"
        autofocus
        v-model="input"
        @keyup.enter="addTodo"
      />
    </header>
    <section class="main">
      <input id="toggle-all" class="toggle-all" type="checkbox" />
      <label for="toggle-all">Mark all as complete</label>
      <ul class="todo-list">
        <li
          v-for="todo in todos"
          :key="todo"
          :class="{ editing: todo === editingTodo }"
        >
          <div class="view">
            <input class="toggle" type="checkbox" v-model="todo.completed" />
            <label @dblclick="editTodo(todo)">{{ todo.text }}</label>
            <button class="destroy" @click="remove(todo)"></button>
          </div>
          <input class="edit" v-model="todo.text" />
        </li>
      </ul>
    </section>
    <footer class="footer" v-if="false">
      <!-- <span class="todo-count">
        <strong>{{ todos.length }}</strong>
        {{ todos.length > 1 ? "items" : "item" }}
        left
      </span> -->
      <ul class="filters" v-if="false">
        <li>
          <a :class="{ selected: type === 'all' }" href="#/all">All</a>
        </li>
        <li>
          <a :class="{ selected: type === 'active' }" href="#/active">Active</a>
        </li>
        <li>
          <a :class="{ selected: type === 'completed' }" href="#/completed">
            Completed
          </a>
        </li>
      </ul>
      <button
        class="clear-completed"
        v-show="completedCount.length > 0"
        @click="removeCompleted"
      >
        Clear completed
      </button>
    </footer>
  </section>
  <footer class="info">
    <p>Double-click to edit a todo</p>
    <p>
      Created by
      <a href="https://github.com/Aisen60/vue-composition-api-todolist">
        Aisen60</a
      >
    </p>
    <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
  </footer>
</template>

<script>
import { ref, reactive, watch, computed } from "vue";
import { getStorage, setStorage } from "../utils/";

const useAddTodo = (todos) => {
  const input = ref("");
  const addTodo = () => {
    const text = input.value && input.value.trim();
    if (text.length === 0) return;
    todos.push({
      text,
      completed: false,
    });
    input.value = "";
  };
  return { input, addTodo };
};

const useRemove = (todos) => {
  const remove = (todo) => {
    const index = todos.indexOf(todo);
    todos.splice(index, 1);
  };
  return { remove };
};

const useEdit = () => {
  let beforeText = "";
  let editingTodo = reactive({});
  const editTodo = (todo) => {
    beforeText = todo.text;
    editingTodo = todo;
    console.log(editingTodo, todo);
    console.log(editingTodo === todo);
  };
  const cancelEdit = (todo) => {
    beforeText = "";
    todo.text = editingTodo.text;
  };

  watch(editingTodo, (newVal, oldVal) => {
  });
  return {
    editingTodo,
    editTodo,
    cancelEdit,
  };
};

export default {
  name: "TodoList",
  setup() {
    const todos = reactive([]);
    const { remove } = useRemove(todos);
    return {
      todos,
      remove,
      ...useAddTodo(todos),
      ...useEdit(),
    };
  },
};
</script>

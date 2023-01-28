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
          v-for="todo in filteredTodos"
          :class="{
            editing: todo === editingTodo,
            completed: todo.completed,
          }"
          :key="todo.date"
        >
          <div class="view">
            <input class="toggle" type="checkbox" v-model="todo.completed" />
            <label @dblclick="editTodo(todo)">{{ todo.text }}</label>
            <button class="destroy" @click="remove(todo)"></button>
          </div>
          <input
            class="edit"
            type="text"
            v-editing-focus="todo === editingTodo"
            v-model="todo.text"
            @keyup.enter="doneEdit(todo)"
            @blur="doneEdit(todo)"
            @keyup.esc="cancelEdit(todo)"
          />
        </li>
      </ul>
    </section>
    <footer class="footer" v-show="count">
      <span class="todo-count">
        <strong>{{ remainingCount }}</strong>
        {{ remainingCount > 1 ? "items" : "item" }} left
      </span>
      <ul class="filters">
        <li>
          <a href="#/all" :class="{ selected: type === 'all' }">All</a>
        </li>
        <li>
          <a href="#/active" :class="{ selected: type === 'active' }">Active</a>
        </li>
        <li>
          <a href="#/completed" :class="{ selected: type === 'completed' }">
            Completed
          </a>
        </li>
      </ul>
      <button
        class="clear-completed"
        @click="removeCompleted"
        v-show="count > remainingCount"
      >
        Clear completed
      </button>
    </footer>
  </section>
  <footer class="info">
    <p>Double-click to edit a todo</p>
    <p>Created by <a href="https://github.com/Aisen60">Aisen60</a></p>
    <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
  </footer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watchEffect } from "vue";
import useLocalStorage from "./utils/useLocalStorage";
import "./assets/index.css";

type Todo = {
  text: string;
  completed: boolean;
  date: string;
};

type Type = "all" | "active" | "completed";

const storage = useLocalStorage();

const KEY = "TODOKEYS";

const todos = ref<Todo[]>(storage.getItem<Todo[]>(KEY) || []);

const input = ref("");

const type = ref<Type>("all");

const editingTodo = ref<Todo | null>();

const beforeEditingText = ref("");

const filter = {
  all: (list: Todo[]) => list,
  active: (list: Todo[]) => list.filter((todo) => !todo.completed),
  completed: (list: Todo[]) => list.filter((todo) => todo.completed),
};

const filteredTodos = computed(() => {
  return filter[type.value](todos.value);
});

const remainingCount = computed(() => filter["active"](todos.value).length);

const count = computed(() => todos.value.length);

const addTodo = () => {
  const text = input.value && input.value.trim();
  if (text.length === 0) return;
  todos.value.push({
    text,
    completed: false,
    date: new Date().getTime().toString(),
  });
  input.value = "";
};

const editTodo = (todo: Todo) => {
  beforeEditingText.value = todo.text;
  editingTodo.value = todo;
};

const doneEdit = (todo: Todo) => {
  if (!editingTodo.value) return;
  todo.text = todo.text.trim();
  todo.text || remove(todo);
  editingTodo.value = null;
};

const cancelEdit = (todo: Todo) => {
  editingTodo.value = null;
  todo.text = beforeEditingText.value;
};

const remove = (todo: Todo) => {
  const index = todos.value.indexOf(todo);
  todos.value.splice(index, 1);
};

const removeCompleted = () => {
  todos.value = todos.value.filter((todo) => !todo.completed);
};

const vEditingFocus = {
  mounted(el: any, binding: any) {
    binding.value && el.focus();
  },
};

watchEffect(() => {
  storage.setItem(KEY, todos.value);
});

const onHashChange = () => {
  const hash = window.location.hash.replace("#/", "") as Type;
  if (filter[hash]) {
    type.value = hash;
  } else {
    type.value = "all";
    window.location.hash = "";
  }
};

onMounted(() => {
  window.addEventListener("hashchange", onHashChange);
  onHashChange();
});

onUnmounted(() => {
  window.removeEventListener("hashchange", onHashChange);
});
</script>

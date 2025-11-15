"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./page.module.css";

type Todo = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
};

type Filter = "all" | "active" | "completed";

const STORAGE_KEY = "agentic-todos";

function createTodo(title: string): Todo {
  return {
    id: crypto.randomUUID(),
    title: title.trim(),
    completed: false,
    createdAt: Date.now()
  };
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed: Todo[] = JSON.parse(stored);
        setTodos(parsed);
      } catch (error) {
        console.error("Failed to parse todos", error);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case "active":
        return todos.filter((todo) => !todo.completed);
      case "completed":
        return todos.filter((todo) => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  const remainingCount = useMemo(
    () => todos.filter((todo) => !todo.completed).length,
    [todos]
  );

  const completionPercentage = useMemo(() => {
    if (todos.length === 0) {
      return 0;
    }
    const done = todos.filter((todo) => todo.completed).length;
    return Math.round((done / todos.length) * 100);
  }, [todos]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) {
      return;
    }
    setTodos((prev) => [createTodo(trimmed), ...prev]);
    setTitle("");
  }

  function handleToggle(id: string) {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }

  function handleRemove(id: string) {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setEditingTitle("");
    }
  }

  function handleStartEdit(todo: Todo) {
    setEditingId(todo.id);
    setEditingTitle(todo.title);
  }

  function handleEditSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingId) {
      return;
    }
    const trimmed = editingTitle.trim();
    if (!trimmed) {
      handleRemove(editingId);
      return;
    }
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === editingId ? { ...todo, title: trimmed } : todo
      )
    );
    setEditingId(null);
    setEditingTitle("");
  }

  function handleCancelEdit() {
    setEditingId(null);
    setEditingTitle("");
  }

  function handleClearCompleted() {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
  }

  function handleToggleAll() {
    const allCompleted = todos.every((todo) => todo.completed);
    setTodos((prev) => prev.map((todo) => ({ ...todo, completed: !allCompleted })));
  }

  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>Focus Tasks</h1>
            <p className={styles.subtitle}>
              Capture what matters, track progress, and stay in flow.
            </p>
          </div>
          <div className={styles.progress}>
            <span>{completionPercentage}% complete</span>
            <div className={styles.progressBar} role="presentation">
              <span
                className={styles.progressIndicator}
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        </header>

        <form className={styles.newForm} onSubmit={handleSubmit}>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Add a new task and press Enter…"
            className={styles.input}
            aria-label="Add a new task"
          />
          <button type="submit" className={styles.submit} disabled={!title.trim()}>
            Add
          </button>
        </form>

        <div className={styles.toolbar}>
          <div className={styles.filters}>
            {(["all", "active", "completed"] as Filter[]).map((option) => (
              <button
                key={option}
                type="button"
                className={
                  option === filter ? styles.filterButtonActive : styles.filterButton
                }
                onClick={() => setFilter(option)}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
          <div className={styles.actions}>
            <button
              type="button"
              onClick={handleToggleAll}
              className={styles.secondaryButton}
              disabled={todos.length === 0}
            >
              Toggle All
            </button>
            <button
              type="button"
              onClick={handleClearCompleted}
              className={styles.secondaryButton}
              disabled={todos.every((todo) => !todo.completed)}
            >
              Clear Completed
            </button>
          </div>
        </div>

        <section className={styles.listSection} aria-live="polite">
          {filteredTodos.length === 0 ? (
            <p className={styles.empty}>
              {todos.length === 0
                ? "No tasks yet. Add your first task to get started."
                : "No tasks match this filter."}
            </p>
          ) : (
            <ul className={styles.list}>
              {filteredTodos.map((todo) => (
                <li key={todo.id} className={styles.listItem}>
                  <label className={styles.todoMain}>
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => handleToggle(todo.id)}
                      className={styles.checkbox}
                    />
                    {editingId === todo.id ? (
                      <form className={styles.editForm} onSubmit={handleEditSubmit}>
                        <input
                          value={editingTitle}
                          onChange={(event) => setEditingTitle(event.target.value)}
                          autoFocus
                          className={styles.editInput}
                          onBlur={handleCancelEdit}
                        />
                      </form>
                    ) : (
                      <span
                        className={
                          todo.completed ? styles.todoTitleCompleted : styles.todoTitle
                        }
                      >
                        {todo.title}
                      </span>
                    )}
                  </label>
                  <div className={styles.todoActions}>
                    {editingId === todo.id ? (
                      <button
                        type="button"
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={handleCancelEdit}
                        className={styles.iconButton}
                        aria-label="Cancel edit"
                      >
                        ✕
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleStartEdit(todo)}
                        className={styles.iconButton}
                        aria-label="Edit task"
                      >
                        ✎
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemove(todo.id)}
                      className={styles.iconButton}
                      aria-label="Delete task"
                    >
                      🗑
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <footer className={styles.footer}>
          <span>
            {remainingCount} task{remainingCount === 1 ? "" : "s"} remaining
          </span>
          <span>{new Date().toLocaleDateString()}</span>
        </footer>
      </div>
    </main>
  );
}

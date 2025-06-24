import { deleteTodo, patchTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';
import { errorNotificationMessage } from '../../utils/errorFunction';
import { TodoElement } from '../TodoElement/TodoElement';

interface TodoappMainProps {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorNotification: (msg: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  errorNotification: string;
}

export const TodoappMain: React.FC<TodoappMainProps> = ({
  todos,
  setTodos,
  setErrorNotification,
  inputRef,
}) => {
  const handleTodoDelete = async (idTodo: number) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === idTodo ? { ...todo, isLoaded: false } : todo,
      ),
    );

    try {
      await deleteTodo(idTodo);
      setTodos(prev => prev.filter(todo => todo.id !== idTodo));
      inputRef.current?.focus();
    } catch {
      errorNotificationMessage('Unable to delete a todo', setErrorNotification);

      setTodos(prev =>
        prev.map(todo =>
          todo.id === idTodo ? { ...todo, isLoaded: true } : todo,
        ),
      );
    }
  };

  const handleToggleStatus = async (todoToUpdate: Todo) => {
    const idTodo = todoToUpdate.id;

    setTodos(prev =>
      prev.map(todo =>
        todo.id === idTodo ? { ...todo, isLoaded: false } : todo,
      ),
    );

    try {
      const updated = await patchTodo(idTodo, {
        completed: !todoToUpdate.completed,
      });

      setTodos(prev =>
        prev.map(todo =>
          todo.id === idTodo ? { ...updated, isLoaded: true } : todo,
        ),
      );
    } catch {
      errorNotificationMessage('Unable to update a todo', setErrorNotification);
    }
  };

  const handleUpdateTodo = async (updatedTodo: Todo) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === updatedTodo.id ? { ...todo, isLoaded: false } : todo,
      ),
    );

    try {
      const serverTodo = await patchTodo(updatedTodo.id, {
        title: updatedTodo.title,
      });

      setTodos(prev =>
        prev.map(todo =>
          todo.id === serverTodo.id
            ? { ...todo, title: updatedTodo.title, isLoaded: true }
            : todo,
        ),
      );
    } catch {
      errorNotificationMessage('Unable to update a todo', setErrorNotification);

      setTodos(prev =>
        prev.map(todo =>
          todo.id === updatedTodo.id ? { ...todo, isLoaded: true } : todo,
        ),
      );
    }
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoElement
          key={todo.id}
          todo={todo}
          handleTodoDelete={handleTodoDelete}
          handleToggleStatus={() => handleToggleStatus(todo)}
          handleUpdateTodo={handleUpdateTodo}
        />
      ))}
    </section>
  );
};

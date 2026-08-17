import { createContext, useContext, useState } from 'react';
import { mockTasks } from '../mocks/taskMock';

const TaskContext = createContext(null);

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState(
    mockTasks.map((task) => ({
      ...task,
    }))
  );

  // 업무 추가
  const addTask = (task) => {
    setTasks((prevTasks) => [
      ...prevTasks,
      {
        ...task,
      },
    ]);
  };

  // 업무 수정
  const updateTask = (taskId, updatedTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.taskId === taskId
          ? {
              ...task,
              ...updatedTask,
            }
          : task
      )
    );
  };

  // 업무 삭제
  const deleteTask = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.filter(
        (task) => task.taskId !== taskId
      )
    );
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        setTasks,
        addTask,
        updateTask,
        deleteTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);

  if (!context) {
    throw new Error(
      'useTasks는 TaskProvider 안에서 사용해야 합니다.'
    );
  }

  return context;
}

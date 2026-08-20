import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  getTasks,
  createTask,
  updateTask as updateTaskApi,
  deleteTask as deleteTaskApi,
} from '../services/taskService';

import { useProject } from './ProjectContext';

const TaskContext = createContext(null);

export function TaskProvider({ children }) {
  const { currentProject } = useProject();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTasks = async (projectId) => {
    if (!projectId) {
      setTasks([]);
      return [];
    }

    try {
      setLoading(true);

      const data = await getTasks(projectId);

      const nextTasks = Array.isArray(data)
          ? data
          : data?.tasks ?? [];

      setTasks(nextTasks);

      return nextTasks;
    } catch (error) {
      console.error(
          '업무 목록 로드 실패:',
          error
      );

      setTasks([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  /*
   * 직접 업무 생성
   */
  const addTask = async (
      taskData,
      projectId = currentProject?.projectId
  ) => {
    if (!projectId) {
      throw new Error(
          '업무를 생성할 프로젝트가 없습니다.'
      );
    }

    const createdTask =
        await createTask(
            projectId,
            taskData
        );

    if (
        String(currentProject?.projectId) ===
        String(projectId)
    ) {
      setTasks((prevTasks) => [
        ...prevTasks,
        createdTask,
      ]);
    }

    return createdTask;
  };

  const updateTask = async (
      taskId,
      updatedTask
  ) => {
    const updated =
        await updateTaskApi(
            taskId,
            updatedTask
        );

    setTasks((prevTasks) =>
        prevTasks.map((task) =>
            task.taskId === taskId
                ? {
                  ...task,
                  ...(updated || updatedTask),
                }
                : task
        )
    );

    return updated;
  };

  const deleteTask = async (taskId) => {
    await deleteTaskApi(taskId);

    setTasks((prevTasks) =>
        prevTasks.filter(
            (task) =>
                task.taskId !== taskId
        )
    );
  };

  useEffect(() => {
    if (currentProject?.projectId) {
      void fetchTasks(
          currentProject.projectId
      );
    }
  }, [currentProject?.projectId]);

  return (
      <TaskContext.Provider
          value={{
            tasks,
            setTasks,
            fetchTasks,
            addTask,
            updateTask,
            deleteTask,
            loading,
          }}
      >
        {children}
      </TaskContext.Provider>
  );
}

export function useTasks() {
  const context =
      useContext(TaskContext);

  if (!context) {
    throw new Error(
        'useTasks는 TaskProvider 안에서 사용해야 합니다.'
    );
  }

  return context;
}
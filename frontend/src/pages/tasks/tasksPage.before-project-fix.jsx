import { useState } from 'react';

import { getAllTasks } from '../../services/taskService';
import { getCurrentUser } from '../../services/userService';
import TaskColumn from '../../components/task/TaskColumn';
import TaskRow from '../../components/task/TaskRow';

import './TasksPage.css';

const TABS = [
  { key: 'all', label: '모든 업무' },
  { key: 'mine', label: '내 업무' },
  { key: 'done', label: '완료된 업무' },
];

const COLUMNS = [
  { status: 'TODO', title: '할 일' },
  { status: 'IN_PROGRESS', title: '진행 중' },
  { status: 'DONE', title: '진행 완료' },
];

function TasksPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState('board');

  const currentUser = getCurrentUser();
  const tasks = getAllTasks();

  const filteredTasks = (Array.isArray(tasks) ? tasks : []).filter((task) => {
    if (activeTab === 'mine') return task.assigneeId === currentUser.userId;
    if (activeTab === 'done') return task.status === 'DONE';
    return true;
  });

  const isDoneTab = activeTab === 'done';
  const showList = isDoneTab || viewMode === 'list';

  return (
    <div className="taskboard-page">

      {/* MY 업무 상단 */}
      <header className="taskboard-header">
        <h1>MY 업무</h1>
      </header>

      {/* 탭 + 보기 옵션 */}
      <div className="taskboard-toolbar">
        <nav className="taskboard-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={`taskboard-tab ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {!isDoneTab && (
          <div className="taskboard-actions">
            <div className="taskboard-view-toggle">
              <button
                type="button"
                className={`view-toggle-button ${viewMode === 'board' ? 'active' : ''}`}
                aria-label="보드형 보기"
                onClick={() => setViewMode('board')}
              >
                <svg viewBox="0 0 16 16" width="14" height="14">
                  <rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor" />
                  <rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor" />
                  <rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor" />
                  <rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor" />
                </svg>
              </button>

              <button
                type="button"
                className={`view-toggle-button ${viewMode === 'list' ? 'active' : ''}`}
                aria-label="리스트형 보기"
                onClick={() => setViewMode('list')}
              >
                <svg viewBox="0 0 16 16" width="14" height="14">
                  <rect x="1" y="2" width="14" height="2.4" rx="1.2" fill="currentColor" />
                  <rect x="1" y="6.8" width="14" height="2.4" rx="1.2" fill="currentColor" />
                  <rect x="1" y="11.6" width="14" height="2.4" rx="1.2" fill="currentColor" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 완료된 업무 탭은 항상 리스트형, 그 외 탭은 보기 토글을 따름 */}
      {showList ? (
        <div className="taskboard-list-view">
          {filteredTasks.length > 0 ? (
            COLUMNS.map((column) => {
              const columnTasks = filteredTasks.filter(
                (task) => task.status === column.status
              );

              if (columnTasks.length === 0) return null;

              return (
                <div key={column.status} className="taskboard-list-group">
                  <div className="taskboard-list-group-header">
                    <h2>{column.title}</h2>
                    <span className="taskboard-column-count">{columnTasks.length}</span>
                  </div>

                  <div className="taskboard-list-group-rows">
                    {columnTasks.map((task) => (
                      <TaskRow key={task.taskId} task={task} />
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
            <p className="taskboard-column-empty">
              해당하는 업무가 없습니다.
            </p>
          )}
        </div>
      ) : (
        <div className="taskboard-board">
          {COLUMNS.map((column) => (
            <TaskColumn
              key={column.status}
              title={column.title}
              tasks={filteredTasks.filter((task) => task.status === column.status)}
            />
          ))}
        </div>
      )}

    </div>
  );
}

export default TasksPage;

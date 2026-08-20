import {
    useEffect,
    useState,
} from 'react';

import { useNavigate } from 'react-router-dom';

import { useTasks } from '../../context/TaskContext';
import { useProjects } from '../../context/ProjectContext';

import { getCurrentUser } from '../../services/userService';
import { getTasks } from '../../services/taskService';

import TaskColumn from '../../components/task/TaskColumn';
import TaskRow from '../../components/task/TaskRow';

import './TasksPage.css';

const TABS = [
    {
        key: 'all',
        label: '모든 업무',
    },
    {
        key: 'mine',
        label: '내 업무',
    },
    {
        key: 'done',
        label: '완료된 업무',
    },
];

const COLUMNS = [
    {
        status: 'TODO',
        title: '할 일',
    },
    {
        status: 'IN_PROGRESS',
        title: '진행 중',
    },
    {
        status: 'DONE',
        title: '진행 완료',
    },
];

function TasksPage() {
    const navigate = useNavigate();

    /*
     * TaskContext는
     * 업무 수정 기능만 사용
     *
     * 목록 조회는 이 페이지에서
     * 참여 프로젝트 전체를 직접 조회
     */
    const {
        updateTask,
    } = useTasks();

    const {
        projects,
        currentProject,
    } = useProjects();

    const [activeTab, setActiveTab] =
        useState('all');

    const [viewMode, setViewMode] =
        useState('board');

    const [currentUser, setCurrentUser] =
        useState(null);

    const [allTasks, setAllTasks] =
        useState([]);

    const [loading, setLoading] =
        useState(false);

    /*
     * =========================
     * 로그인 사용자 조회
     * =========================
     */

    useEffect(() => {
        let cancelled = false;

        const loadCurrentUser = async () => {
            try {
                const user =
                    await getCurrentUser();

                if (!cancelled) {
                    setCurrentUser(user);
                }
            } catch (error) {
                console.error(
                    '현재 사용자 조회 실패:',
                    error
                );
            }
        };

        void loadCurrentUser();

        return () => {
            cancelled = true;
        };
    }, []);

    /*
     * =========================
     * 참여 프로젝트 전체 업무 조회
     * =========================
     */

    useEffect(() => {
        let cancelled = false;

        const loadAllTasks = async () => {
            if (projects.length === 0) {
                if (!cancelled) {
                    setAllTasks([]);
                }

                return;
            }

            try {
                setLoading(true);

                const taskLists =
                    await Promise.all(
                        projects.map(
                            async (project) => {
                                try {
                                    const data =
                                        await getTasks(
                                            project.projectId
                                        );

                                    const projectTasks =
                                        Array.isArray(data)
                                            ? data
                                            : data?.tasks ?? [];

                                    /*
                                     * 응답에 projectId가 없을 경우
                                     * 조회한 프로젝트 ID를 보완
                                     */
                                    return projectTasks.map(
                                        (task) => ({
                                            ...task,
                                            projectId:
                                                task.projectId ??
                                                project.projectId,
                                        })
                                    );
                                } catch (error) {
                                    console.error(
                                        `프로젝트 ${project.projectId} 업무 조회 실패:`,
                                        error
                                    );

                                    /*
                                     * 한 프로젝트 조회가 실패해도
                                     * 다른 프로젝트 업무는 계속 표시
                                     */
                                    return [];
                                }
                            }
                        )
                    );

                if (cancelled) {
                    return;
                }

                const mergedTasks =
                    taskLists.flat();

                /*
                 * 동일 taskId 중복 방지
                 */
                const uniqueTasks =
                    Array.from(
                        new Map(
                            mergedTasks.map(
                                (task) => [
                                    task.taskId,
                                    task,
                                ]
                            )
                        ).values()
                    );

                setAllTasks(uniqueTasks);
            } catch (error) {
                console.error(
                    '전체 업무 조회 실패:',
                    error
                );

                if (!cancelled) {
                    setAllTasks([]);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        void loadAllTasks();

        return () => {
            cancelled = true;
        };
    }, [projects]);

    /*
     * =========================
     * 팀장 여부
     * =========================
     */

    const isLeader =
        currentProject?.role ===
        'LEADER';

    /*
     * =========================
     * 업무 상태 변경
     * =========================
     */

    const handleStatusChange =
        async (
            taskId,
            nextStatus
        ) => {
            try {
                await updateTask(
                    taskId,
                    {
                        status: nextStatus,
                    }
                );

                /*
                 * TasksPage의 전체 업무 목록도
                 * 즉시 상태 반영
                 */
                setAllTasks(
                    (prevTasks) =>
                        prevTasks.map(
                            (task) =>
                                task.taskId === taskId
                                    ? {
                                        ...task,
                                        status: nextStatus,
                                    }
                                    : task
                        )
                );
            } catch (error) {
                console.error(
                    '업무 상태 변경 실패:',
                    error
                );

                alert(
                    '업무 상태 변경에 실패했습니다.'
                );
            }
        };

    /*
     * =========================
     * 탭 필터
     * =========================
     */

    const filteredTasks =
        allTasks.filter((task) => {
            if (activeTab === 'mine') {
                if (!currentUser?.userId) {
                    return false;
                }

                return (
                    String(task.assigneeId) ===
                    String(currentUser.userId)
                );
            }

            if (activeTab === 'done') {
                return (
                    task.status === 'DONE'
                );
            }

            return true;
        });

    const isDoneTab =
        activeTab === 'done';

    const showList =
        isDoneTab ||
        viewMode === 'list';

    /*
     * =========================
     * 새 업무
     * =========================
     */

    const handleCreateTask = () => {
        navigate('/tasks/create');
    };

    /*
     * =========================
     * 화면
     * =========================
     */

    return (
        <div className="taskboard-page">

            {/* =========================
          Header
      ========================= */}

            <header className="taskboard-header">

                <h1>
                    MY 업무
                </h1>

            </header>

            {/* =========================
          Toolbar
      ========================= */}

            <div className="taskboard-toolbar">

                <nav className="taskboard-tabs">

                    {TABS.map((tab) => (
                        <button
                            key={tab.key}
                            type="button"
                            className={`taskboard-tab ${
                                activeTab === tab.key
                                    ? 'active'
                                    : ''
                            }`}
                            onClick={() =>
                                setActiveTab(
                                    tab.key
                                )
                            }
                        >
                            {tab.label}
                        </button>
                    ))}

                </nav>

                <div className="taskboard-actions">

                    {!isDoneTab && (

                        <div className="taskboard-view-toggle">

                            <button
                                type="button"
                                className={`view-toggle-button ${
                                    viewMode === 'board'
                                        ? 'active'
                                        : ''
                                }`}
                                aria-label="보드형 보기"
                                onClick={() =>
                                    setViewMode(
                                        'board'
                                    )
                                }
                            >
                                <svg
                                    viewBox="0 0 16 16"
                                    width="14"
                                    height="14"
                                >
                                    <rect
                                        x="1"
                                        y="1"
                                        width="6"
                                        height="6"
                                        rx="1.5"
                                        fill="currentColor"
                                    />
                                    <rect
                                        x="9"
                                        y="1"
                                        width="6"
                                        height="6"
                                        rx="1.5"
                                        fill="currentColor"
                                    />
                                    <rect
                                        x="1"
                                        y="9"
                                        width="6"
                                        height="6"
                                        rx="1.5"
                                        fill="currentColor"
                                    />
                                    <rect
                                        x="9"
                                        y="9"
                                        width="6"
                                        height="6"
                                        rx="1.5"
                                        fill="currentColor"
                                    />
                                </svg>
                            </button>

                            <button
                                type="button"
                                className={`view-toggle-button ${
                                    viewMode === 'list'
                                        ? 'active'
                                        : ''
                                }`}
                                aria-label="리스트형 보기"
                                onClick={() =>
                                    setViewMode(
                                        'list'
                                    )
                                }
                            >
                                <svg
                                    viewBox="0 0 16 16"
                                    width="14"
                                    height="14"
                                >
                                    <rect
                                        x="1"
                                        y="2"
                                        width="14"
                                        height="2.4"
                                        rx="1.2"
                                        fill="currentColor"
                                    />
                                    <rect
                                        x="1"
                                        y="6.8"
                                        width="14"
                                        height="2.4"
                                        rx="1.2"
                                        fill="currentColor"
                                    />
                                    <rect
                                        x="1"
                                        y="11.6"
                                        width="14"
                                        height="2.4"
                                        rx="1.2"
                                        fill="currentColor"
                                    />
                                </svg>
                            </button>

                        </div>

                    )}

                    {/* 팀장만 새 작업 가능 */}

                    {isLeader && (
                        <button
                            type="button"
                            className="taskboard-create-button"
                            onClick={
                                handleCreateTask
                            }
                        >
                            + 새 작업
                        </button>
                    )}

                </div>

            </div>

            {/* =========================
          Loading
      ========================= */}

            {loading ? (

                <p className="taskboard-column-empty">
                    업무를 불러오는 중입니다.
                </p>

            ) : showList ? (

                /*
                 * =========================
                 * 리스트형
                 * =========================
                 */

                <div className="taskboard-list-view">

                    {filteredTasks.length > 0 ? (

                        COLUMNS.map(
                            (column) => {
                                const columnTasks =
                                    filteredTasks.filter(
                                        (task) =>
                                            task.status ===
                                            column.status
                                    );

                                if (
                                    columnTasks.length === 0
                                ) {
                                    return null;
                                }

                                return (
                                    <div
                                        key={
                                            column.status
                                        }
                                        className="taskboard-list-group"
                                    >

                                        <div className="taskboard-list-group-header">

                                            <h2>
                                                {column.title}
                                            </h2>

                                            <span className="taskboard-column-count">
                        {
                            columnTasks.length
                        }
                      </span>

                                        </div>

                                        <div className="taskboard-list-group-rows">

                                            {columnTasks.map(
                                                (task) => (
                                                    <TaskRow
                                                        key={
                                                            task.taskId
                                                        }
                                                        task={
                                                            task
                                                        }
                                                        onStatusChange={
                                                            handleStatusChange
                                                        }
                                                    />
                                                )
                                            )}

                                        </div>

                                    </div>
                                );
                            }
                        )

                    ) : (

                        <p className="taskboard-column-empty">
                            해당하는 업무가 없습니다.
                        </p>

                    )}

                </div>

            ) : (

                /*
                 * =========================
                 * 보드형
                 * =========================
                 */

                <div className="taskboard-board">

                    {COLUMNS.map(
                        (column) => (
                            <TaskColumn
                                key={
                                    column.status
                                }
                                title={
                                    column.title
                                }
                                tasks={
                                    filteredTasks.filter(
                                        (task) =>
                                            task.status ===
                                            column.status
                                    )
                                }
                                onStatusChange={
                                    handleStatusChange
                                }
                            />
                        )
                    )}

                </div>

            )}

        </div>
    );
}

export default TasksPage;
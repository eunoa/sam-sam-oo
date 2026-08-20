import { useState } from 'react';

import {
    translateTask,
} from '../../services/taskService';

const STATUS_BADGE_CLASS = {
    TODO: 'badge-todo',
    IN_PROGRESS: 'badge-in-progress',
    DONE: 'badge-done',
};

const TRANSLATION_LANGUAGES = [
    { value: 'en', label: 'English' },
    { value: 'ja', label: '日本語' },
    { value: 'fr', label: 'Français' },
    { value: 'ko', label: '한국어' },
];

function getDday(deadlineString) {
    if (!deadlineString) {
        return '';
    }

    const deadline = new Date(deadlineString);
    const today = new Date();

    const startOfDeadline = new Date(
        deadline.getFullYear(),
        deadline.getMonth(),
        deadline.getDate()
    );

    const startOfToday = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
    );

    const days = Math.round(
        (startOfDeadline - startOfToday) /
        (1000 * 60 * 60 * 24)
    );

    if (days > 0) {
        return `D-${days}`;
    }

    if (days === 0) {
        return 'D-day';
    }

    return `D+${Math.abs(days)}`;
}

function TaskCard({
                      task,
                      onStatusChange,
                  }) {
    const [
        targetLanguage,
        setTargetLanguage,
    ] = useState('en');

    const [
        translation,
        setTranslation,
    ] = useState(null);

    const [
        translationLoading,
        setTranslationLoading,
    ] = useState(false);

    /*
     * =========================
     * 마감일
     * =========================
     */

    let formattedDeadline = '';

    if (task.deadline) {
        const deadline =
            new Date(task.deadline);

        formattedDeadline =
            `${deadline.getMonth() + 1}/${deadline.getDate()}`;
    }

    const badgeLabel =
        task.status === 'DONE'
            ? '완료'
            : getDday(task.deadline);

    /*
     * =========================
     * 상태 변경
     * =========================
     */

    const handleStart = async () => {
        await onStatusChange?.(
            task.taskId,
            'IN_PROGRESS'
        );
    };

    const handleComplete = async () => {
        await onStatusChange?.(
            task.taskId,
            'DONE'
        );
    };

    /*
     * =========================
     * 업무 번역
     * =========================
     */

    const handleTranslate = async () => {
        try {
            setTranslationLoading(true);

            const result =
                await translateTask(
                    task.taskId,
                    targetLanguage
                );

            console.log(
                '업무 번역 API 응답:',
                result
            );

            setTranslation({
                title:
                    result?.translatedTitle || '',
                description:
                    result?.translatedDescription || '',
            });

        } catch (error) {
            console.error(
                '업무 번역 실패:',
                error
            );

            alert(
                error.message ||
                '업무 번역에 실패했습니다.'
            );
        } finally {
            setTranslationLoading(false);
        }
    };

    const handleLanguageChange = (
        event
    ) => {
        setTargetLanguage(
            event.target.value
        );

        setTranslation(null);
    };

    return (
        <article className="taskboard-card">

            {task.projectName && (
                <p className="taskboard-card-project">
                    {task.projectName}
                </p>
            )}

            <div className="taskboard-card-top">

                <h3 className="taskboard-card-title">
                    {task.title}
                </h3>

                {badgeLabel && (
                    <span
                        className={`taskboard-card-badge ${
                            STATUS_BADGE_CLASS[
                                task.status
                                ] || ''
                        }`}
                    >
            {badgeLabel}
          </span>
                )}

            </div>

            {task.description && (
                <p className="taskboard-card-description">
                    {task.description}
                </p>
            )}

            <div className="taskboard-card-bottom">

        <span className="taskboard-card-assignee">
          <span className="taskboard-card-avatar" />

            {task.assigneeName ||
                '담당자 없음'}
        </span>

                {formattedDeadline && (
                    <span className="taskboard-card-date">
            {formattedDeadline}
          </span>
                )}

            </div>

            {/* 번역 */}

            <div className="task-translation-controls">

                <select
                    value={targetLanguage}
                    onChange={
                        handleLanguageChange
                    }
                    disabled={
                        translationLoading
                    }
                >

                    {TRANSLATION_LANGUAGES.map(
                        (language) => (
                            <option
                                key={language.value}
                                value={language.value}
                            >
                                {language.label}
                            </option>
                        )
                    )}

                </select>

                <button
                    type="button"
                    className="task-translate-button"
                    onClick={handleTranslate}
                    disabled={
                        translationLoading
                    }
                >
                    {translationLoading
                        ? '번역 중...'
                        : '번역'}
                </button>

            </div>

            {/* 번역 결과 */}

            {translation && (
                <div className="task-translation-result">

                    {translation.title && (
                        <>
              <span className="task-translation-label">
                번역된 제목
              </span>

                            <p className="task-translation-title">
                                {translation.title}
                            </p>
                        </>
                    )}

                    {translation.description && (
                        <>
              <span className="task-translation-label">
                번역된 설명
              </span>

                            <p>
                                {translation.description}
                            </p>
                        </>
                    )}

                </div>
            )}

            {/* 상태 변경 */}

            <div className="taskboard-card-status-actions">

                {task.status === 'TODO' && (
                    <button
                        type="button"
                        className="task-status-button task-status-start"
                        onClick={handleStart}
                    >
                        진행 시작
                    </button>
                )}

                {task.status ===
                    'IN_PROGRESS' && (
                        <button
                            type="button"
                            className="task-status-button task-status-complete"
                            onClick={handleComplete}
                        >
                            완료
                        </button>
                    )}

                {task.status === 'DONE' && (
                    <span className="task-status-finished">
            완료된 업무
          </span>
                )}

            </div>

        </article>
    );
}

export default TaskCard;
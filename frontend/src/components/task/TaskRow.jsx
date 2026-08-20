import { useState } from 'react';

import {
    translateTask,
} from '../../services/taskService';

const TRANSLATION_LANGUAGES = [
    { value: 'en', label: 'English' },
    { value: 'ja', label: '日本語' },
    { value: 'fr', label: 'Français' },
    { value: 'ko', label: '한국어' },
];

function formatRowDate(
    deadlineString
) {
    if (!deadlineString) {
        return '';
    }

    const deadline =
        new Date(deadlineString);

    const month =
        deadline.getMonth() + 1;

    const day =
        deadline.getDate();

    const hours =
        String(
            deadline.getHours()
        ).padStart(2, '0');

    const minutes =
        String(
            deadline.getMinutes()
        ).padStart(2, '0');

    return `${month}월 ${day}일 ${hours}:${minutes}`;
}

function TaskRow({
                     task,
                     onStatusChange,
                 }) {
    const formattedDate =
        formatRowDate(
            task.deadline
        );

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
        <article className="task-row">

            <div className="task-row-left">

                <h3 className="task-row-title">
                    {task.title}
                </h3>

                {formattedDate && (
                    <p className="task-row-date">
                        {formattedDate}
                    </p>
                )}

                {task.projectName && (
                    <p className="task-row-project">
                        {task.projectName}
                    </p>
                )}

            </div>

            <div className="task-row-description-wrapper">

                <p className="task-row-description">
                    {task.description}
                </p>

                {translation && (
                    <div className="task-row-translation-result">

                        {translation.title && (
                            <>
                <span>
                  번역된 제목
                </span>

                                <p>
                                    {translation.title}
                                </p>
                            </>
                        )}

                        {translation.description && (
                            <>
                <span>
                  번역된 설명
                </span>

                                <p>
                                    {translation.description}
                                </p>
                            </>
                        )}

                    </div>
                )}

            </div>

            <div className="task-row-right">

                <div className="task-row-translation-controls">

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

                <div className="task-row-status-actions">

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
              완료
            </span>
                    )}

                </div>

            </div>

        </article>
    );
}

export default TaskRow;
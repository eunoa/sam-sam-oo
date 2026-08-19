import './MeetingCreatePage.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosInstance';

import { useProjects } from '../../context/ProjectContext';

function MeetingCreatePage() {
  const navigate = useNavigate();

  const { projects } = useProjects();

  const [title, setTitle] = useState('');
  const [projectId, setProjectId] = useState(1);

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [isImportant, setIsImportant] =
    useState(false);

  /* =========================
     AI 추천 일정 Mock
  ========================= */

  const aiRecommendation = {
    date: '2026-08-17',
    time: '19:00',
    reason:
      '팀원들의 기존 일정을 고려했을 때 가장 적합한 시간입니다.',
  };

  const handleSelectRecommendation = () => {
    setDate(aiRecommendation.date);
    setTime(aiRecommendation.time);
  };

  /* =========================
     회의 생성
  ========================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title.trim()) {
      alert('회의 제목을 입력해주세요.');
      return;
    }

    if (!date) {
      alert('회의 날짜를 선택해주세요.');
      return;
    }

    if (!time) {
      alert('회의 시간을 선택해주세요.');
      return;
    }

    try {
      const response = await api.post("/projects/" + projectId + "/meetings", {
        title: title.trim(),
        scheduledAt: date + "T" + time + ":00",
      });

      console.log("회의 생성 성공:", response.data);

      alert("회의가 생성되었습니다.");
      navigate("/meetings");
    } catch (error) {
      console.error("회의 생성 실패:", error);
      alert("회의 생성 실패: " + (error.response?.data?.message || error.response?.data || error.message));
    }
  };

  return (
    <div className="meeting-create-page">

      {/* =========================
          상단
      ========================= */}

      <header className="meeting-create-header">

        <h1>새 회의</h1>

        <p className="meeting-create-description">
          새로운 회의 일정을 등록하세요.
        </p>

      </header>


      {/* =========================
          생성 폼
      ========================= */}

      <form
        className="meeting-create-form"
        onSubmit={handleSubmit}
      >

        {/* 회의 제목 */}

        <div className="meeting-form-field">

          <label htmlFor="meeting-title">
            회의 제목
          </label>

          <input
            id="meeting-title"
            type="text"
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
            placeholder="회의 제목을 입력하세요."
          />

        </div>


        {/* 프로젝트 */}

        <div className="meeting-form-field">

          <label htmlFor="meeting-project">
            프로젝트
          </label>

          <select
            id="meeting-project"
            value={projectId}
            onChange={(event) =>
              setProjectId(Number(event.target.value))
            }>
            {projects.map((project) => (
              <option
                key={project.projectId}
                value={project.projectId}
              >
                {project.name}
              </option>
            ))}

          </select>

        </div>


        {/* =========================
            AI 추천 일정
        ========================= */}

        <section className="ai-recommendation">

          <div className="ai-recommendation-header">

            <span className="ai-recommendation-icon">
              ✨
            </span>

            <h2>
              AI 추천 일정
            </h2>

          </div>


          <div className="ai-recommendation-content">

            <div className="ai-recommendation-date">

              <strong>
                8월 17일 (월)
              </strong>

              <span>
                오후 7:00
              </span>

            </div>


            <p className="ai-recommendation-reason">
              {aiRecommendation.reason}
            </p>


            <button
              type="button"
              className="ai-recommendation-button"
              onClick={
                handleSelectRecommendation
              }
            >
              이 시간 선택
            </button>

          </div>

        </section>


        {/* 날짜 */}

        <div className="meeting-form-field">

          <label htmlFor="meeting-date">
            날짜
          </label>

          <input
            id="meeting-date"
            type="date"
            value={date}
            onChange={(event) =>
              setDate(event.target.value)
            }
          />

        </div>


        {/* 시간 */}

        <div className="meeting-form-field">

          <label htmlFor="meeting-time">
            시간
          </label>

          <input
            id="meeting-time"
            type="time"
            value={time}
            onChange={(event) =>
              setTime(event.target.value)
            }
          />

        </div>


        {/* 중요 */}

        <div className="meeting-form-important">

          <button
            type="button"
            className={`meeting-form-star ${
              isImportant
                ? 'active'
                : ''
            }`}
            onClick={() =>
              setIsImportant(
                (prev) => !prev
              )
            }
            aria-label={
              isImportant
                ? '중요 회의 해제'
                : '중요 회의 설정'
            }
          >
            {isImportant ? '★' : '☆'}
          </button>

          <span>
            중요 회의
          </span>

        </div>


        {/* 버튼 */}

        <div className="meeting-create-actions">

          <button
            type="button"
            className="meeting-cancel-button"
            onClick={() =>
              navigate('/meetings')
            }
          >
            취소
          </button>

          <button
            type="submit"
            className="meeting-create-submit-button"
          >
            회의 생성
          </button>

        </div>

      </form>

    </div>
  );
}

export default MeetingCreatePage;
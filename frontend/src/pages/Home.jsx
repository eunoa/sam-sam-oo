import { Link, useNavigate } from 'react-router-dom';

import { isAuthenticated } from '../utils/auth';

import './Home.css';

function Home() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate(
        isAuthenticated()
            ? '/dashboard'
            : '/login'
    );
  };

  return (
      <div className="home-page">

        <header className="home-header">

          <div className="home-brand">

            <div className="home-logo">
              <img
                  src="/workbridge-logo.png"
                  alt="WorkBridge"
              />
            </div>

            <div className="home-brand-text">
              <strong className="home-app-name">
                WorkBridge
              </strong>

              <span className="home-brand-caption">
              AI Project Coordinator
            </span>
            </div>

          </div>

          <Link
              to="/login"
              className="home-auth-link"
          >
            로그인 / 회원가입
          </Link>

        </header>

        <main className="home-main">

          <section className="home-hero">

            <div className="home-badge">
              AI 기반 글로벌 협업 플랫폼
            </div>

            <h1 className="home-title">
              글로벌 팀의 협업을
              <br />
              <span>
              WorkBridge로 연결하세요
            </span>
            </h1>

            <p className="home-description">
              회의에서 업무까지,
              프로젝트의 흐름을 AI가 이해하고
              글로벌 팀의 협업을 하나로 연결합니다.
            </p>

            <button
                type="button"
                className="home-start-button"
                onClick={handleStart}
            >
              WorkBridge 시작하기
            </button>

          </section>

          <section className="home-features">

            <article className="home-feature-card">

              <div className="home-feature-number">
                01
              </div>

              <h2>
                AI 회의 정리
              </h2>

              <p>
                회의 내용을 AI가 요약하고
                핵심 내용을 빠르게 정리합니다.
              </p>

            </article>

            <article className="home-feature-card">

              <div className="home-feature-number">
                02
              </div>

              <h2>
                업무 자동 연결
              </h2>

              <p>
                회의에서 필요한 업무를 찾아
                담당자와 실행 단계로 연결합니다.
              </p>

            </article>

            <article className="home-feature-card">

              <div className="home-feature-number">
                03
              </div>

              <h2>
                스마트 일정 추천
              </h2>

              <p>
                팀원의 시간대를 고려해
                함께 가능한 회의 시간을 추천합니다.
              </p>

            </article>

            <article className="home-feature-card">

              <div className="home-feature-number">
                04
              </div>

              <h2>
                다국어 협업
              </h2>

              <p>
                회의 요약과 업무를 번역해
                글로벌 팀의 언어 장벽을 줄입니다.
              </p>

            </article>

          </section>

        </main>

        <footer className="home-footer">

        <span>
          WorkBridge
        </span>

          <span>
          AI Project Coordinator for Global Startup Teams
        </span>

        </footer>

      </div>
  );
}

export default Home;
import { Link, useNavigate } from 'react-router-dom'
import { isAuthenticated } from '../utils/auth'
import './Home.css'

function Home() {
  const navigate = useNavigate()

  const handleStart = () => {
    navigate(isAuthenticated() ? '/dashboard' : '/login')
  }

  return (
    <div className="home-page">
      <header className="home-header">
        <div className="home-brand">
          <div className="home-logo"><img src="/workbridge-logo.png" alt="WorkBridge" /></div>
          <span className="home-app-name">앱 이름</span>
        </div>
        <Link to="/login" className="home-auth-link">
          로그인 / 회원가입
        </Link>
      </header>

      <main className="home-main">
        <p className="home-description">
          AI가 프로젝트를 이해하고 협업을 도와주는 'AI 프로젝트 코디네이터
        </p>

        <button type="button" className="home-start-button" onClick={handleStart}>
          시작하기
        </button>
      </main>
    </div>
  )
}

export default Home

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
          <div className="home-logo" />
          <span className="home-app-name">앱 이름</span>
        </div>
        <Link to="/login" className="home-auth-link">
          로그인 / 회원가입
        </Link>
      </header>

      <main className="home-main">
        <p className="home-description">
          앱 설명 글 앱 설명 글 앱 설명 글 앱 설명 글 앱 설명 글
        </p>

        <button type="button" className="home-start-button" onClick={handleStart}>
          시작하기
        </button>
      </main>
    </div>
  )
}

export default Home

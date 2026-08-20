import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axiosInstance'
import { mockLogin } from '../api/mockAuth'
import { useProject } from '../context/ProjectContext'
import EyeIcon from '../components/EyeIcon'
import ArrowLeftIcon from '../components/ArrowLeftIcon'
import './Login.css'

const USE_MOCK_AUTH = import.meta.env.VITE_USE_MOCK_AUTH === 'true'

function Login() {
  const navigate = useNavigate()
  const { fetchProjects, clearProjects } = useProject()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = USE_MOCK_AUTH
          ? await mockLogin({ email, password })
          : (await api.post('/users/login', { email, password })).data

      if (!data?.accessToken) {
        throw new Error('로그인 토큰을 받지 못했습니다.')
      }

      // 새 로그인 사용자의 토큰 저장
      localStorage.setItem('accessToken', data.accessToken)

      // 이전 로그인 사용자의 프로젝트 상태 제거
      clearProjects()

      // 새 로그인 사용자 기준으로 프로젝트 목록 즉시 다시 조회
      await fetchProjects()

      navigate('/dashboard')
    } catch (err) {
      // 로그인 또는 프로젝트 초기화 실패 시 잘못된 상태가 남지 않도록 정리
      localStorage.removeItem('accessToken')
      clearProjects()

      setError(
          err.response?.data?.message ||
          err.message ||
          '로그인에 실패했습니다. 다시 시도해주세요.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
      <div className="login-page">
        <Link to="/" className="back-button" aria-label="홈으로 돌아가기">
          <ArrowLeftIcon />
        </Link>

        <div className="login-card">
          <div className="login-logo">
            <span>로고</span>
          </div>

          <h1 className="login-title">웹 이름</h1>

          {USE_MOCK_AUTH && (
              <p
                  style={{
                    fontSize: 12,
                    color: '#c0392b',
                    marginTop: -32,
                    marginBottom: 24,
                  }}
              >
                (임시 mock 로그인 모드 - 아무 값이나 입력해도 로그인됩니다)
              </p>
          )}

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                  type="email"
                  placeholder="이메일을 입력하세요"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
              />
            </div>

            <div className="input-group">
              <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="비밀번호를 입력하세요"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
              />

              <button
                  type="button"
                  className="toggle-password"
                  aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
                  onClick={() => setShowPassword((prev) => !prev)}
              >
                <EyeIcon open={showPassword} />
              </button>
            </div>

            {error && <p className="login-error">{error}</p>}

            <button
                type="submit"
                className="login-button"
                disabled={loading}
            >
              {loading ? '로그인 중...' : '로그인'}
            </button>
          </form>

          <div className="signup-link">
            <Link to="/signup">회원가입하기</Link>
          </div>
        </div>
      </div>
  )
}

export default Login
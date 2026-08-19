import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axiosInstance'
import { mockLogin } from '../api/mockAuth'
import EyeIcon from '../components/EyeIcon'
import ArrowLeftIcon from '../components/ArrowLeftIcon'
import './Login.css'

const USE_MOCK_AUTH = import.meta.env.VITE_USE_MOCK_AUTH === 'true'

function Login() {
  const navigate = useNavigate()
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

      if (data?.accessToken) {
        localStorage.setItem('accessToken', data.accessToken)
      }
      navigate('/dashboard')
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || '로그인에 실패했습니다. 다시 시도해주세요.',
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
        <span className="auth-mark" aria-hidden="true" />
        <h1 className="login-title">WorkBridge</h1>

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

          <button type="submit" className="login-button" disabled={loading}>
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

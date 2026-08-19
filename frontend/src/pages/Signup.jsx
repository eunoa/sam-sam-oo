import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axiosInstance'
import { mockSignup } from '../api/mockAuth'
import EyeIcon from '../components/EyeIcon'
import { COUNTRIES } from '../constants/countries'
import './Signup.css'

const USE_MOCK_AUTH = import.meta.env.VITE_USE_MOCK_AUTH === 'true'

function Signup() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [email, setEmail] = useState('')
  const [languageCountry, setLanguageCountry] = useState('')
  const [timezone, setTimezone] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }

    const language = COUNTRIES.find((c) => c.label === languageCountry)?.language

    setLoading(true)
    try {
      if (USE_MOCK_AUTH) {
        await mockSignup({ name, email, password })
      } else {
        await api.post('/users/signup', { name, email, password, language, timezone })
      }
      navigate('/')
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || '회원가입에 실패했습니다. 다시 시도해주세요.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="signup-page">
      <div className="signup-card">
        <span className="auth-mark" aria-hidden="true" />
        <h1 className="signup-title">WorkBridge</h1>

        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="field-group">
            <label htmlFor="name">이름</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="field-group">
            <label htmlFor="password">비밀번호</label>
            <div className="input-with-icon">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
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
          </div>

          <div className="field-group">
            <label htmlFor="confirmPassword">비밀번호 확인</label>
            <div className="input-with-icon">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="toggle-password"
                aria-label={showConfirmPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                <EyeIcon open={showConfirmPassword} />
              </button>
            </div>
          </div>

          <div className="field-group">
            <label htmlFor="email">이메일</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="field-group">
            <label htmlFor="language">언어</label>
            <select
              id="language"
              value={languageCountry}
              onChange={(e) => setLanguageCountry(e.target.value)}
              required
            >
              <option value="" disabled>
                선택하세요
              </option>
              {COUNTRIES.map((c) => (
                <option key={c.label} value={c.label}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div className="field-group">
            <label htmlFor="timezone">시간대</label>
            <select
              id="timezone"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              required
            >
              <option value="" disabled>
                선택하세요
              </option>
              {COUNTRIES.map((c) => (
                <option key={c.timezone} value={c.timezone}>
                  {c.timezone}
                </option>
              ))}
            </select>
          </div>

          {error && <p className="signup-error">{error}</p>}

          <button type="submit" className="signup-button" disabled={loading}>
            {loading ? '가입 중...' : '회원가입'}
          </button>
        </form>

        <div className="login-link">
          <Link to="/login">이미 계정이 있으신가요? 로그인하기</Link>
        </div>
      </div>
    </div>
  )
}

export default Signup

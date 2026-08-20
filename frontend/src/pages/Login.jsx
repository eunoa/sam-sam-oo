import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import api from '../api/axiosInstance'
import { mockLogin } from '../api/mockAuth'
import { useProject } from '../context/ProjectContext'

import EyeIcon from '../components/EyeIcon'
import ArrowLeftIcon from '../components/ArrowLeftIcon'

import './Login.css'

const USE_MOCK_AUTH =
    import.meta.env.VITE_USE_MOCK_AUTH === 'true'

function Login() {
  const navigate = useNavigate()

  const {
    fetchProjects,
    clearProjects,
  } = useProject()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] =
      useState(false)

  const [error, setError] = useState('')
  const [loading, setLoading] =
      useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')
    setLoading(true)

    try {
      const data = USE_MOCK_AUTH
          ? await mockLogin({
            email,
            password,
          })
          : (
              await api.post(
                  '/users/login',
                  {
                    email,
                    password,
                  }
              )
          ).data

      if (!data?.accessToken) {
        throw new Error(
            '로그인 토큰을 받지 못했습니다.'
        )
      }

      localStorage.setItem(
          'accessToken',
          data.accessToken
      )

      clearProjects()

      await fetchProjects()

      navigate('/dashboard')
    } catch (err) {
      localStorage.removeItem(
          'accessToken'
      )

      clearProjects()

      setError(
          err.response?.data?.message ||
          err.message ||
          '로그인에 실패했습니다. 다시 시도해주세요.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
      <div className="login-page">

        <Link
            to="/"
            className="login-back-button"
            aria-label="홈으로 돌아가기"
        >
          <ArrowLeftIcon />
          <span>홈으로</span>
        </Link>

        <div className="login-layout">

          {/* =========================
            브랜드 영역
        ========================= */}

          <section className="login-brand-panel">

            <div className="login-brand">

              <div className="login-brand-mark">
                W
              </div>

              <div className="login-brand-name">
                WorkBridge
              </div>

            </div>

            <div className="login-brand-content">

            <span className="login-brand-badge">
              AI PROJECT COORDINATOR
            </span>

              <h1>
                글로벌 팀의 협업을
                <br />
                하나로 연결하세요.
              </h1>

              <p>
                회의 일정 조율부터 AI 요약,
                번역, 업무 배정까지.
                <br />
                WorkBridge가 글로벌 프로젝트의
                흐름을 연결합니다.
              </p>

            </div>

            <div className="login-brand-features">

            <span>
              AI 회의 정리
            </span>

              <span>
              스마트 일정 추천
            </span>

              <span>
              다국어 협업
            </span>

            </div>

          </section>

          {/* =========================
            로그인 영역
        ========================= */}

          <section className="login-form-panel">

            <div className="login-card">

              <div className="login-heading">

              <span className="login-mobile-brand">
                WorkBridge
              </span>

                <h2>
                  다시 만나서 반가워요
                </h2>

                <p>
                  WorkBridge에 로그인하고
                  프로젝트를 계속 진행하세요.
                </p>

              </div>

              {USE_MOCK_AUTH && (
                  <div className="login-mock-notice">
                    Mock 로그인 모드가 활성화되어 있습니다.
                  </div>
              )}

              <form
                  className="login-form"
                  onSubmit={handleSubmit}
              >

                <div className="login-field">

                  <label htmlFor="login-email">
                    이메일
                  </label>

                  <input
                      id="login-email"
                      type="email"
                      placeholder="example@email.com"
                      value={email}
                      onChange={(event) =>
                          setEmail(
                              event.target.value
                          )
                      }
                      autoComplete="email"
                      required
                  />

                </div>

                <div className="login-field">

                  <label htmlFor="login-password">
                    비밀번호
                  </label>

                  <div className="login-password-wrapper">

                    <input
                        id="login-password"
                        type={
                          showPassword
                              ? 'text'
                              : 'password'
                        }
                        placeholder="비밀번호를 입력하세요"
                        value={password}
                        onChange={(event) =>
                            setPassword(
                                event.target.value
                            )
                        }
                        autoComplete="current-password"
                        required
                    />

                    <button
                        type="button"
                        className="toggle-password"
                        aria-label={
                          showPassword
                              ? '비밀번호 숨기기'
                              : '비밀번호 보기'
                        }
                        onClick={() =>
                            setShowPassword(
                                (prev) => !prev
                            )
                        }
                    >
                      <EyeIcon
                          open={showPassword}
                      />
                    </button>

                  </div>

                </div>

                {error && (
                    <p className="login-error">
                      {error}
                    </p>
                )}

                <button
                    type="submit"
                    className="login-button"
                    disabled={loading}
                >
                  {loading
                      ? '로그인 중...'
                      : '로그인'}
                </button>

              </form>

              <div className="login-divider">
                <span />
              </div>

              <div className="signup-link">

              <span>
                아직 계정이 없으신가요?
              </span>

                <Link to="/signup">
                  회원가입
                </Link>

              </div>

            </div>

          </section>

        </div>

      </div>
  )
}

export default Login
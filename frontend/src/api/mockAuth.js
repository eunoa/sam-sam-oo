const MOCK_DELAY = 400

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function mockLogin({ email, password }) {
  await delay(MOCK_DELAY)

  if (!email || !password) {
    throw new Error('이메일과 비밀번호를 입력해주세요.')
  }

  return { accessToken: `mock-token-${Date.now()}` }
}

export async function mockSignup({ name, email, password }) {
  await delay(MOCK_DELAY)

  if (!name || !email || !password) {
    throw new Error('필수 정보를 입력해주세요.')
  }

  return { accessToken: `mock-token-${Date.now()}` }
}

export async function mockLogout() {
  await delay(MOCK_DELAY)

  return { message: '로그아웃되었습니다.' }
}

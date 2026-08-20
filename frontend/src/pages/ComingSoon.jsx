import { Link } from 'react-router-dom'

function ComingSoon({ title }) {
  return (
    <div style={{ textAlign: 'center', marginTop: 80 }}>
      <h1>{title}</h1>
      <Link to="/">홈으로 돌아가기</Link>
    </div>
  )
}

export default ComingSoon

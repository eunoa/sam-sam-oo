import './MemberInvitePage.css';

import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useProjects } from '../../context/ProjectContext';
import { useMembers } from '../../context/MemberContext';

function MemberInvitePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [inviteModal, setInviteModal] = useState(null);

  const { projects } = useProjects();
  const { members, addMember } = useMembers();

  const searchParams = new URLSearchParams(location.search);
  const projectId = Number(searchParams.get('projectId'));

  const project = projects.find(
    (item) => item.projectId === projectId
  );

  const projectName = project?.name || '프로젝트';

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      return;
    }

    const isDuplicate = members.some(
      (member) =>
        member.projectId === projectId &&
        member.email.toLowerCase() === trimmedEmail.toLowerCase()
    );

    if (isDuplicate) {
      setInviteModal({
        type: 'error',
        title: '초대할 수 없습니다.',
        message: '이미 해당 프로젝트에 등록된 팀원입니다.',
      });
      return;
    }

    const nextMemberId =
      members.length > 0
        ? Math.max(...members.map((member) => member.memberId)) + 1
        : 1;

    const newMember = {
      memberId: nextMemberId,
      projectId,
      name: trimmedEmail.split('@')[0],
      email: trimmedEmail,
      role: 'MEMBER',
      profileImage: '',
      activeTasks: 0,
    };

    addMember(newMember);

    setInviteModal({
      type: 'success',
      title: '초대 완료!',
      message: `에게 팀원 초대를 보냈습니다.`,
    });
  };

  const handleModalConfirm = () => {
    const isSuccess = inviteModal?.type === 'success';

    setInviteModal(null);

    if (isSuccess) {
      navigate('/dashboard', {
        state: {
          activeTab: 'team',
        },
      });
    }
  };

  const handleCancel = () => {
    navigate('/dashboard', {
      state: {
        activeTab: 'team',
      },
    });
  };

  return (
    <div className="member-invite-page">

      <header className="member-invite-header">

        <div>
          <h1>인원 초대</h1>

          <p>
            {projectName} 프로젝트에 새로운 팀원을 초대해보세요.
          </p>
        </div>

      </header>


      <form
        className="member-invite-form"
        onSubmit={handleSubmit}
      >

        <div className="member-invite-section">

          <div className="member-invite-project-name">
            <span>프로젝트</span>

            <strong>
              {projectName}
            </strong>
          </div>


          <div className="member-invite-field">

            <label htmlFor="member-email">
              이메일 주소
              <span>*</span>
            </label>

            <input
              id="member-email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="초대할 팀원의 이메일을 입력해주세요"
              required
            />

          </div>

        </div>


        <div className="member-invite-actions">

          <button
            type="button"
            className="member-invite-cancel-button"
            onClick={handleCancel}
          >
            취소
          </button>

          <button
            type="submit"
            className="member-invite-submit-button"
          >
            인원 초대
          </button>

        </div>

      </form>

      {inviteModal && (
        <div className="member-invite-modal-overlay">
          <div className={`member-invite-modal `}>
            <div className="member-invite-modal-icon">
              {inviteModal.type === 'success' ? '✓' : '!'}
            </div>

            <h2>{inviteModal.title}</h2>

            <p>{inviteModal.message}</p>

            <button
              type="button"
              className="member-invite-modal-confirm-button"
              onClick={handleModalConfirm}
            >
              확인
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default MemberInvitePage;

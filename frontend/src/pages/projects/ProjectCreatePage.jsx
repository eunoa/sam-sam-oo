import './ProjectCreatePage.css';

import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useProjects } from '../../context/ProjectContext';

function ProjectCreatePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { projects, addProject } = useProjects();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextProjectId =
      projects.length > 0
        ? Math.max(...projects.map((project) => project.projectId)) + 1
        : 1;

    const newProject = {
      projectId: nextProjectId,
      name: name.trim(),
      description: description.trim(),
    };

    addProject(newProject);

    navigate('/dashboard', { state: { activeTab: 'team' } });
  };

  const handleCancel = () => {
    const from = location.state?.from || '/dashboard';

    navigate(from, {
      state: {
        activeTab: location.state?.activeTab || 'overview',
      },
    });
  };

  return (
    <div className="project-create-page">

      <header className="project-create-header">

        <div>
          <h1>프로젝트 생성</h1>

          <p>
            새로운 프로젝트를 만들어보세요.
          </p>
        </div>

      </header>


      <form
        className="project-create-form"
        onSubmit={handleSubmit}
      >

        <div className="project-create-section">

          <div className="project-create-field">

            <label htmlFor="project-name">
              프로젝트 제목
              <span>*</span>
            </label>

            <input
              id="project-name"
              type="text"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              placeholder="프로젝트 제목을 입력해주세요"
              required
            />

          </div>


          <div className="project-create-field">

            <label htmlFor="project-description">
              프로젝트 설명
            </label>

            <textarea
              id="project-description"
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              placeholder="이 프로젝트가 무엇을 하는지 간단하게 설명해주세요"
              rows={5}
            />

          </div>

        </div>


        <div className="project-create-actions">

          <button
            type="button"
            className="project-create-cancel-button"
            onClick={handleCancel}
          >
            취소
          </button>

          <button
            type="submit"
            className="project-create-submit-button"
          >
            프로젝트 생성
          </button>

        </div>

      </form>

    </div>
  );
}

export default ProjectCreatePage;

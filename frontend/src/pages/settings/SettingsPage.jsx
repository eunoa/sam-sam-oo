import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getCurrentUser,
  updateCurrentUser,
  getAvailability,
  updateAvailability,
} from '../../services/userService';
import { COUNTRIES } from '../../constants/countries';
import api from '../../api/axiosInstance';
import { mockLogout } from '../../api/mockAuth';
import './SettingsPage.css';

const USE_MOCK_AUTH = import.meta.env.VITE_USE_MOCK_AUTH === 'true';

// 회원가입 화면(COUNTRIES)이 지원하는 언어와 항상 같은 목록을 쓰도록 여기서 파생시킨다.
const LANGUAGE_LABELS = {
  ko: '한국어',
  ja: '日本語',
  fr: 'Français',
  en: 'English',
};

const LANGUAGES = [...new Set(COUNTRIES.map((country) => country.language))].map(
  (code) => ({
    code,
    label: LANGUAGE_LABELS[code] ?? code,
  })
);

const NAV_ITEMS = [
  { key: 'profile', label: '프로필 관리' },
  { key: 'timezone', label: '시간대 설정' },
];

// API 명세(GET/PUT /users/me/availability)의 dayOfWeek 값
const DAYS = [
  { code: 'MONDAY', label: '월' },
  { code: 'TUESDAY', label: '화' },
  { code: 'WEDNESDAY', label: '수' },
  { code: 'THURSDAY', label: '목' },
  { code: 'FRIDAY', label: '금' },
  { code: 'SATURDAY', label: '토' },
  { code: 'SUNDAY', label: '일' },
];

function dayLabel(code) {
  return DAYS.find((day) => day.code === code)?.label ?? code;
}

function pad2(n) {
  return String(n).padStart(2, '0');
}

// { hour: 1~12, minute, period: 'AM'|'PM' } -> API가 받는 "HH:mm"(24시간제) 문자열
function draftToApiTime({ hour, minute, period }) {
  let hour24 = hour % 12;
  if (period === 'PM') hour24 += 12;
  return `${pad2(hour24)}:${pad2(minute)}`;
}

function formatDraft({ hour, minute, period }) {
  return `${pad2(hour)}:${pad2(minute)} ${period}`;
}

function SettingsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');

  const currentUser = getCurrentUser();
  const fileInputRef = useRef(null);

  const [name, setName] = useState(currentUser.name);
  // 직책, 프로필 사진은 API 명세(PATCH /users/me)에 없는 필드라 화면에만 반영되고 서버에는 저장되지 않는다.
  const [position, setPosition] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [profileMessage, setProfileMessage] = useState('');

  const [language, setLanguage] = useState(currentUser.language);
  const [languageMessage, setLanguageMessage] = useState('');

  const [countryLabel, setCountryLabel] = useState(() => {
    const matched = COUNTRIES.find((country) => country.timezone === currentUser.timezone);
    return matched ? matched.label : COUNTRIES[0].label;
  });
  const [timezoneMessage, setTimezoneMessage] = useState('');

  const [availabilities, setAvailabilities] = useState(() => getAvailability());
  const [selectedDay, setSelectedDay] = useState('MONDAY');
  const [startDraft, setStartDraft] = useState({ hour: 9, minute: 0, period: 'AM' });
  const [endDraft, setEndDraft] = useState({ hour: 12, minute: 0, period: 'PM' });
  const [activePicker, setActivePicker] = useState(null); // 'start' | 'end' | null

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleProfileSave = (e) => {
    e.preventDefault();

    updateCurrentUser({ name });

    setProfileMessage('변경사항이 저장되었습니다.');
  };

  const handleLogout = async () => {
    try {
      if (USE_MOCK_AUTH) {
        await mockLogout();
      } else {
        await api.post('/users/logout');
      }
    } catch {
      // 서버 호출이 실패해도 클라이언트 쪽 로그인 상태는 정리한다.
    } finally {
      localStorage.removeItem('accessToken');
      navigate('/');
    }
  };

  const handleLanguageConfirm = () => {
    updateCurrentUser({ language });

    setLanguageMessage('언어가 변경되었습니다.');
  };

  const handleCountryConfirm = () => {
    const country = COUNTRIES.find((candidate) => candidate.label === countryLabel);
    if (!country) return;

    updateCurrentUser({ timezone: country.timezone });

    setTimezoneMessage('시간대가 변경되었습니다.');
  };

  const activeDraft = activePicker === 'start' ? startDraft : endDraft;
  const setActiveDraft = activePicker === 'start' ? setStartDraft : setEndDraft;

  const adjustHour = (delta) => {
    setActiveDraft((prev) => {
      let hour = prev.hour + delta;
      if (hour > 12) hour = 1;
      if (hour < 1) hour = 12;
      return { ...prev, hour };
    });
  };

  const adjustMinute = (delta) => {
    setActiveDraft((prev) => ({ ...prev, minute: (prev.minute + delta + 60) % 60 }));
  };

  const togglePeriod = () => {
    setActiveDraft((prev) => ({ ...prev, period: prev.period === 'AM' ? 'PM' : 'AM' }));
  };

  const handleAddAvailability = () => {
    const next = [
      ...availabilities.map(({ dayOfWeek, startTime, endTime }) => ({
        dayOfWeek,
        startTime,
        endTime,
      })),
      {
        dayOfWeek: selectedDay,
        startTime: draftToApiTime(startDraft),
        endTime: draftToApiTime(endDraft),
      },
    ];

    updateAvailability(next);
    setAvailabilities([...getAvailability()]);
    setActivePicker(null);
  };

  const handleDeleteAvailability = (availabilityId) => {
    const next = availabilities
      .filter((item) => item.availabilityId !== availabilityId)
      .map(({ dayOfWeek, startTime, endTime }) => ({ dayOfWeek, startTime, endTime }));

    updateAvailability(next);
    setAvailabilities([...getAvailability()]);
  };

  return (
    <div className="settings-page">
      <header className="settings-page-header">
        <h1>설정</h1>
      </header>

      <div className="settings-page-body">
        <nav className="settings-page-nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              type="button"
              className={`settings-page-nav-item ${activeTab === item.key ? 'active' : ''}`}
              onClick={() => setActiveTab(item.key)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="settings-page-content">
          {activeTab === 'profile' && (
            <>
              <section className="settings-page-section">
                <h2>프로필 관리</h2>

                <form className="settings-page-profile-form" onSubmit={handleProfileSave}>
                  <div className="settings-page-form-body">
                    <div className="settings-page-avatar-col">
                      <button
                        type="button"
                        className="settings-page-avatar"
                        onClick={handleAvatarClick}
                        aria-label="프로필 사진 변경"
                      >
                        {avatarPreview ? (
                          <img src={avatarPreview} alt="프로필 사진" />
                        ) : (
                          <span className="settings-page-avatar-placeholder" />
                        )}
                        <span className="settings-page-avatar-badge">+</span>
                      </button>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="settings-page-avatar-input"
                        onChange={handleAvatarChange}
                      />
                    </div>

                    <div className="settings-page-fields">
                      <div className="settings-page-field">
                        <label htmlFor="name">이름</label>
                        <input
                          id="name"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>

                      <div className="settings-page-field">
                        <label htmlFor="position">직책</label>
                        <input
                          id="position"
                          type="text"
                          placeholder="예: 프론트엔드 개발자"
                          value={position}
                          onChange={(e) => setPosition(e.target.value)}
                        />
                      </div>

                      <div className="settings-page-field">
                        <label htmlFor="email">이메일</label>
                        <input id="email" type="email" value={currentUser.email} disabled />
                      </div>
                    </div>
                  </div>

                  <div className="settings-page-save-row">
                    {profileMessage && (
                      <span className="settings-page-save-message">{profileMessage}</span>
                    )}
                    <button type="submit" className="settings-page-save-button">
                      변경사항 저장
                    </button>
                  </div>
                </form>
              </section>

              <section className="settings-page-section">
                <h2>언어 설정</h2>

                <div className="settings-page-language-row">
                  <label htmlFor="language">언어</label>

                  <div className="settings-page-language-controls">
                    <select
                      id="language"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                    >
                      {LANGUAGES.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                          {lang.label}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      className="settings-page-confirm-button"
                      onClick={handleLanguageConfirm}
                    >
                      확인
                    </button>
                  </div>
                </div>

                {languageMessage && (
                  <p className="settings-page-save-message">{languageMessage}</p>
                )}
              </section>

              <div className="settings-page-logout-row">
                <button type="button" className="settings-page-logout-button" onClick={handleLogout}>
                  로그아웃
                </button>
              </div>
            </>
          )}

          {activeTab === 'timezone' && (
            <>
              <section className="settings-page-section">
                <h2>나라 시각 설정</h2>

                <div className="settings-page-language-row">
                  <label htmlFor="country">국가</label>

                  <div className="settings-page-language-controls">
                    <select
                      id="country"
                      value={countryLabel}
                      onChange={(e) => setCountryLabel(e.target.value)}
                    >
                      {COUNTRIES.map((country) => (
                        <option key={country.label} value={country.label}>
                          {country.label}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      className="settings-page-confirm-button"
                      onClick={handleCountryConfirm}
                    >
                      확인
                    </button>
                  </div>
                </div>

                {timezoneMessage && (
                  <p className="settings-page-save-message">{timezoneMessage}</p>
                )}
              </section>

              <section className="settings-page-section">
                <h2>가능시간 설정</h2>

                <div className="availability-toolbar">
                  <select
                    className="availability-day-select"
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(e.target.value)}
                  >
                    {DAYS.map((day) => (
                      <option key={day.code} value={day.code}>
                        {day.label}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    className={`availability-time-button ${activePicker === 'start' ? 'active' : ''}`}
                    onClick={() => setActivePicker(activePicker === 'start' ? null : 'start')}
                  >
                    시작 시간 {formatDraft(startDraft)}
                  </button>

                  <button
                    type="button"
                    className={`availability-time-button ${activePicker === 'end' ? 'active' : ''}`}
                    onClick={() => setActivePicker(activePicker === 'end' ? null : 'end')}
                  >
                    종료 시간 {formatDraft(endDraft)}
                  </button>

                  <button
                    type="button"
                    className="settings-page-confirm-button"
                    onClick={handleAddAvailability}
                  >
                    확인
                  </button>
                </div>

                {activePicker && (
                  <div className="time-picker">
                    <div className="time-picker-header">
                      <span>시간 설정</span>
                      <button
                        type="button"
                        className="time-picker-close"
                        aria-label="시간 설정 닫기"
                        onClick={() => setActivePicker(null)}
                      >
                        X
                      </button>
                    </div>

                    <div className="time-picker-body">
                      <div className="time-picker-column">
                        <button type="button" onClick={() => adjustHour(1)}>▲</button>
                        <span>{pad2(activeDraft.hour)}</span>
                        <button type="button" onClick={() => adjustHour(-1)}>▼</button>
                      </div>

                      <span className="time-picker-colon">:</span>

                      <div className="time-picker-column">
                        <button type="button" onClick={() => adjustMinute(5)}>▲</button>
                        <span>{pad2(activeDraft.minute)}</span>
                        <button type="button" onClick={() => adjustMinute(-5)}>▼</button>
                      </div>

                      <div className="time-picker-column">
                        <button type="button" onClick={togglePeriod}>▲</button>
                        <span>{activeDraft.period}</span>
                        <button type="button" onClick={togglePeriod}>▼</button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="availability-list">
                  {availabilities.length > 0 ? (
                    availabilities.map((item) => (
                      <div key={item.availabilityId} className="availability-item">
                        <span className="availability-item-day">{dayLabel(item.dayOfWeek)}</span>
                        <span className="availability-item-time">
                          {item.startTime} ~ {item.endTime}
                        </span>
                        <button
                          type="button"
                          className="availability-delete-button"
                          onClick={() => handleDeleteAvailability(item.availabilityId)}
                        >
                          삭제
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="settings-page-notice">설정된 가능 시간이 없습니다.</p>
                  )}
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;

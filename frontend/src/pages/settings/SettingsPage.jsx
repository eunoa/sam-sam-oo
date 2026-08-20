import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getCurrentUser,
  updateCurrentUser,
  getAvailability,
  updateAvailability,
} from '../../services/userService';
import { COUNTRIES } from '../../constants/countries';
import api from '../../api/axiosInstance';
import './SettingsPage.css';

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

function draftToApiTime({ hour, minute, period }) {
  let hour24 = hour % 12;

  if (period === 'PM') {
    hour24 += 12;
  }

  return `${pad2(hour24)}:${pad2(minute)}`;
}

function formatDraft({ hour, minute, period }) {
  return `${pad2(hour)}:${pad2(minute)} ${period}`;
}

function apiTimeToDraft(time) {
  if (!time) {
    return {
      hour: 12,
      minute: 0,
      period: 'AM',
    };
  }

  const [hourString, minuteString] = String(time).split(':');
  const hour24 = Number(hourString);
  const minute = Number(minuteString);

  return {
    hour: hour24 % 12 || 12,
    minute,
    period: hour24 >= 12 ? 'PM' : 'AM',
  };
}

function SettingsPage() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('profile');

  const [currentUser, setCurrentUser] = useState(null);
  const [availabilities, setAvailabilities] = useState([]);

  const [loading, setLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);
  const [languageSaving, setLanguageSaving] = useState(false);
  const [timezoneSaving, setTimezoneSaving] = useState(false);
  const [availabilitySaving, setAvailabilitySaving] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');

  const fileInputRef = useRef(null);

  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [profileMessage, setProfileMessage] = useState('');

  const [language, setLanguage] = useState('ko');
  const [languageMessage, setLanguageMessage] = useState('');

  const [countryLabel, setCountryLabel] = useState('');
  const [timezoneMessage, setTimezoneMessage] = useState('');

  const [selectedDay, setSelectedDay] = useState('MONDAY');
  const [startDraft, setStartDraft] = useState({
    hour: 9,
    minute: 0,
    period: 'AM',
  });
  const [endDraft, setEndDraft] = useState({
    hour: 12,
    minute: 0,
    period: 'PM',
  });
  const [activePicker, setActivePicker] = useState(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        setErrorMessage('');

        const [userData, availabilityData] = await Promise.all([
          getCurrentUser(),
          getAvailability(),
        ]);

        setCurrentUser(userData);

        setName(userData?.name ?? '');
        setLanguage(userData?.language ?? 'ko');

        const matchedCountry = COUNTRIES.find(
          (country) => country.timezone === userData?.timezone
        );

        setCountryLabel(
          matchedCountry?.label ?? COUNTRIES[0]?.label ?? ''
        );

        setAvailabilities(
          Array.isArray(availabilityData)
            ? availabilityData
            : availabilityData?.availabilities ?? []
        );
      } catch (error) {
        console.error('설정 정보 로드 실패:', error);
        setErrorMessage(
          error.message || '설정 정보를 불러오지 못했습니다.'
        );
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setAvatarPreview(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();

    try {
      setProfileSaving(true);
      setProfileMessage('');
      setErrorMessage('');

      const updatedUser = await updateCurrentUser({
        name,
      });

      setCurrentUser((prev) => ({
        ...prev,
        ...(updatedUser || {}),
        name,
      }));

      setProfileMessage('변경사항이 저장되었습니다.');
    } catch (error) {
      console.error('프로필 저장 실패:', error);
      setProfileMessage(
        error.message || '프로필 저장에 실패했습니다.'
      );
    } finally {
      setProfileSaving(false);
    }
  };

  const handleLanguageConfirm = async () => {
    try {
      setLanguageSaving(true);
      setLanguageMessage('');

      const updatedUser = await updateCurrentUser({
        language,
      });

      setCurrentUser((prev) => ({
        ...prev,
        ...(updatedUser || {}),
        language,
      }));

      setLanguageMessage('언어가 변경되었습니다.');
    } catch (error) {
      console.error('언어 변경 실패:', error);
      setLanguageMessage(
        error.message || '언어 변경에 실패했습니다.'
      );
    } finally {
      setLanguageSaving(false);
    }
  };

  const handleCountryConfirm = async () => {
    const country = COUNTRIES.find(
      (candidate) => candidate.label === countryLabel
    );

    if (!country) {
      return;
    }

    try {
      setTimezoneSaving(true);
      setTimezoneMessage('');

      const updatedUser = await updateCurrentUser({
        timezone: country.timezone,
      });

      setCurrentUser((prev) => ({
        ...prev,
        ...(updatedUser || {}),
        timezone: country.timezone,
      }));

      setTimezoneMessage('시간대가 변경되었습니다.');
    } catch (error) {
      console.error('시간대 변경 실패:', error);
      setTimezoneMessage(
        error.message || '시간대 변경에 실패했습니다.'
      );
    } finally {
      setTimezoneSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post('/users/logout');
    } catch (error) {
      console.error('로그아웃 API 호출 실패:', error);
    } finally {
      localStorage.removeItem('accessToken');
      navigate('/');
    }
  };

  const activeDraft =
    activePicker === 'start' ? startDraft : endDraft;

  const setActiveDraft =
    activePicker === 'start'
      ? setStartDraft
      : setEndDraft;

  const adjustHour = (delta) => {
    if (!activePicker) {
      return;
    }

    setActiveDraft((prev) => {
      let hour = prev.hour + delta;

      if (hour > 12) {
        hour = 1;
      }

      if (hour < 1) {
        hour = 12;
      }

      return {
        ...prev,
        hour,
      };
    });
  };

  const adjustMinute = (delta) => {
    if (!activePicker) {
      return;
    }

    setActiveDraft((prev) => ({
      ...prev,
      minute: (prev.minute + delta + 60) % 60,
    }));
  };

  const togglePeriod = () => {
    if (!activePicker) {
      return;
    }

    setActiveDraft((prev) => ({
      ...prev,
      period: prev.period === 'AM' ? 'PM' : 'AM',
    }));
  };

  const saveAvailabilities = async (next) => {
    try {
      setAvailabilitySaving(true);

      const normalized = next.map(
        ({ dayOfWeek, startTime, endTime }) => ({
          dayOfWeek,
          startTime,
          endTime,
        })
      );

      await updateAvailability(normalized);

      const refreshed = await getAvailability();

      setAvailabilities(
        Array.isArray(refreshed)
          ? refreshed
          : refreshed?.availabilities ?? []
      );

      setActivePicker(null);
    } catch (error) {
      console.error('가능시간 저장 실패:', error);
      setErrorMessage(
        error.message || '가능시간 저장에 실패했습니다.'
      );
    } finally {
      setAvailabilitySaving(false);
    }
  };

  const handleAddAvailability = async () => {
    const next = [
      ...availabilities.map(
        ({ dayOfWeek, startTime, endTime }) => ({
          dayOfWeek,
          startTime,
          endTime,
        })
      ),
      {
        dayOfWeek: selectedDay,
        startTime: draftToApiTime(startDraft),
        endTime: draftToApiTime(endDraft),
      },
    ];

    await saveAvailabilities(next);
  };

  const handleDeleteAvailability = async (availabilityId) => {
    const next = availabilities
      .filter(
        (item) => item.availabilityId !== availabilityId
      )
      .map(({ dayOfWeek, startTime, endTime }) => ({
        dayOfWeek,
        startTime,
        endTime,
      }));

    await saveAvailabilities(next);
  };

  if (loading) {
    return (
      <div className="settings-page">
        <header className="settings-page-header">
          <h1>설정</h1>
        </header>

        <div className="settings-page-body">
          <div className="settings-page-content">
            <p className="settings-page-notice">
              설정 정보를 불러오는 중입니다...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="settings-page">
        <header className="settings-page-header">
          <h1>설정</h1>
        </header>

        <div className="settings-page-body">
          <div className="settings-page-content">
            <p className="settings-page-notice">
              {errorMessage || '사용자 정보를 불러오지 못했습니다.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

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
              className={`settings-page-nav-item ${
                activeTab === item.key ? 'active' : ''
              }`}
              onClick={() => setActiveTab(item.key)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="settings-page-content">
          {errorMessage && (
            <p className="settings-page-notice">
              {errorMessage}
            </p>
          )}

          {activeTab === 'profile' && (
            <>
              <section className="settings-page-section">
                <h2>프로필 관리</h2>

                <form
                  className="settings-page-profile-form"
                  onSubmit={handleProfileSave}
                >
                  <div className="settings-page-form-body">
                    <div className="settings-page-avatar-col">
                      <button
                        type="button"
                        className="settings-page-avatar"
                        onClick={handleAvatarClick}
                        aria-label="프로필 사진 변경"
                      >
                        {avatarPreview ? (
                          <img
                            src={avatarPreview}
                            alt="프로필 사진"
                          />
                        ) : (
                          <span className="settings-page-avatar-placeholder" />
                        )}

                        <span className="settings-page-avatar-badge">
                          +
                        </span>
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
                        <label htmlFor="name">
                          이름
                        </label>

                        <input
                          id="name"
                          type="text"
                          value={name}
                          onChange={(e) =>
                            setName(e.target.value)
                          }
                        />
                      </div>

                      <div className="settings-page-field">
                        <label htmlFor="position">
                          직책
                        </label>

                        <input
                          id="position"
                          type="text"
                          placeholder="예: 프론트엔드 개발자"
                          value={position}
                          onChange={(e) =>
                            setPosition(e.target.value)
                          }
                        />
                      </div>

                      <div className="settings-page-field">
                        <label htmlFor="email">
                          이메일
                        </label>

                        <input
                          id="email"
                          type="email"
                          value={currentUser.email ?? ''}
                          disabled
                        />
                      </div>
                    </div>
                  </div>

                  <div className="settings-page-save-row">
                    {profileMessage && (
                      <span className="settings-page-save-message">
                        {profileMessage}
                      </span>
                    )}

                    <button
                      type="submit"
                      className="settings-page-save-button"
                      disabled={profileSaving}
                    >
                      {profileSaving
                        ? '저장 중...'
                        : '변경사항 저장'}
                    </button>
                  </div>
                </form>
              </section>

              <section className="settings-page-section">
                <h2>언어 설정</h2>

                <div className="settings-page-language-row">
                  <label htmlFor="language">
                    언어
                  </label>

                  <div className="settings-page-language-controls">
                    <select
                      id="language"
                      value={language}
                      onChange={(e) =>
                        setLanguage(e.target.value)
                      }
                    >
                      {LANGUAGES.map((lang) => (
                        <option
                          key={lang.code}
                          value={lang.code}
                        >
                          {lang.label}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      className="settings-page-confirm-button"
                      onClick={handleLanguageConfirm}
                      disabled={languageSaving}
                    >
                      {languageSaving
                        ? '저장 중...'
                        : '확인'}
                    </button>
                  </div>
                </div>

                {languageMessage && (
                  <p className="settings-page-save-message">
                    {languageMessage}
                  </p>
                )}
              </section>

              <div className="settings-page-logout-row">
                <button
                  type="button"
                  className="settings-page-logout-button"
                  onClick={handleLogout}
                >
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
                  <label htmlFor="country">
                    국가
                  </label>

                  <div className="settings-page-language-controls">
                    <select
                      id="country"
                      value={countryLabel}
                      onChange={(e) =>
                        setCountryLabel(e.target.value)
                      }
                    >
                      {COUNTRIES.map((country) => (
                        <option
                          key={country.label}
                          value={country.label}
                        >
                          {country.label}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      className="settings-page-confirm-button"
                      onClick={handleCountryConfirm}
                      disabled={timezoneSaving}
                    >
                      {timezoneSaving
                        ? '저장 중...'
                        : '확인'}
                    </button>
                  </div>
                </div>

                {timezoneMessage && (
                  <p className="settings-page-save-message">
                    {timezoneMessage}
                  </p>
                )}
              </section>

              <section className="settings-page-section">
                <h2>가능시간 설정</h2>

                <div className="availability-toolbar">
                  <select
                    className="availability-day-select"
                    value={selectedDay}
                    onChange={(e) =>
                      setSelectedDay(e.target.value)
                    }
                  >
                    {DAYS.map((day) => (
                      <option
                        key={day.code}
                        value={day.code}
                      >
                        {day.label}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    className={`availability-time-button ${
                      activePicker === 'start'
                        ? 'active'
                        : ''
                    }`}
                    onClick={() =>
                      setActivePicker(
                        activePicker === 'start'
                          ? null
                          : 'start'
                      )
                    }
                  >
                    시작 시간 {formatDraft(startDraft)}
                  </button>

                  <button
                    type="button"
                    className={`availability-time-button ${
                      activePicker === 'end'
                        ? 'active'
                        : ''
                    }`}
                    onClick={() =>
                      setActivePicker(
                        activePicker === 'end'
                          ? null
                          : 'end'
                      )
                    }
                  >
                    종료 시간 {formatDraft(endDraft)}
                  </button>

                  <button
                    type="button"
                    className="settings-page-confirm-button"
                    onClick={handleAddAvailability}
                    disabled={availabilitySaving}
                  >
                    {availabilitySaving
                      ? '저장 중...'
                      : '확인'}
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
                        onClick={() =>
                          setActivePicker(null)
                        }
                      >
                        X
                      </button>
                    </div>

                    <div className="time-picker-body">
                      <div className="time-picker-column">
                        <button
                          type="button"
                          onClick={() =>
                            adjustHour(1)
                          }
                        >
                          ▲
                        </button>

                        <span>
                          {pad2(activeDraft.hour)}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            adjustHour(-1)
                          }
                        >
                          ▼
                        </button>
                      </div>

                      <span className="time-picker-colon">
                        :
                      </span>

                      <div className="time-picker-column">
                        <button
                          type="button"
                          onClick={() =>
                            adjustMinute(5)
                          }
                        >
                          ▲
                        </button>

                        <span>
                          {pad2(activeDraft.minute)}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            adjustMinute(-5)
                          }
                        >
                          ▼
                        </button>
                      </div>

                      <div className="time-picker-column">
                        <button
                          type="button"
                          onClick={togglePeriod}
                        >
                          ▲
                        </button>

                        <span>
                          {activeDraft.period}
                        </span>

                        <button
                          type="button"
                          onClick={togglePeriod}
                        >
                          ▼
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="availability-list">
                  {availabilities.length > 0 ? (
                    availabilities.map((item) => (
                      <div
                        key={
                          item.availabilityId ??
                          `${item.dayOfWeek}-${item.startTime}-${item.endTime}`
                        }
                        className="availability-item"
                      >
                        <span className="availability-item-day">
                          {dayLabel(item.dayOfWeek)}
                        </span>

                        <span className="availability-item-time">
                          {item.startTime} ~ {item.endTime}
                        </span>

                        <button
                          type="button"
                          className="availability-delete-button"
                          onClick={() =>
                            handleDeleteAvailability(
                              item.availabilityId
                            )
                          }
                          disabled={availabilitySaving}
                        >
                          삭제
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="settings-page-notice">
                      설정된 가능 시간이 없습니다.
                    </p>
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

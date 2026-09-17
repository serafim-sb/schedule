import { useState, useEffect, useRef } from 'react';
import { lessons } from './database';
import { getWeekParity, getISODay, timeToMinutes, isLessonNow, getMondayOfWeek } from './utils/week';

const DAY_NAMES = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];
const DAY_SHORT = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [, forceTick] = useState(0);
  const touchStartX = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      forceTick(prev => prev + 1);
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const todayISO = getISODay(currentDate);
  const weekParity = getWeekParity(currentDate);

  const todaysLessons = lessons
    .filter(lesson =>
      lesson.dayOfWeek === todayISO &&
      (lesson.weekParity === weekParity || lesson.weekParity === 'both')
    )
    .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));

  function shiftDay(amount: number) {
    setCurrentDate(prev => {
      const next = new Date(prev);
      next.setDate(next.getDate() + amount);
      return next;
    });
  }

  function selectDayInWeek(isoDayIndex: number) {
    const monday = getMondayOfWeek(currentDate);
    const target = new Date(monday);
    target.setDate(monday.getDate() + isoDayIndex);
    setCurrentDate(target);
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    const SWIPE_THRESHOLD = 50;

    if (diff > SWIPE_THRESHOLD) {
      shiftDay(1);
    } else if (diff < -SWIPE_THRESHOLD) {
      shiftDay(-1);
    }
  }

  const isToday = new Date().toDateString() === currentDate.toDateString();

  const formattedDate = currentDate.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
  });

  return (
    <div
      className="min-h-screen bg-black text-[#F2F2F0]"
      style={{ fontFamily: "'Inter', sans-serif" }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="max-w-md mx-auto px-6 pt-10 pb-16">

        {/* Заголовок дня */}
        <div className="mb-6">
          <div className="flex items-baseline justify-between">
            <h1 className="text-[40px] leading-none font-light tracking-tight">
              {DAY_NAMES[todayISO]}
            </h1>
            <span className="text-[#D4183D] text-sm font-medium">
              {weekParity} нед.
            </span>
          </div>
          <p className="text-[#7A7A7E] text-sm mt-2">{formattedDate}</p>
        </div>

        {/* Полоска дней недели */}
        <div className="flex justify-between mb-10">
          {DAY_SHORT.map((label, index) => {
            const isSelected = index === todayISO;
            return (
              <button
                key={label}
                onClick={() => selectDayInWeek(index)}
                className="flex flex-col items-center gap-2 py-1"
              >
                <span className={`text-xs ${isSelected ? 'text-[#D4183D]' : 'text-[#7A7A7E]'}`}>
                  {label}
                </span>
                <span className={`w-2 h-2 rounded-full ${
                  isSelected ? 'bg-[#D4183D]' : 'bg-transparent'
                }`} />
              </button>
            );
          })}
        </div>

        {/* Навигация */}
        <div className="flex items-center justify-between mb-12 pb-5 border-b border-[#2A2A2A]">
          <button
            onClick={() => shiftDay(-1)}
            className="text-[#7A7A7E] hover:text-[#F2F2F0] transition-colors text-sm"
          >
            ← Пред. день
          </button>

          {!isToday && (
            <button
              onClick={() => setCurrentDate(new Date())}
              className="text-[#D4183D] text-sm font-medium"
            >
              Сегодня
            </button>
          )}

          <button
            onClick={() => shiftDay(1)}
            className="text-[#7A7A7E] hover:text-[#F2F2F0] transition-colors text-sm"
          >
            След. день →
          </button>
        </div>

        {/* Таймлайн */}
        {todaysLessons.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-[#7A7A7E] text-sm">Пар в этот день нет</p>
          </div>
        ) : (
          <div className="relative pl-6">
            <div className="absolute left-[3px] top-2 bottom-2 w-px bg-[#2A2A2A]" />
            <div className="flex flex-col gap-9">
              {todaysLessons.map(lesson => {
                const isActive = isToday && isLessonNow(lesson.startTime, lesson.endTime);
                return (
                  <div key={lesson.id} className="relative">
                    <div className={`absolute -left-[26px] top-1.5 w-[7px] h-[7px] rounded-full bg-[#D4183D] ${
                      isActive ? 'animate-pulse' : ''
                    }`} />
                    <div className="flex items-baseline gap-3 mb-1.5">
                      <span className={`text-sm font-medium ${isActive ? 'text-[#D4183D]' : 'text-[#F2F2F0]'}`}>
                        {lesson.startTime}
                      </span>
                      <span className="text-xs text-[#7A7A7E]">{lesson.endTime}</span>
                      {lesson.weekParity !== 'both' && (
                        <span className="text-[11px] text-[#D4183D]">
                          · только {lesson.weekParity} нед.
                        </span>
                      )}
                    </div>
                    <p className={`text-[17px] font-medium leading-snug pr-2 ${
                      isActive ? 'text-white' : 'text-[#F2F2F0]'
                    }`}>
                      {lesson.subject}
                    </p>
                    <p className="text-[#7A7A7E] text-sm mt-1">Аудитория {lesson.room}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
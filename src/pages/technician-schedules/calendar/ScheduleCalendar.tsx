/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useTechnicianSchedulesQuery } from '$app/common/queries/technician-schedules';
import { Card } from '$app/components/cards';
import { useColorScheme } from '$app/common/colors';
import { useTranslation } from 'react-i18next';
import { useState, useMemo } from 'react';
import dayjs from 'dayjs';
import { TechnicianSchedule, ScheduleType } from '$app/common/interfaces/technician-schedule';
import { route } from '$app/common/helpers/route';
import { useNavigate } from 'react-router-dom';
import { SelectField } from '$app/components/forms';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import { UserSelector } from '$app/components/users/UserSelector';
import { Spinner } from '$app/components/Spinner';

const getScheduleTypeColor = (scheduleType: ScheduleType) => {
  switch (scheduleType) {
    case 'service':
      return 'bg-blue-500';
    case 'travel':
      return 'bg-yellow-500';
    case 'break':
      return 'bg-green-500';
    case 'meeting':
      return 'bg-orange-500';
    case 'off':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

export function ScheduleCalendar() {
  const [t] = useTranslation();
  const colors = useColorScheme();
  const navigate = useNavigate();

  const [currentDate, setCurrentDate] = useState(dayjs());
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [selectedTechnicianId, setSelectedTechnicianId] = useState<string>('');

  const startOfView = viewMode === 'month'
    ? currentDate.startOf('month').startOf('week')
    : currentDate.startOf('week');

  const endOfView = viewMode === 'month'
    ? currentDate.endOf('month').endOf('week')
    : currentDate.endOf('week');

  const { data: schedules, isLoading } = useTechnicianSchedulesQuery({
    start_date: startOfView.format('YYYY-MM-DD'),
    end_date: endOfView.format('YYYY-MM-DD'),
    user_id: selectedTechnicianId || undefined,
  });

  const calendarDays = useMemo(() => {
    const days = [];
    let day = startOfView;

    while (day.isBefore(endOfView) || day.isSame(endOfView, 'day')) {
      days.push(day);
      day = day.add(1, 'day');
    }

    return days;
  }, [startOfView, endOfView]);

  const getSchedulesForDay = (day: dayjs.Dayjs): TechnicianSchedule[] => {
    if (!schedules) return [];

    return schedules.filter((schedule) => {
      const scheduleDate = dayjs(schedule.schedule_date);
      return scheduleDate.isSame(day, 'day');
    });
  };

  const goToPrevious = () => {
    setCurrentDate(currentDate.subtract(1, viewMode));
  };

  const goToNext = () => {
    setCurrentDate(currentDate.add(1, viewMode));
  };

  const goToToday = () => {
    setCurrentDate(dayjs());
  };

  const handleEventClick = (schedule: TechnicianSchedule) => {
    navigate(route('/technician_schedules/:id/edit', { id: schedule.id }));
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Card
      className="shadow-sm"
      style={{ borderColor: colors.$24 }}
      headerStyle={{ borderColor: colors.$20 }}
    >
      <div className="p-4">
        {/* Calendar Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={goToPrevious}
              className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <MdChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={goToToday}
              className="px-3 py-1 text-sm rounded border hover:bg-gray-100 dark:hover:bg-gray-700"
              style={{ borderColor: colors.$5 }}
            >
              {t('today')}
            </button>
            <button
              onClick={goToNext}
              className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <MdChevronRight className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold ml-2">
              {currentDate.format(viewMode === 'month' ? 'MMMM YYYY' : 'MMM D - ')}
              {viewMode === 'week' && currentDate.endOf('week').format('MMM D, YYYY')}
            </h2>
          </div>

          <div className="flex items-center space-x-4">
            <div className="w-64">
              <UserSelector
                value={selectedTechnicianId}
                onChange={(user) => setSelectedTechnicianId(user.id)}
                onClearButtonClick={() => setSelectedTechnicianId('')}
                clearButton
              />
            </div>
            <SelectField
              value={viewMode}
              onValueChange={(value) => setViewMode(value as 'month' | 'week')}
            >
              <option value="month">{t('month')}</option>
              <option value="week">{t('week')}</option>
            </SelectField>
          </div>
        </div>

        {/* Schedule Type Legend */}
        <div className="flex flex-wrap gap-4 mb-4 text-sm">
          <div className="flex items-center space-x-1">
            <span className="w-3 h-3 rounded bg-blue-500"></span>
            <span>{t('service')}</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-3 h-3 rounded bg-yellow-500"></span>
            <span>{t('travel')}</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-3 h-3 rounded bg-green-500"></span>
            <span>{t('break')}</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-3 h-3 rounded bg-orange-500"></span>
            <span>{t('meeting')}</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-3 h-3 rounded bg-red-500"></span>
            <span>{t('off')}</span>
          </div>
        </div>

        {isLoading ? (
          <Spinner />
        ) : (
          <>
            {/* Calendar Header */}
            <div className="grid grid-cols-7 border-b" style={{ borderColor: colors.$5 }}>
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="p-2 text-center text-sm font-medium"
                  style={{ backgroundColor: colors.$1 }}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className={`grid grid-cols-7 ${viewMode === 'week' ? 'min-h-[400px]' : ''}`}>
              {calendarDays.map((day, index) => {
                const daySchedules = getSchedulesForDay(day);
                const isCurrentMonth = day.month() === currentDate.month();
                const isToday = day.isSame(dayjs(), 'day');

                return (
                  <div
                    key={index}
                    className={`min-h-[100px] border-b border-r p-1 ${
                      !isCurrentMonth && viewMode === 'month' ? 'bg-gray-50 dark:bg-gray-800/50' : ''
                    }`}
                    style={{ borderColor: colors.$5 }}
                  >
                    <div
                      className={`text-sm mb-1 ${
                        isToday
                          ? 'w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center'
                          : ''
                      } ${!isCurrentMonth && viewMode === 'month' ? 'text-gray-400' : ''}`}
                    >
                      {day.date()}
                    </div>
                    <div className="space-y-1">
                      {daySchedules.slice(0, 3).map((schedule) => (
                        <button
                          key={schedule.id}
                          onClick={() => handleEventClick(schedule)}
                          className={`w-full text-left text-xs p-1 rounded text-white truncate ${getScheduleTypeColor(
                            schedule.schedule_type
                          )} hover:opacity-80`}
                          title={`${schedule.title} - ${schedule.user?.first_name || ''} ${
                            schedule.user?.last_name || ''
                          }`}
                        >
                          <span className="font-medium">
                            {schedule.start_time}
                          </span>{' '}
                          {schedule.title}
                        </button>
                      ))}
                      {daySchedules.length > 3 && (
                        <div className="text-xs text-gray-500">
                          +{daySchedules.length - 3} {t('more')}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </Card>
  );
}

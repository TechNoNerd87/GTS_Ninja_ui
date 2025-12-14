/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useTranslation } from 'react-i18next';
import { useTitle } from '$app/common/hooks/useTitle';
import { Page } from '$app/components/Breadcrumbs';
import { DataTable } from '$app/components/DataTable';
import { Default } from '$app/components/layouts/Default';
import {
  defaultColumns,
  useActions,
  useAllTechnicianScheduleColumns,
  useTechnicianScheduleColumns,
} from '../common/hooks';
import { DataTableColumnsPicker } from '$app/components/DataTableColumnsPicker';
import { permission } from '$app/common/guards/guards/permission';
import { useHasPermission } from '$app/common/hooks/permissions/useHasPermission';
import { useState } from 'react';
import { ScheduleCalendar } from '../calendar/ScheduleCalendar';
import { Button } from '$app/components/forms';
import { MdCalendarMonth, MdList } from 'react-icons/md';

export default function TechnicianSchedules() {
  useTitle('technician_schedules');

  const [t] = useTranslation();

  const hasPermission = useHasPermission();

  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  const pages: Page[] = [{ name: t('technician_schedules'), href: '/technician_schedules' }];

  const technicianScheduleColumns = useAllTechnicianScheduleColumns();

  const columns = useTechnicianScheduleColumns();

  const actions = useActions();

  return (
    <Default title={t('technician_schedules')} breadcrumbs={pages}>
      <div className="flex justify-end mb-4 space-x-2">
        <Button
          type="minimal"
          onClick={() => setViewMode('list')}
          className={viewMode === 'list' ? 'bg-gray-200 dark:bg-gray-700' : ''}
        >
          <MdList className="w-5 h-5" />
        </Button>
        <Button
          type="minimal"
          onClick={() => setViewMode('calendar')}
          className={viewMode === 'calendar' ? 'bg-gray-200 dark:bg-gray-700' : ''}
        >
          <MdCalendarMonth className="w-5 h-5" />
        </Button>
      </div>

      {viewMode === 'list' ? (
        <DataTable
          resource="technician_schedule"
          columns={columns}
          endpoint="/api/v1/technician_schedules?include=user,service_order&sort=id|desc"
          bulkRoute="/api/v1/technician_schedules/bulk"
          linkToCreate="/technician_schedules/create"
          linkToEdit="/technician_schedules/:id/edit"
          withResourcefulActions
          customActions={actions}
          rightSide={
            <DataTableColumnsPicker
              table="technician_schedule"
              columns={technicianScheduleColumns as unknown as string[]}
              defaultColumns={defaultColumns}
            />
          }
          linkToCreateGuards={[permission('create_technician_schedule')]}
          hideEditableOptions={!hasPermission('edit_technician_schedule')}
          enableSavingFilterPreference
        />
      ) : (
        <ScheduleCalendar />
      )}
    </Default>
  );
}

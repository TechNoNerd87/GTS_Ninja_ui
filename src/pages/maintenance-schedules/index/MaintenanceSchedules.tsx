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
  useAllMaintenanceScheduleColumns,
  useMaintenanceScheduleColumns,
} from '../common/hooks';
import { DataTableColumnsPicker } from '$app/components/DataTableColumnsPicker';
import { permission } from '$app/common/guards/guards/permission';
import { useHasPermission } from '$app/common/hooks/permissions/useHasPermission';

export default function MaintenanceSchedules() {
  useTitle('maintenance_schedules');

  const [t] = useTranslation();

  const hasPermission = useHasPermission();

  const pages: Page[] = [{ name: t('maintenance_schedules'), href: '/maintenance_schedules' }];

  const maintenanceScheduleColumns = useAllMaintenanceScheduleColumns();

  const columns = useMaintenanceScheduleColumns();

  const actions = useActions();

  return (
    <Default title={t('maintenance_schedules')} breadcrumbs={pages}>
      <DataTable
        resource="maintenance_schedule"
        columns={columns}
        endpoint="/api/v1/maintenance_schedules?include=equipment&sort=id|desc"
        bulkRoute="/api/v1/maintenance_schedules/bulk"
        linkToCreate="/maintenance_schedules/create"
        linkToEdit="/maintenance_schedules/:id/edit"
        withResourcefulActions
        customActions={actions}
        rightSide={
          <DataTableColumnsPicker
            table="maintenance_schedule"
            columns={maintenanceScheduleColumns as unknown as string[]}
            defaultColumns={defaultColumns}
          />
        }
        linkToCreateGuards={[permission('create_maintenance_schedule')]}
        hideEditableOptions={!hasPermission('edit_maintenance_schedule')}
        enableSavingFilterPreference
      />
    </Default>
  );
}

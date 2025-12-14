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
  useAllEquipmentColumns,
  useEquipmentColumns,
} from '../common/hooks';
import { DataTableColumnsPicker } from '$app/components/DataTableColumnsPicker';
import { permission } from '$app/common/guards/guards/permission';
import { useHasPermission } from '$app/common/hooks/permissions/useHasPermission';

export default function Equipment() {
  useTitle('equipment');

  const [t] = useTranslation();

  const hasPermission = useHasPermission();

  const pages: Page[] = [{ name: t('equipment'), href: '/equipment' }];

  const equipmentColumns = useAllEquipmentColumns();

  const columns = useEquipmentColumns();

  const actions = useActions();

  return (
    <Default title={t('equipment')} breadcrumbs={pages}>
      <DataTable
        resource="equipment"
        columns={columns}
        endpoint="/api/v1/equipment?include=client,location&sort=id|desc"
        bulkRoute="/api/v1/equipment/bulk"
        linkToCreate="/equipment/create"
        linkToEdit="/equipment/:id/edit"
        withResourcefulActions
        customActions={actions}
        rightSide={
          <DataTableColumnsPicker
            table="equipment"
            columns={equipmentColumns as unknown as string[]}
            defaultColumns={defaultColumns}
          />
        }
        linkToCreateGuards={[permission('create_equipment')]}
        hideEditableOptions={!hasPermission('edit_equipment')}
        enableSavingFilterPreference
      />
    </Default>
  );
}

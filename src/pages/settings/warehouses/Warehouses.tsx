/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Link } from '$app/components/forms';
import { Warehouse } from '$app/common/interfaces/warehouse';
import { DataTable, DataTableColumns } from '$app/components/DataTable';
import { useTranslation } from 'react-i18next';
import { route } from '$app/common/helpers/route';

export function Warehouses() {
  const [t] = useTranslation();

  const columns: DataTableColumns<Warehouse> = [
    {
      id: 'name',
      label: t('name'),
      format: (value, warehouse) => (
        <Link
          to={route('/settings/warehouses/:id/edit', {
            id: warehouse.id,
          })}
        >
          {value}
        </Link>
      ),
    },
    {
      id: 'code',
      label: t('warehouse_code'),
    },
    {
      id: 'city',
      label: t('city'),
    },
    {
      id: 'state',
      label: t('state'),
    },
    {
      id: 'is_active',
      label: t('is_active'),
      format: (value) => (value ? t('yes') : t('no')),
    },
    {
      id: 'is_default',
      label: t('is_default'),
      format: (value) => (value ? t('yes') : t('no')),
    },
  ];

  return (
    <DataTable
      resource="warehouse"
      columns={columns}
      endpoint="/api/v1/warehouses?sort=name|asc"
      bulkRoute="/api/v1/warehouses/bulk"
      linkToCreate="/settings/warehouses/create"
      linkToEdit="/settings/warehouses/:id/edit"
      withResourcefulActions
      enableSavingFilterPreference
    />
  );
}

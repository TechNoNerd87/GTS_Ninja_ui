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
import { ServiceOrderStatus } from '$app/common/interfaces/service-order-status';
import { DataTable, DataTableColumns } from '$app/components/DataTable';
import { useTranslation } from 'react-i18next';
import { route } from '$app/common/helpers/route';

export function ServiceOrderStatuses() {
  const [t] = useTranslation();

  const columns: DataTableColumns<ServiceOrderStatus> = [
    {
      id: 'name',
      label: t('name'),
      format: (value, status) => (
        <Link
          to={route('/settings/service_order_statuses/:id/edit', {
            id: status.id,
          })}
        >
          {value}
        </Link>
      ),
    },
    {
      id: 'color',
      label: t('color'),
      format: (value) => (
        <div
          className="w-10 h-4 border border-gray-300 rounded-sm"
          style={{ backgroundColor: value.toString() }}
        ></div>
      ),
    },
    {
      id: 'sort_order',
      label: t('sort_order'),
    },
    {
      id: 'is_default',
      label: t('is_default'),
      format: (value) => (value ? t('yes') : t('no')),
    },
    {
      id: 'is_completed',
      label: t('is_completed'),
      format: (value) => (value ? t('yes') : t('no')),
    },
  ];

  return (
    <DataTable
      resource="service_order_status"
      columns={columns}
      endpoint="/api/v1/service_order_statuses?sort=sort_order|asc"
      bulkRoute="/api/v1/service_order_statuses/bulk"
      linkToCreate="/settings/service_order_statuses/create"
      linkToEdit="/settings/service_order_statuses/:id/edit"
      withResourcefulActions
      enableSavingFilterPreference
    />
  );
}

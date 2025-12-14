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
  useAllServiceOrderColumns,
  useServiceOrderColumns,
} from '../common/hooks';
import { DataTableColumnsPicker } from '$app/components/DataTableColumnsPicker';
import { permission } from '$app/common/guards/guards/permission';
import { useHasPermission } from '$app/common/hooks/permissions/useHasPermission';

export default function ServiceOrders() {
  useTitle('service_orders');

  const [t] = useTranslation();

  const hasPermission = useHasPermission();

  const pages: Page[] = [{ name: t('service_orders'), href: '/service_orders' }];

  const serviceOrderColumns = useAllServiceOrderColumns();

  const columns = useServiceOrderColumns();

  const actions = useActions();

  return (
    <Default title={t('service_orders')} breadcrumbs={pages}>
      <DataTable
        resource="service_order"
        columns={columns}
        endpoint="/api/v1/service_orders?include=client,equipment,contract,status&sort=id|desc"
        bulkRoute="/api/v1/service_orders/bulk"
        linkToCreate="/service_orders/create"
        linkToEdit="/service_orders/:id/edit"
        withResourcefulActions
        customActions={actions}
        rightSide={
          <DataTableColumnsPicker
            table="service_order"
            columns={serviceOrderColumns as unknown as string[]}
            defaultColumns={defaultColumns}
          />
        }
        linkToCreateGuards={[permission('create_service_order')]}
        hideEditableOptions={!hasPermission('edit_service_order')}
        enableSavingFilterPreference
      />
    </Default>
  );
}

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
  useAllServiceBankColumns,
  useServiceBankColumns,
} from '../common/hooks';
import { DataTableColumnsPicker } from '$app/components/DataTableColumnsPicker';
import { permission } from '$app/common/guards/guards/permission';
import { useHasPermission } from '$app/common/hooks/permissions/useHasPermission';

export default function ServiceBanks() {
  useTitle('service_banks');

  const [t] = useTranslation();

  const hasPermission = useHasPermission();

  const pages: Page[] = [{ name: t('service_banks'), href: '/service_banks' }];

  const serviceBankColumns = useAllServiceBankColumns();

  const columns = useServiceBankColumns();

  const actions = useActions();

  return (
    <Default title={t('service_banks')} breadcrumbs={pages}>
      <DataTable
        resource="service_bank"
        columns={columns}
        endpoint="/api/v1/service_banks?include=client,contract&sort=id|desc"
        bulkRoute="/api/v1/service_banks/bulk"
        linkToCreate="/service_banks/create"
        linkToEdit="/service_banks/:id/edit"
        withResourcefulActions
        customActions={actions}
        rightSide={
          <DataTableColumnsPicker
            table="service_bank"
            columns={serviceBankColumns as unknown as string[]}
            defaultColumns={defaultColumns}
          />
        }
        linkToCreateGuards={[permission('create_service_bank')]}
        hideEditableOptions={!hasPermission('edit_service_bank')}
        enableSavingFilterPreference
      />
    </Default>
  );
}

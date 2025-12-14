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
  useAllContractColumns,
  useContractColumns,
} from '../common/hooks';
import { DataTableColumnsPicker } from '$app/components/DataTableColumnsPicker';
import { permission } from '$app/common/guards/guards/permission';
import { useHasPermission } from '$app/common/hooks/permissions/useHasPermission';

export default function Contracts() {
  useTitle('contracts');

  const [t] = useTranslation();

  const hasPermission = useHasPermission();

  const pages: Page[] = [{ name: t('contracts'), href: '/contracts' }];

  const contractColumns = useAllContractColumns();

  const columns = useContractColumns();

  const actions = useActions();

  return (
    <Default title={t('contracts')} breadcrumbs={pages}>
      <DataTable
        resource="contract"
        columns={columns}
        endpoint="/api/v1/contracts?include=client&sort=id|desc"
        bulkRoute="/api/v1/contracts/bulk"
        linkToCreate="/contracts/create"
        linkToEdit="/contracts/:id/edit"
        withResourcefulActions
        customActions={actions}
        rightSide={
          <DataTableColumnsPicker
            table="contract"
            columns={contractColumns as unknown as string[]}
            defaultColumns={defaultColumns}
          />
        }
        linkToCreateGuards={[permission('create_contract')]}
        hideEditableOptions={!hasPermission('edit_contract')}
        enableSavingFilterPreference
      />
    </Default>
  );
}

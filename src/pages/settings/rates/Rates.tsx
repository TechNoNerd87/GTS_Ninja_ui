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
import { Rate } from '$app/common/interfaces/rate';
import { DataTable, DataTableColumns } from '$app/components/DataTable';
import { useTranslation } from 'react-i18next';
import { route } from '$app/common/helpers/route';
import { useFormatMoney } from '$app/common/hooks/money/useFormatMoney';
import { useCurrentCompany } from '$app/common/hooks/useCurrentCompany';
import { Badge } from '$app/components/Badge';

export function Rates() {
  const [t] = useTranslation();
  const formatMoney = useFormatMoney();
  const company = useCurrentCompany();

  const columns: DataTableColumns<Rate> = [
    {
      id: 'name',
      label: t('name'),
      format: (value, rate) => (
        <Link
          to={route('/settings/rates/:id/edit', {
            id: rate.id,
          })}
        >
          {value}
        </Link>
      ),
    },
    {
      id: 'code',
      label: t('code'),
    },
    {
      id: 'rate_type',
      label: t('type'),
      format: (value) => (
        <Badge variant={value === 'service' ? 'blue' : 'green'}>
          {value === 'service' ? t('service') : t('travel')}
        </Badge>
      ),
    },
    {
      id: 'cost',
      label: t('cost'),
      format: (value) =>
        formatMoney(
          value as number,
          company?.settings?.country_id,
          company?.settings?.currency_id
        ),
    },
    {
      id: 'charge',
      label: t('charge'),
      format: (value) =>
        formatMoney(
          value as number,
          company?.settings?.country_id,
          company?.settings?.currency_id
        ),
    },
    {
      id: 'unit_type',
      label: t('unit'),
      format: (_, rate) => rate.display_unit_label || rate.unit_type,
    },
    {
      id: 'is_active',
      label: t('status'),
      format: (value) => (
        <Badge variant={value ? 'green' : 'light-blue'}>
          {value ? t('active') : t('inactive')}
        </Badge>
      ),
    },
    {
      id: 'is_default',
      label: t('default'),
      format: (value) =>
        value ? (
          <Badge variant="primary">{t('yes')}</Badge>
        ) : (
          <span className="text-gray-400">-</span>
        ),
    },
  ];

  return (
    <DataTable
      resource="rate"
      columns={columns}
      endpoint="/api/v1/rates?sort=sort_order|asc"
      bulkRoute="/api/v1/rates/bulk"
      linkToCreate="/settings/rates/create"
      linkToEdit="/settings/rates/:id/edit"
      withResourcefulActions
      enableSavingFilterPreference
    />
  );
}

/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { EntityState } from '$app/common/enums/entity-state';
import { date, getEntityState } from '$app/common/helpers';
import { route } from '$app/common/helpers/route';
import { toast } from '$app/common/helpers/toast/toast';
import { useCurrentCompanyDateFormats } from '$app/common/hooks/useCurrentCompanyDateFormats';
import { useFormatMoney } from '$app/common/hooks/money/useFormatMoney';
import { ServiceBank, ServiceBankType } from '$app/common/interfaces/service-bank';
import { ValidationBag } from '$app/common/interfaces/validation-bag';
import { DropdownElement } from '$app/components/dropdown/DropdownElement';
import { EntityStatus } from '$app/components/EntityStatus';
import { Icon } from '$app/components/icons/Icon';
import { DataTableColumnsExtended } from '$app/pages/invoices/common/hooks/useInvoiceColumns';
import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import {
  MdArchive,
  MdControlPointDuplicate,
  MdDelete,
  MdRestore,
  MdAdd,
} from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { serviceBankAtom } from './atoms';
import { bulk } from '$app/common/queries/service-banks';
import { Divider } from '$app/components/cards/Divider';
import { useSetAtom } from 'jotai';
import { useReactSettings } from '$app/common/hooks/useReactSettings';
import { useEntityPageIdentifier } from '$app/common/hooks/useEntityPageIdentifier';
import { $refetch } from '$app/common/hooks/useRefetch';
import { useHasPermission } from '$app/common/hooks/permissions/useHasPermission';
import { useDisableNavigation } from '$app/common/hooks/useDisableNavigation';
import { DynamicLink } from '$app/components/DynamicLink';
import { Badge } from '$app/components/Badge';

export const defaultColumns: string[] = [
  'name',
  'owner_name',
  'bank_type',
  'hours_balance',
  'currency_balance',
  'incidents_balance',
  'expiration_date',
  'is_active',
];

export function useAllServiceBankColumns() {
  const serviceBankColumns = [
    'name',
    'owner_name',
    'bank_type',
    'hours_purchased',
    'hours_used',
    'hours_balance',
    'hourly_rate',
    'currency_purchased',
    'currency_used',
    'currency_balance',
    'incidents_purchased',
    'incidents_used',
    'incidents_balance',
    'effective_date',
    'expiration_date',
    'is_active',
    'is_low_balance',
    'allow_overage',
    'created_at',
    'updated_at',
    'archived_at',
    'entity_state',
    'is_deleted',
  ] as const;

  return serviceBankColumns;
}

const getBankTypeColor = (bankType: ServiceBankType) => {
  switch (bankType) {
    case 'hours':
      return 'blue';
    case 'currency':
      return 'green';
    case 'incidents':
      return 'orange';
    case 'combined':
      return 'purple';
    default:
      return 'generic';
  }
};

export function useServiceBankColumns() {
  const { t } = useTranslation();

  const serviceBankColumns = useAllServiceBankColumns();
  type ServiceBankColumns = (typeof serviceBankColumns)[number];

  const { dateFormat } = useCurrentCompanyDateFormats();
  const formatMoney = useFormatMoney();

  const reactSettings = useReactSettings();
  const disableNavigation = useDisableNavigation();

  const columns: DataTableColumnsExtended<ServiceBank, ServiceBankColumns> = [
    {
      column: 'name',
      id: 'name',
      label: t('name'),
      format: (value, serviceBank) => (
        <span className="inline-flex items-center space-x-4">
          <EntityStatus entity={serviceBank} />

          <DynamicLink
            to={route('/service_banks/:id/edit', { id: serviceBank.id })}
            renderSpan={disableNavigation('service_bank', serviceBank)}
          >
            {value}
          </DynamicLink>
        </span>
      ),
    },
    {
      column: 'owner_name',
      id: 'owner_name',
      label: t('owner'),
    },
    {
      column: 'bank_type',
      id: 'bank_type',
      label: t('bank_type'),
      format: (value) => (
        <Badge variant={getBankTypeColor(value as ServiceBankType)}>
          {t(value as string)}
        </Badge>
      ),
    },
    {
      column: 'hours_purchased',
      id: 'hours_purchased',
      label: t('hours_purchased'),
      format: (value) => (value as number).toFixed(2),
    },
    {
      column: 'hours_used',
      id: 'hours_used',
      label: t('hours_used'),
      format: (value) => (value as number).toFixed(2),
    },
    {
      column: 'hours_balance',
      id: 'hours_balance',
      label: t('hours_balance'),
      format: (value) => (value as number).toFixed(2),
    },
    {
      column: 'hourly_rate',
      id: 'hourly_rate',
      label: t('hourly_rate'),
      format: (value, serviceBank) =>
        formatMoney(
          value as number,
          serviceBank.client?.country_id,
          serviceBank.client?.settings?.currency_id
        ),
    },
    {
      column: 'currency_purchased',
      id: 'currency_purchased',
      label: t('currency_purchased'),
      format: (value, serviceBank) =>
        formatMoney(
          value as number,
          serviceBank.client?.country_id,
          serviceBank.client?.settings?.currency_id
        ),
    },
    {
      column: 'currency_used',
      id: 'currency_used',
      label: t('currency_used'),
      format: (value, serviceBank) =>
        formatMoney(
          value as number,
          serviceBank.client?.country_id,
          serviceBank.client?.settings?.currency_id
        ),
    },
    {
      column: 'currency_balance',
      id: 'currency_balance',
      label: t('currency_balance'),
      format: (value, serviceBank) =>
        formatMoney(
          value as number,
          serviceBank.client?.country_id,
          serviceBank.client?.settings?.currency_id
        ),
    },
    {
      column: 'incidents_purchased',
      id: 'incidents_purchased',
      label: t('incidents_purchased'),
    },
    {
      column: 'incidents_used',
      id: 'incidents_used',
      label: t('incidents_used'),
    },
    {
      column: 'incidents_balance',
      id: 'incidents_balance',
      label: t('incidents_balance'),
    },
    {
      column: 'effective_date',
      id: 'effective_date',
      label: t('effective_date'),
      format: (value) => date(value, dateFormat),
    },
    {
      column: 'expiration_date',
      id: 'expiration_date',
      label: t('expiration_date'),
      format: (value) => date(value, dateFormat),
    },
    {
      column: 'is_active',
      id: 'is_active',
      label: t('is_active'),
      format: (value) => (value ? t('yes') : t('no')),
    },
    {
      column: 'is_low_balance',
      id: 'is_low_balance',
      label: t('low_balance'),
      format: (value) => (
        value ? (
          <Badge variant="yellow">{t('low')}</Badge>
        ) : (
          <Badge variant="green">{t('ok')}</Badge>
        )
      ),
    },
    {
      column: 'allow_overage',
      id: 'allow_overage',
      label: t('allow_overage'),
      format: (value) => (value ? t('yes') : t('no')),
    },
    {
      column: 'created_at',
      id: 'created_at',
      label: t('created_at'),
      format: (value) => date(value, dateFormat),
    },
    {
      column: 'updated_at',
      id: 'updated_at',
      label: t('updated_at'),
      format: (value) => date(value, dateFormat),
    },
    {
      column: 'archived_at',
      id: 'archived_at',
      label: t('archived_at'),
      format: (value) => date(value, dateFormat),
    },
    {
      column: 'entity_state',
      id: 'id',
      label: t('entity_state'),
      format: (value, serviceBank) => <EntityStatus entity={serviceBank} />,
    },
    {
      column: 'is_deleted',
      id: 'is_deleted',
      label: t('is_deleted'),
      format: (value, serviceBank) =>
        serviceBank.is_deleted ? t('yes') : t('no'),
    },
  ];

  const list: string[] =
    reactSettings?.react_table_columns?.service_bank || defaultColumns;

  return columns
    .filter((column) => list.includes(column.column))
    .sort((a, b) => list.indexOf(a.column) - list.indexOf(b.column));
}

export function useActions() {
  const [t] = useTranslation();

  const navigate = useNavigate();

  const hasPermission = useHasPermission();

  const setServiceBank = useSetAtom(serviceBankAtom);

  const { isEditPage } = useEntityPageIdentifier({
    entity: 'service_bank',
    editPageTabs: ['transactions'],
  });

  const cloneToServiceBank = (serviceBank: ServiceBank) => {
    setServiceBank({
      ...serviceBank,
      id: '',
      hours_used: 0,
      hours_balance: serviceBank.hours_purchased,
      currency_used: 0,
      currency_balance: serviceBank.currency_purchased,
      incidents_used: 0,
      incidents_balance: serviceBank.incidents_purchased,
      transactions: [],
    });

    navigate('/service_banks/create?action=clone');
  };

  const handleResourcefulAction = (
    action: 'archive' | 'restore' | 'delete',
    id: string
  ) => {
    toast.processing();

    bulk([id], action).then(() => {
      toast.success(`${action}d_service_bank`);

      $refetch(['service_banks']);
    });
  };

  const actions = [
    (serviceBank: ServiceBank) =>
      !serviceBank.is_deleted &&
      hasPermission('create_service_bank') && (
        <DropdownElement
          onClick={() => cloneToServiceBank(serviceBank)}
          icon={<Icon element={MdControlPointDuplicate} />}
        >
          {t('clone')}
        </DropdownElement>
      ),
    (serviceBank: ServiceBank) =>
      !serviceBank.is_deleted &&
      serviceBank.is_active &&
      hasPermission('edit_service_bank') && (
        <DropdownElement
          onClick={() => navigate(route('/service_banks/:id/deposit', { id: serviceBank.id }))}
          icon={<Icon element={MdAdd} />}
        >
          {t('deposit')}
        </DropdownElement>
      ),
    () => isEditPage && <Divider withoutPadding />,
    (serviceBank: ServiceBank) =>
      getEntityState(serviceBank) === EntityState.Active &&
      isEditPage && (
        <DropdownElement
          onClick={() => handleResourcefulAction('archive', serviceBank.id)}
          icon={<Icon element={MdArchive} />}
        >
          {t('archive')}
        </DropdownElement>
      ),
    (serviceBank: ServiceBank) =>
      (getEntityState(serviceBank) === EntityState.Archived ||
        getEntityState(serviceBank) === EntityState.Deleted) &&
      isEditPage && (
        <DropdownElement
          onClick={() => handleResourcefulAction('restore', serviceBank.id)}
          icon={<Icon element={MdRestore} />}
        >
          {t('restore')}
        </DropdownElement>
      ),
    (serviceBank: ServiceBank) =>
      (getEntityState(serviceBank) === EntityState.Active ||
        getEntityState(serviceBank) === EntityState.Archived) &&
      isEditPage && (
        <DropdownElement
          onClick={() => handleResourcefulAction('delete', serviceBank.id)}
          icon={<Icon element={MdDelete} />}
        >
          {t('delete')}
        </DropdownElement>
      ),
  ];

  return actions;
}

interface Params {
  setErrors: Dispatch<SetStateAction<ValidationBag | undefined>>;
  setServiceBank: Dispatch<SetStateAction<ServiceBank | undefined>>;
}

export function useHandleChange(params: Params) {
  const { setErrors, setServiceBank } = params;

  return (property: keyof ServiceBank, value: ServiceBank[keyof ServiceBank]) => {
    setErrors(undefined);

    setServiceBank((serviceBank) => serviceBank && { ...serviceBank, [property]: value });
  };
}

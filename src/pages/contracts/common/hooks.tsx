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
import { Contract, ContractStatus, ContractType } from '$app/common/interfaces/contract';
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
  MdAutorenew,
} from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { contractAtom } from './atoms';
import { bulk, renewContract } from '$app/common/queries/contracts';
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
  'contract_number',
  'name',
  'client',
  'contract_type',
  'start_date',
  'end_date',
  'contract_value',
  'status',
];

export function useAllContractColumns() {
  const contractColumns = [
    'contract_number',
    'name',
    'client',
    'contract_type',
    'status',
    'start_date',
    'end_date',
    'contract_value',
    'billing_frequency',
    'auto_renew',
    'created_at',
    'updated_at',
    'archived_at',
    'entity_state',
    'is_deleted',
  ] as const;

  return contractColumns;
}

const getStatusColor = (status: ContractStatus) => {
  switch (status) {
    case 'draft':
      return 'gray';
    case 'pending':
      return 'yellow';
    case 'active':
      return 'green';
    case 'expired':
      return 'red';
    case 'cancelled':
      return 'black';
    default:
      return 'gray';
  }
};

export function useContractColumns() {
  const { t } = useTranslation();

  const contractColumns = useAllContractColumns();
  type ContractColumns = (typeof contractColumns)[number];

  const { dateFormat } = useCurrentCompanyDateFormats();
  const formatMoney = useFormatMoney();

  const reactSettings = useReactSettings();
  const disableNavigation = useDisableNavigation();

  const columns: DataTableColumnsExtended<Contract, ContractColumns> = [
    {
      column: 'contract_number',
      id: 'contract_number',
      label: t('contract_number'),
      format: (value, contract) => (
        <span className="inline-flex items-center space-x-4">
          <EntityStatus entity={contract} />

          <DynamicLink
            to={route('/contracts/:id/edit', { id: contract.id })}
            renderSpan={disableNavigation('contract', contract)}
          >
            {value}
          </DynamicLink>
        </span>
      ),
    },
    {
      column: 'name',
      id: 'name',
      label: t('name'),
    },
    {
      column: 'client',
      id: 'client_id',
      label: t('client'),
      format: (_, contract) =>
        contract.client && (
          <DynamicLink
            to={route('/clients/:id', { id: contract.client_id })}
            renderSpan={disableNavigation('client', contract.client)}
          >
            {contract.client.display_name}
          </DynamicLink>
        ),
    },
    {
      column: 'contract_type',
      id: 'contract_type',
      label: t('contract_type'),
      format: (value) => t(value as string),
    },
    {
      column: 'status',
      id: 'status',
      label: t('status'),
      format: (value) => (
        <Badge variant={getStatusColor(value as ContractStatus)}>
          {t(value as string)}
        </Badge>
      ),
    },
    {
      column: 'start_date',
      id: 'start_date',
      label: t('start_date'),
      format: (value) => date(value, dateFormat),
    },
    {
      column: 'end_date',
      id: 'end_date',
      label: t('end_date'),
      format: (value) => date(value, dateFormat),
    },
    {
      column: 'contract_value',
      id: 'contract_value',
      label: t('contract_value'),
      format: (value, contract) =>
        formatMoney(
          value as number,
          contract.client?.country_id,
          contract.client?.settings?.currency_id
        ),
    },
    {
      column: 'billing_frequency',
      id: 'billing_frequency',
      label: t('billing_frequency'),
      format: (value) => t(value as string),
    },
    {
      column: 'auto_renew',
      id: 'auto_renew',
      label: t('auto_renew'),
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
      format: (value, contract) => <EntityStatus entity={contract} />,
    },
    {
      column: 'is_deleted',
      id: 'is_deleted',
      label: t('is_deleted'),
      format: (value, contract) =>
        contract.is_deleted ? t('yes') : t('no'),
    },
  ];

  const list: string[] =
    reactSettings?.react_table_columns?.contract || defaultColumns;

  return columns
    .filter((column) => list.includes(column.column))
    .sort((a, b) => list.indexOf(a.column) - list.indexOf(b.column));
}

export function useActions() {
  const [t] = useTranslation();

  const navigate = useNavigate();

  const hasPermission = useHasPermission();

  const setContract = useSetAtom(contractAtom);

  const { isEditPage } = useEntityPageIdentifier({
    entity: 'contract',
    editPageTabs: ['documents'],
  });

  const cloneToContract = (contract: Contract) => {
    setContract({ ...contract, id: '', documents: [], items: [], renewals: [] });

    navigate('/contracts/create?action=clone');
  };

  const handleRenew = (contract: Contract) => {
    toast.processing();

    renewContract(contract.id).then(() => {
      toast.success('renewed_contract');
      $refetch(['contracts']);
    });
  };

  const handleResourcefulAction = (
    action: 'archive' | 'restore' | 'delete',
    id: string
  ) => {
    toast.processing();

    bulk([id], action).then(() => {
      toast.success(`${action}d_contract`);

      $refetch(['contracts']);
    });
  };

  const actions = [
    (contract: Contract) =>
      !contract.is_deleted &&
      contract.status === 'active' &&
      hasPermission('edit_contract') && (
        <DropdownElement
          onClick={() => handleRenew(contract)}
          icon={<Icon element={MdAutorenew} />}
        >
          {t('renew')}
        </DropdownElement>
      ),
    (contract: Contract) =>
      !contract.is_deleted &&
      hasPermission('create_contract') && (
        <DropdownElement
          onClick={() => cloneToContract(contract)}
          icon={<Icon element={MdControlPointDuplicate} />}
        >
          {t('clone')}
        </DropdownElement>
      ),
    () => isEditPage && <Divider withoutPadding />,
    (contract: Contract) =>
      getEntityState(contract) === EntityState.Active &&
      isEditPage && (
        <DropdownElement
          onClick={() => handleResourcefulAction('archive', contract.id)}
          icon={<Icon element={MdArchive} />}
        >
          {t('archive')}
        </DropdownElement>
      ),
    (contract: Contract) =>
      (getEntityState(contract) === EntityState.Archived ||
        getEntityState(contract) === EntityState.Deleted) &&
      isEditPage && (
        <DropdownElement
          onClick={() => handleResourcefulAction('restore', contract.id)}
          icon={<Icon element={MdRestore} />}
        >
          {t('restore')}
        </DropdownElement>
      ),
    (contract: Contract) =>
      (getEntityState(contract) === EntityState.Active ||
        getEntityState(contract) === EntityState.Archived) &&
      isEditPage && (
        <DropdownElement
          onClick={() => handleResourcefulAction('delete', contract.id)}
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
  setContract: Dispatch<SetStateAction<Contract | undefined>>;
}

export function useHandleChange(params: Params) {
  const { setErrors, setContract } = params;

  return (property: keyof Contract, value: Contract[keyof Contract]) => {
    setErrors(undefined);

    setContract((contract) => contract && { ...contract, [property]: value });
  };
}

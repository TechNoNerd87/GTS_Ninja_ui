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
import { ServiceOrder, ServiceOrderPriority } from '$app/common/interfaces/service-order';
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
  MdReceipt,
} from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { serviceOrderAtom } from './atoms';
import { bulk, createInvoiceFromServiceOrder } from '$app/common/queries/service-orders';
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
  'order_number',
  'title',
  'client',
  'equipment',
  'priority',
  'status',
  'due_date',
  'total_cost',
];

export function useAllServiceOrderColumns() {
  const serviceOrderColumns = [
    'order_number',
    'title',
    'client',
    'equipment',
    'contract',
    'priority',
    'status',
    'order_date',
    'due_date',
    'scheduled_start_date',
    'completed_date',
    'total_labor_cost',
    'total_parts_cost',
    'total_cost',
    'created_at',
    'updated_at',
    'archived_at',
    'entity_state',
    'is_deleted',
  ] as const;

  return serviceOrderColumns;
}

const getPriorityColor = (priority: ServiceOrderPriority) => {
  switch (priority) {
    case 'low':
      return 'generic';
    case 'medium':
      return 'blue';
    case 'high':
      return 'orange';
    case 'urgent':
      return 'red';
    default:
      return 'generic';
  }
};

export function useServiceOrderColumns() {
  const { t } = useTranslation();

  const serviceOrderColumns = useAllServiceOrderColumns();
  type ServiceOrderColumns = (typeof serviceOrderColumns)[number];

  const { dateFormat } = useCurrentCompanyDateFormats();
  const formatMoney = useFormatMoney();

  const reactSettings = useReactSettings();
  const disableNavigation = useDisableNavigation();

  const columns: DataTableColumnsExtended<ServiceOrder, ServiceOrderColumns> = [
    {
      column: 'order_number',
      id: 'order_number',
      label: t('order_number'),
      format: (value, serviceOrder) => (
        <span className="inline-flex items-center space-x-4">
          <EntityStatus entity={serviceOrder} />

          <DynamicLink
            to={route('/service_orders/:id/edit', { id: serviceOrder.id })}
            renderSpan={disableNavigation('service_order', serviceOrder)}
          >
            {value}
          </DynamicLink>
        </span>
      ),
    },
    {
      column: 'title',
      id: 'title',
      label: t('title'),
    },
    {
      column: 'client',
      id: 'client_id',
      label: t('client'),
      format: (_, serviceOrder) =>
        serviceOrder.client && (
          <DynamicLink
            to={route('/clients/:id', { id: serviceOrder.client_id })}
            renderSpan={disableNavigation('client', serviceOrder.client)}
          >
            {serviceOrder.client.display_name}
          </DynamicLink>
        ),
    },
    {
      column: 'equipment',
      id: 'equipment_id',
      label: t('equipment'),
      format: (_, serviceOrder) =>
        serviceOrder.equipment && (
          <DynamicLink
            to={route('/equipment/:id/edit', { id: serviceOrder.equipment_id })}
            renderSpan={disableNavigation('equipment', serviceOrder.equipment)}
          >
            {serviceOrder.equipment.name}
          </DynamicLink>
        ),
    },
    {
      column: 'contract',
      id: 'contract_id',
      label: t('contract'),
      format: (_, serviceOrder) =>
        serviceOrder.contract && (
          <DynamicLink
            to={route('/contracts/:id/edit', { id: serviceOrder.contract_id })}
            renderSpan={disableNavigation('contract', serviceOrder.contract)}
          >
            {serviceOrder.contract.name}
          </DynamicLink>
        ),
    },
    {
      column: 'priority',
      id: 'priority',
      label: t('priority'),
      format: (value) => (
        <Badge variant={getPriorityColor(value as ServiceOrderPriority)}>
          {t(value as string)}
        </Badge>
      ),
    },
    {
      column: 'status',
      id: 'status_id',
      label: t('status'),
      format: (_, serviceOrder) =>
        serviceOrder.status && (
          <Badge
            style={{ backgroundColor: serviceOrder.status.color }}
          >
            {serviceOrder.status.name}
          </Badge>
        ),
    },
    {
      column: 'order_date',
      id: 'order_date',
      label: t('order_date'),
      format: (value) => date(value, dateFormat),
    },
    {
      column: 'due_date',
      id: 'due_date',
      label: t('due_date'),
      format: (value) => date(value, dateFormat),
    },
    {
      column: 'scheduled_start_date',
      id: 'scheduled_start_date',
      label: t('scheduled_start_date'),
      format: (value) => date(value, dateFormat),
    },
    {
      column: 'completed_date',
      id: 'completed_date',
      label: t('completed_date'),
      format: (value) => date(value, dateFormat),
    },
    {
      column: 'total_labor_cost',
      id: 'total_labor_cost',
      label: t('total_labor_cost'),
      format: (value, serviceOrder) =>
        formatMoney(
          value as number,
          serviceOrder.client?.country_id,
          serviceOrder.client?.settings?.currency_id
        ),
    },
    {
      column: 'total_parts_cost',
      id: 'total_parts_cost',
      label: t('total_parts_cost'),
      format: (value, serviceOrder) =>
        formatMoney(
          value as number,
          serviceOrder.client?.country_id,
          serviceOrder.client?.settings?.currency_id
        ),
    },
    {
      column: 'total_cost',
      id: 'total_cost',
      label: t('total_cost'),
      format: (value, serviceOrder) =>
        formatMoney(
          value as number,
          serviceOrder.client?.country_id,
          serviceOrder.client?.settings?.currency_id
        ),
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
      format: (value, serviceOrder) => <EntityStatus entity={serviceOrder} />,
    },
    {
      column: 'is_deleted',
      id: 'is_deleted',
      label: t('is_deleted'),
      format: (value, serviceOrder) =>
        serviceOrder.is_deleted ? t('yes') : t('no'),
    },
  ];

  const list: string[] =
    reactSettings?.react_table_columns?.service_order || defaultColumns;

  return columns
    .filter((column) => list.includes(column.column))
    .sort((a, b) => list.indexOf(a.column) - list.indexOf(b.column));
}

export function useActions() {
  const [t] = useTranslation();

  const navigate = useNavigate();

  const hasPermission = useHasPermission();

  const setServiceOrder = useSetAtom(serviceOrderAtom);

  const { isEditPage } = useEntityPageIdentifier({
    entity: 'service_order',
    editPageTabs: ['documents'],
  });

  const cloneToServiceOrder = (serviceOrder: ServiceOrder) => {
    setServiceOrder({
      ...serviceOrder,
      id: '',
      documents: [],
      labor_entries: [],
      parts: [],
    });

    navigate('/service_orders/create?action=clone');
  };

  const handleCreateInvoice = (serviceOrder: ServiceOrder) => {
    toast.processing();

    createInvoiceFromServiceOrder(serviceOrder.id).then((response) => {
      toast.success('created_invoice');
      navigate(route('/invoices/:id/edit', { id: response.data.data.id }));
    });
  };

  const handleResourcefulAction = (
    action: 'archive' | 'restore' | 'delete',
    id: string
  ) => {
    toast.processing();

    bulk([id], action).then(() => {
      toast.success(`${action}d_service_order`);

      $refetch(['service_orders']);
    });
  };

  const actions = [
    (serviceOrder: ServiceOrder) =>
      !serviceOrder.is_deleted &&
      hasPermission('create_invoice') && (
        <DropdownElement
          onClick={() => handleCreateInvoice(serviceOrder)}
          icon={<Icon element={MdReceipt} />}
        >
          {t('create_invoice')}
        </DropdownElement>
      ),
    (serviceOrder: ServiceOrder) =>
      !serviceOrder.is_deleted &&
      hasPermission('create_service_order') && (
        <DropdownElement
          onClick={() => cloneToServiceOrder(serviceOrder)}
          icon={<Icon element={MdControlPointDuplicate} />}
        >
          {t('clone')}
        </DropdownElement>
      ),
    () => isEditPage && <Divider withoutPadding />,
    (serviceOrder: ServiceOrder) =>
      getEntityState(serviceOrder) === EntityState.Active &&
      isEditPage && (
        <DropdownElement
          onClick={() => handleResourcefulAction('archive', serviceOrder.id)}
          icon={<Icon element={MdArchive} />}
        >
          {t('archive')}
        </DropdownElement>
      ),
    (serviceOrder: ServiceOrder) =>
      (getEntityState(serviceOrder) === EntityState.Archived ||
        getEntityState(serviceOrder) === EntityState.Deleted) &&
      isEditPage && (
        <DropdownElement
          onClick={() => handleResourcefulAction('restore', serviceOrder.id)}
          icon={<Icon element={MdRestore} />}
        >
          {t('restore')}
        </DropdownElement>
      ),
    (serviceOrder: ServiceOrder) =>
      (getEntityState(serviceOrder) === EntityState.Active ||
        getEntityState(serviceOrder) === EntityState.Archived) &&
      isEditPage && (
        <DropdownElement
          onClick={() => handleResourcefulAction('delete', serviceOrder.id)}
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
  setServiceOrder: Dispatch<SetStateAction<ServiceOrder | undefined>>;
}

export function useHandleChange(params: Params) {
  const { setErrors, setServiceOrder } = params;

  return (property: keyof ServiceOrder, value: ServiceOrder[keyof ServiceOrder]) => {
    setErrors(undefined);

    setServiceOrder((serviceOrder) => serviceOrder && { ...serviceOrder, [property]: value });
  };
}

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
import { TechnicianSchedule, TechnicianScheduleStatus } from '$app/common/interfaces/technician-schedule';
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
} from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { technicianScheduleAtom } from './atoms';
import { bulk } from '$app/common/queries/technician-schedules';
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
  'title',
  'user',
  'service_order',
  'scheduled_start',
  'scheduled_end',
  'status',
];

export function useAllTechnicianScheduleColumns() {
  const technicianScheduleColumns = [
    'title',
    'user',
    'service_order',
    'scheduled_start',
    'scheduled_end',
    'actual_start',
    'actual_end',
    'status',
    'created_at',
    'updated_at',
    'archived_at',
    'entity_state',
    'is_deleted',
  ] as const;

  return technicianScheduleColumns;
}

const getStatusColor = (status: TechnicianScheduleStatus) => {
  switch (status) {
    case 'scheduled':
      return 'blue';
    case 'in_progress':
      return 'yellow';
    case 'completed':
      return 'green';
    case 'cancelled':
      return 'red';
    default:
      return 'generic';
  }
};

export function useTechnicianScheduleColumns() {
  const { t } = useTranslation();

  const technicianScheduleColumns = useAllTechnicianScheduleColumns();
  type TechnicianScheduleColumns = (typeof technicianScheduleColumns)[number];

  const { dateFormat } = useCurrentCompanyDateFormats();

  const reactSettings = useReactSettings();
  const disableNavigation = useDisableNavigation();

  const columns: DataTableColumnsExtended<TechnicianSchedule, TechnicianScheduleColumns> = [
    {
      column: 'title',
      id: 'title',
      label: t('title'),
      format: (value, schedule) => (
        <span className="inline-flex items-center space-x-4">
          <EntityStatus entity={schedule} />

          <DynamicLink
            to={route('/technician_schedules/:id/edit', { id: schedule.id })}
            renderSpan={disableNavigation('technician_schedule', schedule)}
          >
            {value}
          </DynamicLink>
        </span>
      ),
    },
    {
      column: 'user',
      id: 'user_id',
      label: t('technician'),
      format: (_, schedule) =>
        schedule.user && (
          <span>{schedule.user.first_name} {schedule.user.last_name}</span>
        ),
    },
    {
      column: 'service_order',
      id: 'service_order_id',
      label: t('service_order'),
      format: (_, schedule) =>
        schedule.service_order && (
          <DynamicLink
            to={route('/service_orders/:id/edit', { id: schedule.service_order_id })}
            renderSpan={disableNavigation('service_order', schedule.service_order)}
          >
            {schedule.service_order.title}
          </DynamicLink>
        ),
    },
    {
      column: 'scheduled_start',
      id: 'scheduled_start',
      label: t('scheduled_start'),
      format: (value) => date(value, dateFormat + ' HH:mm'),
    },
    {
      column: 'scheduled_end',
      id: 'scheduled_end',
      label: t('scheduled_end'),
      format: (value) => date(value, dateFormat + ' HH:mm'),
    },
    {
      column: 'actual_start',
      id: 'actual_start',
      label: t('actual_start'),
      format: (value) => date(value, dateFormat + ' HH:mm'),
    },
    {
      column: 'actual_end',
      id: 'actual_end',
      label: t('actual_end'),
      format: (value) => date(value, dateFormat + ' HH:mm'),
    },
    {
      column: 'status',
      id: 'status',
      label: t('status'),
      format: (value) => (
        <Badge variant={getStatusColor(value as TechnicianScheduleStatus)}>
          {t(value as string)}
        </Badge>
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
      format: (value, schedule) => <EntityStatus entity={schedule} />,
    },
    {
      column: 'is_deleted',
      id: 'is_deleted',
      label: t('is_deleted'),
      format: (value, schedule) =>
        schedule.is_deleted ? t('yes') : t('no'),
    },
  ];

  const list: string[] =
    reactSettings?.react_table_columns?.technician_schedule || defaultColumns;

  return columns
    .filter((column) => list.includes(column.column))
    .sort((a, b) => list.indexOf(a.column) - list.indexOf(b.column));
}

export function useActions() {
  const [t] = useTranslation();

  const navigate = useNavigate();

  const hasPermission = useHasPermission();

  const setTechnicianSchedule = useSetAtom(technicianScheduleAtom);

  const { isEditPage } = useEntityPageIdentifier({
    entity: 'technician_schedule',
  });

  const cloneToTechnicianSchedule = (schedule: TechnicianSchedule) => {
    setTechnicianSchedule({ ...schedule, id: '' });

    navigate('/technician_schedules/create?action=clone');
  };

  const handleResourcefulAction = (
    action: 'archive' | 'restore' | 'delete',
    id: string
  ) => {
    toast.processing();

    bulk([id], action).then(() => {
      toast.success(`${action}d_technician_schedule`);

      $refetch(['technician_schedules']);
    });
  };

  const actions = [
    (schedule: TechnicianSchedule) =>
      !schedule.is_deleted &&
      hasPermission('create_technician_schedule') && (
        <DropdownElement
          onClick={() => cloneToTechnicianSchedule(schedule)}
          icon={<Icon element={MdControlPointDuplicate} />}
        >
          {t('clone')}
        </DropdownElement>
      ),
    () => isEditPage && <Divider withoutPadding />,
    (schedule: TechnicianSchedule) =>
      getEntityState(schedule) === EntityState.Active &&
      isEditPage && (
        <DropdownElement
          onClick={() => handleResourcefulAction('archive', schedule.id)}
          icon={<Icon element={MdArchive} />}
        >
          {t('archive')}
        </DropdownElement>
      ),
    (schedule: TechnicianSchedule) =>
      (getEntityState(schedule) === EntityState.Archived ||
        getEntityState(schedule) === EntityState.Deleted) &&
      isEditPage && (
        <DropdownElement
          onClick={() => handleResourcefulAction('restore', schedule.id)}
          icon={<Icon element={MdRestore} />}
        >
          {t('restore')}
        </DropdownElement>
      ),
    (schedule: TechnicianSchedule) =>
      (getEntityState(schedule) === EntityState.Active ||
        getEntityState(schedule) === EntityState.Archived) &&
      isEditPage && (
        <DropdownElement
          onClick={() => handleResourcefulAction('delete', schedule.id)}
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
  setTechnicianSchedule: Dispatch<SetStateAction<TechnicianSchedule | undefined>>;
}

export function useHandleChange(params: Params) {
  const { setErrors, setTechnicianSchedule } = params;

  return (property: keyof TechnicianSchedule, value: TechnicianSchedule[keyof TechnicianSchedule]) => {
    setErrors(undefined);

    setTechnicianSchedule((schedule) => schedule && { ...schedule, [property]: value });
  };
}

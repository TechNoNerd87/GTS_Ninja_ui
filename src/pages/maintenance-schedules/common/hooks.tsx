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
import { MaintenanceSchedule } from '$app/common/interfaces/maintenance-schedule';
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
import { maintenanceScheduleAtom } from './atoms';
import { bulk } from '$app/common/queries/maintenance-schedules';
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
  'equipment',
  'frequency_type',
  'next_due_date',
  'is_active',
];

export function useAllMaintenanceScheduleColumns() {
  const maintenanceScheduleColumns = [
    'name',
    'equipment',
    'frequency_type',
    'frequency_interval',
    'last_completed_date',
    'next_due_date',
    'estimated_duration',
    'is_active',
    'created_at',
    'updated_at',
    'archived_at',
    'entity_state',
    'is_deleted',
  ] as const;

  return maintenanceScheduleColumns;
}

export function useMaintenanceScheduleColumns() {
  const { t } = useTranslation();

  const maintenanceScheduleColumns = useAllMaintenanceScheduleColumns();
  type MaintenanceScheduleColumns = (typeof maintenanceScheduleColumns)[number];

  const { dateFormat } = useCurrentCompanyDateFormats();

  const reactSettings = useReactSettings();
  const disableNavigation = useDisableNavigation();

  const columns: DataTableColumnsExtended<MaintenanceSchedule, MaintenanceScheduleColumns> = [
    {
      column: 'name',
      id: 'name',
      label: t('name'),
      format: (value, schedule) => (
        <span className="inline-flex items-center space-x-4">
          <EntityStatus entity={schedule} />

          <DynamicLink
            to={route('/maintenance_schedules/:id/edit', { id: schedule.id })}
            renderSpan={disableNavigation('maintenance_schedule', schedule)}
          >
            {value}
          </DynamicLink>
        </span>
      ),
    },
    {
      column: 'equipment',
      id: 'equipment_id',
      label: t('equipment'),
      format: (_, schedule) =>
        schedule.equipment && (
          <DynamicLink
            to={route('/equipment/:id/edit', { id: schedule.equipment_id })}
            renderSpan={disableNavigation('equipment', schedule.equipment)}
          >
            {schedule.equipment.name}
          </DynamicLink>
        ),
    },
    {
      column: 'frequency_type',
      id: 'frequency_type',
      label: t('frequency_type'),
      format: (value) => t(value as string),
    },
    {
      column: 'frequency_interval',
      id: 'frequency_interval',
      label: t('frequency_interval'),
    },
    {
      column: 'last_completed_date',
      id: 'last_completed_date',
      label: t('last_completed_date'),
      format: (value) => date(value, dateFormat),
    },
    {
      column: 'next_due_date',
      id: 'next_due_date',
      label: t('next_due_date'),
      format: (value) => date(value, dateFormat),
    },
    {
      column: 'estimated_duration',
      id: 'estimated_duration',
      label: t('estimated_duration'),
      format: (value) => value ? `${value} ${t('minutes')}` : '',
    },
    {
      column: 'is_active',
      id: 'is_active',
      label: t('is_active'),
      format: (value) => (
        <Badge variant={value ? 'green' : 'generic'}>
          {value ? t('active') : t('inactive')}
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
    reactSettings?.react_table_columns?.maintenance_schedule || defaultColumns;

  return columns
    .filter((column) => list.includes(column.column))
    .sort((a, b) => list.indexOf(a.column) - list.indexOf(b.column));
}

export function useActions() {
  const [t] = useTranslation();

  const navigate = useNavigate();

  const hasPermission = useHasPermission();

  const setMaintenanceSchedule = useSetAtom(maintenanceScheduleAtom);

  const { isEditPage } = useEntityPageIdentifier({
    entity: 'maintenance_schedule',
  });

  const cloneToMaintenanceSchedule = (schedule: MaintenanceSchedule) => {
    setMaintenanceSchedule({ ...schedule, id: '' });

    navigate('/maintenance_schedules/create?action=clone');
  };

  const handleResourcefulAction = (
    action: 'archive' | 'restore' | 'delete',
    id: string
  ) => {
    toast.processing();

    bulk([id], action).then(() => {
      toast.success(`${action}d_maintenance_schedule`);

      $refetch(['maintenance_schedules']);
    });
  };

  const actions = [
    (schedule: MaintenanceSchedule) =>
      !schedule.is_deleted &&
      hasPermission('create_maintenance_schedule') && (
        <DropdownElement
          onClick={() => cloneToMaintenanceSchedule(schedule)}
          icon={<Icon element={MdControlPointDuplicate} />}
        >
          {t('clone')}
        </DropdownElement>
      ),
    () => isEditPage && <Divider withoutPadding />,
    (schedule: MaintenanceSchedule) =>
      getEntityState(schedule) === EntityState.Active &&
      isEditPage && (
        <DropdownElement
          onClick={() => handleResourcefulAction('archive', schedule.id)}
          icon={<Icon element={MdArchive} />}
        >
          {t('archive')}
        </DropdownElement>
      ),
    (schedule: MaintenanceSchedule) =>
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
    (schedule: MaintenanceSchedule) =>
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
  setMaintenanceSchedule: Dispatch<SetStateAction<MaintenanceSchedule | undefined>>;
}

export function useHandleChange(params: Params) {
  const { setErrors, setMaintenanceSchedule } = params;

  return (property: keyof MaintenanceSchedule, value: MaintenanceSchedule[keyof MaintenanceSchedule]) => {
    setErrors(undefined);

    setMaintenanceSchedule((schedule) => schedule && { ...schedule, [property]: value });
  };
}

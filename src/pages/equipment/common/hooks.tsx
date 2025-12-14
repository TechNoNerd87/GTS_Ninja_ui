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
import { Equipment } from '$app/common/interfaces/equipment';
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
import { equipmentAtom } from './atoms';
import { bulk } from '$app/common/queries/equipment';
import { Divider } from '$app/components/cards/Divider';
import { useSetAtom } from 'jotai';
import { useReactSettings } from '$app/common/hooks/useReactSettings';
import { useEntityPageIdentifier } from '$app/common/hooks/useEntityPageIdentifier';
import { $refetch } from '$app/common/hooks/useRefetch';
import { useHasPermission } from '$app/common/hooks/permissions/useHasPermission';
import { useDisableNavigation } from '$app/common/hooks/useDisableNavigation';
import { DynamicLink } from '$app/components/DynamicLink';

export const defaultColumns: string[] = [
  'name',
  'serial_number',
  'client',
  'status',
  'warranty_expiration',
];

export function useAllEquipmentColumns() {
  const equipmentColumns = [
    'name',
    'serial_number',
    'model_number',
    'manufacturer',
    'client',
    'location',
    'status',
    'purchase_date',
    'warranty_expiration',
    'created_at',
    'updated_at',
    'archived_at',
    'entity_state',
    'is_deleted',
  ] as const;

  return equipmentColumns;
}

export function useEquipmentColumns() {
  const { t } = useTranslation();

  const equipmentColumns = useAllEquipmentColumns();
  type EquipmentColumns = (typeof equipmentColumns)[number];

  const { dateFormat } = useCurrentCompanyDateFormats();

  const reactSettings = useReactSettings();
  const disableNavigation = useDisableNavigation();

  const columns: DataTableColumnsExtended<Equipment, EquipmentColumns> = [
    {
      column: 'name',
      id: 'name',
      label: t('name'),
      format: (value, equipment) => (
        <span className="inline-flex items-center space-x-4">
          <EntityStatus entity={equipment} />

          <DynamicLink
            to={route('/equipment/:id/edit', { id: equipment.id })}
            renderSpan={disableNavigation('equipment', equipment)}
          >
            {value}
          </DynamicLink>
        </span>
      ),
    },
    {
      column: 'serial_number',
      id: 'serial_number',
      label: t('serial_number'),
    },
    {
      column: 'model_number',
      id: 'model_number',
      label: t('model_number'),
    },
    {
      column: 'manufacturer',
      id: 'manufacturer',
      label: t('manufacturer'),
    },
    {
      column: 'client',
      id: 'client_id',
      label: t('client'),
      format: (_, equipment) =>
        equipment.client && (
          <DynamicLink
            to={route('/clients/:id', { id: equipment.client_id })}
            renderSpan={disableNavigation('client', equipment.client)}
          >
            {equipment.client.display_name}
          </DynamicLink>
        ),
    },
    {
      column: 'location',
      id: 'location_id',
      label: t('location'),
      format: (_, equipment) => equipment.location?.name,
    },
    {
      column: 'status',
      id: 'status',
      label: t('status'),
      format: (value) => t(value as string),
    },
    {
      column: 'purchase_date',
      id: 'purchase_date',
      label: t('purchase_date'),
      format: (value) => date(value, dateFormat),
    },
    {
      column: 'warranty_expiration',
      id: 'warranty_expiration',
      label: t('warranty_expiration'),
      format: (value) => date(value, dateFormat),
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
      format: (value, equipment) => <EntityStatus entity={equipment} />,
    },
    {
      column: 'is_deleted',
      id: 'is_deleted',
      label: t('is_deleted'),
      format: (value, equipment) =>
        equipment.is_deleted ? t('yes') : t('no'),
    },
  ];

  const list: string[] =
    reactSettings?.react_table_columns?.equipment || defaultColumns;

  return columns
    .filter((column) => list.includes(column.column))
    .sort((a, b) => list.indexOf(a.column) - list.indexOf(b.column));
}

export function useActions() {
  const [t] = useTranslation();

  const navigate = useNavigate();

  const hasPermission = useHasPermission();

  const setEquipment = useSetAtom(equipmentAtom);

  const { isEditPage } = useEntityPageIdentifier({
    entity: 'equipment',
    editPageTabs: ['documents'],
  });

  const cloneToEquipment = (equipment: Equipment) => {
    setEquipment({ ...equipment, id: '', documents: [] });

    navigate('/equipment/create?action=clone');
  };

  const handleResourcefulAction = (
    action: 'archive' | 'restore' | 'delete',
    id: string
  ) => {
    toast.processing();

    bulk([id], action).then(() => {
      toast.success(`${action}d_equipment`);

      $refetch(['equipment']);
    });
  };

  const actions = [
    (equipment: Equipment) =>
      !equipment.is_deleted &&
      hasPermission('create_equipment') && (
        <DropdownElement
          onClick={() => cloneToEquipment(equipment)}
          icon={<Icon element={MdControlPointDuplicate} />}
        >
          {t('clone')}
        </DropdownElement>
      ),
    () => isEditPage && <Divider withoutPadding />,
    (equipment: Equipment) =>
      getEntityState(equipment) === EntityState.Active &&
      isEditPage && (
        <DropdownElement
          onClick={() => handleResourcefulAction('archive', equipment.id)}
          icon={<Icon element={MdArchive} />}
        >
          {t('archive')}
        </DropdownElement>
      ),
    (equipment: Equipment) =>
      (getEntityState(equipment) === EntityState.Archived ||
        getEntityState(equipment) === EntityState.Deleted) &&
      isEditPage && (
        <DropdownElement
          onClick={() => handleResourcefulAction('restore', equipment.id)}
          icon={<Icon element={MdRestore} />}
        >
          {t('restore')}
        </DropdownElement>
      ),
    (equipment: Equipment) =>
      (getEntityState(equipment) === EntityState.Active ||
        getEntityState(equipment) === EntityState.Archived) &&
      isEditPage && (
        <DropdownElement
          onClick={() => handleResourcefulAction('delete', equipment.id)}
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
  setEquipment: Dispatch<SetStateAction<Equipment | undefined>>;
}

export function useHandleChange(params: Params) {
  const { setErrors, setEquipment } = params;

  return (property: keyof Equipment, value: Equipment[keyof Equipment]) => {
    setErrors(undefined);

    setEquipment((equipment) => equipment && { ...equipment, [property]: value });
  };
}

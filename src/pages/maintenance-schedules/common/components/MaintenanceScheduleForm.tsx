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
import { InputField, SelectField } from '$app/components/forms';
import { Element } from '$app/components/cards';
import { MaintenanceSchedule, FrequencyType } from '$app/common/interfaces/maintenance-schedule';
import { ValidationBag } from '$app/common/interfaces/validation-bag';
import { EntityStatus } from '$app/components/EntityStatus';
import { EquipmentSelector } from '$app/components/equipment/EquipmentSelector';
import { Toggle } from '$app/components/forms/Toggle';
import { NumberInputField } from '$app/components/forms/NumberInputField';

interface Props {
  type?: 'create' | 'edit';
  maintenanceSchedule: MaintenanceSchedule;
  errors: ValidationBag | undefined;
  handleChange: (
    property: keyof MaintenanceSchedule,
    value: MaintenanceSchedule[keyof MaintenanceSchedule]
  ) => void;
}

export function MaintenanceScheduleForm(props: Props) {
  const [t] = useTranslation();

  const { errors, handleChange, type, maintenanceSchedule } = props;

  const frequencyTypeOptions: { value: FrequencyType; label: string }[] = [
    { value: 'daily', label: t('daily') },
    { value: 'weekly', label: t('weekly') },
    { value: 'monthly', label: t('monthly') },
    { value: 'quarterly', label: t('quarterly') },
    { value: 'yearly', label: t('yearly') },
  ];

  return (
    <>
      {type === 'edit' && (
        <Element leftSide={t('status')}>
          <EntityStatus entity={maintenanceSchedule} />
        </Element>
      )}

      <Element leftSide={t('name')} required>
        <InputField
          required
          value={maintenanceSchedule.name}
          onValueChange={(value) => handleChange('name', value)}
          errorMessage={errors?.errors.name}
        />
      </Element>

      <Element leftSide={t('equipment')} required>
        <EquipmentSelector
          value={maintenanceSchedule.equipment_id}
          onChange={(equipment) => handleChange('equipment_id', equipment.id)}
          onClearButtonClick={() => handleChange('equipment_id', '')}
          errorMessage={errors?.errors.equipment_id}
        />
      </Element>

      <Element leftSide={t('frequency_type')}>
        <SelectField
          value={maintenanceSchedule.frequency_type}
          onValueChange={(value) => handleChange('frequency_type', value as FrequencyType)}
          errorMessage={errors?.errors.frequency_type}
        >
          {frequencyTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </SelectField>
      </Element>

      <Element leftSide={t('frequency_interval')}>
        <NumberInputField
          value={maintenanceSchedule.frequency_interval}
          onValueChange={(value) => handleChange('frequency_interval', parseInt(value) || 1)}
          errorMessage={errors?.errors.frequency_interval}
        />
      </Element>

      <Element leftSide={t('last_completed_date')}>
        <InputField
          type="date"
          value={maintenanceSchedule.last_completed_date}
          onValueChange={(value) => handleChange('last_completed_date', value)}
          errorMessage={errors?.errors.last_completed_date}
        />
      </Element>

      <Element leftSide={t('next_due_date')}>
        <InputField
          type="date"
          value={maintenanceSchedule.next_due_date}
          onValueChange={(value) => handleChange('next_due_date', value)}
          errorMessage={errors?.errors.next_due_date}
        />
      </Element>

      <Element leftSide={t('estimated_duration')}>
        <NumberInputField
          value={maintenanceSchedule.estimated_duration}
          onValueChange={(value) => handleChange('estimated_duration', parseInt(value) || 0)}
          errorMessage={errors?.errors.estimated_duration}
        />
        <span className="text-xs text-gray-500 mt-1">{t('minutes')}</span>
      </Element>

      <Element leftSide={t('is_active')}>
        <Toggle
          checked={maintenanceSchedule.is_active}
          onValueChange={(value) => handleChange('is_active', value)}
        />
      </Element>

      <Element leftSide={t('notes')}>
        <InputField
          element="textarea"
          value={maintenanceSchedule.notes}
          onValueChange={(value) => handleChange('notes', value)}
          errorMessage={errors?.errors.notes}
        />
      </Element>
    </>
  );
}

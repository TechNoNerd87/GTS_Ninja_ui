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
import { Card } from '$app/components/cards';
import { MaintenanceSchedule, FrequencyType, MeterType } from '$app/common/interfaces/maintenance-schedule';
import { ValidationBag } from '$app/common/interfaces/validation-bag';
import { EntityStatus } from '$app/components/EntityStatus';
import { EquipmentSelector } from '$app/components/equipment/EquipmentSelector';
import { ClientSelector } from '$app/components/clients/ClientSelector';
import Toggle from '$app/components/forms/Toggle';
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
    { value: 'meter_based', label: t('meter_based') },
  ];

  const meterTypeOptions: { value: MeterType; label: string }[] = [
    { value: 'hours', label: t('hours') },
    { value: 'miles', label: t('miles') },
    { value: 'kilometers', label: t('kilometers') },
    { value: 'cycles', label: t('cycles') },
    { value: 'units', label: t('units') },
  ];

  const isMeterBased = maintenanceSchedule.frequency_type === 'meter_based';

  return (
    <div className="grid grid-cols-12 gap-4">
      {/* Basic Information */}
      <Card className="col-span-12 lg:col-span-6" title={t('details')}>
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

        <Element leftSide={t('schedule_number')}>
          <InputField
            value={maintenanceSchedule.number}
            onValueChange={(value) => handleChange('number', value)}
            errorMessage={errors?.errors.number}
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

        <Element leftSide={t('client')}>
          <ClientSelector
            value={maintenanceSchedule.client_id}
            onChange={(client) => handleChange('client_id', client.id)}
            onClearButtonClick={() => handleChange('client_id', '')}
            errorMessage={errors?.errors.client_id}
          />
        </Element>

        <Element leftSide={t('description')}>
          <InputField
            element="textarea"
            value={maintenanceSchedule.description}
            onValueChange={(value) => handleChange('description', value)}
            errorMessage={errors?.errors.description}
          />
        </Element>
      </Card>

      {/* Schedule Frequency */}
      <Card className="col-span-12 lg:col-span-6" title={t('frequency')}>
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

        {!isMeterBased && (
          <Element leftSide={t('frequency_value')}>
            <NumberInputField
              value={maintenanceSchedule.frequency_value}
              onValueChange={(value) => handleChange('frequency_value', parseInt(value) || 1)}
              errorMessage={errors?.errors.frequency_value}
            />
          </Element>
        )}

        {isMeterBased && (
          <>
            <Element leftSide={t('meter_type')}>
              <SelectField
                value={maintenanceSchedule.meter_type}
                onValueChange={(value) => handleChange('meter_type', value as MeterType)}
                errorMessage={errors?.errors.meter_type}
              >
                {meterTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </SelectField>
            </Element>

            <Element leftSide={t('meter_interval')}>
              <NumberInputField
                value={maintenanceSchedule.meter_interval}
                onValueChange={(value) => handleChange('meter_interval', parseInt(value) || 0)}
                errorMessage={errors?.errors.meter_interval}
              />
            </Element>

            <Element leftSide={t('meter_threshold')}>
              <NumberInputField
                value={maintenanceSchedule.meter_threshold}
                onValueChange={(value) => handleChange('meter_threshold', parseInt(value) || 0)}
                errorMessage={errors?.errors.meter_threshold}
              />
            </Element>
          </>
        )}

        <Element leftSide={t('lead_time_days')}>
          <NumberInputField
            value={maintenanceSchedule.lead_time_days}
            onValueChange={(value) => handleChange('lead_time_days', parseInt(value) || 0)}
            errorMessage={errors?.errors.lead_time_days}
          />
        </Element>
      </Card>

      {/* Dates */}
      <Card className="col-span-12 lg:col-span-6" title={t('dates')}>
        <Element leftSide={t('start_date')}>
          <InputField
            type="date"
            value={maintenanceSchedule.start_date}
            onValueChange={(value) => handleChange('start_date', value)}
            errorMessage={errors?.errors.start_date}
          />
        </Element>

        <Element leftSide={t('end_date')}>
          <InputField
            type="date"
            value={maintenanceSchedule.end_date}
            onValueChange={(value) => handleChange('end_date', value)}
            errorMessage={errors?.errors.end_date}
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

        <Element leftSide={t('last_completed_date')}>
          <InputField
            type="date"
            value={maintenanceSchedule.last_completed_date}
            onValueChange={(value) => handleChange('last_completed_date', value)}
            errorMessage={errors?.errors.last_completed_date}
          />
        </Element>
      </Card>

      {/* Estimates */}
      <Card className="col-span-12 lg:col-span-6" title={t('estimates')}>
        <Element leftSide={t('estimated_duration')}>
          <NumberInputField
            value={maintenanceSchedule.estimated_duration}
            onValueChange={(value) => handleChange('estimated_duration', parseInt(value) || 0)}
            errorMessage={errors?.errors.estimated_duration}
          />
          <span className="text-xs text-gray-500 mt-1">{t('minutes')}</span>
        </Element>

        <Element leftSide={t('estimated_cost')}>
          <NumberInputField
            value={maintenanceSchedule.estimated_cost}
            onValueChange={(value) => handleChange('estimated_cost', parseFloat(value) || 0)}
            errorMessage={errors?.errors.estimated_cost}
          />
        </Element>
      </Card>

      {/* Settings */}
      <Card className="col-span-12 lg:col-span-6" title={t('settings')}>
        <Element leftSide={t('is_active')}>
          <Toggle
            checked={maintenanceSchedule.is_active}
            onValueChange={(value) => handleChange('is_active', value)}
          />
        </Element>

        <Element leftSide={t('auto_generate')}>
          <Toggle
            checked={maintenanceSchedule.auto_generate}
            onValueChange={(value) => handleChange('auto_generate', value)}
          />
          <span className="text-xs text-gray-500 mt-1">{t('auto_generate_service_orders')}</span>
        </Element>
      </Card>

      {/* Task List */}
      <Card className="col-span-12 lg:col-span-6" title={t('task_list')}>
        <Element leftSide={t('tasks')}>
          <InputField
            element="textarea"
            value={maintenanceSchedule.task_list}
            onValueChange={(value) => handleChange('task_list', value)}
            errorMessage={errors?.errors.task_list}
            placeholder={t('enter_tasks_one_per_line')}
          />
        </Element>

        <Element leftSide={t('parts_list')}>
          <InputField
            element="textarea"
            value={maintenanceSchedule.parts_list}
            onValueChange={(value) => handleChange('parts_list', value)}
            errorMessage={errors?.errors.parts_list}
            placeholder={t('enter_parts_one_per_line')}
          />
        </Element>
      </Card>

      {/* Notes */}
      <Card className="col-span-12" title={t('notes')}>
        <Element leftSide={t('notes')}>
          <InputField
            element="textarea"
            value={maintenanceSchedule.notes}
            onValueChange={(value) => handleChange('notes', value)}
            errorMessage={errors?.errors.notes}
          />
        </Element>
      </Card>
    </div>
  );
}

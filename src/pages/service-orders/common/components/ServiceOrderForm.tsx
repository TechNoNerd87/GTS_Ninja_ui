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
import { ServiceOrder, ServiceOrderPriority, ServiceType } from '$app/common/interfaces/service-order';
import { ValidationBag } from '$app/common/interfaces/validation-bag';
import { EntityStatus } from '$app/components/EntityStatus';
import { ClientSelector } from '$app/components/clients/ClientSelector';
import { EquipmentSelector } from '$app/components/equipment/EquipmentSelector';
import { ContractSelector } from '$app/components/contracts/ContractSelector';
import { LocationSelector } from '$app/components/locations/LocationSelector';
import { ServiceOrderStatusSelector } from '$app/components/service-order-statuses/ServiceOrderStatusSelector';
import { NumberInputField } from '$app/components/forms/NumberInputField';
import Toggle from '$app/components/forms/Toggle';
import { MdCheckCircle } from 'react-icons/md';
import { Icon } from '$app/components/icons/Icon';

interface Props {
  type?: 'create' | 'edit';
  serviceOrder: ServiceOrder;
  errors: ValidationBag | undefined;
  handleChange: (
    property: keyof ServiceOrder,
    value: ServiceOrder[keyof ServiceOrder]
  ) => void;
}

export function ServiceOrderForm(props: Props) {
  const [t] = useTranslation();

  const { errors, handleChange, type, serviceOrder } = props;

  const priorityOptions: { value: ServiceOrderPriority; label: string }[] = [
    { value: 'low', label: t('low') },
    { value: 'normal', label: t('normal') },
    { value: 'high', label: t('high') },
    { value: 'urgent', label: t('urgent') },
  ];

  const serviceTypeOptions: { value: ServiceType; label: string }[] = [
    { value: 'repair', label: t('repair') },
    { value: 'maintenance', label: t('maintenance') },
    { value: 'installation', label: t('installation') },
    { value: 'inspection', label: t('inspection') },
  ];

  return (
    <div className="grid grid-cols-12 gap-4">
      {/* Basic Information */}
      <Card className="col-span-12 lg:col-span-6" title={t('details')}>
        {type === 'edit' && (
          <Element leftSide={t('status')}>
            <EntityStatus entity={serviceOrder} />
          </Element>
        )}

        <Element leftSide={t('title')} required>
          <InputField
            required
            value={serviceOrder.title}
            onValueChange={(value) => handleChange('title', value)}
            errorMessage={errors?.errors.title}
          />
        </Element>

        <Element leftSide={t('service_order_number')}>
          <InputField
            value={serviceOrder.number}
            onValueChange={(value) => handleChange('number', value)}
            errorMessage={errors?.errors.number}
          />
        </Element>

        <Element leftSide={t('service_type')}>
          <SelectField
            value={serviceOrder.service_type}
            onValueChange={(value) => handleChange('service_type', value as ServiceType)}
            errorMessage={errors?.errors.service_type}
          >
            <option value="">{t('select_service_type')}</option>
            {serviceTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </SelectField>
        </Element>

        <Element leftSide={t('priority')}>
          <SelectField
            value={serviceOrder.priority}
            onValueChange={(value) => handleChange('priority', value as ServiceOrderPriority)}
            errorMessage={errors?.errors.priority}
          >
            {priorityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </SelectField>
        </Element>

        <Element leftSide={t('service_order_status')}>
          <ServiceOrderStatusSelector
            value={serviceOrder.status_id}
            onChange={(status) => handleChange('status_id', status.id)}
            onClearButtonClick={() => handleChange('status_id', '')}
            errorMessage={errors?.errors.status_id}
          />
        </Element>
      </Card>

      {/* Client & Equipment */}
      <Card className="col-span-12 lg:col-span-6" title={t('client_and_equipment')}>
        <Element leftSide={t('client')}>
          <ClientSelector
            value={serviceOrder.client_id}
            onChange={(client) => handleChange('client_id', client.id)}
            onClearButtonClick={() => handleChange('client_id', '')}
            errorMessage={errors?.errors.client_id}
          />
        </Element>

        <Element leftSide={t('equipment')}>
          <EquipmentSelector
            value={serviceOrder.equipment_id}
            clientId={serviceOrder.client_id}
            onChange={(equipment) => handleChange('equipment_id', equipment.id)}
            onClearButtonClick={() => handleChange('equipment_id', '')}
            errorMessage={errors?.errors.equipment_id}
          />
        </Element>

        <Element leftSide={t('location')}>
          <LocationSelector
            value={serviceOrder.location_id}
            onChange={(location) => handleChange('location_id', location.id)}
            onClearButtonClick={() => handleChange('location_id', '')}
            errorMessage={errors?.errors.location_id}
          />
        </Element>

        <Element leftSide={t('contract')}>
          <ContractSelector
            value={serviceOrder.contract_id}
            clientId={serviceOrder.client_id}
            onChange={(contract) => handleChange('contract_id', contract.id)}
            onClearButtonClick={() => handleChange('contract_id', '')}
            errorMessage={errors?.errors.contract_id}
          />
        </Element>

        <Element leftSide={t('covered_by_contract')}>
          <Toggle
            checked={serviceOrder.is_covered_by_contract}
            onValueChange={(value) => handleChange('is_covered_by_contract', value)}
          />
        </Element>
      </Card>

      {/* Service Bank Balance - Only show when available */}
      {serviceOrder.has_service_bank && (
        <Card className="col-span-12 lg:col-span-6" title={t('service_bank_balance')}>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {serviceOrder.service_bank_hours_balance?.toFixed(1) || '0'}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {t('hours_available')}
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  ${serviceOrder.service_bank_currency_balance?.toFixed(2) || '0.00'}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {t('currency_available')}
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {serviceOrder.service_bank_incidents_balance || 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {t('incidents_available')}
                </div>
              </div>
            </div>
            <div className="mt-3 text-xs text-center text-gray-500 dark:text-gray-400">
              {t('prepaid_credits_from_service_bank')}
            </div>
          </div>
        </Card>
      )}

      {/* Task Completion Progress - Only show in edit mode with tasks */}
      {type === 'edit' && serviceOrder.tasks_total > 0 && (
        <Card className="col-span-12 lg:col-span-6" title={t('task_completion')}>
          <div className={`p-4 rounded-lg border ${
            serviceOrder.all_tasks_completed
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
              : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('task_progress')}
              </span>
              <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {serviceOrder.tasks_completed} / {serviceOrder.tasks_total} ({serviceOrder.tasks_completion_percentage}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-300 ${
                  serviceOrder.tasks_completion_percentage === 100
                    ? 'bg-green-500'
                    : serviceOrder.tasks_completion_percentage > 50
                    ? 'bg-blue-500'
                    : 'bg-yellow-500'
                }`}
                style={{ width: `${serviceOrder.tasks_completion_percentage}%` }}
              />
            </div>
            {serviceOrder.all_tasks_completed && (
              <div className="flex items-center mt-3 text-green-600 dark:text-green-400">
                <Icon element={MdCheckCircle} size={20} className="mr-2" />
                <span className="font-medium">{t('all_tasks_completed')}</span>
              </div>
            )}
            {!serviceOrder.all_tasks_completed && serviceOrder.tasks_incomplete > 0 && (
              <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                {t('tasks_remaining', { count: serviceOrder.tasks_incomplete })}
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Scheduling */}
      <Card className="col-span-12 lg:col-span-6" title={t('scheduling')}>
        <Element leftSide={t('scheduled_date')}>
          <InputField
            type="date"
            value={serviceOrder.scheduled_date}
            onValueChange={(value) => handleChange('scheduled_date', value)}
            errorMessage={errors?.errors.scheduled_date}
          />
        </Element>

        <Element leftSide={t('scheduled_start_time')}>
          <InputField
            type="time"
            value={serviceOrder.scheduled_start_time}
            onValueChange={(value) => handleChange('scheduled_start_time', value)}
            errorMessage={errors?.errors.scheduled_start_time}
          />
        </Element>

        <Element leftSide={t('scheduled_end_time')}>
          <InputField
            type="time"
            value={serviceOrder.scheduled_end_time}
            onValueChange={(value) => handleChange('scheduled_end_time', value)}
            errorMessage={errors?.errors.scheduled_end_time}
          />
        </Element>

        <Element leftSide={t('estimated_duration')}>
          <NumberInputField
            value={serviceOrder.estimated_duration}
            onValueChange={(value) => handleChange('estimated_duration', parseFloat(value) || 0)}
            errorMessage={errors?.errors.estimated_duration}
          />
          <span className="text-xs text-gray-500 mt-1">{t('minutes')}</span>
        </Element>
      </Card>

      {/* Actual Times */}
      <Card className="col-span-12 lg:col-span-6" title={t('actual_times')}>
        <Element leftSide={t('actual_start_date')}>
          <InputField
            type="datetime-local"
            value={serviceOrder.actual_start_date}
            onValueChange={(value) => handleChange('actual_start_date', value)}
            errorMessage={errors?.errors.actual_start_date}
          />
        </Element>

        <Element leftSide={t('actual_end_date')}>
          <InputField
            type="datetime-local"
            value={serviceOrder.actual_end_date}
            onValueChange={(value) => handleChange('actual_end_date', value)}
            errorMessage={errors?.errors.actual_end_date}
          />
        </Element>

        <Element leftSide={t('actual_duration')}>
          <NumberInputField
            value={serviceOrder.actual_duration}
            onValueChange={(value) => handleChange('actual_duration', parseFloat(value) || 0)}
            errorMessage={errors?.errors.actual_duration}
          />
          <span className="text-xs text-gray-500 mt-1">{t('minutes')}</span>
        </Element>

        <Element leftSide={t('completed_at')}>
          <InputField
            type="datetime-local"
            value={serviceOrder.completed_at}
            onValueChange={(value) => handleChange('completed_at', value)}
            errorMessage={errors?.errors.completed_at}
          />
        </Element>
      </Card>

      {/* Costs */}
      <Card className="col-span-12 lg:col-span-6" title={t('costs')}>
        <Element leftSide={t('labor_cost')}>
          <NumberInputField
            value={serviceOrder.labor_cost}
            onValueChange={(value) => handleChange('labor_cost', parseFloat(value) || 0)}
            errorMessage={errors?.errors.labor_cost}
          />
        </Element>

        <Element leftSide={t('parts_cost')}>
          <NumberInputField
            value={serviceOrder.parts_cost}
            onValueChange={(value) => handleChange('parts_cost', parseFloat(value) || 0)}
            errorMessage={errors?.errors.parts_cost}
          />
        </Element>

        <Element leftSide={t('travel_cost')}>
          <NumberInputField
            value={serviceOrder.travel_cost}
            onValueChange={(value) => handleChange('travel_cost', parseFloat(value) || 0)}
            errorMessage={errors?.errors.travel_cost}
          />
        </Element>

        <Element leftSide={t('other_cost')}>
          <NumberInputField
            value={serviceOrder.other_cost}
            onValueChange={(value) => handleChange('other_cost', parseFloat(value) || 0)}
            errorMessage={errors?.errors.other_cost}
          />
        </Element>

        <Element leftSide={t('total_cost')}>
          <NumberInputField
            value={serviceOrder.total_cost}
            onValueChange={(value) => handleChange('total_cost', parseFloat(value) || 0)}
            errorMessage={errors?.errors.total_cost}
            disabled
          />
        </Element>
      </Card>

      {/* Work Details */}
      <Card className="col-span-12" title={t('work_details')}>
        <Element leftSide={t('description')}>
          <InputField
            element="textarea"
            value={serviceOrder.description}
            onValueChange={(value) => handleChange('description', value)}
            errorMessage={errors?.errors.description}
          />
        </Element>

        <Element leftSide={t('work_performed')}>
          <InputField
            element="textarea"
            value={serviceOrder.work_performed}
            onValueChange={(value) => handleChange('work_performed', value)}
            errorMessage={errors?.errors.work_performed}
          />
        </Element>

        <Element leftSide={t('technician_notes')}>
          <InputField
            element="textarea"
            value={serviceOrder.technician_notes}
            onValueChange={(value) => handleChange('technician_notes', value)}
            errorMessage={errors?.errors.technician_notes}
          />
        </Element>
      </Card>
    </div>
  );
}

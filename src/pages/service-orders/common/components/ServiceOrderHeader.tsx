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
import { ServiceOrder, ServiceOrderPriority, ServiceType } from '$app/common/interfaces/service-order';
import { ValidationBag } from '$app/common/interfaces/validation-bag';
import { ClientSelector } from '$app/components/clients/ClientSelector';
import { EquipmentSelector } from '$app/components/equipment/EquipmentSelector';
import { ContractSelector } from '$app/components/contracts/ContractSelector';
import { LocationSelector } from '$app/components/locations/LocationSelector';
import { ServiceOrderStatusSelector } from '$app/components/service-order-statuses/ServiceOrderStatusSelector';

interface Props {
  serviceOrder: ServiceOrder;
  errors: ValidationBag | undefined;
  handleChange: (
    property: keyof ServiceOrder,
    value: ServiceOrder[keyof ServiceOrder]
  ) => void;
}

export function ServiceOrderHeader(props: Props) {
  const [t] = useTranslation();

  const { errors, handleChange, serviceOrder } = props;

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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6">
      {/* Left Column - Client & Equipment */}
      <div>
        <Element leftSide={t('title')} required>
          <InputField
            required
            value={serviceOrder.title}
            onValueChange={(value) => handleChange('title', value)}
            errorMessage={errors?.errors.title}
          />
        </Element>

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
      </div>

      {/* Right Column - Status & Scheduling */}
      <div>
        <Element leftSide={t('service_order_status')}>
          <ServiceOrderStatusSelector
            value={serviceOrder.status_id}
            onChange={(status) => handleChange('status_id', status.id)}
            onClearButtonClick={() => handleChange('status_id', '')}
            errorMessage={errors?.errors.status_id}
          />
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

        <Element leftSide={t('scheduled_date')}>
          <InputField
            type="date"
            value={serviceOrder.scheduled_date}
            onValueChange={(value) => handleChange('scheduled_date', value)}
            errorMessage={errors?.errors.scheduled_date}
          />
        </Element>

        <Element leftSide={t('close_by_date')}>
          <InputField
            type="date"
            value={serviceOrder.close_by_date}
            onValueChange={(value) => handleChange('close_by_date', value)}
            errorMessage={errors?.errors.close_by_date}
          />
        </Element>
      </div>
    </div>
  );
}

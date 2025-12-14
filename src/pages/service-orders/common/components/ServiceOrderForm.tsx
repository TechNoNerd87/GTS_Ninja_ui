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
import { ServiceOrder, ServiceOrderPriority } from '$app/common/interfaces/service-order';
import { ValidationBag } from '$app/common/interfaces/validation-bag';
import { EntityStatus } from '$app/components/EntityStatus';
import { ClientSelector } from '$app/components/clients/ClientSelector';
import { EquipmentSelector } from '$app/components/equipment/EquipmentSelector';
import { ContractSelector } from '$app/components/contracts/ContractSelector';
import { ServiceOrderStatusSelector } from '$app/components/service-order-statuses/ServiceOrderStatusSelector';

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
    { value: 'medium', label: t('medium') },
    { value: 'high', label: t('high') },
    { value: 'urgent', label: t('urgent') },
  ];

  return (
    <>
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

      <Element leftSide={t('order_number')}>
        <InputField
          value={serviceOrder.order_number}
          onValueChange={(value) => handleChange('order_number', value)}
          errorMessage={errors?.errors.order_number}
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

      <Element leftSide={t('contract')}>
        <ContractSelector
          value={serviceOrder.contract_id}
          clientId={serviceOrder.client_id}
          onChange={(contract) => handleChange('contract_id', contract.id)}
          onClearButtonClick={() => handleChange('contract_id', '')}
          errorMessage={errors?.errors.contract_id}
        />
      </Element>

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

      <Element leftSide={t('order_date')}>
        <InputField
          type="date"
          value={serviceOrder.order_date}
          onValueChange={(value) => handleChange('order_date', value)}
          errorMessage={errors?.errors.order_date}
        />
      </Element>

      <Element leftSide={t('due_date')}>
        <InputField
          type="date"
          value={serviceOrder.due_date}
          onValueChange={(value) => handleChange('due_date', value)}
          errorMessage={errors?.errors.due_date}
        />
      </Element>

      <Element leftSide={t('scheduled_start_date')}>
        <InputField
          type="date"
          value={serviceOrder.scheduled_start_date}
          onValueChange={(value) => handleChange('scheduled_start_date', value)}
          errorMessage={errors?.errors.scheduled_start_date}
        />
      </Element>

      <Element leftSide={t('completed_date')}>
        <InputField
          type="date"
          value={serviceOrder.completed_date}
          onValueChange={(value) => handleChange('completed_date', value)}
          errorMessage={errors?.errors.completed_date}
        />
      </Element>

      <Element leftSide={t('problem_description')}>
        <InputField
          element="textarea"
          value={serviceOrder.problem_description}
          onValueChange={(value) => handleChange('problem_description', value)}
          errorMessage={errors?.errors.problem_description}
        />
      </Element>

      <Element leftSide={t('resolution_notes')}>
        <InputField
          element="textarea"
          value={serviceOrder.resolution_notes}
          onValueChange={(value) => handleChange('resolution_notes', value)}
          errorMessage={errors?.errors.resolution_notes}
        />
      </Element>
    </>
  );
}

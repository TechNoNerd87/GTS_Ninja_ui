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
import Toggle from '$app/components/forms/Toggle';
import { useColorScheme } from '$app/common/colors';
import { MdEdit, MdLocationOn } from 'react-icons/md';
import { Icon } from '$app/components/icons/Icon';

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
  const colors = useColorScheme();

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

  // Get address from location or client
  const getDisplayAddress = () => {
    if (serviceOrder.service_address) {
      return serviceOrder.service_address;
    }
    if (serviceOrder.location) {
      const loc = serviceOrder.location;
      const parts = [loc.address1, loc.address2, loc.city, loc.state, loc.postal_code].filter(Boolean);
      return parts.join(', ');
    }
    if (serviceOrder.client) {
      const client = serviceOrder.client;
      const parts = [client.address1, client.address2, client.city, client.state, client.postal_code].filter(Boolean);
      return parts.join(', ');
    }
    return '';
  };

  return (
    <div className="space-y-6">
      {/* Row 1: Customer | Customer Signature | Status | Address */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
            {t('customer')}
          </label>
          <ClientSelector
            value={serviceOrder.client_id}
            onChange={(client) => handleChange('client_id', client.id)}
            onClearButtonClick={() => handleChange('client_id', '')}
            errorMessage={errors?.errors.client_id}
          />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
            {t('customer_signature')}
          </label>
          <div
            className="h-[38px] border rounded px-3 py-2 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
            style={{ borderColor: colors.$5 }}
            onClick={() => {/* TODO: Open signature modal */}}
          >
            {serviceOrder.customer_signature ? (
              <span className="text-sm text-green-600 dark:text-green-400">{t('signed')}</span>
            ) : (
              <span className="text-sm text-gray-400">{t('click_to_sign')}</span>
            )}
            <Icon element={MdEdit} size={16} />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
            {t('work_order_status')}
          </label>
          <ServiceOrderStatusSelector
            value={serviceOrder.status_id}
            onChange={(status) => handleChange('status_id', status.id)}
            onClearButtonClick={() => handleChange('status_id', '')}
            errorMessage={errors?.errors.status_id}
          />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
            {t('address')}
          </label>
          <div
            className="h-[38px] border rounded px-3 py-2 flex items-center gap-2 text-sm truncate"
            style={{ borderColor: colors.$5, color: colors.$3 }}
            title={getDisplayAddress()}
          >
            <Icon element={MdLocationOn} size={16} className="flex-shrink-0" />
            <span className="truncate">{getDisplayAddress() || t('no_address')}</span>
          </div>
        </div>
      </div>

      {/* Row 2: Technician Signature | Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
            {t('technician_signature')}
          </label>
          <div
            className="h-[38px] border rounded px-3 py-2 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
            style={{ borderColor: colors.$5 }}
            onClick={() => {/* TODO: Open signature modal */}}
          >
            {serviceOrder.technician_signature ? (
              <span className="text-sm text-green-600 dark:text-green-400">{t('signed')}</span>
            ) : (
              <span className="text-sm text-gray-400">{t('click_to_sign')}</span>
            )}
            <Icon element={MdEdit} size={16} />
          </div>
        </div>

        <div className="md:col-span-3">
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
            {t('summary')}
          </label>
          <InputField
            value={serviceOrder.title}
            onValueChange={(value) => handleChange('title', value)}
            errorMessage={errors?.errors.title}
          />
        </div>
      </div>

      {/* Row 3: Date to Complete | Time | Contract | Project | Invoice Number */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div>
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
            {t('date_to_be_completed')}
          </label>
          <InputField
            type="date"
            value={serviceOrder.close_by_date}
            onValueChange={(value) => handleChange('close_by_date', value)}
            errorMessage={errors?.errors.close_by_date}
          />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
            {t('time')}
          </label>
          <InputField
            type="time"
            value={serviceOrder.scheduled_end_time}
            onValueChange={(value) => handleChange('scheduled_end_time', value)}
            errorMessage={errors?.errors.scheduled_end_time}
          />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
            {t('contract')}
          </label>
          <ContractSelector
            value={serviceOrder.contract_id}
            clientId={serviceOrder.client_id}
            onChange={(contract) => handleChange('contract_id', contract.id)}
            onClearButtonClick={() => handleChange('contract_id', '')}
            errorMessage={errors?.errors.contract_id}
          />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
            {t('equipment')}
          </label>
          <EquipmentSelector
            value={serviceOrder.equipment_id}
            clientId={serviceOrder.client_id}
            onChange={(equipment) => handleChange('equipment_id', equipment.id)}
            onClearButtonClick={() => handleChange('equipment_id', '')}
            errorMessage={errors?.errors.equipment_id}
          />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
            {t('invoice_number')}
          </label>
          <InputField
            value={serviceOrder.invoice_number}
            onValueChange={(value) => handleChange('invoice_number', value)}
            errorMessage={errors?.errors.invoice_number}
          />
        </div>
      </div>

      {/* Row 4: Service Date | Time | Contact | Customer Ref | Internal Ref */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div>
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
            {t('service_date')}
          </label>
          <InputField
            type="date"
            value={serviceOrder.scheduled_date}
            onValueChange={(value) => handleChange('scheduled_date', value)}
            errorMessage={errors?.errors.scheduled_date}
          />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
            {t('time')}
          </label>
          <InputField
            type="time"
            value={serviceOrder.scheduled_start_time}
            onValueChange={(value) => handleChange('scheduled_start_time', value)}
            errorMessage={errors?.errors.scheduled_start_time}
          />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
            {t('contact')}
          </label>
          <SelectField
            value={serviceOrder.contact_id}
            onValueChange={(value) => handleChange('contact_id', value)}
            errorMessage={errors?.errors.contact_id}
          >
            <option value="">{t('select_contact')}</option>
            {serviceOrder.client?.contacts?.map((contact) => (
              <option key={contact.id} value={contact.id}>
                {contact.first_name} {contact.last_name}
                {contact.email ? ` (${contact.email})` : ''}
              </option>
            ))}
          </SelectField>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
            {t('customer_reference')}
          </label>
          <InputField
            value={serviceOrder.customer_reference}
            onValueChange={(value) => handleChange('customer_reference', value)}
            errorMessage={errors?.errors.customer_reference}
          />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
            {t('internal_reference')}
          </label>
          <InputField
            value={serviceOrder.internal_reference}
            onValueChange={(value) => handleChange('internal_reference', value)}
            errorMessage={errors?.errors.internal_reference}
          />
        </div>
      </div>

      {/* Row 5: Onsite | Priority | Service Type | Location */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex items-center gap-3">
          <Toggle
            checked={serviceOrder.is_onsite}
            onValueChange={(value) => handleChange('is_onsite', value)}
          />
          <label className="text-sm font-medium" style={{ color: colors.$3 }}>
            {t('onsite')}
          </label>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
            {t('priority')}
          </label>
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
        </div>

        <div>
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
            {t('service_type')}
          </label>
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
        </div>

        <div>
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
            {t('location')}
          </label>
          <LocationSelector
            value={serviceOrder.location_id}
            onChange={(location) => handleChange('location_id', location.id)}
            onClearButtonClick={() => handleChange('location_id', '')}
            errorMessage={errors?.errors.location_id}
          />
        </div>
      </div>

      {/* Row 6: Tags */}
      {serviceOrder.tags && serviceOrder.tags.length > 0 && (
        <div>
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 block">
            {t('tags')}
          </label>
          <div className="flex flex-wrap gap-2">
            {serviceOrder.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs rounded-full bg-gray-200 dark:bg-gray-700"
                style={{ color: colors.$3 }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

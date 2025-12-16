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
import { Contract, ContractStatus, ContractType, BillingFrequency } from '$app/common/interfaces/contract';
import { ValidationBag } from '$app/common/interfaces/validation-bag';
import { EntityStatus } from '$app/components/EntityStatus';
import { ClientSelector } from '$app/components/clients/ClientSelector';
import { ServiceBankSelector } from '$app/components/service-banks/ServiceBankSelector';
import Toggle from '$app/components/forms/Toggle';
import { NumberInputField } from '$app/components/forms/NumberInputField';

interface Props {
  type?: 'create' | 'edit';
  contract: Contract;
  errors: ValidationBag | undefined;
  handleChange: (
    property: keyof Contract,
    value: Contract[keyof Contract]
  ) => void;
}

export function ContractForm(props: Props) {
  const [t] = useTranslation();

  const { errors, handleChange, type, contract } = props;

  const contractTypeOptions: { value: ContractType; label: string }[] = [
    { value: 'warranty', label: t('warranty') },
    { value: 'service_agreement', label: t('service_agreement') },
    { value: 'maintenance', label: t('maintenance') },
    { value: 'support', label: t('support') },
    { value: 'sla', label: t('sla') },
  ];

  const statusOptions: { value: ContractStatus; label: string }[] = [
    { value: 'draft', label: t('draft') },
    { value: 'pending', label: t('pending') },
    { value: 'active', label: t('active') },
    { value: 'expired', label: t('expired') },
    { value: 'cancelled', label: t('cancelled') },
  ];

  const billingFrequencyOptions: { value: BillingFrequency; label: string }[] = [
    { value: 'monthly', label: t('monthly') },
    { value: 'quarterly', label: t('quarterly') },
    { value: 'semi_annual', label: t('semi_annual') },
    { value: 'annual', label: t('annual') },
  ];

  return (
    <div className="grid grid-cols-12 gap-4">
      {/* Basic Information */}
      <Card className="col-span-12 lg:col-span-6" title={t('details')}>
        {type === 'edit' && (
          <Element leftSide={t('status')}>
            <EntityStatus entity={contract} />
          </Element>
        )}

        <Element leftSide={t('name')} required>
          <InputField
            required
            value={contract.name}
            onValueChange={(value) => handleChange('name', value)}
            errorMessage={errors?.errors.name}
          />
        </Element>

        <Element leftSide={t('contract_number')}>
          <InputField
            value={contract.contract_number}
            onValueChange={(value) => handleChange('contract_number', value)}
            errorMessage={errors?.errors.contract_number}
          />
        </Element>

        <Element leftSide={t('client')}>
          <ClientSelector
            value={contract.client_id}
            onChange={(client) => handleChange('client_id', client.id)}
            onClearButtonClick={() => handleChange('client_id', '')}
            errorMessage={errors?.errors.client_id}
          />
        </Element>

        <Element leftSide={t('contract_type')}>
          <SelectField
            value={contract.contract_type}
            onValueChange={(value) => handleChange('contract_type', value as ContractType)}
            errorMessage={errors?.errors.contract_type}
          >
            {contractTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </SelectField>
        </Element>

        <Element leftSide={t('contract_status')}>
          <SelectField
            value={contract.status}
            onValueChange={(value) => handleChange('status', value as ContractStatus)}
            errorMessage={errors?.errors.status}
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </SelectField>
        </Element>
      </Card>

      {/* Dates */}
      <Card className="col-span-12 lg:col-span-6" title={t('dates')}>
        <Element leftSide={t('start_date')}>
          <InputField
            type="date"
            value={contract.start_date}
            onValueChange={(value) => handleChange('start_date', value)}
            errorMessage={errors?.errors.start_date}
          />
        </Element>

        <Element leftSide={t('end_date')}>
          <InputField
            type="date"
            value={contract.end_date}
            onValueChange={(value) => handleChange('end_date', value)}
            errorMessage={errors?.errors.end_date}
          />
        </Element>

        <Element leftSide={t('signed_date')}>
          <InputField
            type="date"
            value={contract.signed_date}
            onValueChange={(value) => handleChange('signed_date', value)}
            errorMessage={errors?.errors.signed_date}
          />
        </Element>

        {type === 'edit' && contract.cancelled_date && (
          <Element leftSide={t('cancelled_date')}>
            <InputField
              type="date"
              value={contract.cancelled_date}
              disabled
            />
          </Element>
        )}
      </Card>

      {/* Billing */}
      <Card className="col-span-12 lg:col-span-6" title={t('billing')}>
        <Element leftSide={t('contract_value')}>
          <NumberInputField
            value={contract.contract_value}
            onValueChange={(value) => handleChange('contract_value', parseFloat(value) || 0)}
            errorMessage={errors?.errors.contract_value}
          />
        </Element>

        <Element leftSide={t('recurring_amount')}>
          <NumberInputField
            value={contract.recurring_amount}
            onValueChange={(value) => handleChange('recurring_amount', parseFloat(value) || 0)}
            errorMessage={errors?.errors.recurring_amount}
          />
        </Element>

        <Element leftSide={t('billing_frequency')}>
          <SelectField
            value={contract.billing_frequency}
            onValueChange={(value) => handleChange('billing_frequency', value as BillingFrequency)}
            errorMessage={errors?.errors.billing_frequency}
          >
            {billingFrequencyOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </SelectField>
        </Element>

        <Element leftSide={t('next_billing_date')}>
          <InputField
            type="date"
            value={contract.next_billing_date}
            onValueChange={(value) => handleChange('next_billing_date', value)}
            errorMessage={errors?.errors.next_billing_date}
          />
        </Element>
      </Card>

      {/* Renewal Settings */}
      <Card className="col-span-12 lg:col-span-6" title={t('renewal')}>
        <Element leftSide={t('auto_renew')}>
          <Toggle
            checked={contract.auto_renew}
            onValueChange={(value) => handleChange('auto_renew', value)}
          />
        </Element>

        <Element leftSide={t('renewal_term_months')}>
          <NumberInputField
            value={contract.renewal_term_months}
            onValueChange={(value) => handleChange('renewal_term_months', parseInt(value) || 0)}
            errorMessage={errors?.errors.renewal_term_months}
          />
        </Element>

        <Element leftSide={t('renewal_notice_days')}>
          <NumberInputField
            value={contract.renewal_notice_days}
            onValueChange={(value) => handleChange('renewal_notice_days', parseInt(value) || 0)}
            errorMessage={errors?.errors.renewal_notice_days}
          />
        </Element>

        <Element leftSide={t('default_service_bank')}>
          <ServiceBankSelector
            value={contract.default_service_bank_id}
            clientId={contract.client_id}
            onChange={(serviceBank) => handleChange('default_service_bank_id', serviceBank.id)}
            onClearButtonClick={() => handleChange('default_service_bank_id', '')}
            errorMessage={errors?.errors.default_service_bank_id}
          />
        </Element>
      </Card>

      {/* SLA - Hours Tracking */}
      <Card className="col-span-12 lg:col-span-6" title={t('hours_tracking')}>
        <Element leftSide={t('included_hours')}>
          <NumberInputField
            value={contract.included_hours}
            onValueChange={(value) => handleChange('included_hours', parseFloat(value) || 0)}
            errorMessage={errors?.errors.included_hours}
          />
        </Element>

        {type === 'edit' && (
          <Element leftSide={t('used_hours')}>
            <NumberInputField
              value={contract.used_hours}
              onValueChange={(value) => handleChange('used_hours', parseFloat(value) || 0)}
              errorMessage={errors?.errors.used_hours}
            />
          </Element>
        )}

        <Element leftSide={t('hourly_rate')}>
          <NumberInputField
            value={contract.hourly_rate}
            onValueChange={(value) => handleChange('hourly_rate', parseFloat(value) || 0)}
            errorMessage={errors?.errors.hourly_rate}
          />
        </Element>
      </Card>

      {/* SLA - Response Times */}
      <Card className="col-span-12 lg:col-span-6" title={t('sla_response_times')}>
        <Element leftSide={t('response_time_hours')}>
          <NumberInputField
            value={contract.response_time_hours}
            onValueChange={(value) => handleChange('response_time_hours', parseInt(value) || 0)}
            errorMessage={errors?.errors.response_time_hours}
          />
        </Element>

        <Element leftSide={t('resolution_time_hours')}>
          <NumberInputField
            value={contract.resolution_time_hours}
            onValueChange={(value) => handleChange('resolution_time_hours', parseInt(value) || 0)}
            errorMessage={errors?.errors.resolution_time_hours}
          />
        </Element>
      </Card>

      {/* SLA - Coverage */}
      <Card className="col-span-12 lg:col-span-6" title={t('coverage')}>
        <Element leftSide={t('covers_parts')}>
          <Toggle
            checked={contract.covers_parts}
            onValueChange={(value) => handleChange('covers_parts', value)}
          />
        </Element>

        <Element leftSide={t('covers_labor')}>
          <Toggle
            checked={contract.covers_labor}
            onValueChange={(value) => handleChange('covers_labor', value)}
          />
        </Element>

        <Element leftSide={t('covers_travel')}>
          <Toggle
            checked={contract.covers_travel}
            onValueChange={(value) => handleChange('covers_travel', value)}
          />
        </Element>

        <Element leftSide={t('covers_emergency')}>
          <Toggle
            checked={contract.covers_emergency}
            onValueChange={(value) => handleChange('covers_emergency', value)}
          />
        </Element>
      </Card>

      {/* SLA - Discounts */}
      <Card className="col-span-12 lg:col-span-6" title={t('discounts')}>
        <Element leftSide={t('parts_discount_percent')}>
          <NumberInputField
            value={contract.parts_discount_percent}
            onValueChange={(value) => handleChange('parts_discount_percent', parseFloat(value) || 0)}
            errorMessage={errors?.errors.parts_discount_percent}
          />
        </Element>

        <Element leftSide={t('labor_discount_percent')}>
          <NumberInputField
            value={contract.labor_discount_percent}
            onValueChange={(value) => handleChange('labor_discount_percent', parseFloat(value) || 0)}
            errorMessage={errors?.errors.labor_discount_percent}
          />
        </Element>
      </Card>

      {/* Notes */}
      <Card className="col-span-12" title={t('notes')}>
        <Element leftSide={t('description')}>
          <InputField
            element="textarea"
            value={contract.description}
            onValueChange={(value) => handleChange('description', value)}
            errorMessage={errors?.errors.description}
          />
        </Element>

        <Element leftSide={t('public_notes')}>
          <InputField
            element="textarea"
            value={contract.public_notes}
            onValueChange={(value) => handleChange('public_notes', value)}
            errorMessage={errors?.errors.public_notes}
          />
        </Element>

        <Element leftSide={t('private_notes')}>
          <InputField
            element="textarea"
            value={contract.private_notes}
            onValueChange={(value) => handleChange('private_notes', value)}
            errorMessage={errors?.errors.private_notes}
          />
        </Element>

        <Element leftSide={t('terms_and_conditions')}>
          <InputField
            element="textarea"
            value={contract.terms_and_conditions}
            onValueChange={(value) => handleChange('terms_and_conditions', value)}
            errorMessage={errors?.errors.terms_and_conditions}
          />
        </Element>
      </Card>
    </div>
  );
}

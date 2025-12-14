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
import { Contract, ContractStatus, ContractType, BillingFrequency } from '$app/common/interfaces/contract';
import { ValidationBag } from '$app/common/interfaces/validation-bag';
import { EntityStatus } from '$app/components/EntityStatus';
import { ClientSelector } from '$app/components/clients/ClientSelector';
import { Toggle } from '$app/components/forms/Toggle';
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
    <>
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

      <Element leftSide={t('contract_value')}>
        <NumberInputField
          value={contract.contract_value}
          onValueChange={(value) => handleChange('contract_value', parseFloat(value) || 0)}
          errorMessage={errors?.errors.contract_value}
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

      <Element leftSide={t('auto_renew')}>
        <Toggle
          checked={contract.auto_renew}
          onValueChange={(value) => handleChange('auto_renew', value)}
        />
      </Element>

      <Element leftSide={t('description')}>
        <InputField
          element="textarea"
          value={contract.description}
          onValueChange={(value) => handleChange('description', value)}
          errorMessage={errors?.errors.description}
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
    </>
  );
}

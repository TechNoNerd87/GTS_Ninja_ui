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
import { ServiceBank, ServiceBankType } from '$app/common/interfaces/service-bank';
import { ValidationBag } from '$app/common/interfaces/validation-bag';
import { EntityStatus } from '$app/components/EntityStatus';
import { ClientSelector } from '$app/components/clients/ClientSelector';
import { ContractSelector } from '$app/components/contracts/ContractSelector';
import Toggle from '$app/components/forms/Toggle';
import { NumberInputField } from '$app/components/forms/NumberInputField';

interface Props {
  type?: 'create' | 'edit';
  serviceBank: ServiceBank;
  errors: ValidationBag | undefined;
  handleChange: (
    property: keyof ServiceBank,
    value: ServiceBank[keyof ServiceBank]
  ) => void;
}

export function ServiceBankForm(props: Props) {
  const [t] = useTranslation();

  const { errors, handleChange, type, serviceBank } = props;

  const bankTypeOptions: { value: ServiceBankType; label: string }[] = [
    { value: 'hours', label: t('hours') },
    { value: 'currency', label: t('currency') },
    { value: 'incidents', label: t('incidents') },
    { value: 'combined', label: t('combined') },
  ];

  const showHoursFields = serviceBank.bank_type === 'hours' || serviceBank.bank_type === 'combined';
  const showCurrencyFields = serviceBank.bank_type === 'currency' || serviceBank.bank_type === 'combined';
  const showIncidentsFields = serviceBank.bank_type === 'incidents' || serviceBank.bank_type === 'combined';

  return (
    <div className="grid grid-cols-12 gap-4">
      {/* Basic Information */}
      <Card className="col-span-12 lg:col-span-6" title={t('details')}>
        {type === 'edit' && (
          <Element leftSide={t('status')}>
            <EntityStatus entity={serviceBank} />
          </Element>
        )}

        <Element leftSide={t('name')} required>
          <InputField
            required
            value={serviceBank.name}
            onValueChange={(value) => handleChange('name', value)}
            errorMessage={errors?.errors.name}
          />
        </Element>

        <Element leftSide={t('bank_type')} required>
          <SelectField
            value={serviceBank.bank_type}
            onValueChange={(value) => handleChange('bank_type', value as ServiceBankType)}
            errorMessage={errors?.errors.bank_type}
          >
            {bankTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </SelectField>
        </Element>

        <Element leftSide={t('client')}>
          <ClientSelector
            value={serviceBank.client_id}
            onChange={(client) => handleChange('client_id', client.id)}
            onClearButtonClick={() => handleChange('client_id', '')}
            errorMessage={errors?.errors.client_id}
          />
        </Element>

        <Element leftSide={t('contract')}>
          <ContractSelector
            value={serviceBank.contract_id}
            clientId={serviceBank.client_id}
            onChange={(contract) => handleChange('contract_id', contract.id)}
            onClearButtonClick={() => handleChange('contract_id', '')}
            errorMessage={errors?.errors.contract_id}
          />
        </Element>

        <Element leftSide={t('description')}>
          <InputField
            element="textarea"
            value={serviceBank.description}
            onValueChange={(value) => handleChange('description', value)}
            errorMessage={errors?.errors.description}
          />
        </Element>
      </Card>

      {/* Hours Tracking */}
      {showHoursFields && (
        <Card className="col-span-12 lg:col-span-6" title={t('hours_tracking')}>
          <Element leftSide={t('hours_purchased')}>
            <NumberInputField
              value={serviceBank.hours_purchased}
              onValueChange={(value) => handleChange('hours_purchased', parseFloat(value) || 0)}
              errorMessage={errors?.errors.hours_purchased}
              precision={2}
            />
          </Element>

          {type === 'edit' && (
            <>
              <Element leftSide={t('hours_used')}>
                <NumberInputField
                  value={serviceBank.hours_used}
                  disabled
                  precision={2}
                />
              </Element>

              <Element leftSide={t('hours_balance')}>
                <NumberInputField
                  value={serviceBank.hours_balance}
                  disabled
                  precision={2}
                />
              </Element>
            </>
          )}

          <Element leftSide={t('hourly_rate')}>
            <NumberInputField
              value={serviceBank.hourly_rate}
              onValueChange={(value) => handleChange('hourly_rate', parseFloat(value) || 0)}
              errorMessage={errors?.errors.hourly_rate}
              precision={2}
            />
          </Element>
        </Card>
      )}

      {/* Currency Tracking */}
      {showCurrencyFields && (
        <Card className="col-span-12 lg:col-span-6" title={t('currency_tracking')}>
          <Element leftSide={t('currency_purchased')}>
            <NumberInputField
              value={serviceBank.currency_purchased}
              onValueChange={(value) => handleChange('currency_purchased', parseFloat(value) || 0)}
              errorMessage={errors?.errors.currency_purchased}
              precision={2}
            />
          </Element>

          {type === 'edit' && (
            <>
              <Element leftSide={t('currency_used')}>
                <NumberInputField
                  value={serviceBank.currency_used}
                  disabled
                  precision={2}
                />
              </Element>

              <Element leftSide={t('currency_balance')}>
                <NumberInputField
                  value={serviceBank.currency_balance}
                  disabled
                  precision={2}
                />
              </Element>
            </>
          )}
        </Card>
      )}

      {/* Incidents Tracking */}
      {showIncidentsFields && (
        <Card className="col-span-12 lg:col-span-6" title={t('incidents_tracking')}>
          <Element leftSide={t('incidents_purchased')}>
            <NumberInputField
              value={serviceBank.incidents_purchased}
              onValueChange={(value) => handleChange('incidents_purchased', parseInt(value) || 0)}
              errorMessage={errors?.errors.incidents_purchased}
              precision={0}
            />
          </Element>

          {type === 'edit' && (
            <>
              <Element leftSide={t('incidents_used')}>
                <NumberInputField
                  value={serviceBank.incidents_used}
                  disabled
                  precision={0}
                />
              </Element>

              <Element leftSide={t('incidents_balance')}>
                <NumberInputField
                  value={serviceBank.incidents_balance}
                  disabled
                  precision={0}
                />
              </Element>
            </>
          )}
        </Card>
      )}

      {/* Dates */}
      <Card className="col-span-12 lg:col-span-6" title={t('dates')}>
        <Element leftSide={t('effective_date')}>
          <InputField
            type="date"
            value={serviceBank.effective_date}
            onValueChange={(value) => handleChange('effective_date', value)}
            errorMessage={errors?.errors.effective_date}
          />
        </Element>

        <Element leftSide={t('expiration_date')}>
          <InputField
            type="date"
            value={serviceBank.expiration_date}
            onValueChange={(value) => handleChange('expiration_date', value)}
            errorMessage={errors?.errors.expiration_date}
          />
        </Element>
      </Card>

      {/* Settings */}
      <Card className="col-span-12 lg:col-span-6" title={t('settings')}>
        <Element leftSide={t('is_active')}>
          <Toggle
            checked={serviceBank.is_active}
            onValueChange={(value) => handleChange('is_active', value)}
          />
        </Element>

        <Element leftSide={t('allow_overage')}>
          <Toggle
            checked={serviceBank.allow_overage}
            onValueChange={(value) => handleChange('allow_overage', value)}
          />
        </Element>

        <Element leftSide={t('rollover_unused')}>
          <Toggle
            checked={serviceBank.rollover_unused}
            onValueChange={(value) => handleChange('rollover_unused', value)}
          />
        </Element>

        <Element leftSide={t('notify_low_balance')}>
          <Toggle
            checked={serviceBank.notify_low_balance}
            onValueChange={(value) => handleChange('notify_low_balance', value)}
          />
        </Element>

        {serviceBank.notify_low_balance && (
          <Element leftSide={t('low_balance_threshold')}>
            <NumberInputField
              value={serviceBank.low_balance_threshold}
              onValueChange={(value) => handleChange('low_balance_threshold', parseFloat(value) || 0)}
              errorMessage={errors?.errors.low_balance_threshold}
              precision={2}
            />
          </Element>
        )}
      </Card>

      {/* Notes */}
      <Card className="col-span-12" title={t('notes')}>
        <Element leftSide={t('notes')}>
          <InputField
            element="textarea"
            value={serviceBank.notes}
            onValueChange={(value) => handleChange('notes', value)}
            errorMessage={errors?.errors.notes}
          />
        </Element>
      </Card>
    </div>
  );
}

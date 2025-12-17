/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Card, CardContainer, Element } from '$app/components/cards';
import { InputField, SelectField } from '$app/components/forms';
import { AxiosError } from 'axios';
import { endpoint } from '$app/common/helpers';
import { request } from '$app/common/helpers/request';
import { route } from '$app/common/helpers/route';
import { toast } from '$app/common/helpers/toast/toast';
import { useTitle } from '$app/common/hooks/useTitle';
import { Rate } from '$app/common/interfaces/rate';
import { ValidationBag } from '$app/common/interfaces/validation-bag';
import { useRateQuery } from '$app/common/queries/rates';
import { Badge } from '$app/components/Badge';
import { Settings } from '$app/components/layouts/Settings';
import { Spinner } from '$app/components/Spinner';
import { FormEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import {
  useActions,
  useHandleChange,
} from '$app/pages/settings/rates/common/hooks';
import { ResourceActions } from '$app/components/ResourceActions';
import { $refetch } from '$app/common/hooks/useRefetch';
import { useColorScheme } from '$app/common/colors';
import { NumberInputField } from '$app/components/forms/NumberInputField';
import Toggle from '$app/components/forms/Toggle';
import { TaxRateSelector } from '$app/components/tax-rates/TaxRateSelector';
import { GroupSettingsSelector } from '$app/components/group-settings/GroupSettingsSelector';
import { useFormatMoney } from '$app/common/hooks/money/useFormatMoney';
import { useCurrentCompany } from '$app/common/hooks/useCurrentCompany';

export function Edit() {
  const [t] = useTranslation();

  const { id } = useParams();

  const actions = useActions();
  const colors = useColorScheme();
  const formatMoney = useFormatMoney();
  const company = useCurrentCompany();

  const pages = [
    { name: t('settings'), href: '/settings' },
    { name: t('rates'), href: '/settings/rates' },
    {
      name: t('edit_rate'),
      href: route('/settings/rates/:id/edit', { id }),
    },
  ];

  const { data: rateData } = useRateQuery({ id });

  const [errors, setErrors] = useState<ValidationBag>();
  const { documentTitle, setDocumentTitle } = useTitle('');
  const [rate, setRate] = useState<Rate>();
  const [isFormBusy, setIsFormBusy] = useState<boolean>(false);
  const [isTitleApplied, setIsTitleApplied] = useState<boolean>(false);

  const handleChange = useHandleChange({ setErrors, setRate });

  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isFormBusy) {
      toast.processing();

      setErrors(undefined);

      setIsFormBusy(true);

      request('PUT', endpoint('/api/v1/rates/:id', { id }), rate)
        .then(() => {
          toast.success('updated_rate');

          $refetch(['rates']);

          setIsTitleApplied(false);
        })
        .catch((error: AxiosError<ValidationBag>) => {
          if (error.response?.status === 422) {
            setErrors(error.response.data);
            toast.dismiss();
          }
        })
        .finally(() => setIsFormBusy(false));
    }
  };

  useEffect(() => {
    if (rateData) {
      setRate(rateData.data.data);
    }
  }, [rateData]);

  useEffect(() => {
    if (rate && !isTitleApplied) {
      setDocumentTitle(rate.name);
      setIsTitleApplied(true);
    }
  }, [rate]);

  const rateTypeOptions = [
    { value: 'service', label: t('service') },
    { value: 'travel', label: t('travel') },
  ];

  const unitTypeOptions = [
    { value: 'hour', label: t('hour') },
    { value: 'mile', label: t('mile') },
    { value: 'km', label: t('km') },
    { value: 'flat', label: t('flat') },
    { value: 'each', label: t('each') },
  ];

  const serviceBankUnitTypeOptions = [
    { value: '', label: t('none') },
    { value: 'hours', label: t('hours') },
    { value: 'currency', label: t('currency') },
    { value: 'incidents', label: t('incidents') },
  ];

  return (
    <Settings
      title={t('rates')}
      navigationTopRight={
        rate && (
          <ResourceActions
            label={t('actions')}
            resource={rate}
            actions={actions}
          />
        )
      }
      breadcrumbs={pages}
    >
      {!rate && (
        <div className="flex justify-center">
          <Spinner />
        </div>
      )}

      {rate && (
        <Card
          title={documentTitle}
          className="shadow-sm"
          childrenClassName="pt-4"
          style={{ borderColor: colors.$24 }}
          headerStyle={{ borderColor: colors.$20 }}
          withoutBodyPadding
          withSaveButton
          disableSubmitButton={isFormBusy}
          onSaveClick={(event) => handleSave(event)}
          onFormSubmit={(event) => handleSave(event)}
        >
          <Element leftSide={t('status')}>
            {!rate.is_deleted && !rate.archived_at && (
              <Badge variant="primary">{t('active')}</Badge>
            )}

            {rate.archived_at && !rate.is_deleted ? (
              <Badge variant="yellow">{t('archived')}</Badge>
            ) : null}

            {rate.is_deleted && (
              <Badge variant="red">{t('deleted')}</Badge>
            )}
          </Element>

          {/* Calculated Fields Display */}
          <Element leftSide={t('margin')}>
            {formatMoney(
              rate.margin,
              company?.settings?.country_id,
              company?.settings?.currency_id
            )}
          </Element>

          <Element leftSide={t('markup_percentage')}>
            {rate.markup_percentage.toFixed(2)}%
          </Element>

          <CardContainer>
            {/* Basic Information */}
            <InputField
              required
              label={t('name')}
              value={rate.name}
              onValueChange={(value) => handleChange('name', value)}
              errorMessage={errors?.errors?.name}
            />

            <InputField
              label={t('code')}
              value={rate.code}
              onValueChange={(value) => handleChange('code', value)}
              errorMessage={errors?.errors?.code}
            />

            <InputField
              label={t('description')}
              value={rate.description}
              onValueChange={(value) => handleChange('description', value)}
              errorMessage={errors?.errors?.description}
            />

            <SelectField
              label={t('rate_type')}
              value={rate.rate_type}
              onValueChange={(value) => handleChange('rate_type', value)}
              errorMessage={errors?.errors?.rate_type}
            >
              {rateTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </SelectField>

            {/* Pricing */}
            <NumberInputField
              label={t('cost')}
              value={rate.cost}
              onValueChange={(value) => handleChange('cost', parseFloat(value) || 0)}
              errorMessage={errors?.errors?.cost}
              precision={2}
            />

            <NumberInputField
              label={t('charge')}
              value={rate.charge}
              onValueChange={(value) => handleChange('charge', parseFloat(value) || 0)}
              errorMessage={errors?.errors?.charge}
              precision={2}
            />

            <SelectField
              label={t('unit_type')}
              value={rate.unit_type}
              onValueChange={(value) => handleChange('unit_type', value)}
              errorMessage={errors?.errors?.unit_type}
            >
              {unitTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </SelectField>

            <InputField
              label={t('unit_label')}
              value={rate.unit_label}
              onValueChange={(value) => handleChange('unit_label', value)}
              errorMessage={errors?.errors?.unit_label}
            />

            {/* Tax Settings */}
            <Element leftSide={t('is_taxable')}>
              <Toggle
                checked={rate.is_taxable}
                onChange={(value) => handleChange('is_taxable', value)}
              />
            </Element>

            {rate.is_taxable && (
              <Element leftSide={t('tax_rate')}>
                <TaxRateSelector
                  defaultValue={rate.tax_rate_id}
                  onChange={(taxRate) => handleChange('tax_rate_id', taxRate.id)}
                  onClearButtonClick={() => handleChange('tax_rate_id', '')}
                />
              </Element>
            )}

            {/* Client Group */}
            <GroupSettingsSelector
              inputLabel={t('client_group')}
              value={rate.group_setting_id}
              onChange={(group) => handleChange('group_setting_id', group.id)}
              onClearButtonClick={() => handleChange('group_setting_id', '')}
            />

            <Element leftSide={t('contract_rate')}>
              <Toggle
                checked={rate.is_contract_rate}
                onChange={(value) => handleChange('is_contract_rate', value)}
              />
            </Element>

            {/* Service Bank Settings */}
            <Element leftSide={t('can_use_service_bank')}>
              <Toggle
                checked={rate.can_use_service_bank}
                onChange={(value) => handleChange('can_use_service_bank', value)}
              />
            </Element>

            {rate.can_use_service_bank && (
              <SelectField
                label={t('service_bank_unit_type')}
                value={rate.service_bank_unit_type}
                onValueChange={(value) => handleChange('service_bank_unit_type', value)}
                errorMessage={errors?.errors?.service_bank_unit_type}
              >
                {serviceBankUnitTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </SelectField>
            )}

            {/* Overtime Settings */}
            <Element leftSide={t('overtime_rate')}>
              <Toggle
                checked={rate.is_overtime_rate}
                onChange={(value) => handleChange('is_overtime_rate', value)}
              />
            </Element>

            {rate.is_overtime_rate && (
              <NumberInputField
                label={t('overtime_multiplier')}
                value={rate.overtime_multiplier}
                onValueChange={(value) => handleChange('overtime_multiplier', parseFloat(value) || 0)}
                errorMessage={errors?.errors?.overtime_multiplier}
                precision={2}
              />
            )}

            {/* Accounting */}
            <InputField
              label={t('account_number')}
              value={rate.account_number}
              onValueChange={(value) => handleChange('account_number', value)}
              errorMessage={errors?.errors?.account_number}
            />

            <InputField
              label={t('expense_account')}
              value={rate.expense_account}
              onValueChange={(value) => handleChange('expense_account', value)}
              errorMessage={errors?.errors?.expense_account}
            />

            <InputField
              label={t('income_account')}
              value={rate.income_account}
              onValueChange={(value) => handleChange('income_account', value)}
              errorMessage={errors?.errors?.income_account}
            />

            {/* Status */}
            <Element leftSide={t('active')}>
              <Toggle
                checked={rate.is_active}
                onChange={(value) => handleChange('is_active', value)}
              />
            </Element>

            <Element leftSide={t('default')}>
              <Toggle
                checked={rate.is_default}
                onChange={(value) => handleChange('is_default', value)}
              />
            </Element>

            <NumberInputField
              label={t('sort_order')}
              value={rate.sort_order}
              onValueChange={(value) => handleChange('sort_order', parseInt(value) || 0)}
              errorMessage={errors?.errors?.sort_order}
            />
          </CardContainer>
        </Card>
      )}
    </Settings>
  );
}

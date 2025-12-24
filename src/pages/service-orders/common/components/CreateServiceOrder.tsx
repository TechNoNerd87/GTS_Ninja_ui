/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Element } from '$app/components/cards';
import { ValidationBag } from '$app/common/interfaces/validation-bag';
import { useAtom } from 'jotai';
import { serviceOrderAtom } from '../atoms';
import { useHandleChange } from '../hooks';
import { ServiceOrderHeader } from './ServiceOrderHeader';
import { ServiceOrderInfoBar } from './ServiceOrderInfoBar';
import { CollapsibleSection } from './CollapsibleSection';
import { useColorScheme } from '$app/common/colors';
import { InputField } from '$app/components/forms';
import { NumberInputField } from '$app/components/forms/NumberInputField';

interface Props {
  errors: ValidationBag | undefined;
  setErrors: Dispatch<SetStateAction<ValidationBag | undefined>>;
}

export function CreateServiceOrder(props: Props) {
  const [t] = useTranslation();

  const colors = useColorScheme();

  const [serviceOrder, setServiceOrder] = useAtom(serviceOrderAtom);

  const handleChange = useHandleChange({
    setErrors: props.setErrors,
    setServiceOrder,
  });

  if (!serviceOrder) {
    return null;
  }

  return (
    <div className="flex flex-col space-y-4">
      {/* Compact Header */}
      <Card
        title={t('new_service_order')}
        className="shadow-sm"
        style={{ borderColor: colors.$24 }}
        headerStyle={{ borderColor: colors.$20 }}
      >
        <div className="p-4">
          <ServiceOrderHeader
            serviceOrder={serviceOrder}
            errors={props.errors}
            handleChange={handleChange}
          />
        </div>
      </Card>

      {/* Quick Info Bar */}
      <ServiceOrderInfoBar
        serviceOrder={serviceOrder}
        errors={props.errors}
        handleChange={handleChange}
        type="create"
      />

      {/* Info message about line items */}
      <div
        className="p-4 rounded-lg border bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
      >
        <p className="text-sm text-blue-700 dark:text-blue-300">
          {t('line_items_after_save')}
        </p>
      </div>

      {/* Scheduling & Times */}
      <CollapsibleSection title={t('scheduling_and_times')}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6">
          <div>
            <Element leftSide={t('scheduled_start_time')}>
              <InputField
                type="time"
                value={serviceOrder.scheduled_start_time}
                onValueChange={(value) => handleChange('scheduled_start_time', value)}
                errorMessage={props.errors?.errors.scheduled_start_time}
              />
            </Element>

            <Element leftSide={t('scheduled_end_time')}>
              <InputField
                type="time"
                value={serviceOrder.scheduled_end_time}
                onValueChange={(value) => handleChange('scheduled_end_time', value)}
                errorMessage={props.errors?.errors.scheduled_end_time}
              />
            </Element>

            <Element leftSide={t('estimated_duration')}>
              <div className="flex items-center gap-2">
                <NumberInputField
                  value={serviceOrder.estimated_duration}
                  onValueChange={(value) => handleChange('estimated_duration', parseFloat(value) || 0)}
                  errorMessage={props.errors?.errors.estimated_duration}
                />
                <span className="text-xs text-gray-500">{t('minutes')}</span>
              </div>
            </Element>
          </div>

          <div>
            <Element leftSide={t('actual_start_date')}>
              <InputField
                type="datetime-local"
                value={serviceOrder.actual_start_date}
                onValueChange={(value) => handleChange('actual_start_date', value)}
                errorMessage={props.errors?.errors.actual_start_date}
              />
            </Element>

            <Element leftSide={t('actual_end_date')}>
              <InputField
                type="datetime-local"
                value={serviceOrder.actual_end_date}
                onValueChange={(value) => handleChange('actual_end_date', value)}
                errorMessage={props.errors?.errors.actual_end_date}
              />
            </Element>
          </div>
        </div>
      </CollapsibleSection>

      {/* Contact Information */}
      <CollapsibleSection title={t('contact_information')}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-6">
          <Element leftSide={t('contact_name')}>
            <InputField
              value={serviceOrder.customer_contact_name}
              onValueChange={(value) => handleChange('customer_contact_name', value)}
              errorMessage={props.errors?.errors.customer_contact_name}
            />
          </Element>

          <Element leftSide={t('contact_phone')}>
            <InputField
              type="tel"
              value={serviceOrder.customer_contact_phone}
              onValueChange={(value) => handleChange('customer_contact_phone', value)}
              errorMessage={props.errors?.errors.customer_contact_phone}
            />
          </Element>

          <Element leftSide={t('contact_email')}>
            <InputField
              type="email"
              value={serviceOrder.customer_contact_email}
              onValueChange={(value) => handleChange('customer_contact_email', value)}
              errorMessage={props.errors?.errors.customer_contact_email}
            />
          </Element>
        </div>
      </CollapsibleSection>

      {/* Work Details */}
      <CollapsibleSection title={t('work_details')} defaultOpen>
        <div className="space-y-4">
          <Element leftSide={t('description')}>
            <InputField
              element="textarea"
              value={serviceOrder.description}
              onValueChange={(value) => handleChange('description', value)}
              errorMessage={props.errors?.errors.description}
            />
          </Element>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6">
            <Element leftSide={t('internal_reference')}>
              <InputField
                value={serviceOrder.internal_reference}
                onValueChange={(value) => handleChange('internal_reference', value)}
                errorMessage={props.errors?.errors.internal_reference}
              />
            </Element>

            <Element leftSide={t('invoice_number')}>
              <InputField
                value={serviceOrder.invoice_number}
                onValueChange={(value) => handleChange('invoice_number', value)}
                errorMessage={props.errors?.errors.invoice_number}
              />
            </Element>
          </div>
        </div>
      </CollapsibleSection>
    </div>
  );
}

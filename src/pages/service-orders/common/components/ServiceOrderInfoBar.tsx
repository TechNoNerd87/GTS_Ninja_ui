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
import { InputField } from '$app/components/forms';
import { ServiceOrder } from '$app/common/interfaces/service-order';
import { ValidationBag } from '$app/common/interfaces/validation-bag';
import { useColorScheme } from '$app/common/colors';
import Toggle from '$app/components/forms/Toggle';
import classNames from 'classnames';

interface Props {
  serviceOrder: ServiceOrder;
  errors: ValidationBag | undefined;
  handleChange: (
    property: keyof ServiceOrder,
    value: ServiceOrder[keyof ServiceOrder]
  ) => void;
  type?: 'create' | 'edit';
}

export function ServiceOrderInfoBar(props: Props) {
  const [t] = useTranslation();
  const colors = useColorScheme();

  const { errors, handleChange, serviceOrder, type = 'edit' } = props;

  return (
    <div
      className="flex flex-wrap items-center gap-4 p-3 rounded-lg border"
      style={{ borderColor: colors.$5, backgroundColor: colors.$1 }}
    >
      {/* Service Order Number */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {t('service_order_number')}:
        </span>
        <span className="text-sm font-semibold" style={{ color: colors.$3 }}>
          {serviceOrder.number || (type === 'create' ? t('auto_generated') : '-')}
        </span>
      </div>

      <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />

      {/* Customer Reference */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {t('customer_reference')}:
        </span>
        <InputField
          value={serviceOrder.customer_reference}
          onValueChange={(value) => handleChange('customer_reference', value)}
          errorMessage={errors?.errors.customer_reference}
          placeholder={t('po_number')}
          className="!py-1 !text-sm w-32"
        />
      </div>

      <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />

      {/* On-site / In-shop Toggle */}
      <div className="flex items-center gap-2">
        <span
          className={classNames('text-sm', {
            'font-medium': !serviceOrder.is_onsite,
            'text-gray-400': serviceOrder.is_onsite,
          })}
        >
          {t('in_shop')}
        </span>
        <Toggle
          checked={serviceOrder.is_onsite}
          onValueChange={(value) => handleChange('is_onsite', value)}
        />
        <span
          className={classNames('text-sm', {
            'font-medium': serviceOrder.is_onsite,
            'text-gray-400': !serviceOrder.is_onsite,
          })}
        >
          {t('on_site')}
        </span>
      </div>

      <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />

      {/* Warranty Service */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {t('warranty_service')}:
        </span>
        <Toggle
          checked={serviceOrder.is_warranty_service}
          onValueChange={(value) => handleChange('is_warranty_service', value)}
        />
      </div>

      {/* Closed Toggle (edit mode only) */}
      {type === 'edit' && (
        <>
          <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {t('closed')}:
            </span>
            <Toggle
              checked={serviceOrder.is_closed}
              onValueChange={(value) => handleChange('is_closed', value)}
            />
          </div>
        </>
      )}
    </div>
  );
}

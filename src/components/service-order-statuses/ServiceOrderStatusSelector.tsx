/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { ServiceOrderStatus } from '$app/common/interfaces/service-order-status';
import { GenericSelectorProps } from '$app/common/interfaces/generic-selector-props';
import { useTranslation } from 'react-i18next';
import { ComboboxAsync } from '../forms/Combobox';
import { endpoint } from '$app/common/helpers';
import { ErrorMessage } from '../ErrorMessage';

export interface ServiceOrderStatusSelectorProps
  extends GenericSelectorProps<ServiceOrderStatus> {
  staleTime?: number;
}

export function ServiceOrderStatusSelector(
  props: ServiceOrderStatusSelectorProps
) {
  const [t] = useTranslation();

  return (
    <>
      <ComboboxAsync<ServiceOrderStatus>
        inputOptions={{
          label: props.inputLabel || t('service_order_status'),
          value: props.value || null,
        }}
        endpoint={endpoint('/api/v1/service_order_statuses?sort=sort_order|asc')}
        readonly={props.readonly}
        onDismiss={props.onClearButtonClick}
        querySpecificEntry="/api/v1/service_order_statuses/:id"
        entryOptions={{
          id: 'id',
          label: 'name',
          value: 'id',
          dropdownLabelFn: (status) => (
            <div className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: status.color }}
              />
              <span>{status.name}</span>
            </div>
          ),
        }}
        onChange={(value) => value.resource && props.onChange(value.resource)}
        staleTime={props.staleTime || Infinity}
        sortBy="sort_order|asc"
        key="service_order_status_selector"
      />

      <ErrorMessage className="mt-2">{props.errorMessage}</ErrorMessage>
    </>
  );
}

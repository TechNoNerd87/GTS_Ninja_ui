/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Rate, RateType } from '$app/common/interfaces/rate';
import { GenericSelectorProps } from '$app/common/interfaces/generic-selector-props';
import { useTranslation } from 'react-i18next';
import { ComboboxAsync } from '../forms/Combobox';
import { endpoint } from '$app/common/helpers';
import { ErrorMessage } from '../ErrorMessage';
import { useFormatMoney } from '$app/common/hooks/money/useFormatMoney';
import { useCurrentCompany } from '$app/common/hooks/useCurrentCompany';

export interface RateSelectorProps extends GenericSelectorProps<Rate> {
  staleTime?: number;
  rateType?: RateType;
  showCharge?: boolean;
  groupSettingId?: string;
}

export function RateSelector(props: RateSelectorProps) {
  const [t] = useTranslation();
  const formatMoney = useFormatMoney();
  const company = useCurrentCompany();

  // Build endpoint with filters
  let apiEndpoint = '/api/v1/rates';

  // Use dedicated type endpoints if available
  if (props.rateType === 'service') {
    apiEndpoint = '/api/v1/rates/type/service';
  } else if (props.rateType === 'travel') {
    apiEndpoint = '/api/v1/rates/type/travel';
  }

  apiEndpoint += '?sort=sort_order|asc&is_active=true';

  if (props.groupSettingId) {
    apiEndpoint += `&group_setting_id=${props.groupSettingId}`;
  }

  const getLabel = () => {
    if (props.inputLabel) {
      return props.inputLabel;
    }

    if (props.rateType === 'service') {
      return t('labor_rate') as string;
    }

    if (props.rateType === 'travel') {
      return t('travel_rate') as string;
    }

    return t('rate') as string;
  };

  return (
    <>
      <ComboboxAsync<Rate>
        inputOptions={{
          label: getLabel(),
          value: props.value || null,
        }}
        endpoint={endpoint(apiEndpoint)}
        readonly={props.readonly}
        onDismiss={props.onClearButtonClick}
        querySpecificEntry="/api/v1/rates/:id"
        entryOptions={{
          id: 'id',
          label: 'name',
          value: 'id',
          dropdownLabelFn: (rate) => (
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col">
                <span className="font-medium">{rate.name}</span>
                {rate.code && (
                  <span className="text-xs text-gray-500">{rate.code}</span>
                )}
              </div>
              {props.showCharge !== false && (
                <div className="text-right">
                  <span className="font-medium text-green-600">
                    {formatMoney(
                      rate.charge,
                      company?.settings?.country_id,
                      company?.settings?.currency_id
                    )}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">
                    /{rate.display_unit_label || rate.unit_type}
                  </span>
                </div>
              )}
            </div>
          ),
        }}
        onChange={(value) => value.resource && props.onChange(value.resource)}
        staleTime={props.staleTime || Infinity}
        sortBy="sort_order|asc"
        key={`rate_selector_${props.rateType || 'all'}`}
      />

      <ErrorMessage className="mt-2">{props.errorMessage}</ErrorMessage>
    </>
  );
}

/**
 * Specialized selector for service/labor rates only
 */
export function ServiceRateSelector(
  props: Omit<RateSelectorProps, 'rateType'>
) {
  return <RateSelector {...props} rateType="service" />;
}

/**
 * Specialized selector for travel rates only
 */
export function TravelRateSelector(props: Omit<RateSelectorProps, 'rateType'>) {
  return <RateSelector {...props} rateType="travel" />;
}

/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Location } from '$app/common/interfaces/location';
import { GenericSelectorProps } from '$app/common/interfaces/generic-selector-props';
import { ComboboxAsync } from '../forms/Combobox';
import { endpoint } from '$app/common/helpers';
import { ErrorMessage } from '../ErrorMessage';

export interface LocationSelectorProps extends GenericSelectorProps<Location> {
  clientId?: string;
  staleTime?: number;
  clearInputAfterSelection?: boolean;
}

export function LocationSelector(props: LocationSelectorProps) {
  const { clientId } = props;

  const endpointUrl = clientId
    ? endpoint('/api/v1/locations?client_id=:clientId', { clientId })
    : endpoint('/api/v1/locations');

  return (
    <>
      <ComboboxAsync<Location>
        inputOptions={{
          label: props.inputLabel?.toString(),
          value: props.value || null,
        }}
        endpoint={endpointUrl}
        readonly={props.readonly}
        onDismiss={props.onClearButtonClick}
        querySpecificEntry="/api/v1/locations/:id"
        entryOptions={{
          id: 'id',
          label: 'name',
          value: 'id',
          dropdownLabelFn: (location) => (
            <span>
              {location.name}
              {location.city && ` - ${location.city}`}
              {location.state && `, ${location.state}`}
            </span>
          ),
        }}
        onChange={(value) => value.resource && props.onChange(value.resource)}
        staleTime={props.staleTime || Infinity}
        sortBy="name|asc"
        key="location_selector"
        clearInputAfterSelection={props.clearInputAfterSelection}
      />

      <ErrorMessage className="mt-2">{props.errorMessage}</ErrorMessage>
    </>
  );
}

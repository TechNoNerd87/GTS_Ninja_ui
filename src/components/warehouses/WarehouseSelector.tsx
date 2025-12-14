/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Warehouse } from '$app/common/interfaces/warehouse';
import { GenericSelectorProps } from '$app/common/interfaces/generic-selector-props';
import { useTranslation } from 'react-i18next';
import { ComboboxAsync } from '../forms/Combobox';
import { endpoint } from '$app/common/helpers';
import { ErrorMessage } from '../ErrorMessage';

export interface WarehouseSelectorProps
  extends GenericSelectorProps<Warehouse> {
  staleTime?: number;
}

export function WarehouseSelector(props: WarehouseSelectorProps) {
  const [t] = useTranslation();

  return (
    <>
      <ComboboxAsync<Warehouse>
        inputOptions={{
          label: props.inputLabel?.toString() || t('warehouse'),
          value: props.value || null,
        }}
        endpoint={endpoint('/api/v1/warehouses?is_active=true&sort=name|asc')}
        readonly={props.readonly}
        onDismiss={props.onClearButtonClick}
        querySpecificEntry="/api/v1/warehouses/:id"
        entryOptions={{
          id: 'id',
          label: 'name',
          value: 'id',
          dropdownLabelFn: (warehouse) => (
            <div className="flex flex-col">
              <span>{warehouse.name}</span>
              {warehouse.code && (
                <span className="text-xs text-gray-500">{warehouse.code}</span>
              )}
            </div>
          ),
        }}
        onChange={(value) => value.resource && props.onChange(value.resource)}
        staleTime={props.staleTime || Infinity}
        sortBy="name|asc"
        key="warehouse_selector"
      />

      <ErrorMessage className="mt-2">{props.errorMessage}</ErrorMessage>
    </>
  );
}

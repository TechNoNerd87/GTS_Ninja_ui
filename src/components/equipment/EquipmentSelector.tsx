/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Equipment } from '$app/common/interfaces/equipment';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ComboboxAsync, Entry } from '../forms/Combobox';
import { endpoint } from '$app/common/helpers';
import { useHasPermission } from '$app/common/hooks/permissions/useHasPermission';
import { useColorScheme } from '$app/common/colors';
import { ErrorMessage } from '../ErrorMessage';

interface Props {
  value?: string | number | boolean;
  clearButton?: boolean;
  className?: string;
  onChange?: (value: Entry<Equipment>) => unknown;
  onClearButtonClick?: () => unknown;
  onInputFocus?: () => unknown;
  errorMessage?: string | string[];
  onInputValueChange?: (value: string) => void;
  label?: string | undefined;
  withoutAction?: boolean;
  clearInputAfterSelection?: boolean;
  withShadow?: boolean;
  clientId?: string;
}

export function EquipmentSelector(props: Props) {
  const [t] = useTranslation();

  const colors = useColorScheme();

  const hasPermission = useHasPermission();

  const buildEndpoint = () => {
    let url = '/api/v1/equipment?per_page=500&status=active';

    if (props.clientId) {
      url += `&client_id=${props.clientId}`;
    }

    return endpoint(url);
  };

  return (
    <>
      <ComboboxAsync<Equipment>
        endpoint={buildEndpoint()}
        inputOptions={{ value: props.value ?? null, label: props.label }}
        entryOptions={{
          id: 'id',
          label: 'name',
          value: 'id',
          searchable: 'serial_number',
          dropdownLabelFn: (equipment) => (
            <div className="flex flex-col flex-1 max-w-[33rem]">
              <div className="flex space-x-1">
                <p className="font-medium truncate">{equipment.name}</p>
              </div>

              {equipment.serial_number && (
                <p
                  className="text-xs font-medium truncate"
                  style={{ color: colors.$22 }}
                >
                  {t('serial_number')}: {equipment.serial_number}
                </p>
              )}

              {equipment.client?.display_name && (
                <p
                  className="text-xs truncate"
                  style={{ color: colors.$22 }}
                >
                  {equipment.client.display_name}
                </p>
              )}
            </div>
          ),
        }}
        onChange={(equipment) => props.onChange && props.onChange(equipment)}
        onInputValueChange={props.onInputValueChange}
        action={{
          label: t('new_equipment'),
          onClick: () => window.open('/equipment/create', '_blank'),
          visible: hasPermission('create_equipment') && !props.withoutAction,
        }}
        onDismiss={props.onClearButtonClick}
        sortBy="name|asc"
        nullable
        key="equipment_selector"
        clearInputAfterSelection={props.clearInputAfterSelection}
        withShadow={props.withShadow}
      />

      <ErrorMessage className="mt-2">{props.errorMessage}</ErrorMessage>
    </>
  );
}

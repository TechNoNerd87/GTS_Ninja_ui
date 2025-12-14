/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Contract } from '$app/common/interfaces/contract';
import { useTranslation } from 'react-i18next';
import { ComboboxAsync, Entry } from '../forms/Combobox';
import { endpoint } from '$app/common/helpers';
import { useHasPermission } from '$app/common/hooks/permissions/useHasPermission';
import { useColorScheme } from '$app/common/colors';
import { ErrorMessage } from '../ErrorMessage';
import { Badge } from '../Badge';

interface Props {
  value?: string | number | boolean;
  clearButton?: boolean;
  className?: string;
  onChange?: (value: Entry<Contract>) => unknown;
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

export function ContractSelector(props: Props) {
  const [t] = useTranslation();

  const colors = useColorScheme();

  const hasPermission = useHasPermission();

  const buildEndpoint = () => {
    let url = '/api/v1/contracts?per_page=500&status=active';

    if (props.clientId) {
      url += `&client_id=${props.clientId}`;
    }

    return endpoint(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'green';
      case 'expired':
        return 'red';
      case 'pending':
        return 'yellow';
      default:
        return 'gray';
    }
  };

  return (
    <>
      <ComboboxAsync<Contract>
        endpoint={buildEndpoint()}
        inputOptions={{ value: props.value ?? null, label: props.label }}
        entryOptions={{
          id: 'id',
          label: 'name',
          value: 'id',
          searchable: 'contract_number',
          dropdownLabelFn: (contract) => (
            <div className="flex flex-col flex-1 max-w-[33rem]">
              <div className="flex space-x-2 items-center">
                <p className="font-medium truncate">{contract.name}</p>
                <Badge variant={getStatusColor(contract.status)}>
                  {t(contract.status)}
                </Badge>
              </div>

              {contract.contract_number && (
                <p
                  className="text-xs font-medium truncate"
                  style={{ color: colors.$22 }}
                >
                  #{contract.contract_number}
                </p>
              )}

              {contract.client?.display_name && (
                <p
                  className="text-xs truncate"
                  style={{ color: colors.$22 }}
                >
                  {contract.client.display_name}
                </p>
              )}
            </div>
          ),
        }}
        onChange={(contract) => props.onChange && props.onChange(contract)}
        onInputValueChange={props.onInputValueChange}
        action={{
          label: t('new_contract'),
          onClick: () => window.open('/contracts/create', '_blank'),
          visible: hasPermission('create_contract') && !props.withoutAction,
        }}
        onDismiss={props.onClearButtonClick}
        sortBy="name|asc"
        nullable
        key="contract_selector"
        clearInputAfterSelection={props.clearInputAfterSelection}
        withShadow={props.withShadow}
      />

      <ErrorMessage className="mt-2">{props.errorMessage}</ErrorMessage>
    </>
  );
}

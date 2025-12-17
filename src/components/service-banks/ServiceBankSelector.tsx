/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { ServiceBank } from '$app/common/interfaces/service-bank';
import { useTranslation } from 'react-i18next';
import { ComboboxAsync, Entry } from '../forms/Combobox';
import { endpoint } from '$app/common/helpers';
import { useHasPermission } from '$app/common/hooks/permissions/useHasPermission';
import { useColorScheme } from '$app/common/colors';
import { ErrorMessage } from '../ErrorMessage';
import { Badge } from '../Badge';
import { useFormatMoney } from '$app/common/hooks/money/useFormatMoney';

interface Props {
  value?: string | number | boolean;
  clearButton?: boolean;
  className?: string;
  onChange?: (value: Entry<ServiceBank>) => unknown;
  onClearButtonClick?: () => unknown;
  onInputFocus?: () => unknown;
  errorMessage?: string | string[];
  onInputValueChange?: (value: string) => void;
  label?: string | undefined;
  withoutAction?: boolean;
  clearInputAfterSelection?: boolean;
  withShadow?: boolean;
  clientId?: string;
  contractId?: string;
  bankType?: string;
  activeOnly?: boolean;
}

export function ServiceBankSelector(props: Props) {
  const [t] = useTranslation();

  const colors = useColorScheme();

  const hasPermission = useHasPermission();

  const formatMoney = useFormatMoney();

  const buildEndpoint = () => {
    let url = '/api/v1/service_banks?per_page=500&include=client,contract';

    if (props.activeOnly ?? true) {
      url += '&is_active=true';
    }

    if (props.clientId) {
      url += `&client_id=${props.clientId}`;
    }

    if (props.contractId) {
      url += `&contract_id=${props.contractId}`;
    }

    if (props.bankType) {
      url += `&bank_type=${props.bankType}`;
    }

    return endpoint(url);
  };

  const getBankTypeLabel = (bankType: string) => {
    switch (bankType) {
      case 'hours':
        return t('hours');
      case 'currency':
        return t('currency');
      case 'incidents':
        return t('incidents');
      case 'combined':
        return t('combined');
      default:
        return bankType;
    }
  };

  const getBalanceDisplay = (bank: ServiceBank) => {
    switch (bank.bank_type) {
      case 'hours':
        return `${bank.hours_balance.toFixed(2)} ${t('hours')}`;
      case 'currency':
        return formatMoney(
          bank.currency_balance,
          bank.client?.country_id,
          bank.client?.settings?.currency_id
        );
      case 'incidents':
        return `${bank.incidents_balance} ${t('incidents')}`;
      case 'combined':
        return `${bank.hours_balance.toFixed(2)}h / ${formatMoney(
          bank.currency_balance,
          bank.client?.country_id,
          bank.client?.settings?.currency_id
        )} / ${bank.incidents_balance}i`;
      default:
        return '';
    }
  };

  const getStatusVariant = (bank: ServiceBank) => {
    if (!bank.is_active || !bank.is_valid) return 'red';
    if (bank.is_low_balance) return 'yellow';
    return 'green';
  };

  return (
    <>
      <ComboboxAsync<ServiceBank>
        endpoint={buildEndpoint()}
        inputOptions={{ value: props.value ?? null, label: props.label }}
        entryOptions={{
          id: 'id',
          label: 'name',
          value: 'id',
          searchable: 'name',
          dropdownLabelFn: (bank) => (
            <div className="flex flex-col flex-1 max-w-[33rem]">
              <div className="flex space-x-2 items-center">
                <p className="font-medium truncate">{bank.name}</p>
                <Badge variant={getStatusVariant(bank)}>
                  {getBankTypeLabel(bank.bank_type)}
                </Badge>
              </div>

              <p
                className="text-xs font-medium truncate"
                style={{ color: colors.$22 }}
              >
                {t('balance')}: {getBalanceDisplay(bank)}
              </p>

              {bank.owner_name && (
                <p
                  className="text-xs truncate"
                  style={{ color: colors.$22 }}
                >
                  {bank.owner_name}
                </p>
              )}
            </div>
          ),
        }}
        onChange={(bank) => props.onChange && props.onChange(bank)}
        onInputValueChange={props.onInputValueChange}
        action={{
          label: t('new_service_bank'),
          onClick: () => window.open('/service_banks/create', '_blank'),
          visible: hasPermission('create_service_bank') && !props.withoutAction,
        }}
        onDismiss={props.onClearButtonClick}
        sortBy="name|asc"
        nullable
        key="service_bank_selector"
        clearInputAfterSelection={props.clearInputAfterSelection}
        withShadow={props.withShadow}
      />

      <ErrorMessage className="mt-2">{props.errorMessage}</ErrorMessage>
    </>
  );
}

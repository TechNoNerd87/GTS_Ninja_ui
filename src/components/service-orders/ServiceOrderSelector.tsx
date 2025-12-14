/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { ServiceOrder } from '$app/common/interfaces/service-order';
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
  onChange?: (value: Entry<ServiceOrder>) => unknown;
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

export function ServiceOrderSelector(props: Props) {
  const [t] = useTranslation();

  const colors = useColorScheme();

  const hasPermission = useHasPermission();

  const buildEndpoint = () => {
    let url = '/api/v1/service_orders?per_page=500&include=status';

    if (props.clientId) {
      url += `&client_id=${props.clientId}`;
    }

    return endpoint(url);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'red';
      case 'high':
        return 'orange';
      case 'medium':
        return 'blue';
      default:
        return 'gray';
    }
  };

  return (
    <>
      <ComboboxAsync<ServiceOrder>
        endpoint={buildEndpoint()}
        inputOptions={{ value: props.value ?? null, label: props.label }}
        entryOptions={{
          id: 'id',
          label: 'title',
          value: 'id',
          searchable: 'order_number',
          dropdownLabelFn: (serviceOrder) => (
            <div className="flex flex-col flex-1 max-w-[33rem]">
              <div className="flex space-x-2 items-center">
                <p className="font-medium truncate">{serviceOrder.title}</p>
                <Badge variant={getPriorityColor(serviceOrder.priority)}>
                  {t(serviceOrder.priority)}
                </Badge>
              </div>

              {serviceOrder.order_number && (
                <p
                  className="text-xs font-medium truncate"
                  style={{ color: colors.$22 }}
                >
                  #{serviceOrder.order_number}
                </p>
              )}

              {serviceOrder.status?.name && (
                <p
                  className="text-xs truncate"
                  style={{ color: colors.$22 }}
                >
                  {serviceOrder.status.name}
                </p>
              )}
            </div>
          ),
        }}
        onChange={(serviceOrder) => props.onChange && props.onChange(serviceOrder)}
        onInputValueChange={props.onInputValueChange}
        action={{
          label: t('new_service_order'),
          onClick: () => window.open('/service_orders/create', '_blank'),
          visible: hasPermission('create_service_order') && !props.withoutAction,
        }}
        onDismiss={props.onClearButtonClick}
        sortBy="created_at|desc"
        nullable
        key="service_order_selector"
        clearInputAfterSelection={props.clearInputAfterSelection}
        withShadow={props.withShadow}
      />

      <ErrorMessage className="mt-2">{props.errorMessage}</ErrorMessage>
    </>
  );
}

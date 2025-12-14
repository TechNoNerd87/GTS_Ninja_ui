/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { endpoint } from '$app/common/helpers';
import { request } from '$app/common/helpers/request';
import { GenericManyResponse } from '$app/common/interfaces/generic-many-response';
import { ServiceOrderStatus } from '$app/common/interfaces/service-order-status';
import { useQuery } from 'react-query';
import { GenericSingleResourceResponse } from '$app/common/interfaces/generic-api-response';
import { useAdmin } from '$app/common/hooks/permissions/useHasPermission';
import { toast } from '$app/common/helpers/toast/toast';
import { $refetch } from '../hooks/useRefetch';
import { GenericQueryOptions } from './invoices';

export function useBlankServiceOrderStatusQuery(options?: GenericQueryOptions) {
  const { isAdmin } = useAdmin();

  return useQuery<ServiceOrderStatus>(
    ['/api/v1/service_order_statuses', 'create'],
    () =>
      request('GET', endpoint('/api/v1/service_order_statuses/create')).then(
        (response: GenericSingleResourceResponse<ServiceOrderStatus>) =>
          response.data.data
      ),
    {
      staleTime: Infinity,
      enabled: isAdmin ? options?.enabled ?? true : false,
    }
  );
}

interface Params {
  status?: string;
}

export function useServiceOrderStatusesQuery(params?: Params) {
  return useQuery<GenericManyResponse<ServiceOrderStatus>>(
    ['/api/v1/service_order_statuses', params],
    () =>
      request(
        'GET',
        endpoint('/api/v1/service_order_statuses?status=:status', {
          status: params?.status || 'all',
        })
      ).then((response) => response.data),
    { staleTime: Infinity }
  );
}

export function useServiceOrderStatusQuery(params: { id: string | undefined }) {
  return useQuery(
    ['/api/v1/service_order_statuses', params.id],
    () =>
      request(
        'GET',
        endpoint('/api/v1/service_order_statuses/:id', { id: params.id })
      ),
    { staleTime: Infinity }
  );
}

export function useBulkAction() {
  return (id: string, action: 'archive' | 'restore' | 'delete') => {
    toast.processing();

    request('POST', endpoint('/api/v1/service_order_statuses/bulk'), {
      action,
      ids: [id],
    }).then(() => {
      toast.success(`${action}d_service_order_status`);

      $refetch(['service_order_statuses']);
    });
  };
}

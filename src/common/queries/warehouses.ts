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
import { Warehouse } from '$app/common/interfaces/warehouse';
import { useQuery } from 'react-query';
import { GenericSingleResourceResponse } from '$app/common/interfaces/generic-api-response';
import { useAdmin } from '$app/common/hooks/permissions/useHasPermission';
import { toast } from '$app/common/helpers/toast/toast';
import { $refetch } from '../hooks/useRefetch';
import { GenericQueryOptions } from './invoices';
import { AxiosResponse } from 'axios';

export function useBlankWarehouseQuery(options?: GenericQueryOptions) {
  const { isAdmin } = useAdmin();

  return useQuery<Warehouse>(
    ['/api/v1/warehouses', 'create'],
    () =>
      request('GET', endpoint('/api/v1/warehouses/create')).then(
        (response: GenericSingleResourceResponse<Warehouse>) =>
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

export function useWarehousesQuery(params?: Params) {
  return useQuery<GenericManyResponse<Warehouse>>(
    ['/api/v1/warehouses', params],
    () =>
      request(
        'GET',
        endpoint('/api/v1/warehouses?status=:status', {
          status: params?.status || 'all',
        })
      ).then((response) => response.data),
    { staleTime: Infinity }
  );
}

export function useWarehouseQuery(params: { id: string | undefined }) {
  return useQuery(
    ['/api/v1/warehouses', params.id],
    () =>
      request('GET', endpoint('/api/v1/warehouses/:id', { id: params.id })),
    { staleTime: Infinity }
  );
}

export function bulk(
  id: string[],
  action: 'archive' | 'restore' | 'delete'
): Promise<AxiosResponse> {
  return request('POST', endpoint('/api/v1/warehouses/bulk'), {
    action,
    ids: Array.from(id),
  });
}

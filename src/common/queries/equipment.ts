/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { AxiosResponse } from 'axios';
import { request } from '$app/common/helpers/request';
import { useQuery } from 'react-query';
import { endpoint } from '../helpers';
import { Equipment } from '$app/common/interfaces/equipment';
import { GenericSingleResourceResponse } from '$app/common/interfaces/generic-api-response';
import { GenericQueryOptions } from './invoices';
import { useHasPermission } from '$app/common/hooks/permissions/useHasPermission';
import { Params } from './common/params.interface';

interface EquipmentParams extends Params {
  include?: string;
}

export function useEquipmentListQuery(params?: EquipmentParams) {
  return useQuery<Equipment[]>(
    ['/api/v1/equipment'],
    () =>
      request(
        'GET',
        endpoint(
          '/api/v1/equipment?per_page=500&include=:include&status=:status',
          {
            include: params?.include || 'client,location',
            status: params?.status ?? 'all',
          }
        )
      ).then(
        (response: GenericSingleResourceResponse<Equipment[]>) =>
          response.data.data
      ),
    { staleTime: Infinity }
  );
}

export function useEquipmentQuery(params: { id: string | undefined }) {
  return useQuery(
    ['/api/v1/equipment', params.id],
    () =>
      request(
        'GET',
        endpoint('/api/v1/equipment/:id?include=client,location', {
          id: params.id,
        })
      ),
    { staleTime: Infinity }
  );
}

export function useBlankEquipmentQuery(options?: GenericQueryOptions) {
  const hasPermission = useHasPermission();

  return useQuery(
    ['/api/v1/equipment/create'],
    () =>
      request('GET', endpoint('/api/v1/equipment/create')).then(
        (response: GenericSingleResourceResponse<Equipment>) =>
          response.data.data
      ),
    {
      ...options,
      staleTime: Infinity,
      enabled: hasPermission('create_equipment')
        ? options?.enabled ?? true
        : false,
    }
  );
}

export function bulk(
  id: string[],
  action: 'archive' | 'restore' | 'delete'
): Promise<AxiosResponse> {
  return request('POST', endpoint('/api/v1/equipment/bulk'), {
    action,
    ids: Array.from(id),
  });
}

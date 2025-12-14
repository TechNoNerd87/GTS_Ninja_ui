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
import { Contract } from '$app/common/interfaces/contract';
import { GenericSingleResourceResponse } from '$app/common/interfaces/generic-api-response';
import { GenericQueryOptions } from './invoices';
import { useHasPermission } from '$app/common/hooks/permissions/useHasPermission';
import { Params } from './common/params.interface';

interface ContractsParams extends Params {
  include?: string;
}

export function useContractsQuery(params?: ContractsParams) {
  return useQuery<Contract[]>(
    ['/api/v1/contracts'],
    () =>
      request(
        'GET',
        endpoint(
          '/api/v1/contracts?per_page=500&include=:include&status=:status',
          {
            include: params?.include || 'client',
            status: params?.status ?? 'all',
          }
        )
      ).then(
        (response: GenericSingleResourceResponse<Contract[]>) =>
          response.data.data
      ),
    { staleTime: Infinity }
  );
}

export function useContractQuery(params: { id: string | undefined }) {
  return useQuery(
    ['/api/v1/contracts', params.id],
    () =>
      request(
        'GET',
        endpoint('/api/v1/contracts/:id?include=client,items,renewals', {
          id: params.id,
        })
      ),
    { staleTime: Infinity }
  );
}

export function useBlankContractQuery(options?: GenericQueryOptions) {
  const hasPermission = useHasPermission();

  return useQuery(
    ['/api/v1/contracts/create'],
    () =>
      request('GET', endpoint('/api/v1/contracts/create')).then(
        (response: GenericSingleResourceResponse<Contract>) =>
          response.data.data
      ),
    {
      ...options,
      staleTime: Infinity,
      enabled: hasPermission('create_contract')
        ? options?.enabled ?? true
        : false,
    }
  );
}

export function bulk(
  id: string[],
  action: 'archive' | 'restore' | 'delete'
): Promise<AxiosResponse> {
  return request('POST', endpoint('/api/v1/contracts/bulk'), {
    action,
    ids: Array.from(id),
  });
}

export function renewContract(id: string): Promise<AxiosResponse> {
  return request('POST', endpoint('/api/v1/contracts/:id/renew', { id }));
}

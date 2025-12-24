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
import { ServiceOrder } from '$app/common/interfaces/service-order';
import { GenericSingleResourceResponse } from '$app/common/interfaces/generic-api-response';
import { GenericQueryOptions } from './invoices';
import { useHasPermission } from '$app/common/hooks/permissions/useHasPermission';
import { Params } from './common/params.interface';

interface ServiceOrdersParams extends Params {
  include?: string;
}

export function useServiceOrdersQuery(params?: ServiceOrdersParams) {
  return useQuery<ServiceOrder[]>(
    ['/api/v1/service_orders'],
    () =>
      request(
        'GET',
        endpoint(
          '/api/v1/service_orders?per_page=500&include=:include&status=:status',
          {
            include:
              params?.include || 'client,equipment,contract,status,assigned_user',
            status: params?.status ?? 'all',
          }
        )
      ).then(
        (response: GenericSingleResourceResponse<ServiceOrder[]>) =>
          response.data.data
      ),
    { staleTime: Infinity }
  );
}

export function useServiceOrderQuery(params: { id: string | undefined }) {
  return useQuery(
    ['/api/v1/service_orders', params.id],
    () =>
      request(
        'GET',
        endpoint(
          '/api/v1/service_orders/:id?include=client,equipment,contract,status,assigned_user,labor_entries,parts_used,travels,expenses,tasks',
          {
            id: params.id,
          }
        )
      ),
    { staleTime: Infinity }
  );
}

export function useBlankServiceOrderQuery(options?: GenericQueryOptions) {
  const hasPermission = useHasPermission();

  return useQuery(
    ['/api/v1/service_orders/create'],
    () =>
      request('GET', endpoint('/api/v1/service_orders/create')).then(
        (response: GenericSingleResourceResponse<ServiceOrder>) =>
          response.data.data
      ),
    {
      ...options,
      staleTime: Infinity,
      enabled: hasPermission('create_service_order')
        ? options?.enabled ?? true
        : false,
    }
  );
}

export function bulk(
  id: string[],
  action: 'archive' | 'restore' | 'delete'
): Promise<AxiosResponse> {
  return request('POST', endpoint('/api/v1/service_orders/bulk'), {
    action,
    ids: Array.from(id),
  });
}

export function createInvoiceFromServiceOrder(
  id: string
): Promise<AxiosResponse> {
  return request(
    'POST',
    endpoint('/api/v1/service_orders/:id/invoice', { id })
  );
}

export function getInvoicePreview(id: string): Promise<AxiosResponse> {
  return request(
    'GET',
    endpoint('/api/v1/service_orders/:id/invoice_preview', { id })
  );
}

export function bulkInvoice(ids: string[]): Promise<AxiosResponse> {
  return request('POST', endpoint('/api/v1/service_orders/bulk_invoice'), {
    ids,
  });
}

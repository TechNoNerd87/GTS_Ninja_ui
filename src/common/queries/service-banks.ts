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
import {
  ServiceBank,
  ServiceBankTransaction,
  DepositHoursRequest,
  DepositCurrencyRequest,
  DepositIncidentsRequest,
  AdjustmentRequest,
} from '$app/common/interfaces/service-bank';
import { GenericSingleResourceResponse } from '$app/common/interfaces/generic-api-response';
import { GenericQueryOptions } from './invoices';
import { useHasPermission } from '$app/common/hooks/permissions/useHasPermission';
import { Params } from './common/params.interface';

interface ServiceBanksParams extends Params {
  include?: string;
  client_id?: string;
  contract_id?: string;
  bank_type?: string;
  is_active?: string;
  low_balance?: string;
  has_available_hours?: string;
}

export function useServiceBanksQuery(params?: ServiceBanksParams) {
  return useQuery<ServiceBank[]>(
    ['/api/v1/service_banks', params],
    () =>
      request(
        'GET',
        endpoint(
          '/api/v1/service_banks?per_page=500&include=:include&status=:status&client_id=:client_id&contract_id=:contract_id&bank_type=:bank_type&is_active=:is_active&low_balance=:low_balance',
          {
            include: params?.include || 'client,contract',
            status: params?.status ?? 'all',
            client_id: params?.client_id || '',
            contract_id: params?.contract_id || '',
            bank_type: params?.bank_type || '',
            is_active: params?.is_active || '',
            low_balance: params?.low_balance || '',
          }
        )
      ).then(
        (response: GenericSingleResourceResponse<ServiceBank[]>) =>
          response.data.data
      ),
    { staleTime: Infinity }
  );
}

export function useServiceBankQuery(params: { id: string | undefined }) {
  return useQuery(
    ['/api/v1/service_banks', params.id],
    () =>
      request(
        'GET',
        endpoint('/api/v1/service_banks/:id?include=client,contract,transactions', {
          id: params.id,
        })
      ),
    { staleTime: Infinity, enabled: Boolean(params.id) }
  );
}

export function useBlankServiceBankQuery(options?: GenericQueryOptions) {
  const hasPermission = useHasPermission();

  return useQuery(
    ['/api/v1/service_banks/create'],
    () =>
      request('GET', endpoint('/api/v1/service_banks/create')).then(
        (response: GenericSingleResourceResponse<ServiceBank>) =>
          response.data.data
      ),
    {
      ...options,
      staleTime: Infinity,
      enabled: hasPermission('create_service_bank')
        ? options?.enabled ?? true
        : false,
    }
  );
}

export function useServiceBankTransactionsQuery(params: { id: string | undefined }) {
  return useQuery<ServiceBankTransaction[]>(
    ['/api/v1/service_banks', params.id, 'transactions'],
    () =>
      request(
        'GET',
        endpoint('/api/v1/service_banks/:id/transactions', { id: params.id })
      ).then(
        (response: GenericSingleResourceResponse<ServiceBankTransaction[]>) =>
          response.data.data
      ),
    { staleTime: Infinity, enabled: Boolean(params.id) }
  );
}

export function bulk(
  id: string[],
  action: 'archive' | 'restore' | 'delete'
): Promise<AxiosResponse> {
  return request('POST', endpoint('/api/v1/service_banks/bulk'), {
    action,
    ids: Array.from(id),
  });
}

export function depositHours(
  id: string,
  data: DepositHoursRequest
): Promise<AxiosResponse> {
  return request(
    'POST',
    endpoint('/api/v1/service_banks/:id/deposit_hours', { id }),
    data
  );
}

export function depositCurrency(
  id: string,
  data: DepositCurrencyRequest
): Promise<AxiosResponse> {
  return request(
    'POST',
    endpoint('/api/v1/service_banks/:id/deposit_currency', { id }),
    data
  );
}

export function depositIncidents(
  id: string,
  data: DepositIncidentsRequest
): Promise<AxiosResponse> {
  return request(
    'POST',
    endpoint('/api/v1/service_banks/:id/deposit_incidents', { id }),
    data
  );
}

export function adjustment(
  id: string,
  data: AdjustmentRequest
): Promise<AxiosResponse> {
  return request(
    'POST',
    endpoint('/api/v1/service_banks/:id/adjustment', { id }),
    data
  );
}

export function useAvailableServiceBanksForClient(clientId: string | undefined) {
  return useQuery<ServiceBank[]>(
    ['/api/v1/service_banks', 'available', clientId],
    () =>
      request(
        'GET',
        endpoint(
          '/api/v1/service_banks?per_page=500&client_id=:client_id&is_active=true&include=contract',
          { client_id: clientId || '' }
        )
      ).then(
        (response: GenericSingleResourceResponse<ServiceBank[]>) =>
          response.data.data
      ),
    { staleTime: Infinity, enabled: Boolean(clientId) }
  );
}

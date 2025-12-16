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
import { Rate, RateType } from '$app/common/interfaces/rate';
import { useQuery } from 'react-query';
import { GenericSingleResourceResponse } from '$app/common/interfaces/generic-api-response';
import { useAdmin } from '$app/common/hooks/permissions/useHasPermission';
import { toast } from '$app/common/helpers/toast/toast';
import { $refetch } from '../hooks/useRefetch';
import { GenericQueryOptions } from './invoices';

export function useBlankRateQuery(options?: GenericQueryOptions) {
  const { isAdmin } = useAdmin();

  return useQuery<Rate>(
    ['/api/v1/rates', 'create'],
    () =>
      request('GET', endpoint('/api/v1/rates/create')).then(
        (response: GenericSingleResourceResponse<Rate>) =>
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
  rateType?: RateType;
  isActive?: boolean;
  isContractRate?: boolean;
  groupSettingId?: string;
}

export function useRatesQuery(params?: Params) {
  let queryString = '?status=' + (params?.status || 'all');

  if (params?.rateType) {
    queryString += `&rate_type=${params.rateType}`;
  }

  if (params?.isActive !== undefined) {
    queryString += `&is_active=${params.isActive}`;
  }

  if (params?.isContractRate !== undefined) {
    queryString += `&is_contract_rate=${params.isContractRate}`;
  }

  if (params?.groupSettingId) {
    queryString += `&group_setting_id=${params.groupSettingId}`;
  }

  return useQuery<GenericManyResponse<Rate>>(
    ['/api/v1/rates', params],
    () =>
      request('GET', endpoint('/api/v1/rates' + queryString)).then(
        (response) => response.data
      ),
    { staleTime: Infinity }
  );
}

export function useServiceRatesQuery(params?: Omit<Params, 'rateType'>) {
  return useRatesQuery({ ...params, rateType: 'service' });
}

export function useTravelRatesQuery(params?: Omit<Params, 'rateType'>) {
  return useRatesQuery({ ...params, rateType: 'travel' });
}

export function useRateQuery(params: { id: string | undefined }) {
  return useQuery(
    ['/api/v1/rates', params.id],
    () =>
      request('GET', endpoint('/api/v1/rates/:id', { id: params.id })),
    { staleTime: Infinity, enabled: !!params.id }
  );
}

export function useBulkAction() {
  return (id: string, action: 'archive' | 'restore' | 'delete') => {
    toast.processing();

    request('POST', endpoint('/api/v1/rates/bulk'), {
      action,
      ids: [id],
    }).then(() => {
      toast.success(`${action}d_rate`);

      $refetch(['rates']);
    });
  };
}

/**
 * Hook to get the default rate for a given type
 */
export function useDefaultRate(rateType: RateType) {
  const { data: rates } = useRatesQuery({
    rateType,
    isActive: true,
  });

  if (!rates?.data) {
    return null;
  }

  return rates.data.find((rate) => rate.is_default) || rates.data[0] || null;
}

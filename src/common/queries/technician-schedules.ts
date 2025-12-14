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
import { TechnicianSchedule } from '$app/common/interfaces/technician-schedule';
import { GenericSingleResourceResponse } from '$app/common/interfaces/generic-api-response';
import { GenericQueryOptions } from './invoices';
import { useHasPermission } from '$app/common/hooks/permissions/useHasPermission';
import { Params } from './common/params.interface';

interface TechnicianSchedulesParams extends Params {
  include?: string;
  user_id?: string;
  start_date?: string;
  end_date?: string;
}

export function useTechnicianSchedulesQuery(
  params?: TechnicianSchedulesParams
) {
  const queryParams = new URLSearchParams();
  queryParams.append('per_page', '500');
  queryParams.append('include', params?.include || 'user,service_order');
  queryParams.append('status', params?.status ?? 'all');

  if (params?.user_id) {
    queryParams.append('user_id', params.user_id);
  }
  if (params?.start_date) {
    queryParams.append('start_date', params.start_date);
  }
  if (params?.end_date) {
    queryParams.append('end_date', params.end_date);
  }

  return useQuery<TechnicianSchedule[]>(
    ['/api/v1/technician_schedules', params],
    () =>
      request(
        'GET',
        endpoint(`/api/v1/technician_schedules?${queryParams.toString()}`)
      ).then(
        (response: GenericSingleResourceResponse<TechnicianSchedule[]>) =>
          response.data.data
      ),
    { staleTime: Infinity }
  );
}

export function useTechnicianScheduleQuery(params: {
  id: string | undefined;
}) {
  return useQuery(
    ['/api/v1/technician_schedules', params.id],
    () =>
      request(
        'GET',
        endpoint(
          '/api/v1/technician_schedules/:id?include=user,service_order',
          {
            id: params.id,
          }
        )
      ),
    { staleTime: Infinity }
  );
}

export function useBlankTechnicianScheduleQuery(
  options?: GenericQueryOptions
) {
  const hasPermission = useHasPermission();

  return useQuery(
    ['/api/v1/technician_schedules/create'],
    () =>
      request('GET', endpoint('/api/v1/technician_schedules/create')).then(
        (response: GenericSingleResourceResponse<TechnicianSchedule>) =>
          response.data.data
      ),
    {
      ...options,
      staleTime: Infinity,
      enabled: hasPermission('create_technician_schedule')
        ? options?.enabled ?? true
        : false,
    }
  );
}

export function bulk(
  id: string[],
  action: 'archive' | 'restore' | 'delete'
): Promise<AxiosResponse> {
  return request('POST', endpoint('/api/v1/technician_schedules/bulk'), {
    action,
    ids: Array.from(id),
  });
}

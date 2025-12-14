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
import { MaintenanceSchedule } from '$app/common/interfaces/maintenance-schedule';
import { GenericSingleResourceResponse } from '$app/common/interfaces/generic-api-response';
import { GenericQueryOptions } from './invoices';
import { useHasPermission } from '$app/common/hooks/permissions/useHasPermission';
import { Params } from './common/params.interface';

interface MaintenanceSchedulesParams extends Params {
  include?: string;
}

export function useMaintenanceSchedulesQuery(
  params?: MaintenanceSchedulesParams
) {
  return useQuery<MaintenanceSchedule[]>(
    ['/api/v1/maintenance_schedules'],
    () =>
      request(
        'GET',
        endpoint(
          '/api/v1/maintenance_schedules?per_page=500&include=:include&status=:status',
          {
            include: params?.include || 'equipment',
            status: params?.status ?? 'all',
          }
        )
      ).then(
        (response: GenericSingleResourceResponse<MaintenanceSchedule[]>) =>
          response.data.data
      ),
    { staleTime: Infinity }
  );
}

export function useMaintenanceScheduleQuery(params: {
  id: string | undefined;
}) {
  return useQuery(
    ['/api/v1/maintenance_schedules', params.id],
    () =>
      request(
        'GET',
        endpoint('/api/v1/maintenance_schedules/:id?include=equipment', {
          id: params.id,
        })
      ),
    { staleTime: Infinity }
  );
}

export function useBlankMaintenanceScheduleQuery(
  options?: GenericQueryOptions
) {
  const hasPermission = useHasPermission();

  return useQuery(
    ['/api/v1/maintenance_schedules/create'],
    () =>
      request('GET', endpoint('/api/v1/maintenance_schedules/create')).then(
        (response: GenericSingleResourceResponse<MaintenanceSchedule>) =>
          response.data.data
      ),
    {
      ...options,
      staleTime: Infinity,
      enabled: hasPermission('create_maintenance_schedule')
        ? options?.enabled ?? true
        : false,
    }
  );
}

export function bulk(
  id: string[],
  action: 'archive' | 'restore' | 'delete'
): Promise<AxiosResponse> {
  return request('POST', endpoint('/api/v1/maintenance_schedules/bulk'), {
    action,
    ids: Array.from(id),
  });
}

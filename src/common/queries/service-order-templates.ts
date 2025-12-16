/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2025. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useQuery, useMutation, useQueryClient } from 'react-query';
import { request } from '$app/common/helpers/request';
import { endpoint } from '$app/common/helpers';
import { toast } from '$app/common/helpers/toast/toast';
import { ServiceOrderTemplate } from '../interfaces/service-order-template';
import { GenericSingleResourceResponse } from '../interfaces/generic-api-response';

interface Params {
  id?: string;
  enabled?: boolean;
}

export function useServiceOrderTemplateQuery(params: Params) {
  return useQuery<ServiceOrderTemplate>(
    ['service_order_templates', params.id],
    () =>
      request(
        'GET',
        endpoint('/api/v1/service_order_templates/:id', { id: params.id })
      ).then(
        (response: GenericSingleResourceResponse<ServiceOrderTemplate>) =>
          response.data.data
      ),
    { enabled: params.enabled ?? true, staleTime: Infinity }
  );
}

export function useServiceOrderTemplatesQuery() {
  return useQuery<ServiceOrderTemplate[]>(
    ['service_order_templates'],
    () =>
      request('GET', endpoint('/api/v1/service_order_templates')).then(
        (response) => response.data.data
      ),
    { staleTime: Infinity }
  );
}

export function useBlankServiceOrderTemplateQuery() {
  return useQuery<ServiceOrderTemplate>(
    ['service_order_templates', 'create'],
    () =>
      request('GET', endpoint('/api/v1/service_order_templates/create')).then(
        (response: GenericSingleResourceResponse<ServiceOrderTemplate>) =>
          response.data.data
      ),
    { staleTime: Infinity }
  );
}

export function useSaveServiceOrderTemplate() {
  const queryClient = useQueryClient();

  return useMutation(
    (template: ServiceOrderTemplate) => {
      const isNew = !template.id || template.id === '';

      if (isNew) {
        return request(
          'POST',
          endpoint('/api/v1/service_order_templates'),
          template
        );
      }

      return request(
        'PUT',
        endpoint('/api/v1/service_order_templates/:id', { id: template.id }),
        template
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['service_order_templates']);
      },
    }
  );
}

export function useDeleteServiceOrderTemplate() {
  const queryClient = useQueryClient();

  return useMutation(
    (id: string) =>
      request(
        'DELETE',
        endpoint('/api/v1/service_order_templates/:id', { id })
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['service_order_templates']);
        toast.success('deleted_service_order_template');
      },
    }
  );
}

export function useBulkServiceOrderTemplates() {
  const queryClient = useQueryClient();

  return useMutation(
    (data: { ids: string[]; action: string }) =>
      request('POST', endpoint('/api/v1/service_order_templates/bulk'), data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['service_order_templates']);
      },
    }
  );
}

export function useCreateServiceOrderFromTemplate() {
  const queryClient = useQueryClient();

  return useMutation(
    (data: { templateId: string; overrides?: Record<string, unknown> }) =>
      request(
        'POST',
        endpoint(
          '/api/v1/service_order_templates/:id/create_service_order',
          { id: data.templateId }
        ),
        { overrides: data.overrides }
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['service_orders']);
        toast.success('created_service_order');
      },
    }
  );
}

export function useCreateTemplateFromServiceOrder() {
  const queryClient = useQueryClient();

  return useMutation(
    (data: {
      serviceOrderId: string;
      name: string;
      description?: string;
      category?: string;
    }) =>
      request(
        'POST',
        endpoint('/api/v1/service_orders/:id/create_template', {
          id: data.serviceOrderId,
        }),
        {
          name: data.name,
          description: data.description,
          category: data.category,
        }
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['service_order_templates']);
        toast.success('created_service_order_template');
      },
    }
  );
}

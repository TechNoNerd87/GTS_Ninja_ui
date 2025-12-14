/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { route } from '$app/common/helpers/route';
import { useHasPermission } from '$app/common/hooks/permissions/useHasPermission';
import { useEntityAssigned } from '$app/common/hooks/useEntityAssigned';
import { ServiceOrder } from '$app/common/interfaces/service-order';
import { DocumentsTabLabel } from '$app/components/DocumentsTabLabel';
import { Tab } from '$app/components/Tabs';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

interface Params {
  serviceOrder: ServiceOrder | undefined;
}

export function useTabs(params: Params) {
  const [t] = useTranslation();

  const { serviceOrder } = params;

  const { id } = useParams();

  const entityAssigned = useEntityAssigned();

  const hasPermission = useHasPermission();

  const canEditAndView =
    hasPermission('view_service_order') ||
    hasPermission('edit_service_order') ||
    entityAssigned(serviceOrder);

  const tabs: Tab[] = [
    {
      name: t('edit'),
      href: route('/service_orders/:id/edit', { id }),
    },
    {
      name: t('documents'),
      href: route('/service_orders/:id/documents', { id }),
      enabled: canEditAndView,
      formatName: () => (
        <DocumentsTabLabel numberOfDocuments={serviceOrder?.documents?.length} />
      ),
    },
  ];

  return tabs;
}

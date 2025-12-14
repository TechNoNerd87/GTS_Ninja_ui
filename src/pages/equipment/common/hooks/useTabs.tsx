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
import { Equipment } from '$app/common/interfaces/equipment';
import { DocumentsTabLabel } from '$app/components/DocumentsTabLabel';
import { Tab } from '$app/components/Tabs';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

interface Params {
  equipment: Equipment | undefined;
}

export function useTabs(params: Params) {
  const [t] = useTranslation();

  const { equipment } = params;

  const { id } = useParams();

  const entityAssigned = useEntityAssigned();

  const hasPermission = useHasPermission();

  const canEditAndView =
    hasPermission('view_equipment') ||
    hasPermission('edit_equipment') ||
    entityAssigned(equipment);

  const tabs: Tab[] = [
    {
      name: t('edit'),
      href: route('/equipment/:id/edit', { id }),
    },
    {
      name: t('documents'),
      href: route('/equipment/:id/documents', { id }),
      enabled: canEditAndView,
      formatName: () => (
        <DocumentsTabLabel numberOfDocuments={equipment?.documents?.length} />
      ),
    },
  ];

  return tabs;
}

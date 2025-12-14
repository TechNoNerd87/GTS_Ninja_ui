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
import { TechnicianSchedule } from '$app/common/interfaces/technician-schedule';
import { Tab } from '$app/components/Tabs';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

interface Params {
  technicianSchedule: TechnicianSchedule | undefined;
}

export function useTabs(params: Params) {
  const [t] = useTranslation();

  const { technicianSchedule } = params;

  const { id } = useParams();

  const entityAssigned = useEntityAssigned();

  const hasPermission = useHasPermission();

  const canEditAndView =
    hasPermission('view_technician_schedule') ||
    hasPermission('edit_technician_schedule') ||
    entityAssigned(technicianSchedule);

  const tabs: Tab[] = [
    {
      name: t('edit'),
      href: route('/technician_schedules/:id/edit', { id }),
    },
  ];

  return tabs;
}

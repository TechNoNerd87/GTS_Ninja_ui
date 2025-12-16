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
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Tab } from '$app/components/Tabs';

export function useTabs() {
  const [t] = useTranslation();
  const { id } = useParams();

  const tabs: Tab[] = [
    {
      name: t('overview'),
      href: route('/service_banks/:id', { id }),
    },
    {
      name: t('edit'),
      href: route('/service_banks/:id/edit', { id }),
    },
    {
      name: t('transactions'),
      href: route('/service_banks/:id/transactions', { id }),
    },
  ];

  return tabs;
}

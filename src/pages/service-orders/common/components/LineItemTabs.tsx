/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useTranslation } from 'react-i18next';
import { useColorScheme } from '$app/common/colors';
import { MdBuild, MdInventory, MdDirectionsCar, MdReceipt, MdChecklist } from 'react-icons/md';
import { Icon } from '$app/components/icons/Icon';
import classNames from 'classnames';

export type LineItemTabType = 'labor' | 'parts' | 'travel' | 'expenses' | 'tasks';

interface Props {
  activeTab: LineItemTabType;
  onTabChange: (tab: LineItemTabType) => void;
  counts: {
    labor: number;
    parts: number;
    travel: number;
    expenses: number;
    tasks: number;
  };
}

export function LineItemTabs(props: Props) {
  const [t] = useTranslation();
  const colors = useColorScheme();

  const { activeTab, onTabChange, counts } = props;

  const tabs: { key: LineItemTabType; label: string; icon: typeof MdBuild; count: number }[] = [
    { key: 'labor', label: t('labor'), icon: MdBuild, count: counts.labor },
    { key: 'parts', label: t('parts'), icon: MdInventory, count: counts.parts },
    { key: 'travel', label: t('travel'), icon: MdDirectionsCar, count: counts.travel },
    { key: 'expenses', label: t('expenses'), icon: MdReceipt, count: counts.expenses },
    { key: 'tasks', label: t('tasks'), icon: MdChecklist, count: counts.tasks },
  ];

  return (
    <div
      className="flex border-b"
      style={{ borderColor: colors.$5 }}
    >
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onTabChange(tab.key)}
          className={classNames(
            'flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors',
            'hover:bg-gray-50 dark:hover:bg-gray-800',
            'focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500',
            {
              'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400': activeTab === tab.key,
              'text-gray-600 dark:text-gray-400': activeTab !== tab.key,
            }
          )}
        >
          <Icon element={tab.icon} size={18} />
          <span>{tab.label}</span>
          {tab.count > 0 && (
            <span
              className={classNames(
                'inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full',
                {
                  'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300': activeTab === tab.key,
                  'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300': activeTab !== tab.key,
                }
              )}
            >
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

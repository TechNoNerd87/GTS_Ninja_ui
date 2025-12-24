/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useState } from 'react';
import { useColorScheme } from '$app/common/colors';
import { MdExpandMore, MdExpandLess } from 'react-icons/md';
import { Icon } from '$app/components/icons/Icon';
import classNames from 'classnames';

interface Props {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export function CollapsibleSection(props: Props) {
  const colors = useColorScheme();

  const { title, defaultOpen = false, children } = props;

  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div
      className="border rounded-lg overflow-hidden"
      style={{ borderColor: colors.$5, backgroundColor: colors.$1 }}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={classNames(
          'w-full flex items-center justify-between px-4 py-3',
          'text-left font-medium transition-colors',
          'hover:bg-gray-50 dark:hover:bg-gray-800',
          'focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500'
        )}
        style={{ color: colors.$3 }}
      >
        <span>{title}</span>
        <Icon
          element={isOpen ? MdExpandLess : MdExpandMore}
          size={24}
          className="text-gray-500"
        />
      </button>

      {isOpen && (
        <div
          className="px-4 py-4 border-t"
          style={{ borderColor: colors.$5 }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

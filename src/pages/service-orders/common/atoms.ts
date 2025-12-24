/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { ServiceOrder } from '$app/common/interfaces/service-order';
import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { LineItemTabType } from './components/LineItemTabs';

export const serviceOrderAtom = atom<ServiceOrder | undefined>(undefined);

export const activeLineItemTabAtom = atomWithStorage<LineItemTabType>(
  'service-order-active-tab',
  'labor'
);

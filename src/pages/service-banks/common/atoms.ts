/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { ServiceBank } from '$app/common/interfaces/service-bank';
import { atom } from 'jotai';

export const serviceBankAtom = atom<ServiceBank | undefined>(undefined);

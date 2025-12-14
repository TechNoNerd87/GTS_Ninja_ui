/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { TechnicianSchedule } from '$app/common/interfaces/technician-schedule';
import { atom } from 'jotai';

export const technicianScheduleAtom = atom<TechnicianSchedule | undefined>(undefined);

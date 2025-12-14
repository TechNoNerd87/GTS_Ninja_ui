/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { MaintenanceSchedule } from '$app/common/interfaces/maintenance-schedule';
import { atom } from 'jotai';

export const maintenanceScheduleAtom = atom<MaintenanceSchedule | undefined>(undefined);

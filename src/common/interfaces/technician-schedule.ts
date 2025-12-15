/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { ServiceOrder } from './service-order';
import { User } from './user';

export type TechnicianScheduleStatus =
  | 'scheduled'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface TechnicianSchedule {
  id: string;
  user_id: string;
  assigned_user_id: string;
  service_order_id: string;
  title: string;
  scheduled_start: string;
  scheduled_end: string;
  actual_start: string;
  actual_end: string;
  status: TechnicianScheduleStatus;
  notes: string;
  created_at: number;
  updated_at: number;
  archived_at: number;
  is_deleted: boolean;
  user?: User;
  service_order?: ServiceOrder;
}

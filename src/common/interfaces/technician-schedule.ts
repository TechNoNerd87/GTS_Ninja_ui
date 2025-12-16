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

export type ScheduleType =
  | 'service'
  | 'break'
  | 'travel'
  | 'meeting'
  | 'off';

export interface TechnicianSchedule {
  id: string;
  user_id: string;
  technician_user_id: string;
  service_order_id: string;
  title: string;
  schedule_date: string;
  start_time: string;
  end_time: string;
  schedule_type: ScheduleType;
  notes: string;
  custom_value1: string;
  custom_value2: string;
  custom_value3: string;
  custom_value4: string;
  created_at: number;
  updated_at: number;
  archived_at: number;
  is_deleted: boolean;
  user?: User;
  technician?: User;
  service_order?: ServiceOrder;
}

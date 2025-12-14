/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Equipment } from './equipment';

export type FrequencyType =
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'quarterly'
  | 'yearly';

export interface MaintenanceSchedule {
  id: string;
  equipment_id: string;
  name: string;
  frequency_type: FrequencyType;
  frequency_interval: number;
  last_completed_date: string;
  next_due_date: string;
  estimated_duration: number;
  notes: string;
  is_active: boolean;
  created_at: number;
  updated_at: number;
  archived_at: number;
  is_deleted: boolean;
  equipment?: Equipment;
}

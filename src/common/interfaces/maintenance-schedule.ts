/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Client } from './client';
import { Equipment } from './equipment';

export type FrequencyType =
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'quarterly'
  | 'yearly'
  | 'meter_based';

export type MeterType = 'hours' | 'miles' | 'kilometers' | 'cycles' | 'units';

export interface MaintenanceSchedule {
  id: string;
  user_id: string;
  assigned_user_id: string;
  equipment_id: string;
  client_id: string;
  number: string;
  name: string;
  description: string;
  frequency_type: FrequencyType;
  frequency_value: number;
  // Meter-based scheduling
  meter_type: MeterType;
  meter_interval: number;
  meter_threshold: number;
  // Dates
  start_date: string;
  end_date: string;
  next_due_date: string;
  last_completed_date: string;
  lead_time_days: number;
  // Estimates
  estimated_duration: number;
  estimated_cost: number;
  // Task/Parts lists (JSON)
  task_list: string;
  parts_list: string;
  // Settings
  is_active: boolean;
  auto_generate: boolean;
  notes: string;
  custom_value1: string;
  custom_value2: string;
  custom_value3: string;
  custom_value4: string;
  created_at: number;
  updated_at: number;
  archived_at: number;
  is_deleted: boolean;
  is_overdue: boolean;
  is_due_soon: boolean;
  equipment?: Equipment;
  client?: Client;
  documents?: any[];
}

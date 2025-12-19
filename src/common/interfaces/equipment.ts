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
import { Location } from './location';
import { Warehouse } from './warehouse';

export type EquipmentStatus = 'active' | 'inactive' | 'maintenance' | 'retired';

export interface EquipmentMeterReading {
  id: string;
  equipment_id: string;
  user_id: string;
  meter_type: 'hours' | 'miles' | 'kilometers' | 'cycles' | 'units';
  reading_value: number;
  reading_date: string;
  notes: string;
  created_at: number;
  updated_at: number;
  is_deleted: boolean;
}

export interface Equipment {
  id: string;
  user_id: string;
  assigned_user_id: string;
  client_id: string;
  location_id: string;
  warehouse_id: string;
  number: string;
  name: string;
  model: string;
  serial_number: string;
  asset_tag: string;
  manufacturer: string;
  category: string;
  status: EquipmentStatus;
  purchase_date: string;
  warranty_expiration: string;
  installation_date: string;
  purchase_cost: number;
  current_value: number;
  description: string;
  notes: string;
  specifications: string;
  custom_value1: string;
  custom_value2: string;
  custom_value3: string;
  custom_value4: string;
  created_at: number;
  updated_at: number;
  archived_at: number;
  is_deleted: boolean;
  is_under_warranty: boolean;
  uses_banking: boolean;
  default_service_bank_id: string;
  client?: Client;
  location?: Location;
  warehouse?: Warehouse;
  meter_readings?: EquipmentMeterReading[];
  documents?: any[];
}

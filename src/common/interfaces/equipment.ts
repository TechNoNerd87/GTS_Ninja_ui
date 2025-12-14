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

export type EquipmentStatus = 'active' | 'inactive' | 'maintenance' | 'retired';

export interface Equipment {
  id: string;
  client_id: string;
  location_id: string;
  name: string;
  serial_number: string;
  model_number: string;
  manufacturer: string;
  status: EquipmentStatus;
  purchase_date: string;
  warranty_expiration: string;
  notes: string;
  custom_value1: string;
  custom_value2: string;
  custom_value3: string;
  custom_value4: string;
  created_at: number;
  updated_at: number;
  archived_at: number;
  is_deleted: boolean;
  client?: Client;
  location?: Location;
  documents?: any[];
}

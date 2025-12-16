/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Location } from './location';

export interface Warehouse {
  id: string;
  user_id: string;
  assigned_user_id: string;
  location_id: string;
  country_id: string;
  name: string;
  code: string;
  description: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  postal_code: string;
  phone: string;
  email: string;
  is_active: boolean;
  is_default: boolean;
  notes: string;
  custom_value1: string;
  custom_value2: string;
  custom_value3: string;
  custom_value4: string;
  created_at: number;
  updated_at: number;
  archived_at: number;
  is_deleted: boolean;
  location?: Location;
  documents?: any[];
}

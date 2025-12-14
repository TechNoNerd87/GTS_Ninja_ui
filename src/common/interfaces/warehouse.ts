/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

export interface Warehouse {
  id: string;
  name: string;
  code: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  postal_code: string;
  country_id: string;
  phone: string;
  email: string;
  is_active: boolean;
  is_default: boolean;
  notes: string;
  created_at: number;
  updated_at: number;
  archived_at: number;
  is_deleted: boolean;
}

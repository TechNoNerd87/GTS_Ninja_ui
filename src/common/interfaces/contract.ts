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

export type ContractType =
  | 'warranty'
  | 'service_agreement'
  | 'maintenance'
  | 'support'
  | 'sla';

export type ContractStatus =
  | 'draft'
  | 'pending'
  | 'active'
  | 'expired'
  | 'cancelled';

export type BillingFrequency =
  | 'monthly'
  | 'quarterly'
  | 'semi_annual'
  | 'annual';

export interface ContractItem {
  id: string;
  contract_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
  sort_order: number;
  created_at: number;
  updated_at: number;
}

export interface ContractRenewal {
  id: string;
  contract_id: string;
  renewal_date: string;
  previous_end_date: string;
  new_end_date: string;
  notes: string;
  created_at: number;
}

export interface Contract {
  id: string;
  user_id: string;
  assigned_user_id: string;
  client_id: string;
  name: string;
  contract_number: string;
  contract_type: ContractType;
  status: ContractStatus;
  start_date: string;
  end_date: string;
  contract_value: number;
  billing_frequency: BillingFrequency;
  auto_renew: boolean;
  description: string;
  terms_and_conditions: string;
  custom_value1: string;
  custom_value2: string;
  custom_value3: string;
  custom_value4: string;
  created_at: number;
  updated_at: number;
  archived_at: number;
  is_deleted: boolean;
  client?: Client;
  items?: ContractItem[];
  renewals?: ContractRenewal[];
  documents?: any[];
}

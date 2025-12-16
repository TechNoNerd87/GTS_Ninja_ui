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
import { Contract } from './contract';
import { ServiceOrder } from './service-order';

export type ServiceBankType = 'hours' | 'currency' | 'incidents' | 'combined';

export type TransactionType =
  | 'deposit'
  | 'withdrawal'
  | 'adjustment'
  | 'rollover'
  | 'expiration'
  | 'refund';

export interface ServiceBankTransaction {
  id: string;
  service_bank_id: string;
  user_id: string;
  service_order_id: string;
  service_order_labor_id: string;
  transaction_type: TransactionType;
  hours_amount: number;
  currency_amount: number;
  incidents_amount: number;
  hours_balance_after: number;
  currency_balance_after: number;
  incidents_balance_after: number;
  transaction_date: string;
  description: string;
  reference_number: string;
  amount_paid: number;
  is_deleted: boolean;
  created_at: number;
  updated_at: number;
  archived_at: number;
  service_order?: ServiceOrder;
}

export interface ServiceBank {
  id: string;
  user_id: string;
  assigned_user_id: string;
  client_id: string;
  contract_id: string;
  name: string;
  description: string;
  bank_type: ServiceBankType;
  // Hours tracking
  hours_purchased: number;
  hours_used: number;
  hours_balance: number;
  hourly_rate: number;
  // Currency tracking
  currency_purchased: number;
  currency_used: number;
  currency_balance: number;
  // Incidents tracking
  incidents_purchased: number;
  incidents_used: number;
  incidents_balance: number;
  // Dates
  effective_date: string;
  expiration_date: string;
  // Settings
  is_active: boolean;
  allow_overage: boolean;
  rollover_unused: boolean;
  notify_low_balance: boolean;
  low_balance_threshold: number;
  // Notes
  notes: string;
  // Custom fields
  custom_value1: string;
  custom_value2: string;
  custom_value3: string;
  custom_value4: string;
  // Computed
  is_valid: boolean;
  is_low_balance: boolean;
  owner_name: string;
  // Timestamps
  is_deleted: boolean;
  created_at: number;
  updated_at: number;
  archived_at: number;
  // Relations
  client?: Client;
  contract?: Contract;
  transactions?: ServiceBankTransaction[];
}

export interface DepositHoursRequest {
  hours: number;
  description?: string;
  reference?: string;
  amount_paid?: number;
}

export interface DepositCurrencyRequest {
  amount: number;
  description?: string;
  reference?: string;
  amount_paid?: number;
}

export interface DepositIncidentsRequest {
  count: number;
  description?: string;
  reference?: string;
  amount_paid?: number;
}

export interface AdjustmentRequest {
  type: 'hours' | 'currency' | 'incidents';
  amount: number;
  description?: string;
}

/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

export type RateType = 'service' | 'travel';
export type UnitType = 'hour' | 'mile' | 'km' | 'flat' | 'each';
export type ServiceBankUnitType = 'hours' | 'currency' | 'incidents';

export interface Rate {
  id: string;
  user_id: string;
  name: string;
  description: string;
  code: string;
  rate_type: RateType;
  cost: number;
  charge: number;
  unit_type: UnitType;
  unit_label: string;
  group_setting_id: string;
  is_contract_rate: boolean;
  tax_rate_id: string;
  is_taxable: boolean;
  account_number: string;
  expense_account: string;
  income_account: string;
  can_use_service_bank: boolean;
  service_bank_unit_type: ServiceBankUnitType | '';
  is_overtime_rate: boolean;
  overtime_multiplier: number;
  base_rate_id: string;
  is_active: boolean;
  is_default: boolean;
  sort_order: number;
  custom_value1: string;
  custom_value2: string;
  custom_value3: string;
  custom_value4: string;
  is_deleted: boolean;
  created_at: number;
  updated_at: number;
  archived_at: number;
  // Computed fields from transformer
  margin: number;
  markup_percentage: number;
  display_unit_label: string;
}

export const blankRate: Rate = {
  id: '',
  user_id: '',
  name: '',
  description: '',
  code: '',
  rate_type: 'service',
  cost: 0,
  charge: 0,
  unit_type: 'hour',
  unit_label: '',
  group_setting_id: '',
  is_contract_rate: false,
  tax_rate_id: '',
  is_taxable: true,
  account_number: '',
  expense_account: '',
  income_account: '',
  can_use_service_bank: true,
  service_bank_unit_type: '',
  is_overtime_rate: false,
  overtime_multiplier: 0,
  base_rate_id: '',
  is_active: true,
  is_default: false,
  sort_order: 0,
  custom_value1: '',
  custom_value2: '',
  custom_value3: '',
  custom_value4: '',
  is_deleted: false,
  created_at: 0,
  updated_at: 0,
  archived_at: 0,
  margin: 0,
  markup_percentage: 0,
  display_unit_label: '',
};

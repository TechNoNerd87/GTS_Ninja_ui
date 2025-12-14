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
import { Equipment } from './equipment';
import { ServiceOrderStatus } from './service-order-status';
import { User } from './user';
import { Product } from './product';

export type ServiceOrderPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface ServiceOrderLabor {
  id: string;
  service_order_id: string;
  user_id: string;
  date: string;
  hours: number;
  rate: number;
  total: number;
  description: string;
  created_at: number;
  updated_at: number;
  user?: User;
}

export interface ServiceOrderPart {
  id: string;
  service_order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total: number;
  description: string;
  created_at: number;
  updated_at: number;
  product?: Product;
}

export interface ServiceOrder {
  id: string;
  client_id: string;
  equipment_id: string;
  contract_id: string;
  status_id: string;
  assigned_user_id: string;
  order_number: string;
  title: string;
  priority: ServiceOrderPriority;
  order_date: string;
  due_date: string;
  scheduled_start_date: string;
  completed_date: string;
  problem_description: string;
  resolution_notes: string;
  total_labor_cost: number;
  total_parts_cost: number;
  total_cost: number;
  custom_value1: string;
  custom_value2: string;
  custom_value3: string;
  custom_value4: string;
  created_at: number;
  updated_at: number;
  archived_at: number;
  is_deleted: boolean;
  client?: Client;
  equipment?: Equipment;
  contract?: Contract;
  status?: ServiceOrderStatus;
  assigned_user?: User;
  labor_entries?: ServiceOrderLabor[];
  parts?: ServiceOrderPart[];
  documents?: any[];
}

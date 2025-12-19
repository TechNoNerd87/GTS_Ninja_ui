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
import { Location } from './location';
import { MaintenanceSchedule } from './maintenance-schedule';
import { ServiceBank } from './service-bank';
import { ServiceOrderStatus } from './service-order-status';
import { User } from './user';
import { Product } from './product';
import { Warehouse } from './warehouse';

export type ServiceOrderPriority = 'low' | 'normal' | 'high' | 'urgent';
export type ServiceType = 'repair' | 'maintenance' | 'installation' | 'inspection';
export type TaskCompletionStatus = 'incomplete' | 'complete' | 'not_applicable' | 'skipped';
export type ExpenseCategory = 'fuel' | 'meals' | 'supplies' | 'parking' | 'tolls' | 'lodging' | 'equipment_rental' | 'subcontractor' | 'other';

export interface ServiceOrderLabor {
  id: string;
  service_order_id: string;
  user_id: string;
  technician_user_id: string;
  service_bank_id: string;
  start_time: string;
  end_time: string;
  duration_hours: number;
  no_charge_hours: number; // Non-billable portion
  hourly_rate: number;
  labor_rate_id: string;
  total_cost: number;
  tax_rate_id: string;
  description: string;
  is_billable: boolean;
  applied_to_bank: boolean;
  billable_hours: number; // Calculated: duration_hours - no_charge_hours
  created_at: number;
  updated_at: number;
  is_deleted: boolean;
  user?: User;
  technician?: User;
  service_bank?: ServiceBank;
}

export type PartStatus = 'reserved' | 'used' | 'returned' | 'defective';

export interface ServiceOrderPart {
  id: string;
  user_id: string;
  service_order_id: string;
  product_id: string;
  warehouse_id: string;
  service_bank_id: string;
  tax_rate_id: string;
  part_name: string;
  serial_number: string;
  lot_number: string;
  quantity: number;
  quantity_returned: number;
  return_reason: string;
  unit_cost: number;
  unit_price: number;
  total_cost: number;
  total_price: number;
  notes: string;
  warranty_months: number;
  warranty_expiration: string;
  is_billable: boolean;
  affects_inventory: boolean;
  inventory_deducted: boolean;
  inventory_deducted_at: string;
  applied_to_bank: boolean;
  part_status: PartStatus;
  // Computed fields
  is_serialized: boolean;
  is_under_warranty: boolean;
  effective_quantity: number;
  billable_amount: number;
  created_at: number;
  updated_at: number;
  archived_at: number;
  is_deleted: boolean;
  // Relations
  product?: Product;
  warehouse?: Warehouse;
  service_bank?: ServiceBank;
}

// Travel entry with service bank integration
export interface ServiceOrderTravel {
  id: string;
  service_order_id: string;
  user_id: string;
  technician_user_id: string;
  service_bank_id: string;
  travel_start_time: string;
  travel_end_time: string;
  duration_hours: number;
  distance: number;
  distance_unit: 'miles' | 'km';
  travel_details: string;
  notes: string;
  travel_rate_id: string;
  rate_quantity: number;
  no_charge_quantity: number; // Non-billable portion
  rate_amount: number;
  total_cost: number;
  is_billable: boolean;
  tax_rate_id: string;
  applied_to_bank: boolean;
  is_banked: boolean;
  billable_quantity: number; // Calculated: rate_quantity - no_charge_quantity
  created_at: number;
  updated_at: number;
  archived_at: number;
  is_deleted: boolean;
  technician?: User;
  service_bank?: ServiceBank;
}

// Expense entry with technician reimbursement
export interface ServiceOrderExpense {
  id: string;
  service_order_id: string;
  user_id: string;
  technician_user_id: string;
  name: string;
  description: string;
  expense_category: ExpenseCategory;
  expense_date: string;
  total_cost: number;
  tax_paid: number;
  charge_to_client: boolean;
  charge_amount: number;
  charge_tax_rate_id: string;
  reimburse_user: boolean;
  is_reimbursed: boolean;
  reimbursed_at: string;
  receipt_number: string;
  receipt_image: string;
  needs_reimbursement: boolean; // Calculated
  net_cost: number; // Calculated: total_cost - tax_paid
  created_at: number;
  updated_at: number;
  archived_at: number;
  is_deleted: boolean;
  technician?: User;
}

export type DependencyType = 'all' | 'any';

// Task entry for service order checklist
export interface ServiceOrderTask {
  id: string;
  service_order_id: string;
  user_id: string;
  task_id: string;
  task_group_id: string;
  depends_on_task_id: string;
  dependency_ids: string[];
  dependency_type: DependencyType;
  is_blocked: boolean;
  name: string;
  description: string;
  sort_order: number;
  completion_status: TaskCompletionStatus;
  completed_by_user_id: string;
  completed_at: string;
  completion_notes: string;
  estimated_duration: number;
  actual_duration: number;
  // Computed fields
  is_completed: boolean;
  has_dependencies: boolean;
  are_dependencies_satisfied: boolean;
  blocking_task_names: string[];
  created_at: number;
  updated_at: number;
  archived_at: number;
  is_deleted: boolean;
  // Relations
  task?: ServiceTask;
  task_group?: ServiceTaskGroup;
  completed_by?: User;
  depends_on_task?: ServiceOrderTask;
}

// Reusable task template
export interface ServiceTask {
  id: string;
  user_id: string;
  name: string;
  description: string;
  category: string;
  sort_order: number;
  estimated_duration: number;
  is_active: boolean;
  created_at: number;
  updated_at: number;
  archived_at: number;
  is_deleted: boolean;
}

// Task group for organizing tasks
export interface ServiceTaskGroup {
  id: string;
  user_id: string;
  name: string;
  description: string;
  sort_order: number;
  is_active: boolean;
  total_estimated_duration: number; // Calculated
  active_task_count: number; // Calculated
  created_at: number;
  updated_at: number;
  archived_at: number;
  is_deleted: boolean;
  tasks?: ServiceTask[];
}

export interface ServiceOrder {
  id: string;
  user_id: string;
  assigned_user_id: string;
  client_id: string;
  equipment_id: string;
  location_id: string;
  maintenance_schedule_id: string;
  status_id: string;
  invoice_id: string;
  project_id: string;
  contract_id: string;
  quote_id: string;
  category_id: string;
  region_id: string;
  number: string;
  title: string;
  description: string;
  priority: ServiceOrderPriority;
  service_type: ServiceType;
  // Extended fields
  customer_reference: string;
  internal_reference: string;
  customer_contact_name: string;
  customer_contact_phone: string;
  customer_contact_email: string;
  invoice_number: string;
  is_onsite: boolean;
  is_warranty_service: boolean;
  is_closed: boolean;
  closed_at: string;
  close_by_date: string;
  // Scheduling
  scheduled_date: string;
  scheduled_start_time: string;
  scheduled_end_time: string;
  estimated_duration: number;
  // Actual times
  actual_start_date: string;
  actual_end_date: string;
  actual_duration: number;
  // Costs
  labor_cost: number;
  parts_cost: number;
  travel_cost: number;
  other_cost: number;
  total_cost: number;
  // Work details
  work_performed: string;
  technician_notes: string;
  customer_signature: string;
  completed_at: string;
  is_covered_by_contract: boolean;
  is_completed: boolean;
  // Service Bank integration
  has_service_bank: boolean;
  service_bank_id: string;
  service_bank_hours_balance: number;
  service_bank_currency_balance: number;
  service_bank_incidents_balance: number;
  // Task completion stats
  tasks_total: number;
  tasks_completed: number;
  tasks_incomplete: number;
  tasks_completion_percentage: number;
  all_tasks_completed: boolean;
  // Custom fields
  custom_value1: string;
  custom_value2: string;
  custom_value3: string;
  custom_value4: string;
  custom_value5: string;
  custom_value6: string;
  custom_value7: string;
  custom_value8: string;
  custom_value9: string;
  custom_value10: string;
  created_at: number;
  updated_at: number;
  archived_at: number;
  is_deleted: boolean;
  // Relations
  client?: Client;
  equipment?: Equipment;
  location?: Location;
  contract?: Contract;
  status?: ServiceOrderStatus;
  maintenance_schedule?: MaintenanceSchedule;
  assigned_user?: User;
  service_bank?: ServiceBank;
  labor_entries?: ServiceOrderLabor[];
  parts_used?: ServiceOrderPart[];
  travels?: ServiceOrderTravel[];
  expenses?: ServiceOrderExpense[];
  tasks?: ServiceOrderTask[];
  documents?: any[];
}

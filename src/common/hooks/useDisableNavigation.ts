/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Client } from '../interfaces/client';
import { Contract } from '../interfaces/contract';
import { Credit } from '../interfaces/credit';
import { Equipment } from '../interfaces/equipment';
import { Expense } from '../interfaces/expense';
import { Invoice } from '../interfaces/invoice';
import { MaintenanceSchedule } from '../interfaces/maintenance-schedule';
import { Payment } from '../interfaces/payment';
import { Product } from '../interfaces/product';
import { Project } from '../interfaces/project';
import { PurchaseOrder } from '../interfaces/purchase-order';
import { Quote } from '../interfaces/quote';
import { RecurringExpense } from '../interfaces/recurring-expense';
import { RecurringInvoice } from '../interfaces/recurring-invoice';
import { ServiceBank } from '../interfaces/service-bank';
import { ServiceOrder } from '../interfaces/service-order';
import { Task } from '../interfaces/task';
import { TechnicianSchedule } from '../interfaces/technician-schedule';
import { Transaction } from '../interfaces/transactions';
import { Vendor } from '../interfaces/vendor';
import { useHasPermission } from './permissions/useHasPermission';
import { useEntityAssigned } from './useEntityAssigned';

type Entity =
  | 'client'
  | 'recurring_invoice'
  | 'payment'
  | 'invoice'
  | 'quote'
  | 'product'
  | 'credit'
  | 'project'
  | 'task'
  | 'expense'
  | 'vendor'
  | 'recurring_expense'
  | 'bank_transaction'
  | 'purchase_order'
  | 'contract'
  | 'equipment'
  | 'service_order'
  | 'service_bank'
  | 'maintenance_schedule'
  | 'technician_schedule';

type Resource =
  | Client
  | Contract
  | RecurringInvoice
  | Payment
  | Invoice
  | Quote
  | Product
  | Credit
  | Project
  | Task
  | Expense
  | Vendor
  | RecurringExpense
  | Transaction
  | PurchaseOrder
  | Equipment
  | ServiceBank
  | ServiceOrder
  | MaintenanceSchedule
  | TechnicianSchedule;

export function useDisableNavigation() {
  const hasPermission = useHasPermission();
  const entityAssigned = useEntityAssigned();

  return (entity: Entity, resource: Resource | undefined | null) => {
    return (
      !hasPermission(`view_${entity}`) &&
      !hasPermission(`edit_${entity}`) &&
      !entityAssigned(resource)
    );
  };
}

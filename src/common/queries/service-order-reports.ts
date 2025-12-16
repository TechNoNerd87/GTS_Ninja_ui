/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2025. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useQuery } from 'react-query';
import { request } from '$app/common/helpers/request';
import { endpoint } from '$app/common/helpers';

export interface ReportPeriod {
  start_date: string;
  end_date: string;
}

export interface SummaryReport {
  period: ReportPeriod;
  totals: {
    total_orders: number;
    completed_orders: number;
    pending_orders: number;
    completion_rate: number;
  };
  revenue: {
    total_labor: number;
    total_parts: number;
    total_travel: number;
    total_expenses: number;
    grand_total: number;
  };
  priority_breakdown: {
    low: number;
    normal: number;
    high: number;
    urgent: number;
  };
}

export interface StatusReportItem {
  status_id: string;
  status_name: string;
  status_color: string;
  is_completed: boolean;
  count: number;
  total_revenue: number;
  avg_duration_hours: number;
}

export interface StatusReport {
  period: ReportPeriod;
  statuses: StatusReportItem[];
}

export interface TechnicianReportItem {
  user_id: string;
  user_name: string;
  total_orders: number;
  completed_orders: number;
  completion_rate: number;
  total_revenue: number;
  total_labor_hours: number;
  avg_completion_hours: number;
}

export interface TechnicianReport {
  period: ReportPeriod;
  technicians: TechnicianReportItem[];
}

export interface EquipmentReportItem {
  equipment_id: string;
  equipment_name: string;
  serial_number: string;
  client_name: string;
  total_service_orders: number;
  total_service_cost: number;
  total_parts_cost: number;
  total_labor_cost: number;
  last_service_date: string;
  warranty_status: string;
}

export interface EquipmentReport {
  period: ReportPeriod;
  equipment: EquipmentReportItem[];
}

export interface ClientReportItem {
  client_id: string;
  client_name: string;
  total_orders: number;
  completed_orders: number;
  pending_orders: number;
  total_revenue: number;
  total_labor: number;
  total_parts: number;
  avg_order_value: number;
}

export interface ClientReport {
  period: ReportPeriod;
  clients: ClientReportItem[];
}

export interface ContractReportItem {
  contract_id: string;
  contract_name: string;
  contract_number: string;
  client_name: string;
  contract_type: string;
  status: string;
  start_date: string;
  end_date: string;
  contract_value: number;
  total_service_orders: number;
  total_service_cost: number;
  hours_used: number;
  prepaid_hours_remaining: number | null;
  credits_remaining: number | null;
}

export interface ContractReport {
  period: ReportPeriod;
  contracts: ContractReportItem[];
}

export interface MaintenanceScheduleReportItem {
  schedule_id: string;
  schedule_name: string;
  equipment_name: string;
  equipment_serial: string;
  frequency: string;
  next_due_date: string;
  last_completed: string;
  is_overdue: boolean;
  is_upcoming: boolean;
  days_until_due: number | null;
}

export interface MaintenanceReport {
  summary: {
    total_schedules: number;
    overdue: number;
    upcoming_7_days: number;
    completed_on_time_rate: number;
  };
  schedules: MaintenanceScheduleReportItem[];
}

export interface RevenueTrendItem {
  period: string;
  order_count: number;
  total_revenue: number;
  labor_revenue: number;
  parts_revenue: number;
  travel_revenue: number;
}

export interface RevenueTrendReport {
  period: ReportPeriod;
  interval: string;
  data: RevenueTrendItem[];
}

interface ReportParams {
  start_date?: string;
  end_date?: string;
}

export function useSummaryReportQuery(params: ReportParams = {}) {
  return useQuery<SummaryReport>(
    ['service_order_reports', 'summary', params],
    () =>
      request('GET', endpoint('/api/v1/reports/service_orders/summary'), {
        params,
      }).then((response) => response.data.data),
    { staleTime: 60000 }
  );
}

export function useStatusReportQuery(params: ReportParams = {}) {
  return useQuery<StatusReport>(
    ['service_order_reports', 'status', params],
    () =>
      request('GET', endpoint('/api/v1/reports/service_orders/status'), {
        params,
      }).then((response) => response.data.data),
    { staleTime: 60000 }
  );
}

export function useTechnicianReportQuery(params: ReportParams = {}) {
  return useQuery<TechnicianReport>(
    ['service_order_reports', 'technicians', params],
    () =>
      request('GET', endpoint('/api/v1/reports/service_orders/technicians'), {
        params,
      }).then((response) => response.data.data),
    { staleTime: 60000 }
  );
}

export function useEquipmentReportQuery(
  params: ReportParams & { equipment_id?: string } = {}
) {
  return useQuery<EquipmentReport>(
    ['service_order_reports', 'equipment', params],
    () =>
      request('GET', endpoint('/api/v1/reports/service_orders/equipment'), {
        params,
      }).then((response) => response.data.data),
    { staleTime: 60000 }
  );
}

export function useClientReportQuery(
  params: ReportParams & { client_id?: string } = {}
) {
  return useQuery<ClientReport>(
    ['service_order_reports', 'clients', params],
    () =>
      request('GET', endpoint('/api/v1/reports/service_orders/clients'), {
        params,
      }).then((response) => response.data.data),
    { staleTime: 60000 }
  );
}

export function useContractReportQuery(params: ReportParams = {}) {
  return useQuery<ContractReport>(
    ['service_order_reports', 'contracts', params],
    () =>
      request('GET', endpoint('/api/v1/reports/service_orders/contracts'), {
        params,
      }).then((response) => response.data.data),
    { staleTime: 60000 }
  );
}

export function useMaintenanceReportQuery(params: ReportParams = {}) {
  return useQuery<MaintenanceReport>(
    ['service_order_reports', 'maintenance', params],
    () =>
      request('GET', endpoint('/api/v1/reports/service_orders/maintenance'), {
        params,
      }).then((response) => response.data.data),
    { staleTime: 60000 }
  );
}

export function useRevenueTrendReportQuery(
  params: ReportParams & { interval?: 'daily' | 'weekly' | 'monthly' } = {}
) {
  return useQuery<RevenueTrendReport>(
    ['service_order_reports', 'revenue_trend', params],
    () =>
      request('GET', endpoint('/api/v1/reports/service_orders/revenue_trend'), {
        params,
      }).then((response) => response.data.data),
    { staleTime: 60000 }
  );
}

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

export interface StatusCount {
  status_id: string;
  status_name: string;
  color: string;
  is_completed: boolean;
  count: number;
}

export interface ServiceOrderCounts {
  statuses: StatusCount[];
  total_open: number;
  total_all: number;
}

export interface ScheduledServiceOrder {
  id: string;
  number: string;
  title: string;
  client_name: string;
  equipment_name: string;
  status: string;
  status_color: string;
  priority: string;
  scheduled_start_time: string;
  scheduled_end_time: string;
  technician: string;
}

export interface TechnicianScheduleItem {
  id: string;
  title: string;
  technician: string;
  service_order_number: string;
  scheduled_start: string;
  scheduled_end: string;
  status: string;
}

export interface TodaysSchedule {
  service_orders: ScheduledServiceOrder[];
  technician_schedules: TechnicianScheduleItem[];
  count: number;
}

export interface OverdueMaintenanceItem {
  id: string;
  name: string;
  equipment_name: string;
  client_name: string;
  next_due_date: string;
  days_overdue: number;
}

export interface OverdueMaintenance {
  schedules: OverdueMaintenanceItem[];
  count: number;
}

export interface UpcomingMaintenanceItem {
  id: string;
  name: string;
  equipment_name: string;
  client_name: string;
  next_due_date: string;
  days_until_due: number;
}

export interface UpcomingMaintenance {
  schedules: UpcomingMaintenanceItem[];
  count: number;
}

export interface RecentServiceOrder {
  id: string;
  number: string;
  title: string;
  client_name: string;
  status: string;
  status_color: string;
  priority: string;
  created_at: string;
  technician: string;
  total_cost: number;
}

export interface RevenueSummary {
  today: number;
  this_week: number;
  this_month: number;
  last_month: number;
  month_change_percent: number;
  breakdown: {
    labor: number;
    parts: number;
    travel: number;
  };
}

export interface TechnicianWorkloadItem {
  user_id: string;
  user_name: string;
  open_orders: number;
  todays_orders: number;
}

export interface ExpiringContractItem {
  id: string;
  name: string;
  contract_number: string;
  client_name: string;
  end_date: string;
  days_until_expiry: number;
  contract_value: number;
  auto_renew: boolean;
}

export interface ExpiringContracts {
  contracts: ExpiringContractItem[];
  count: number;
}

export interface PriorityBreakdown {
  low: number;
  normal: number;
  high: number;
  urgent: number;
}

export interface AllDashboardWidgets {
  service_order_counts: ServiceOrderCounts;
  todays_schedule: TodaysSchedule;
  overdue_maintenance: OverdueMaintenance;
  upcoming_maintenance: UpcomingMaintenance;
  recent_service_orders: RecentServiceOrder[];
  revenue_summary: RevenueSummary;
  technician_workload: TechnicianWorkloadItem[];
  expiring_contracts: ExpiringContracts;
  priority_breakdown: PriorityBreakdown;
}

export function useServiceOrderDashboardQuery() {
  return useQuery<AllDashboardWidgets>(
    ['service_order_dashboard', 'all'],
    () =>
      request('GET', endpoint('/api/v1/dashboard/service_orders')).then(
        (response) => response.data.data
      ),
    { staleTime: 30000, refetchInterval: 60000 }
  );
}

export function useServiceOrderCountsQuery() {
  return useQuery<ServiceOrderCounts>(
    ['service_order_dashboard', 'counts'],
    () =>
      request('GET', endpoint('/api/v1/dashboard/service_orders/counts')).then(
        (response) => response.data.data
      ),
    { staleTime: 30000, refetchInterval: 60000 }
  );
}

export function useTodaysScheduleQuery() {
  return useQuery<TodaysSchedule>(
    ['service_order_dashboard', 'today'],
    () =>
      request('GET', endpoint('/api/v1/dashboard/service_orders/today')).then(
        (response) => response.data.data
      ),
    { staleTime: 30000, refetchInterval: 60000 }
  );
}

export function useOverdueMaintenanceQuery() {
  return useQuery<OverdueMaintenance>(
    ['service_order_dashboard', 'overdue_maintenance'],
    () =>
      request(
        'GET',
        endpoint('/api/v1/dashboard/service_orders/overdue_maintenance')
      ).then((response) => response.data.data),
    { staleTime: 30000, refetchInterval: 60000 }
  );
}

export function useRevenueSummaryQuery() {
  return useQuery<RevenueSummary>(
    ['service_order_dashboard', 'revenue'],
    () =>
      request(
        'GET',
        endpoint('/api/v1/dashboard/service_orders/revenue')
      ).then((response) => response.data.data),
    { staleTime: 30000, refetchInterval: 60000 }
  );
}

export function useTechnicianWorkloadQuery() {
  return useQuery<TechnicianWorkloadItem[]>(
    ['service_order_dashboard', 'technician_workload'],
    () =>
      request(
        'GET',
        endpoint('/api/v1/dashboard/service_orders/technician_workload')
      ).then((response) => response.data.data),
    { staleTime: 30000, refetchInterval: 60000 }
  );
}

export function useDashboardWidgetQuery<T>(widgetName: string) {
  return useQuery<T>(
    ['service_order_dashboard', 'widget', widgetName],
    () =>
      request(
        'GET',
        endpoint(`/api/v1/dashboard/service_orders/widget/${widgetName}`)
      ).then((response) => response.data.data),
    { staleTime: 30000, refetchInterval: 60000 }
  );
}

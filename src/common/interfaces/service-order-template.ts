/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2025. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

export interface TemplateTask {
  name: string;
  description?: string;
  sort_order?: number;
}

export interface TemplatePart {
  product_id?: string;
  quantity?: number;
  description?: string;
}

export interface TemplateData {
  title?: string;
  description?: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  estimated_duration?: number;
  client_id?: string;
  equipment_id?: string;
  contract_id?: string;
  custom_value1?: string;
  custom_value2?: string;
  custom_value3?: string;
  custom_value4?: string;
}

export interface ServiceOrderTemplate {
  id: string;
  company_id: string;
  user_id: string | null;
  name: string;
  description: string | null;
  category: string | null;
  template_data: TemplateData;
  template_tasks: TemplateTask[] | null;
  template_parts: TemplatePart[] | null;
  default_priority: string;
  default_status_id: string | null;
  estimated_duration: number | null;
  is_active: boolean;
  is_shared: boolean;
  created_at: number;
  updated_at: number;
  archived_at: number | null;
  is_deleted: boolean;
}

export const blankServiceOrderTemplate: ServiceOrderTemplate = {
  id: '',
  company_id: '',
  user_id: null,
  name: '',
  description: null,
  category: null,
  template_data: {},
  template_tasks: [],
  template_parts: [],
  default_priority: 'normal',
  default_status_id: null,
  estimated_duration: null,
  is_active: true,
  is_shared: true,
  created_at: 0,
  updated_at: 0,
  archived_at: null,
  is_deleted: false,
};

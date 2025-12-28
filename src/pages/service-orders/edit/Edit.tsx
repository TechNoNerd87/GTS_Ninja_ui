/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Card, Element } from '$app/components/cards';
import { useServiceOrderQuery } from '$app/common/queries/service-orders';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import { ServiceOrderHeader } from '../common/components/ServiceOrderHeader';
import { ServiceOrderInfoBar } from '../common/components/ServiceOrderInfoBar';
import { LineItemTabs, LineItemTabType } from '../common/components/LineItemTabs';
import { CollapsibleSection } from '../common/components/CollapsibleSection';
import { ServiceOrderLaborTable } from '../common/components/ServiceOrderLaborTable';
import { ServiceOrderPartsTable } from '../common/components/ServiceOrderPartsTable';
import { ServiceOrderTravelTable } from '../common/components/ServiceOrderTravelTable';
import { ServiceOrderExpenseTable } from '../common/components/ServiceOrderExpenseTable';
import { ServiceOrderTaskTable } from '../common/components/ServiceOrderTaskTable';
import { useHandleChange } from '../common/hooks';
import { Spinner } from '$app/components/Spinner';
import { ValidationBag } from '$app/common/interfaces/validation-bag';
import { ServiceOrder } from '$app/common/interfaces/service-order';
import { useTitle } from '$app/common/hooks/useTitle';
import { useColorScheme } from '$app/common/colors';
import { useTranslation } from 'react-i18next';
import { useAtom } from 'jotai';
import { activeLineItemTabAtom } from '../common/atoms';
import { InputField } from '$app/components/forms';
import { NumberInputField } from '$app/components/forms/NumberInputField';
import { useFormatMoney } from '$app/common/hooks/money/useFormatMoney';
import { MdCheckCircle, MdAttachFile, MdNotes } from 'react-icons/md';
import { Icon } from '$app/components/icons/Icon';
import { MarkdownEditor } from '$app/components/forms/MarkdownEditor';

interface Context {
  errors: ValidationBag | undefined;
  setErrors: Dispatch<SetStateAction<ValidationBag | undefined>>;
  serviceOrder: ServiceOrder;
  setServiceOrder: Dispatch<SetStateAction<ServiceOrder | undefined>>;
}

export default function Edit() {
  const { documentTitle } = useTitle('edit_service_order');
  const [t] = useTranslation();

  const { id } = useParams();

  const colors = useColorScheme();
  const formatMoney = useFormatMoney();

  const { data: serviceOrderResponse } = useServiceOrderQuery({ id });

  const context: Context = useOutletContext();

  const { setErrors, setServiceOrder, serviceOrder, errors } = context;

  const handleChange = useHandleChange({ setErrors, setServiceOrder });

  const [activeTab, setActiveTab] = useAtom(activeLineItemTabAtom);

  useEffect(() => {
    if (serviceOrderResponse) {
      setServiceOrder(serviceOrderResponse.data.data);
    }
  }, [serviceOrderResponse]);

  const getLineCounts = () => ({
    labor: serviceOrder?.labor_entries?.length || 0,
    parts: serviceOrder?.parts_used?.length || 0,
    travel: serviceOrder?.travels?.length || 0,
    expenses: serviceOrder?.expenses?.length || 0,
    tasks: serviceOrder?.tasks?.length || 0,
  });

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'labor':
        return <ServiceOrderLaborTable serviceOrder={serviceOrder} handleChange={handleChange} />;
      case 'parts':
        return <ServiceOrderPartsTable serviceOrder={serviceOrder} handleChange={handleChange} />;
      case 'travel':
        return <ServiceOrderTravelTable serviceOrder={serviceOrder} handleChange={handleChange} />;
      case 'expenses':
        return <ServiceOrderExpenseTable serviceOrder={serviceOrder} handleChange={handleChange} />;
      case 'tasks':
        return <ServiceOrderTaskTable serviceOrder={serviceOrder} handleChange={handleChange} />;
      default:
        return null;
    }
  };

  return (
    <>
      {serviceOrderResponse && serviceOrder ? (
        <div className="flex flex-col space-y-4">
          {/* Compact Header */}
          <Card
            title={serviceOrderResponse.data.data.title || documentTitle}
            className="shadow-sm"
            style={{ borderColor: colors.$24 }}
            headerStyle={{ borderColor: colors.$20 }}
          >
            <div className="p-4">
              <ServiceOrderHeader
                serviceOrder={serviceOrder}
                errors={errors}
                handleChange={handleChange}
              />
            </div>
          </Card>

          {/* Quick Info Bar */}
          <ServiceOrderInfoBar
            serviceOrder={serviceOrder}
            errors={errors}
            handleChange={handleChange}
            type="edit"
          />

          {/* Wiki/Notes Section */}
          <CollapsibleSection
            title={t('wiki_notes')}
            icon={<Icon element={MdNotes} size={18} />}
            badge={serviceOrder.private_notes || serviceOrder.public_notes ? '1' : undefined}
          >
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 block">
                  {t('public_notes')}
                </label>
                <InputField
                  element="textarea"
                  value={serviceOrder.public_notes}
                  onValueChange={(value) => handleChange('public_notes', value)}
                  errorMessage={errors?.errors.public_notes}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 block">
                  {t('private_notes')}
                </label>
                <InputField
                  element="textarea"
                  value={serviceOrder.private_notes}
                  onValueChange={(value) => handleChange('private_notes', value)}
                  errorMessage={errors?.errors.private_notes}
                />
              </div>
            </div>
          </CollapsibleSection>

          {/* Attached Files Section */}
          <CollapsibleSection
            title={t('attached_files')}
            icon={<Icon element={MdAttachFile} size={18} />}
            badge={serviceOrder.documents?.length ? String(serviceOrder.documents.length) : undefined}
          >
            <div className="p-4 text-center border-2 border-dashed rounded-lg" style={{ borderColor: colors.$5 }}>
              {serviceOrder.documents && serviceOrder.documents.length > 0 ? (
                <div className="space-y-2">
                  {serviceOrder.documents.map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded"
                    >
                      <span className="text-sm" style={{ color: colors.$3 }}>{doc.name}</span>
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        {t('download')}
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-4">
                  <Icon element={MdAttachFile} size={32} className="mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-500">{t('no_files_attached')}</p>
                  <p className="text-xs text-gray-400 mt-1">{t('drag_drop_or_click_to_upload')}</p>
                </div>
              )}
            </div>
          </CollapsibleSection>

          {/* Tabbed Line Items */}
          <Card
            className="shadow-sm overflow-hidden"
            style={{ borderColor: colors.$24 }}
          >
            <LineItemTabs
              activeTab={activeTab}
              onTabChange={(tab) => setActiveTab(tab as LineItemTabType)}
              counts={getLineCounts()}
            />
            <div className="p-4">
              {renderActiveTabContent()}
            </div>
          </Card>

          {/* Task Completion Progress - Shown when there are tasks */}
          {serviceOrder.tasks_total > 0 && (
            <div
              className={`p-4 rounded-lg border ${
                serviceOrder.all_tasks_completed
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                  : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('task_progress')}
                </span>
                <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {serviceOrder.tasks_completed} / {serviceOrder.tasks_total} ({serviceOrder.tasks_completion_percentage}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-300 ${
                    serviceOrder.tasks_completion_percentage === 100
                      ? 'bg-green-500'
                      : serviceOrder.tasks_completion_percentage > 50
                      ? 'bg-blue-500'
                      : 'bg-yellow-500'
                  }`}
                  style={{ width: `${serviceOrder.tasks_completion_percentage}%` }}
                />
              </div>
              {serviceOrder.all_tasks_completed && (
                <div className="flex items-center mt-3 text-green-600 dark:text-green-400">
                  <Icon element={MdCheckCircle} size={20} className="mr-2" />
                  <span className="font-medium">{t('all_tasks_completed')}</span>
                </div>
              )}
            </div>
          )}

          {/* Service Bank Balance */}
          {serviceOrder.has_service_bank && (
            <CollapsibleSection title={t('service_bank_balance')} defaultOpen>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {serviceOrder.service_bank_hours_balance?.toFixed(1) || '0'}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {t('hours_available')}
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      ${serviceOrder.service_bank_currency_balance?.toFixed(2) || '0.00'}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {t('currency_available')}
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {serviceOrder.service_bank_incidents_balance || 0}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {t('incidents_available')}
                    </div>
                  </div>
                </div>
                <div className="mt-3 text-xs text-center text-gray-500 dark:text-gray-400">
                  {t('prepaid_credits_from_service_bank')}
                </div>
              </div>
            </CollapsibleSection>
          )}

          {/* Scheduling & Times */}
          <CollapsibleSection title={t('scheduling_and_times')}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6">
              <div>
                <Element leftSide={t('scheduled_start_time')}>
                  <InputField
                    type="time"
                    value={serviceOrder.scheduled_start_time}
                    onValueChange={(value) => handleChange('scheduled_start_time', value)}
                    errorMessage={errors?.errors.scheduled_start_time}
                  />
                </Element>

                <Element leftSide={t('scheduled_end_time')}>
                  <InputField
                    type="time"
                    value={serviceOrder.scheduled_end_time}
                    onValueChange={(value) => handleChange('scheduled_end_time', value)}
                    errorMessage={errors?.errors.scheduled_end_time}
                  />
                </Element>

                <Element leftSide={t('estimated_duration')}>
                  <div className="flex items-center gap-2">
                    <NumberInputField
                      value={serviceOrder.estimated_duration}
                      onValueChange={(value) => handleChange('estimated_duration', parseFloat(value) || 0)}
                      errorMessage={errors?.errors.estimated_duration}
                    />
                    <span className="text-xs text-gray-500">{t('minutes')}</span>
                  </div>
                </Element>
              </div>

              <div>
                <Element leftSide={t('actual_start_date')}>
                  <InputField
                    type="datetime-local"
                    value={serviceOrder.actual_start_date}
                    onValueChange={(value) => handleChange('actual_start_date', value)}
                    errorMessage={errors?.errors.actual_start_date}
                  />
                </Element>

                <Element leftSide={t('actual_end_date')}>
                  <InputField
                    type="datetime-local"
                    value={serviceOrder.actual_end_date}
                    onValueChange={(value) => handleChange('actual_end_date', value)}
                    errorMessage={errors?.errors.actual_end_date}
                  />
                </Element>

                <Element leftSide={t('actual_duration')}>
                  <div className="flex items-center gap-2">
                    <NumberInputField
                      value={serviceOrder.actual_duration}
                      onValueChange={(value) => handleChange('actual_duration', parseFloat(value) || 0)}
                      errorMessage={errors?.errors.actual_duration}
                    />
                    <span className="text-xs text-gray-500">{t('minutes')}</span>
                  </div>
                </Element>

                <Element leftSide={t('completed_at')}>
                  <InputField
                    type="datetime-local"
                    value={serviceOrder.completed_at}
                    onValueChange={(value) => handleChange('completed_at', value)}
                    errorMessage={errors?.errors.completed_at}
                  />
                </Element>
              </div>
            </div>
          </CollapsibleSection>

          {/* Contact Information */}
          <CollapsibleSection title={t('contact_information')}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-6">
              <Element leftSide={t('contact_name')}>
                <InputField
                  value={serviceOrder.customer_contact_name}
                  onValueChange={(value) => handleChange('customer_contact_name', value)}
                  errorMessage={errors?.errors.customer_contact_name}
                />
              </Element>

              <Element leftSide={t('contact_phone')}>
                <InputField
                  type="tel"
                  value={serviceOrder.customer_contact_phone}
                  onValueChange={(value) => handleChange('customer_contact_phone', value)}
                  errorMessage={errors?.errors.customer_contact_phone}
                />
              </Element>

              <Element leftSide={t('contact_email')}>
                <InputField
                  type="email"
                  value={serviceOrder.customer_contact_email}
                  onValueChange={(value) => handleChange('customer_contact_email', value)}
                  errorMessage={errors?.errors.customer_contact_email}
                />
              </Element>
            </div>
          </CollapsibleSection>

          {/* Work Details */}
          <CollapsibleSection title={t('work_details')}>
            <div className="space-y-4">
              <Element leftSide={t('description')}>
                <InputField
                  element="textarea"
                  value={serviceOrder.description}
                  onValueChange={(value) => handleChange('description', value)}
                  errorMessage={errors?.errors.description}
                />
              </Element>

              <Element leftSide={t('work_performed')}>
                <InputField
                  element="textarea"
                  value={serviceOrder.work_performed}
                  onValueChange={(value) => handleChange('work_performed', value)}
                  errorMessage={errors?.errors.work_performed}
                />
              </Element>

              <Element leftSide={t('technician_notes')}>
                <InputField
                  element="textarea"
                  value={serviceOrder.technician_notes}
                  onValueChange={(value) => handleChange('technician_notes', value)}
                  errorMessage={errors?.errors.technician_notes}
                />
              </Element>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6">
                <Element leftSide={t('internal_reference')}>
                  <InputField
                    value={serviceOrder.internal_reference}
                    onValueChange={(value) => handleChange('internal_reference', value)}
                    errorMessage={errors?.errors.internal_reference}
                  />
                </Element>

                <Element leftSide={t('invoice_number')}>
                  <InputField
                    value={serviceOrder.invoice_number}
                    onValueChange={(value) => handleChange('invoice_number', value)}
                    errorMessage={errors?.errors.invoice_number}
                  />
                </Element>
              </div>
            </div>
          </CollapsibleSection>

          {/* Costs Summary */}
          <CollapsibleSection title={t('costs_summary')} defaultOpen>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className="text-lg font-bold" style={{ color: colors.$3 }}>
                  {formatMoney(
                    serviceOrder.labor_cost || 0,
                    serviceOrder.client?.country_id,
                    serviceOrder.client?.settings?.currency_id
                  )}
                </div>
                <div className="text-xs text-gray-500">{t('labor')}</div>
              </div>

              <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className="text-lg font-bold" style={{ color: colors.$3 }}>
                  {formatMoney(
                    serviceOrder.parts_cost || 0,
                    serviceOrder.client?.country_id,
                    serviceOrder.client?.settings?.currency_id
                  )}
                </div>
                <div className="text-xs text-gray-500">{t('parts')}</div>
              </div>

              <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className="text-lg font-bold" style={{ color: colors.$3 }}>
                  {formatMoney(
                    serviceOrder.travel_cost || 0,
                    serviceOrder.client?.country_id,
                    serviceOrder.client?.settings?.currency_id
                  )}
                </div>
                <div className="text-xs text-gray-500">{t('travel')}</div>
              </div>

              <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className="text-lg font-bold" style={{ color: colors.$3 }}>
                  {formatMoney(
                    serviceOrder.other_cost || 0,
                    serviceOrder.client?.country_id,
                    serviceOrder.client?.settings?.currency_id
                  )}
                </div>
                <div className="text-xs text-gray-500">{t('other')}</div>
              </div>

              <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {formatMoney(
                    serviceOrder.total_cost || 0,
                    serviceOrder.client?.country_id,
                    serviceOrder.client?.settings?.currency_id
                  )}
                </div>
                <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">{t('total')}</div>
              </div>
            </div>
          </CollapsibleSection>
        </div>
      ) : (
        <Spinner />
      )}
    </>
  );
}

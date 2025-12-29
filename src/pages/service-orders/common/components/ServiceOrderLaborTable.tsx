/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ServiceOrder, ServiceOrderLabor } from '$app/common/interfaces/service-order';
import { useColorScheme } from '$app/common/colors';
import { Button } from '$app/components/forms';
import { InputField } from '$app/components/forms';
import { NumberInputField } from '$app/components/forms/NumberInputField';
import { useFormatMoney } from '$app/common/hooks/money/useFormatMoney';
import { MdDelete, MdAdd } from 'react-icons/md';
import { Icon } from '$app/components/icons/Icon';
import { Table, Thead, Th, Tbody, Tr, Td } from '$app/components/tables';
import { v4 as uuidv4 } from 'uuid';
import Toggle from '$app/components/forms/Toggle';
import { ServiceRateSelector } from '$app/components/rates/RateSelector';
import { Rate } from '$app/common/interfaces/rate';
import classNames from 'classnames';

interface Props {
  serviceOrder: ServiceOrder;
  handleChange: (property: keyof ServiceOrder, value: ServiceOrder[keyof ServiceOrder]) => void;
}

export function ServiceOrderLaborTable(props: Props) {
  const [t] = useTranslation();

  const colors = useColorScheme();
  const formatMoney = useFormatMoney();

  const { serviceOrder, handleChange } = props;

  const laborEntries = serviceOrder.labor_entries || [];

  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(
    laborEntries.length > 0 ? laborEntries[0].id : null
  );

  const selectedEntry = laborEntries.find((entry) => entry.id === selectedEntryId);

  const handleAddEntry = () => {
    const newEntry: ServiceOrderLabor = {
      id: uuidv4(),
      service_order_id: serviceOrder.id,
      user_id: '',
      technician_user_id: '',
      service_bank_id: '',
      start_time: '',
      end_time: '',
      duration_hours: 0,
      no_charge_hours: 0,
      hourly_rate: 0,
      labor_rate_id: '',
      total_cost: 0,
      tax_rate_id: '',
      description: '',
      is_billable: true,
      applied_to_bank: false,
      billable_hours: 0,
      created_at: Math.floor(Date.now() / 1000),
      updated_at: Math.floor(Date.now() / 1000),
      is_deleted: false,
    };

    const newEntries = [...laborEntries, newEntry];
    handleChange('labor_entries', newEntries);
    setSelectedEntryId(newEntry.id);
  };

  const handleRemoveEntry = (entryId: string) => {
    const newEntries = laborEntries.filter((entry) => entry.id !== entryId);
    handleChange('labor_entries', newEntries);

    if (selectedEntryId === entryId) {
      setSelectedEntryId(newEntries.length > 0 ? newEntries[0].id : null);
    }
  };

  const handleEntryChange = (
    entryId: string,
    property: keyof ServiceOrderLabor,
    value: string | number | boolean
  ) => {
    const updatedEntries = laborEntries.map((entry) => {
      if (entry.id === entryId) {
        const updatedEntry = { ...entry, [property]: value };

        // Recalculate billable_hours and total_cost when relevant fields change
        if (property === 'duration_hours' || property === 'no_charge_hours' || property === 'hourly_rate') {
          updatedEntry.billable_hours = Math.max(0, (updatedEntry.duration_hours || 0) - (updatedEntry.no_charge_hours || 0));
          updatedEntry.total_cost = updatedEntry.billable_hours * (updatedEntry.hourly_rate || 0);
        }

        return updatedEntry;
      }
      return entry;
    });

    handleChange('labor_entries', updatedEntries);
  };

  const handleRateSelection = (entryId: string, rate: Rate) => {
    const updatedEntries = laborEntries.map((entry) => {
      if (entry.id === entryId) {
        const updatedEntry = {
          ...entry,
          labor_rate_id: rate.id,
          hourly_rate: rate.charge,
        };

        // Recalculate total_cost
        updatedEntry.billable_hours = Math.max(0, (updatedEntry.duration_hours || 0) - (updatedEntry.no_charge_hours || 0));
        updatedEntry.total_cost = updatedEntry.billable_hours * updatedEntry.hourly_rate;

        return updatedEntry;
      }
      return entry;
    });

    handleChange('labor_entries', updatedEntries);
  };

  const calculateTotalCost = () => {
    return laborEntries.reduce((sum, entry) => sum + (entry.total_cost || 0), 0);
  };

  const calculateTotalHours = () => {
    return laborEntries.reduce((sum, entry) => sum + (entry.duration_hours || 0), 0);
  };

  const calculateTotalBillableHours = () => {
    return laborEntries.reduce((sum, entry) => sum + (entry.billable_hours || 0), 0);
  };

  return (
    <div className="flex flex-col space-y-4">
      {/* Header with Add button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium flex items-center gap-2" style={{ color: colors.$3 }}>
          <span>🔧</span>
          {t('labors')}
        </h3>
        <Button type="minimal" behavior="button" onClick={handleAddEntry}>
          <Icon element={MdAdd} size={20} />
          {t('add_labor')}
        </Button>
      </div>

      {laborEntries.length > 0 && (
        <>
          {/* Summary Table */}
          <Table>
            <Thead>
              <Th>{t('start_time')}</Th>
              <Th>{t('end_time')}</Th>
              <Th>{t('service_rate')}</Th>
              <Th>{t('duration')}</Th>
              <Th>{t('no_charge')}</Th>
              <Th>{t('billable')}</Th>
              <Th>{t('total')}</Th>
              <Th></Th>
            </Thead>
            <Tbody>
              {laborEntries.map((entry) => (
                <Tr
                  key={entry.id}
                  className={classNames('cursor-pointer transition-colors', {
                    'bg-blue-50 dark:bg-blue-900/20': entry.id === selectedEntryId,
                  })}
                  onClick={() => setSelectedEntryId(entry.id)}
                >
                  <Td>{entry.start_time || '-'}</Td>
                  <Td>{entry.end_time || '-'}</Td>
                  <Td>{entry.labor_rate_id ? t('rate_selected') : '-'}</Td>
                  <Td>{(entry.duration_hours || 0).toFixed(2)}</Td>
                  <Td>{(entry.no_charge_hours || 0).toFixed(2)}</Td>
                  <Td>{(entry.billable_hours || 0).toFixed(2)}</Td>
                  <Td>
                    {formatMoney(
                      entry.total_cost || 0,
                      serviceOrder.client?.country_id,
                      serviceOrder.client?.settings?.currency_id
                    )}
                  </Td>
                  <Td>
                    <Button
                      type="minimal"
                      behavior="button"
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.stopPropagation();
                        handleRemoveEntry(entry.id);
                      }}
                    >
                      <Icon element={MdDelete} size={20} color="red" />
                    </Button>
                  </Td>
                </Tr>
              ))}
              {/* Totals Row */}
              <Tr>
                <Td colSpan={3} className="text-right font-medium">
                  {t('totals')}:
                </Td>
                <Td className="font-medium">{calculateTotalHours().toFixed(2)}</Td>
                <Td></Td>
                <Td className="font-medium">{calculateTotalBillableHours().toFixed(2)}</Td>
                <Td className="font-medium">
                  {formatMoney(
                    calculateTotalCost(),
                    serviceOrder.client?.country_id,
                    serviceOrder.client?.settings?.currency_id
                  )}
                </Td>
                <Td></Td>
              </Tr>
            </Tbody>
          </Table>

          {/* Detail Form for Selected Entry */}
          {selectedEntry && (
            <div
              className="border rounded-lg p-4 mt-4"
              style={{ borderColor: colors.$5, backgroundColor: colors.$1 }}
            >
              <h4 className="text-sm font-medium mb-4" style={{ color: colors.$3 }}>
                {t('edit_labor_entry')}
              </h4>

              {/* Row 1: Start Time | End Time | Duration | Service Rate */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                    {t('service_start_date_time')}
                  </label>
                  <InputField
                    type="datetime-local"
                    value={selectedEntry.start_time}
                    onValueChange={(value) =>
                      handleEntryChange(selectedEntry.id, 'start_time', value)
                    }
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                    {t('service_stop_date_time')}
                  </label>
                  <InputField
                    type="datetime-local"
                    value={selectedEntry.end_time}
                    onValueChange={(value) =>
                      handleEntryChange(selectedEntry.id, 'end_time', value)
                    }
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                    {t('service_rate_quantity')}
                  </label>
                  <NumberInputField
                    value={selectedEntry.duration_hours}
                    onValueChange={(value) =>
                      handleEntryChange(selectedEntry.id, 'duration_hours', parseFloat(value) || 0)
                    }
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                    {t('service_rate')}
                  </label>
                  <ServiceRateSelector
                    value={selectedEntry.labor_rate_id}
                    onChange={(rate) => handleRateSelection(selectedEntry.id, rate)}
                    onClearButtonClick={() => {
                      handleEntryChange(selectedEntry.id, 'labor_rate_id', '');
                      handleEntryChange(selectedEntry.id, 'hourly_rate', 0);
                    }}
                    showCharge={true}
                    groupSettingId={serviceOrder.client?.group_settings_id}
                  />
                </div>
              </div>

              {/* Row 2: User | No Charge | Billable Toggle | Price Override */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                    {t('user')}
                  </label>
                  <InputField
                    value={selectedEntry.technician_user_id}
                    onValueChange={(value) =>
                      handleEntryChange(selectedEntry.id, 'technician_user_id', value)
                    }
                    placeholder={t('select_user')}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                    {t('no_charge_quantity')}
                  </label>
                  <NumberInputField
                    value={selectedEntry.no_charge_hours}
                    onValueChange={(value) =>
                      handleEntryChange(selectedEntry.id, 'no_charge_hours', parseFloat(value) || 0)
                    }
                  />
                </div>
                <div className="flex items-center gap-3 pt-5">
                  <Toggle
                    checked={selectedEntry.is_billable}
                    onValueChange={(value) =>
                      handleEntryChange(selectedEntry.id, 'is_billable', value)
                    }
                  />
                  <label className="text-sm font-medium" style={{ color: colors.$3 }}>
                    {t('billable')}
                  </label>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                    {t('price_override')}
                  </label>
                  <NumberInputField
                    value={selectedEntry.hourly_rate}
                    onValueChange={(value) =>
                      handleEntryChange(selectedEntry.id, 'hourly_rate', parseFloat(value) || 0)
                    }
                  />
                </div>
              </div>

              {/* Row 3: Service Details */}
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                  {t('service_details')}
                </label>
                <InputField
                  element="textarea"
                  value={selectedEntry.description}
                  onValueChange={(value) =>
                    handleEntryChange(selectedEntry.id, 'description', value)
                  }
                  placeholder={t('enter_service_details')}
                />
              </div>
            </div>
          )}
        </>
      )}

      {laborEntries.length === 0 && (
        <div
          className="text-center py-8 border rounded"
          style={{ borderColor: colors.$5, color: colors.$3 }}
        >
          <p>{t('no_labor_entries')}</p>
          <Button type="minimal" behavior="button" onClick={handleAddEntry} className="mt-2">
            <Icon element={MdAdd} size={20} />
            {t('add_labor')}
          </Button>
        </div>
      )}
    </div>
  );
}

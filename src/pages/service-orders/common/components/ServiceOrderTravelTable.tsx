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
import { ServiceOrder, ServiceOrderTravel } from '$app/common/interfaces/service-order';
import { useColorScheme } from '$app/common/colors';
import { Button, SelectField } from '$app/components/forms';
import { InputField } from '$app/components/forms';
import { NumberInputField } from '$app/components/forms/NumberInputField';
import { useFormatMoney } from '$app/common/hooks/money/useFormatMoney';
import { MdDelete, MdAdd } from 'react-icons/md';
import { Icon } from '$app/components/icons/Icon';
import { Table, Thead, Th, Tbody, Tr, Td } from '$app/components/tables';
import { v4 as uuidv4 } from 'uuid';
import Toggle from '$app/components/forms/Toggle';
import { TravelRateSelector } from '$app/components/rates/RateSelector';
import { Rate } from '$app/common/interfaces/rate';
import classNames from 'classnames';

interface Props {
  serviceOrder: ServiceOrder;
  handleChange: (property: keyof ServiceOrder, value: ServiceOrder[keyof ServiceOrder]) => void;
}

export function ServiceOrderTravelTable(props: Props) {
  const [t] = useTranslation();

  const colors = useColorScheme();
  const formatMoney = useFormatMoney();

  const { serviceOrder, handleChange } = props;

  const travelEntries = serviceOrder.travels || [];

  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(
    travelEntries.length > 0 ? travelEntries[0].id : null
  );

  const selectedEntry = travelEntries.find((entry) => entry.id === selectedEntryId);

  const handleAddEntry = () => {
    const newEntry: ServiceOrderTravel = {
      id: uuidv4(),
      service_order_id: serviceOrder.id,
      user_id: '',
      technician_user_id: '',
      service_bank_id: '',
      travel_start_time: '',
      travel_end_time: '',
      duration_hours: 0,
      distance: 0,
      distance_unit: 'miles',
      travel_details: '',
      notes: '',
      travel_rate_id: '',
      rate_quantity: 0,
      no_charge_quantity: 0,
      rate_amount: 0,
      total_cost: 0,
      is_billable: true,
      tax_rate_id: '',
      applied_to_bank: false,
      is_banked: false,
      billable_quantity: 0,
      created_at: Math.floor(Date.now() / 1000),
      updated_at: Math.floor(Date.now() / 1000),
      archived_at: 0,
      is_deleted: false,
    };

    const newEntries = [...travelEntries, newEntry];
    handleChange('travels', newEntries);
    setSelectedEntryId(newEntry.id);
  };

  const handleRemoveEntry = (entryId: string) => {
    const newEntries = travelEntries.filter((entry) => entry.id !== entryId);
    handleChange('travels', newEntries);

    if (selectedEntryId === entryId) {
      setSelectedEntryId(newEntries.length > 0 ? newEntries[0].id : null);
    }
  };

  const handleEntryChange = (
    entryId: string,
    property: keyof ServiceOrderTravel,
    value: string | number | boolean
  ) => {
    const updatedEntries = travelEntries.map((entry) => {
      if (entry.id === entryId) {
        const updatedEntry = { ...entry, [property]: value };

        // Recalculate billable_quantity and total_cost when relevant fields change
        if (property === 'rate_quantity' || property === 'no_charge_quantity' || property === 'rate_amount') {
          updatedEntry.billable_quantity = Math.max(0, (updatedEntry.rate_quantity || 0) - (updatedEntry.no_charge_quantity || 0));
          updatedEntry.total_cost = updatedEntry.billable_quantity * (updatedEntry.rate_amount || 0);
        }

        return updatedEntry;
      }
      return entry;
    });

    handleChange('travels', updatedEntries);
  };

  const handleRateSelection = (entryId: string, rate: Rate) => {
    const updatedEntries = travelEntries.map((entry) => {
      if (entry.id === entryId) {
        const updatedEntry = {
          ...entry,
          travel_rate_id: rate.id,
          rate_amount: rate.charge,
        };

        // Recalculate total_cost
        updatedEntry.billable_quantity = Math.max(0, (updatedEntry.rate_quantity || 0) - (updatedEntry.no_charge_quantity || 0));
        updatedEntry.total_cost = updatedEntry.billable_quantity * updatedEntry.rate_amount;

        return updatedEntry;
      }
      return entry;
    });

    handleChange('travels', updatedEntries);
  };

  const calculateTotalCost = () => {
    return travelEntries.reduce((sum, entry) => sum + (entry.total_cost || 0), 0);
  };

  const calculateTotalDistance = () => {
    return travelEntries.reduce((sum, entry) => sum + (entry.distance || 0), 0);
  };

  const calculateTotalBillableQuantity = () => {
    return travelEntries.reduce((sum, entry) => sum + (entry.billable_quantity || 0), 0);
  };

  return (
    <div className="flex flex-col space-y-4">
      {/* Header with Add button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium flex items-center gap-2" style={{ color: colors.$3 }}>
          <span>🚗</span>
          {t('travel_entries')}
        </h3>
        <Button type="minimal" behavior="button" onClick={handleAddEntry}>
          <Icon element={MdAdd} size={20} />
          {t('add_travel')}
        </Button>
      </div>

      {travelEntries.length > 0 && (
        <>
          {/* Summary Table */}
          <Table>
            <Thead>
              <Th>{t('start_time')}</Th>
              <Th>{t('end_time')}</Th>
              <Th>{t('distance')}</Th>
              <Th>{t('travel_rate')}</Th>
              <Th>{t('quantity')}</Th>
              <Th>{t('no_charge')}</Th>
              <Th>{t('billable')}</Th>
              <Th>{t('total')}</Th>
              <Th></Th>
            </Thead>
            <Tbody>
              {travelEntries.map((entry) => (
                <Tr
                  key={entry.id}
                  className={classNames('cursor-pointer transition-colors', {
                    'bg-blue-50 dark:bg-blue-900/20': entry.id === selectedEntryId,
                  })}
                  onClick={() => setSelectedEntryId(entry.id)}
                >
                  <Td>{entry.travel_start_time || '-'}</Td>
                  <Td>{entry.travel_end_time || '-'}</Td>
                  <Td>{`${(entry.distance || 0).toFixed(1)} ${entry.distance_unit || 'miles'}`}</Td>
                  <Td>{entry.travel_rate_id ? t('rate_selected') : '-'}</Td>
                  <Td>{(entry.rate_quantity || 0).toFixed(2)}</Td>
                  <Td>{(entry.no_charge_quantity || 0).toFixed(2)}</Td>
                  <Td>{(entry.billable_quantity || 0).toFixed(2)}</Td>
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
                      onClick={(e) => {
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
                <Td colSpan={2} className="text-right font-medium">
                  {t('totals')}:
                </Td>
                <Td className="font-medium">{calculateTotalDistance().toFixed(1)}</Td>
                <Td></Td>
                <Td></Td>
                <Td></Td>
                <Td className="font-medium">{calculateTotalBillableQuantity().toFixed(2)}</Td>
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
                {t('edit_travel_entry')}
              </h4>

              {/* Row 1: Start Time | End Time | Distance | Distance Unit */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                    {t('travel_start_time')}
                  </label>
                  <InputField
                    type="datetime-local"
                    value={selectedEntry.travel_start_time}
                    onValueChange={(value) =>
                      handleEntryChange(selectedEntry.id, 'travel_start_time', value)
                    }
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                    {t('travel_end_time')}
                  </label>
                  <InputField
                    type="datetime-local"
                    value={selectedEntry.travel_end_time}
                    onValueChange={(value) =>
                      handleEntryChange(selectedEntry.id, 'travel_end_time', value)
                    }
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                    {t('distance')}
                  </label>
                  <NumberInputField
                    value={selectedEntry.distance}
                    onValueChange={(value) =>
                      handleEntryChange(selectedEntry.id, 'distance', parseFloat(value) || 0)
                    }
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                    {t('distance_unit')}
                  </label>
                  <SelectField
                    value={selectedEntry.distance_unit}
                    onValueChange={(value) =>
                      handleEntryChange(selectedEntry.id, 'distance_unit', value)
                    }
                  >
                    <option value="miles">{t('miles')}</option>
                    <option value="km">{t('kilometers')}</option>
                  </SelectField>
                </div>
              </div>

              {/* Row 2: Travel Rate | Rate Quantity | No Charge | Price Override */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                    {t('travel_rate')}
                  </label>
                  <TravelRateSelector
                    value={selectedEntry.travel_rate_id}
                    onChange={(rate) => handleRateSelection(selectedEntry.id, rate)}
                    onClearButtonClick={() => {
                      handleEntryChange(selectedEntry.id, 'travel_rate_id', '');
                      handleEntryChange(selectedEntry.id, 'rate_amount', 0);
                    }}
                    showCharge={true}
                    groupSettingId={serviceOrder.client?.group_settings_id}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                    {t('rate_quantity')}
                  </label>
                  <NumberInputField
                    value={selectedEntry.rate_quantity}
                    onValueChange={(value) =>
                      handleEntryChange(selectedEntry.id, 'rate_quantity', parseFloat(value) || 0)
                    }
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                    {t('no_charge_quantity')}
                  </label>
                  <NumberInputField
                    value={selectedEntry.no_charge_quantity}
                    onValueChange={(value) =>
                      handleEntryChange(selectedEntry.id, 'no_charge_quantity', parseFloat(value) || 0)
                    }
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                    {t('price_override')}
                  </label>
                  <NumberInputField
                    value={selectedEntry.rate_amount}
                    onValueChange={(value) =>
                      handleEntryChange(selectedEntry.id, 'rate_amount', parseFloat(value) || 0)
                    }
                  />
                </div>
              </div>

              {/* Row 3: User | Billable Toggle | Duration Hours */}
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
                    {t('duration_hours')}
                  </label>
                  <NumberInputField
                    value={selectedEntry.duration_hours}
                    onValueChange={(value) =>
                      handleEntryChange(selectedEntry.id, 'duration_hours', parseFloat(value) || 0)
                    }
                  />
                </div>
                <div></div>
              </div>

              {/* Row 4: Travel Details */}
              <div className="mb-4">
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                  {t('travel_details')}
                </label>
                <InputField
                  value={selectedEntry.travel_details}
                  onValueChange={(value) =>
                    handleEntryChange(selectedEntry.id, 'travel_details', value)
                  }
                  placeholder={t('enter_travel_details')}
                />
              </div>

              {/* Row 5: Notes */}
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                  {t('notes')}
                </label>
                <InputField
                  element="textarea"
                  value={selectedEntry.notes}
                  onValueChange={(value) =>
                    handleEntryChange(selectedEntry.id, 'notes', value)
                  }
                  placeholder={t('enter_notes')}
                />
              </div>
            </div>
          )}
        </>
      )}

      {travelEntries.length === 0 && (
        <div
          className="text-center py-8 border rounded"
          style={{ borderColor: colors.$5, color: colors.$3 }}
        >
          <p>{t('no_travel_entries')}</p>
          <Button type="minimal" behavior="button" onClick={handleAddEntry} className="mt-2">
            <Icon element={MdAdd} size={20} />
            {t('add_travel')}
          </Button>
        </div>
      )}
    </div>
  );
}

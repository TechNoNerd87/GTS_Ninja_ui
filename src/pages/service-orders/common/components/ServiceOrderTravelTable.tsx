/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

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

    handleChange('travels', [...travelEntries, newEntry]);
  };

  const handleRemoveEntry = (entryId: string) => {
    handleChange(
      'travels',
      travelEntries.filter((entry) => entry.id !== entryId)
    );
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
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium" style={{ color: colors.$3 }}>
          {t('travel_entries')}
        </h3>
        <Button type="minimal" onClick={handleAddEntry}>
          <Icon element={MdAdd} size={20} />
          {t('add_travel')}
        </Button>
      </div>

      {travelEntries.length > 0 && (
        <Table>
          <Thead>
            <Th>{t('start_time')}</Th>
            <Th>{t('end_time')}</Th>
            <Th>{t('distance')}</Th>
            <Th>{t('unit')}</Th>
            <Th>{t('details')}</Th>
            <Th>{t('quantity')}</Th>
            <Th>{t('no_charge')}</Th>
            <Th>{t('billable')}</Th>
            <Th>{t('rate')}</Th>
            <Th>{t('billable_toggle')}</Th>
            <Th>{t('total')}</Th>
            <Th></Th>
          </Thead>
          <Tbody>
            {travelEntries.map((entry) => (
              <Tr key={entry.id}>
                <Td>
                  <InputField
                    type="datetime-local"
                    value={entry.travel_start_time}
                    onValueChange={(value) =>
                      handleEntryChange(entry.id, 'travel_start_time', value)
                    }
                  />
                </Td>
                <Td>
                  <InputField
                    type="datetime-local"
                    value={entry.travel_end_time}
                    onValueChange={(value) =>
                      handleEntryChange(entry.id, 'travel_end_time', value)
                    }
                  />
                </Td>
                <Td>
                  <NumberInputField
                    value={entry.distance}
                    onValueChange={(value) =>
                      handleEntryChange(entry.id, 'distance', parseFloat(value) || 0)
                    }
                  />
                </Td>
                <Td>
                  <SelectField
                    value={entry.distance_unit}
                    onValueChange={(value) =>
                      handleEntryChange(entry.id, 'distance_unit', value)
                    }
                  >
                    <option value="miles">{t('miles')}</option>
                    <option value="km">{t('kilometers')}</option>
                  </SelectField>
                </Td>
                <Td>
                  <InputField
                    value={entry.travel_details}
                    onValueChange={(value) =>
                      handleEntryChange(entry.id, 'travel_details', value)
                    }
                  />
                </Td>
                <Td>
                  <NumberInputField
                    value={entry.rate_quantity}
                    onValueChange={(value) =>
                      handleEntryChange(entry.id, 'rate_quantity', parseFloat(value) || 0)
                    }
                  />
                </Td>
                <Td>
                  <NumberInputField
                    value={entry.no_charge_quantity}
                    onValueChange={(value) =>
                      handleEntryChange(entry.id, 'no_charge_quantity', parseFloat(value) || 0)
                    }
                  />
                </Td>
                <Td className="text-center">
                  {(entry.billable_quantity || 0).toFixed(2)}
                </Td>
                <Td className="min-w-[200px]">
                  <TravelRateSelector
                    value={entry.travel_rate_id}
                    onChange={(rate) => handleRateSelection(entry.id, rate)}
                    onClearButtonClick={() => {
                      handleEntryChange(entry.id, 'travel_rate_id', '');
                      handleEntryChange(entry.id, 'rate_amount', 0);
                    }}
                    showCharge={true}
                    groupSettingId={serviceOrder.client?.group_settings_id}
                  />
                </Td>
                <Td className="text-center">
                  <Toggle
                    checked={entry.is_billable}
                    onValueChange={(value) =>
                      handleEntryChange(entry.id, 'is_billable', value)
                    }
                  />
                </Td>
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
                    onClick={() => handleRemoveEntry(entry.id)}
                  >
                    <Icon element={MdDelete} size={20} color="red" />
                  </Button>
                </Td>
              </Tr>
            ))}
            <Tr>
              <Td colSpan={2} className="text-right font-medium">
                {t('totals')}:
              </Td>
              <Td className="font-medium text-center">
                {calculateTotalDistance().toFixed(1)}
              </Td>
              <Td></Td>
              <Td></Td>
              <Td></Td>
              <Td></Td>
              <Td className="font-medium text-center">
                {calculateTotalBillableQuantity().toFixed(2)}
              </Td>
              <Td></Td>
              <Td></Td>
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
      )}

      {travelEntries.length === 0 && (
        <div
          className="text-center py-8 border rounded"
          style={{ borderColor: colors.$5, color: colors.$3 }}
        >
          <p>{t('no_travel_entries')}</p>
          <Button type="minimal" onClick={handleAddEntry} className="mt-2">
            <Icon element={MdAdd} size={20} />
            {t('add_travel')}
          </Button>
        </div>
      )}
    </div>
  );
}

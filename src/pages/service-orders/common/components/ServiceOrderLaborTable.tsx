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

    handleChange('labor_entries', [...laborEntries, newEntry]);
  };

  const handleRemoveEntry = (entryId: string) => {
    handleChange(
      'labor_entries',
      laborEntries.filter((entry) => entry.id !== entryId)
    );
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
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium" style={{ color: colors.$3 }}>
          {t('labor_entries')}
        </h3>
        <Button type="minimal" behavior="button" onClick={handleAddEntry}>
          <Icon element={MdAdd} size={20} />
          {t('add_labor')}
        </Button>
      </div>

      {laborEntries.length > 0 && (
        <Table allowOverflow>
          <Thead>
            <Th>{t('start_time')}</Th>
            <Th>{t('end_time')}</Th>
            <Th>{t('description')}</Th>
            <Th>{t('duration')}</Th>
            <Th>{t('no_charge')}</Th>
            <Th>{t('billable')}</Th>
            <Th>{t('rate')}</Th>
            <Th>{t('billable_toggle')}</Th>
            <Th>{t('total')}</Th>
            <Th></Th>
          </Thead>
          <Tbody>
            {laborEntries.map((entry) => (
              <Tr key={entry.id}>
                <Td>
                  <InputField
                    type="datetime-local"
                    value={entry.start_time}
                    onValueChange={(value) =>
                      handleEntryChange(entry.id, 'start_time', value)
                    }
                  />
                </Td>
                <Td>
                  <InputField
                    type="datetime-local"
                    value={entry.end_time}
                    onValueChange={(value) =>
                      handleEntryChange(entry.id, 'end_time', value)
                    }
                  />
                </Td>
                <Td>
                  <InputField
                    value={entry.description}
                    onValueChange={(value) =>
                      handleEntryChange(entry.id, 'description', value)
                    }
                  />
                </Td>
                <Td>
                  <NumberInputField
                    value={entry.duration_hours}
                    onValueChange={(value) =>
                      handleEntryChange(entry.id, 'duration_hours', parseFloat(value) || 0)
                    }
                  />
                </Td>
                <Td>
                  <NumberInputField
                    value={entry.no_charge_hours}
                    onValueChange={(value) =>
                      handleEntryChange(entry.id, 'no_charge_hours', parseFloat(value) || 0)
                    }
                  />
                </Td>
                <Td className="text-center">
                  {(entry.billable_hours || 0).toFixed(2)}
                </Td>
                <Td className="min-w-[200px]" allowOverflow>
                  <ServiceRateSelector
                    value={entry.labor_rate_id}
                    onChange={(rate) => handleRateSelection(entry.id, rate)}
                    onClearButtonClick={() => {
                      handleEntryChange(entry.id, 'labor_rate_id', '');
                      handleEntryChange(entry.id, 'hourly_rate', 0);
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
                    behavior="button"
                    onClick={() => handleRemoveEntry(entry.id)}
                  >
                    <Icon element={MdDelete} size={20} color="red" />
                  </Button>
                </Td>
              </Tr>
            ))}
            <Tr>
              <Td colSpan={3} className="text-right font-medium">
                {t('totals')}:
              </Td>
              <Td className="font-medium text-center">
                {calculateTotalHours().toFixed(2)}
              </Td>
              <Td></Td>
              <Td className="font-medium text-center">
                {calculateTotalBillableHours().toFixed(2)}
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

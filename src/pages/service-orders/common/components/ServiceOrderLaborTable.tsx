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
      date: new Date().toISOString().split('T')[0],
      hours: 0,
      rate: 0,
      total: 0,
      description: '',
      created_at: Math.floor(Date.now() / 1000),
      updated_at: Math.floor(Date.now() / 1000),
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
    value: string | number
  ) => {
    const updatedEntries = laborEntries.map((entry) => {
      if (entry.id === entryId) {
        const updatedEntry = { ...entry, [property]: value };

        // Recalculate total when hours or rate changes
        if (property === 'hours' || property === 'rate') {
          updatedEntry.total = updatedEntry.hours * updatedEntry.rate;
        }

        return updatedEntry;
      }
      return entry;
    });

    handleChange('labor_entries', updatedEntries);
  };

  const calculateTotal = () => {
    return laborEntries.reduce((sum, entry) => sum + (entry.total || 0), 0);
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium" style={{ color: colors.$3 }}>
          {t('labor_entries')}
        </h3>
        <Button type="minimal" onClick={handleAddEntry}>
          <Icon element={MdAdd} size={20} />
          {t('add_labor')}
        </Button>
      </div>

      {laborEntries.length > 0 && (
        <Table>
          <Thead>
            <Th>{t('date')}</Th>
            <Th>{t('description')}</Th>
            <Th>{t('hours')}</Th>
            <Th>{t('rate')}</Th>
            <Th>{t('total')}</Th>
            <Th></Th>
          </Thead>
          <Tbody>
            {laborEntries.map((entry) => (
              <Tr key={entry.id}>
                <Td>
                  <InputField
                    type="date"
                    value={entry.date}
                    onValueChange={(value) =>
                      handleEntryChange(entry.id, 'date', value)
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
                    value={entry.hours}
                    onValueChange={(value) =>
                      handleEntryChange(entry.id, 'hours', parseFloat(value) || 0)
                    }
                  />
                </Td>
                <Td>
                  <NumberInputField
                    value={entry.rate}
                    onValueChange={(value) =>
                      handleEntryChange(entry.id, 'rate', parseFloat(value) || 0)
                    }
                  />
                </Td>
                <Td>
                  {formatMoney(
                    entry.total || 0,
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
              <Td colSpan={4} className="text-right font-medium">
                {t('total_labor_cost')}:
              </Td>
              <Td className="font-medium">
                {formatMoney(
                  calculateTotal(),
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
          <Button type="minimal" onClick={handleAddEntry} className="mt-2">
            <Icon element={MdAdd} size={20} />
            {t('add_labor')}
          </Button>
        </div>
      )}
    </div>
  );
}

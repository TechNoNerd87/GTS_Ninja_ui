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
import { Contract, ContractItem } from '$app/common/interfaces/contract';
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
  contract: Contract;
  handleChange: (property: keyof Contract, value: Contract[keyof Contract]) => void;
}

export function ContractItemsTable(props: Props) {
  const [t] = useTranslation();

  const colors = useColorScheme();
  const formatMoney = useFormatMoney();

  const { contract, handleChange } = props;

  const items = contract.items || [];

  const handleAddItem = () => {
    const newItem: ContractItem = {
      id: uuidv4(),
      contract_id: contract.id,
      description: '',
      quantity: 1,
      unit_price: 0,
      total: 0,
    };

    handleChange('items', [...items, newItem]);
  };

  const handleRemoveItem = (itemId: string) => {
    handleChange(
      'items',
      items.filter((item) => item.id !== itemId)
    );
  };

  const handleItemChange = (
    itemId: string,
    property: keyof ContractItem,
    value: string | number
  ) => {
    const updatedItems = items.map((item) => {
      if (item.id === itemId) {
        const updatedItem = { ...item, [property]: value };

        // Recalculate total when quantity or unit_price changes
        if (property === 'quantity' || property === 'unit_price') {
          updatedItem.total = updatedItem.quantity * updatedItem.unit_price;
        }

        return updatedItem;
      }
      return item;
    });

    handleChange('items', updatedItems);
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.total || 0), 0);
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium" style={{ color: colors.$3 }}>
          {t('contract_items')}
        </h3>
        <Button type="minimal" onClick={handleAddItem}>
          <Icon element={MdAdd} size={20} />
          {t('add_item')}
        </Button>
      </div>

      {items.length > 0 && (
        <Table>
          <Thead>
            <Th>{t('description')}</Th>
            <Th>{t('quantity')}</Th>
            <Th>{t('unit_price')}</Th>
            <Th>{t('total')}</Th>
            <Th></Th>
          </Thead>
          <Tbody>
            {items.map((item) => (
              <Tr key={item.id}>
                <Td>
                  <InputField
                    value={item.description}
                    onValueChange={(value) =>
                      handleItemChange(item.id, 'description', value)
                    }
                  />
                </Td>
                <Td>
                  <NumberInputField
                    value={item.quantity}
                    onValueChange={(value) =>
                      handleItemChange(item.id, 'quantity', parseFloat(value) || 0)
                    }
                  />
                </Td>
                <Td>
                  <NumberInputField
                    value={item.unit_price}
                    onValueChange={(value) =>
                      handleItemChange(item.id, 'unit_price', parseFloat(value) || 0)
                    }
                  />
                </Td>
                <Td>
                  {formatMoney(
                    item.total || 0,
                    contract.client?.country_id,
                    contract.client?.settings?.currency_id
                  )}
                </Td>
                <Td>
                  <Button
                    type="minimal"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    <Icon element={MdDelete} size={20} color="red" />
                  </Button>
                </Td>
              </Tr>
            ))}
            <Tr>
              <Td colSpan={3} className="text-right font-medium">
                {t('total')}:
              </Td>
              <Td className="font-medium">
                {formatMoney(
                  calculateTotal(),
                  contract.client?.country_id,
                  contract.client?.settings?.currency_id
                )}
              </Td>
              <Td></Td>
            </Tr>
          </Tbody>
        </Table>
      )}

      {items.length === 0 && (
        <div
          className="text-center py-8 border rounded"
          style={{ borderColor: colors.$5, color: colors.$3 }}
        >
          <p>{t('no_items')}</p>
          <Button type="minimal" onClick={handleAddItem} className="mt-2">
            <Icon element={MdAdd} size={20} />
            {t('add_item')}
          </Button>
        </div>
      )}
    </div>
  );
}

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
import { ServiceOrder, ServiceOrderPart } from '$app/common/interfaces/service-order';
import { useColorScheme } from '$app/common/colors';
import { Button } from '$app/components/forms';
import { InputField } from '$app/components/forms';
import { NumberInputField } from '$app/components/forms/NumberInputField';
import { useFormatMoney } from '$app/common/hooks/money/useFormatMoney';
import { MdDelete, MdAdd } from 'react-icons/md';
import { Icon } from '$app/components/icons/Icon';
import { Table, Thead, Th, Tbody, Tr, Td } from '$app/components/tables';
import { ProductSelector } from '$app/components/products/ProductSelector';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  serviceOrder: ServiceOrder;
  handleChange: (property: keyof ServiceOrder, value: ServiceOrder[keyof ServiceOrder]) => void;
}

export function ServiceOrderPartsTable(props: Props) {
  const [t] = useTranslation();

  const colors = useColorScheme();
  const formatMoney = useFormatMoney();

  const { serviceOrder, handleChange } = props;

  const parts = serviceOrder.parts_used || [];

  const handleAddPart = () => {
    const newPart: ServiceOrderPart = {
      id: uuidv4(),
      service_order_id: serviceOrder.id,
      product_id: '',
      warehouse_id: '',
      part_name: '',
      quantity: 1,
      unit_cost: 0,
      unit_price: 0,
      total_cost: 0,
      total_price: 0,
      notes: '',
      is_billable: true,
      created_at: Math.floor(Date.now() / 1000),
      updated_at: Math.floor(Date.now() / 1000),
      is_deleted: false,
    };

    handleChange('parts_used', [...parts, newPart]);
  };

  const handleRemovePart = (partId: string) => {
    handleChange(
      'parts_used',
      parts.filter((part) => part.id !== partId)
    );
  };

  const handlePartChange = (
    partId: string,
    property: keyof ServiceOrderPart,
    value: string | number
  ) => {
    const updatedParts = parts.map((part) => {
      if (part.id === partId) {
        const updatedPart = { ...part, [property]: value };

        // Recalculate totals when quantity or prices change
        if (property === 'quantity' || property === 'unit_price' || property === 'unit_cost') {
          updatedPart.total_price = updatedPart.quantity * updatedPart.unit_price;
          updatedPart.total_cost = updatedPart.quantity * updatedPart.unit_cost;
        }

        return updatedPart;
      }
      return part;
    });

    handleChange('parts_used', updatedParts);
  };

  const handleProductSelect = (partId: string, product: any) => {
    const updatedParts = parts.map((part) => {
      if (part.id === partId) {
        const price = product.resource?.price || 0;
        const cost = product.resource?.cost || 0;
        return {
          ...part,
          product_id: product.id,
          part_name: product.resource?.product_key || '',
          unit_price: price,
          unit_cost: cost,
          total_price: part.quantity * price,
          total_cost: part.quantity * cost,
        };
      }
      return part;
    });

    handleChange('parts_used', updatedParts);
  };

  const calculateTotal = () => {
    return parts.reduce((sum, part) => sum + (part.total_price || 0), 0);
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium" style={{ color: colors.$3 }}>
          {t('parts_used')}
        </h3>
        <Button type="minimal" onClick={handleAddPart}>
          <Icon element={MdAdd} size={20} />
          {t('add_part')}
        </Button>
      </div>

      {parts.length > 0 && (
        <Table>
          <Thead>
            <Th>{t('product')}</Th>
            <Th>{t('description')}</Th>
            <Th>{t('quantity')}</Th>
            <Th>{t('unit_price')}</Th>
            <Th>{t('total')}</Th>
            <Th></Th>
          </Thead>
          <Tbody>
            {parts.map((part) => (
              <Tr key={part.id}>
                <Td>
                  <ProductSelector
                    defaultValue={part.product_id}
                    onChange={(product) => handleProductSelect(part.id, product)}
                    onClearButtonClick={() => handlePartChange(part.id, 'product_id', '')}
                    withoutAction
                  />
                </Td>
                <Td>
                  <InputField
                    value={part.part_name}
                    onValueChange={(value) =>
                      handlePartChange(part.id, 'part_name', value)
                    }
                  />
                </Td>
                <Td>
                  <NumberInputField
                    value={part.quantity}
                    onValueChange={(value) =>
                      handlePartChange(part.id, 'quantity', parseFloat(value) || 0)
                    }
                  />
                </Td>
                <Td>
                  <NumberInputField
                    value={part.unit_price}
                    onValueChange={(value) =>
                      handlePartChange(part.id, 'unit_price', parseFloat(value) || 0)
                    }
                  />
                </Td>
                <Td>
                  {formatMoney(
                    part.total_price || 0,
                    serviceOrder.client?.country_id,
                    serviceOrder.client?.settings?.currency_id
                  )}
                </Td>
                <Td>
                  <Button
                    type="minimal"
                    onClick={() => handleRemovePart(part.id)}
                  >
                    <Icon element={MdDelete} size={20} color="red" />
                  </Button>
                </Td>
              </Tr>
            ))}
            <Tr>
              <Td colSpan={4} className="text-right font-medium">
                {t('total_parts_cost')}:
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

      {parts.length === 0 && (
        <div
          className="text-center py-8 border rounded"
          style={{ borderColor: colors.$5, color: colors.$3 }}
        >
          <p>{t('no_parts')}</p>
          <Button type="minimal" onClick={handleAddPart} className="mt-2">
            <Icon element={MdAdd} size={20} />
            {t('add_part')}
          </Button>
        </div>
      )}
    </div>
  );
}

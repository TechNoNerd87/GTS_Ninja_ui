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
import Toggle from '$app/components/forms/Toggle';
import classNames from 'classnames';

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

  const [selectedPartId, setSelectedPartId] = useState<string | null>(
    parts.length > 0 ? parts[0].id : null
  );

  const selectedPart = parts.find((part) => part.id === selectedPartId);

  const handleAddPart = () => {
    const newPart: ServiceOrderPart = {
      id: uuidv4(),
      user_id: '',
      service_order_id: serviceOrder.id,
      product_id: '',
      warehouse_id: '',
      service_bank_id: '',
      tax_rate_id: '',
      part_name: '',
      serial_number: '',
      lot_number: '',
      quantity: 1,
      quantity_returned: 0,
      return_reason: '',
      unit_cost: 0,
      unit_price: 0,
      total_cost: 0,
      total_price: 0,
      notes: '',
      warranty_months: 0,
      warranty_expiration: '',
      is_billable: true,
      affects_inventory: true,
      inventory_deducted: false,
      inventory_deducted_at: '',
      applied_to_bank: false,
      part_status: 'reserved',
      is_serialized: false,
      is_under_warranty: false,
      effective_quantity: 1,
      billable_amount: 0,
      created_at: Math.floor(Date.now() / 1000),
      updated_at: Math.floor(Date.now() / 1000),
      archived_at: 0,
      is_deleted: false,
    };

    const newParts = [...parts, newPart];
    handleChange('parts_used', newParts);
    setSelectedPartId(newPart.id);
  };

  const handleRemovePart = (partId: string) => {
    const newParts = parts.filter((part) => part.id !== partId);
    handleChange('parts_used', newParts);

    if (selectedPartId === partId) {
      setSelectedPartId(newParts.length > 0 ? newParts[0].id : null);
    }
  };

  const handlePartChange = (
    partId: string,
    property: keyof ServiceOrderPart,
    value: string | number | boolean
  ) => {
    const updatedParts = parts.map((part) => {
      if (part.id === partId) {
        const updatedPart = { ...part, [property]: value };

        // Recalculate totals when quantity or prices change
        if (property === 'quantity' || property === 'unit_price' || property === 'unit_cost') {
          updatedPart.effective_quantity = Math.max(0, (updatedPart.quantity || 0) - (updatedPart.quantity_returned || 0));
          updatedPart.total_price = updatedPart.effective_quantity * (updatedPart.unit_price || 0);
          updatedPart.total_cost = updatedPart.effective_quantity * (updatedPart.unit_cost || 0);
        }

        if (property === 'quantity_returned') {
          updatedPart.effective_quantity = Math.max(0, (updatedPart.quantity || 0) - (updatedPart.quantity_returned || 0));
          updatedPart.total_price = updatedPart.effective_quantity * (updatedPart.unit_price || 0);
          updatedPart.total_cost = updatedPart.effective_quantity * (updatedPart.unit_cost || 0);
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
        const effectiveQty = Math.max(0, (part.quantity || 0) - (part.quantity_returned || 0));
        return {
          ...part,
          product_id: product.id,
          part_name: product.resource?.product_key || '',
          unit_price: price,
          unit_cost: cost,
          effective_quantity: effectiveQty,
          total_price: effectiveQty * price,
          total_cost: effectiveQty * cost,
        };
      }
      return part;
    });

    handleChange('parts_used', updatedParts);
  };

  const calculateTotalPrice = () => {
    return parts.reduce((sum, part) => sum + (part.total_price || 0), 0);
  };

  const calculateTotalQuantity = () => {
    return parts.reduce((sum, part) => sum + (part.quantity || 0), 0);
  };

  const calculateTotalEffectiveQuantity = () => {
    return parts.reduce((sum, part) => sum + (part.effective_quantity || 0), 0);
  };

  return (
    <div className="flex flex-col space-y-4">
      {/* Header with Add button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium flex items-center gap-2" style={{ color: colors.$3 }}>
          <span>🔩</span>
          {t('parts_used')}
        </h3>
        <Button type="minimal" behavior="button" onClick={handleAddPart}>
          <Icon element={MdAdd} size={20} />
          {t('add_part')}
        </Button>
      </div>

      {parts.length > 0 && (
        <>
          {/* Summary Table */}
          <Table>
            <Thead>
              <Th>{t('product')}</Th>
              <Th>{t('description')}</Th>
              <Th>{t('quantity')}</Th>
              <Th>{t('returned')}</Th>
              <Th>{t('effective')}</Th>
              <Th>{t('unit_price')}</Th>
              <Th>{t('total')}</Th>
              <Th></Th>
            </Thead>
            <Tbody>
              {parts.map((part) => (
                <Tr
                  key={part.id}
                  className={classNames('cursor-pointer transition-colors', {
                    'bg-blue-50 dark:bg-blue-900/20': part.id === selectedPartId,
                  })}
                  onClick={() => setSelectedPartId(part.id)}
                >
                  <Td>{part.product_id ? t('product_selected') : '-'}</Td>
                  <Td>{part.part_name || '-'}</Td>
                  <Td>{part.quantity || 0}</Td>
                  <Td>{part.quantity_returned || 0}</Td>
                  <Td>{part.effective_quantity || 0}</Td>
                  <Td>
                    {formatMoney(
                      part.unit_price || 0,
                      serviceOrder.client?.country_id,
                      serviceOrder.client?.settings?.currency_id
                    )}
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
                      behavior="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemovePart(part.id);
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
                <Td className="font-medium">{calculateTotalQuantity()}</Td>
                <Td></Td>
                <Td className="font-medium">{calculateTotalEffectiveQuantity()}</Td>
                <Td></Td>
                <Td className="font-medium">
                  {formatMoney(
                    calculateTotalPrice(),
                    serviceOrder.client?.country_id,
                    serviceOrder.client?.settings?.currency_id
                  )}
                </Td>
                <Td></Td>
              </Tr>
            </Tbody>
          </Table>

          {/* Detail Form for Selected Part */}
          {selectedPart && (
            <div
              className="border rounded-lg p-4 mt-4"
              style={{ borderColor: colors.$5, backgroundColor: colors.$1 }}
            >
              <h4 className="text-sm font-medium mb-4" style={{ color: colors.$3 }}>
                {t('edit_part')}
              </h4>

              {/* Row 1: Product | Part Name | Serial Number | Lot Number */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                    {t('product')}
                  </label>
                  <ProductSelector
                    defaultValue={selectedPart.product_id}
                    onChange={(product) => handleProductSelect(selectedPart.id, product)}
                    onClearButtonClick={() => handlePartChange(selectedPart.id, 'product_id', '')}
                    withoutAction
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                    {t('part_name')}
                  </label>
                  <InputField
                    value={selectedPart.part_name}
                    onValueChange={(value) =>
                      handlePartChange(selectedPart.id, 'part_name', value)
                    }
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                    {t('serial_number')}
                  </label>
                  <InputField
                    value={selectedPart.serial_number}
                    onValueChange={(value) =>
                      handlePartChange(selectedPart.id, 'serial_number', value)
                    }
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                    {t('lot_number')}
                  </label>
                  <InputField
                    value={selectedPart.lot_number}
                    onValueChange={(value) =>
                      handlePartChange(selectedPart.id, 'lot_number', value)
                    }
                  />
                </div>
              </div>

              {/* Row 2: Quantity | Returned | Unit Cost | Unit Price */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                    {t('quantity')}
                  </label>
                  <NumberInputField
                    value={selectedPart.quantity}
                    onValueChange={(value) =>
                      handlePartChange(selectedPart.id, 'quantity', parseFloat(value) || 0)
                    }
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                    {t('quantity_returned')}
                  </label>
                  <NumberInputField
                    value={selectedPart.quantity_returned}
                    onValueChange={(value) =>
                      handlePartChange(selectedPart.id, 'quantity_returned', parseFloat(value) || 0)
                    }
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                    {t('unit_cost')}
                  </label>
                  <NumberInputField
                    value={selectedPart.unit_cost}
                    onValueChange={(value) =>
                      handlePartChange(selectedPart.id, 'unit_cost', parseFloat(value) || 0)
                    }
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                    {t('unit_price')}
                  </label>
                  <NumberInputField
                    value={selectedPart.unit_price}
                    onValueChange={(value) =>
                      handlePartChange(selectedPart.id, 'unit_price', parseFloat(value) || 0)
                    }
                  />
                </div>
              </div>

              {/* Row 3: Warranty Months | Warranty Expiration | Billable Toggle | Affects Inventory Toggle */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                    {t('warranty_months')}
                  </label>
                  <NumberInputField
                    value={selectedPart.warranty_months}
                    onValueChange={(value) =>
                      handlePartChange(selectedPart.id, 'warranty_months', parseInt(value) || 0)
                    }
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                    {t('warranty_expiration')}
                  </label>
                  <InputField
                    type="date"
                    value={selectedPart.warranty_expiration}
                    onValueChange={(value) =>
                      handlePartChange(selectedPart.id, 'warranty_expiration', value)
                    }
                  />
                </div>
                <div className="flex items-center gap-3 pt-5">
                  <Toggle
                    checked={selectedPart.is_billable}
                    onValueChange={(value) =>
                      handlePartChange(selectedPart.id, 'is_billable', value)
                    }
                  />
                  <label className="text-sm font-medium" style={{ color: colors.$3 }}>
                    {t('billable')}
                  </label>
                </div>
                <div className="flex items-center gap-3 pt-5">
                  <Toggle
                    checked={selectedPart.affects_inventory}
                    onValueChange={(value) =>
                      handlePartChange(selectedPart.id, 'affects_inventory', value)
                    }
                  />
                  <label className="text-sm font-medium" style={{ color: colors.$3 }}>
                    {t('affects_inventory')}
                  </label>
                </div>
              </div>

              {/* Row 4: Return Reason (if quantity_returned > 0) */}
              {(selectedPart.quantity_returned || 0) > 0 && (
                <div className="mb-4">
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                    {t('return_reason')}
                  </label>
                  <InputField
                    value={selectedPart.return_reason}
                    onValueChange={(value) =>
                      handlePartChange(selectedPart.id, 'return_reason', value)
                    }
                    placeholder={t('enter_return_reason')}
                  />
                </div>
              )}

              {/* Row 5: Notes */}
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                  {t('notes')}
                </label>
                <InputField
                  element="textarea"
                  value={selectedPart.notes}
                  onValueChange={(value) =>
                    handlePartChange(selectedPart.id, 'notes', value)
                  }
                  placeholder={t('enter_notes')}
                />
              </div>
            </div>
          )}
        </>
      )}

      {parts.length === 0 && (
        <div
          className="text-center py-8 border rounded"
          style={{ borderColor: colors.$5, color: colors.$3 }}
        >
          <p>{t('no_parts')}</p>
          <Button type="minimal" behavior="button" onClick={handleAddPart} className="mt-2">
            <Icon element={MdAdd} size={20} />
            {t('add_part')}
          </Button>
        </div>
      )}
    </div>
  );
}

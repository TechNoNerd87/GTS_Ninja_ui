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
import { InputField, SelectField } from '$app/components/forms';
import { Element } from '$app/components/cards';
import { Card } from '$app/components/cards';
import { Equipment, EquipmentStatus } from '$app/common/interfaces/equipment';
import { ValidationBag } from '$app/common/interfaces/validation-bag';
import { EntityStatus } from '$app/components/EntityStatus';
import { ClientSelector } from '$app/components/clients/ClientSelector';
import { LocationSelector } from '$app/components/locations/LocationSelector';
import { NumberInputField } from '$app/components/forms/NumberInputField';

interface Props {
  type?: 'create' | 'edit';
  equipment: Equipment;
  errors: ValidationBag | undefined;
  handleChange: (
    property: keyof Equipment,
    value: Equipment[keyof Equipment]
  ) => void;
}

export function EquipmentForm(props: Props) {
  const [t] = useTranslation();

  const { errors, handleChange, type, equipment } = props;

  const statusOptions: { value: EquipmentStatus; label: string }[] = [
    { value: 'active', label: t('active') },
    { value: 'inactive', label: t('inactive') },
    { value: 'maintenance', label: t('maintenance') },
    { value: 'retired', label: t('retired') },
  ];

  const categoryOptions = [
    { value: '', label: t('select_category') },
    { value: 'hvac', label: t('hvac') },
    { value: 'electrical', label: t('electrical') },
    { value: 'plumbing', label: t('plumbing') },
    { value: 'mechanical', label: t('mechanical') },
    { value: 'computer', label: t('computer') },
    { value: 'office', label: t('office') },
    { value: 'vehicle', label: t('vehicle') },
    { value: 'other', label: t('other') },
  ];

  return (
    <div className="grid grid-cols-12 gap-4">
      {/* Basic Information */}
      <Card className="col-span-12 lg:col-span-6" title={t('details')}>
        {type === 'edit' && (
          <Element leftSide={t('status')}>
            <EntityStatus entity={equipment} />
          </Element>
        )}

        <Element leftSide={t('name')} required>
          <InputField
            required
            value={equipment.name}
            onValueChange={(value) => handleChange('name', value)}
            errorMessage={errors?.errors.name}
          />
        </Element>

        <Element leftSide={t('equipment_number')}>
          <InputField
            value={equipment.number}
            onValueChange={(value) => handleChange('number', value)}
            errorMessage={errors?.errors.number}
          />
        </Element>

        <Element leftSide={t('client')}>
          <ClientSelector
            value={equipment.client_id}
            onChange={(client) => handleChange('client_id', client.id)}
            onClearButtonClick={() => handleChange('client_id', '')}
            errorMessage={errors?.errors.client_id}
          />
        </Element>

        <Element leftSide={t('location')}>
          <LocationSelector
            value={equipment.location_id}
            onChange={(location) => handleChange('location_id', location.id)}
            onClearButtonClick={() => handleChange('location_id', '')}
            errorMessage={errors?.errors.location_id}
          />
        </Element>

        <Element leftSide={t('equipment_status')}>
          <SelectField
            value={equipment.status}
            onValueChange={(value) => handleChange('status', value as EquipmentStatus)}
            errorMessage={errors?.errors.status}
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </SelectField>
        </Element>

        <Element leftSide={t('category')}>
          <SelectField
            value={equipment.category}
            onValueChange={(value) => handleChange('category', value)}
            errorMessage={errors?.errors.category}
          >
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </SelectField>
        </Element>
      </Card>

      {/* Identification */}
      <Card className="col-span-12 lg:col-span-6" title={t('identification')}>
        <Element leftSide={t('serial_number')}>
          <InputField
            value={equipment.serial_number}
            onValueChange={(value) => handleChange('serial_number', value)}
            errorMessage={errors?.errors.serial_number}
          />
        </Element>

        <Element leftSide={t('model')}>
          <InputField
            value={equipment.model}
            onValueChange={(value) => handleChange('model', value)}
            errorMessage={errors?.errors.model}
          />
        </Element>

        <Element leftSide={t('manufacturer')}>
          <InputField
            value={equipment.manufacturer}
            onValueChange={(value) => handleChange('manufacturer', value)}
            errorMessage={errors?.errors.manufacturer}
          />
        </Element>

        <Element leftSide={t('asset_tag')}>
          <InputField
            value={equipment.asset_tag}
            onValueChange={(value) => handleChange('asset_tag', value)}
            errorMessage={errors?.errors.asset_tag}
          />
        </Element>
      </Card>

      {/* Dates */}
      <Card className="col-span-12 lg:col-span-6" title={t('dates')}>
        <Element leftSide={t('purchase_date')}>
          <InputField
            type="date"
            value={equipment.purchase_date}
            onValueChange={(value) => handleChange('purchase_date', value)}
            errorMessage={errors?.errors.purchase_date}
          />
        </Element>

        <Element leftSide={t('installation_date')}>
          <InputField
            type="date"
            value={equipment.installation_date}
            onValueChange={(value) => handleChange('installation_date', value)}
            errorMessage={errors?.errors.installation_date}
          />
        </Element>

        <Element leftSide={t('warranty_expiration')}>
          <InputField
            type="date"
            value={equipment.warranty_expiration}
            onValueChange={(value) => handleChange('warranty_expiration', value)}
            errorMessage={errors?.errors.warranty_expiration}
          />
        </Element>
      </Card>

      {/* Financial */}
      <Card className="col-span-12 lg:col-span-6" title={t('financial')}>
        <Element leftSide={t('purchase_cost')}>
          <NumberInputField
            value={equipment.purchase_cost}
            onValueChange={(value) => handleChange('purchase_cost', parseFloat(value) || 0)}
            errorMessage={errors?.errors.purchase_cost}
          />
        </Element>

        <Element leftSide={t('current_value')}>
          <NumberInputField
            value={equipment.current_value}
            onValueChange={(value) => handleChange('current_value', parseFloat(value) || 0)}
            errorMessage={errors?.errors.current_value}
          />
        </Element>
      </Card>

      {/* Notes */}
      <Card className="col-span-12" title={t('notes')}>
        <Element leftSide={t('description')}>
          <InputField
            element="textarea"
            value={equipment.description}
            onValueChange={(value) => handleChange('description', value)}
            errorMessage={errors?.errors.description}
          />
        </Element>

        <Element leftSide={t('specifications')}>
          <InputField
            element="textarea"
            value={equipment.specifications}
            onValueChange={(value) => handleChange('specifications', value)}
            errorMessage={errors?.errors.specifications}
          />
        </Element>

        <Element leftSide={t('notes')}>
          <InputField
            element="textarea"
            value={equipment.notes}
            onValueChange={(value) => handleChange('notes', value)}
            errorMessage={errors?.errors.notes}
          />
        </Element>
      </Card>
    </div>
  );
}

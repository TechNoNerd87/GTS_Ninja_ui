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
import { Equipment, EquipmentStatus } from '$app/common/interfaces/equipment';
import { ValidationBag } from '$app/common/interfaces/validation-bag';
import { EntityStatus } from '$app/components/EntityStatus';
import { ClientSelector } from '$app/components/clients/ClientSelector';
import { LocationSelector } from '$app/components/locations/LocationSelector';

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

  return (
    <>
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

      <Element leftSide={t('serial_number')}>
        <InputField
          value={equipment.serial_number}
          onValueChange={(value) => handleChange('serial_number', value)}
          errorMessage={errors?.errors.serial_number}
        />
      </Element>

      <Element leftSide={t('model_number')}>
        <InputField
          value={equipment.model_number}
          onValueChange={(value) => handleChange('model_number', value)}
          errorMessage={errors?.errors.model_number}
        />
      </Element>

      <Element leftSide={t('manufacturer')}>
        <InputField
          value={equipment.manufacturer}
          onValueChange={(value) => handleChange('manufacturer', value)}
          errorMessage={errors?.errors.manufacturer}
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

      <Element leftSide={t('purchase_date')}>
        <InputField
          type="date"
          value={equipment.purchase_date}
          onValueChange={(value) => handleChange('purchase_date', value)}
          errorMessage={errors?.errors.purchase_date}
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

      <Element leftSide={t('notes')}>
        <InputField
          element="textarea"
          value={equipment.notes}
          onValueChange={(value) => handleChange('notes', value)}
          errorMessage={errors?.errors.notes}
        />
      </Element>
    </>
  );
}

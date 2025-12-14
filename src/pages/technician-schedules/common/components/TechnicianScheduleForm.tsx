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
import { TechnicianSchedule, TechnicianScheduleStatus } from '$app/common/interfaces/technician-schedule';
import { ValidationBag } from '$app/common/interfaces/validation-bag';
import { EntityStatus } from '$app/components/EntityStatus';
import { UserSelector } from '$app/components/users/UserSelector';
import { ServiceOrderSelector } from '$app/components/service-orders/ServiceOrderSelector';

interface Props {
  type?: 'create' | 'edit';
  technicianSchedule: TechnicianSchedule;
  errors: ValidationBag | undefined;
  handleChange: (
    property: keyof TechnicianSchedule,
    value: TechnicianSchedule[keyof TechnicianSchedule]
  ) => void;
}

export function TechnicianScheduleForm(props: Props) {
  const [t] = useTranslation();

  const { errors, handleChange, type, technicianSchedule } = props;

  const statusOptions: { value: TechnicianScheduleStatus; label: string }[] = [
    { value: 'scheduled', label: t('scheduled') },
    { value: 'in_progress', label: t('in_progress') },
    { value: 'completed', label: t('completed') },
    { value: 'cancelled', label: t('cancelled') },
  ];

  return (
    <>
      {type === 'edit' && (
        <Element leftSide={t('status')}>
          <EntityStatus entity={technicianSchedule} />
        </Element>
      )}

      <Element leftSide={t('title')} required>
        <InputField
          required
          value={technicianSchedule.title}
          onValueChange={(value) => handleChange('title', value)}
          errorMessage={errors?.errors.title}
        />
      </Element>

      <Element leftSide={t('technician')} required>
        <UserSelector
          value={technicianSchedule.user_id}
          onChange={(user) => handleChange('user_id', user.id)}
          onClearButtonClick={() => handleChange('user_id', '')}
          errorMessage={errors?.errors.user_id}
        />
      </Element>

      <Element leftSide={t('service_order')}>
        <ServiceOrderSelector
          value={technicianSchedule.service_order_id}
          onChange={(serviceOrder) => handleChange('service_order_id', serviceOrder.id)}
          onClearButtonClick={() => handleChange('service_order_id', '')}
          errorMessage={errors?.errors.service_order_id}
        />
      </Element>

      <Element leftSide={t('scheduled_start')}>
        <InputField
          type="datetime-local"
          value={technicianSchedule.scheduled_start}
          onValueChange={(value) => handleChange('scheduled_start', value)}
          errorMessage={errors?.errors.scheduled_start}
        />
      </Element>

      <Element leftSide={t('scheduled_end')}>
        <InputField
          type="datetime-local"
          value={technicianSchedule.scheduled_end}
          onValueChange={(value) => handleChange('scheduled_end', value)}
          errorMessage={errors?.errors.scheduled_end}
        />
      </Element>

      <Element leftSide={t('actual_start')}>
        <InputField
          type="datetime-local"
          value={technicianSchedule.actual_start}
          onValueChange={(value) => handleChange('actual_start', value)}
          errorMessage={errors?.errors.actual_start}
        />
      </Element>

      <Element leftSide={t('actual_end')}>
        <InputField
          type="datetime-local"
          value={technicianSchedule.actual_end}
          onValueChange={(value) => handleChange('actual_end', value)}
          errorMessage={errors?.errors.actual_end}
        />
      </Element>

      <Element leftSide={t('schedule_status')}>
        <SelectField
          value={technicianSchedule.status}
          onValueChange={(value) => handleChange('status', value as TechnicianScheduleStatus)}
          errorMessage={errors?.errors.status}
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </SelectField>
      </Element>

      <Element leftSide={t('notes')}>
        <InputField
          element="textarea"
          value={technicianSchedule.notes}
          onValueChange={(value) => handleChange('notes', value)}
          errorMessage={errors?.errors.notes}
        />
      </Element>
    </>
  );
}

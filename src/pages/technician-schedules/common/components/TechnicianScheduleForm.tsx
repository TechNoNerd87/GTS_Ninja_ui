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
import { TechnicianSchedule, ScheduleType } from '$app/common/interfaces/technician-schedule';
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

  const scheduleTypeOptions: { value: ScheduleType; label: string }[] = [
    { value: 'service', label: t('service') },
    { value: 'break', label: t('break') },
    { value: 'travel', label: t('travel') },
    { value: 'meeting', label: t('meeting') },
    { value: 'off', label: t('off') },
  ];

  return (
    <div className="grid grid-cols-12 gap-4">
      {/* Basic Information */}
      <Card className="col-span-12 lg:col-span-6" title={t('details')}>
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
            value={technicianSchedule.technician_user_id}
            onChange={(user) => handleChange('technician_user_id', user.id)}
            onClearButtonClick={() => handleChange('technician_user_id', '')}
            errorMessage={errors?.errors.technician_user_id}
          />
        </Element>

        <Element leftSide={t('schedule_type')}>
          <SelectField
            value={technicianSchedule.schedule_type}
            onValueChange={(value) => handleChange('schedule_type', value as ScheduleType)}
            errorMessage={errors?.errors.schedule_type}
          >
            {scheduleTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </SelectField>
        </Element>

        <Element leftSide={t('service_order')}>
          <ServiceOrderSelector
            value={technicianSchedule.service_order_id}
            onChange={(serviceOrder) => handleChange('service_order_id', serviceOrder.id)}
            onClearButtonClick={() => handleChange('service_order_id', '')}
            errorMessage={errors?.errors.service_order_id}
          />
        </Element>
      </Card>

      {/* Schedule Times */}
      <Card className="col-span-12 lg:col-span-6" title={t('schedule')}>
        <Element leftSide={t('schedule_date')} required>
          <InputField
            type="date"
            required
            value={technicianSchedule.schedule_date}
            onValueChange={(value) => handleChange('schedule_date', value)}
            errorMessage={errors?.errors.schedule_date}
          />
        </Element>

        <Element leftSide={t('start_time')} required>
          <InputField
            type="time"
            required
            value={technicianSchedule.start_time}
            onValueChange={(value) => handleChange('start_time', value)}
            errorMessage={errors?.errors.start_time}
          />
        </Element>

        <Element leftSide={t('end_time')} required>
          <InputField
            type="time"
            required
            value={technicianSchedule.end_time}
            onValueChange={(value) => handleChange('end_time', value)}
            errorMessage={errors?.errors.end_time}
          />
        </Element>
      </Card>

      {/* Notes */}
      <Card className="col-span-12" title={t('notes')}>
        <Element leftSide={t('notes')}>
          <InputField
            element="textarea"
            value={technicianSchedule.notes}
            onValueChange={(value) => handleChange('notes', value)}
            errorMessage={errors?.errors.notes}
          />
        </Element>
      </Card>
    </div>
  );
}

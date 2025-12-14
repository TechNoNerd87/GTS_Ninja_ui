/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '$app/components/cards';
import { ValidationBag } from '$app/common/interfaces/validation-bag';
import { useAtom } from 'jotai';
import { technicianScheduleAtom } from '../atoms';
import { useHandleChange } from '../hooks';
import { TechnicianScheduleForm } from './TechnicianScheduleForm';
import { useColorScheme } from '$app/common/colors';

interface Props {
  errors: ValidationBag | undefined;
  setErrors: Dispatch<SetStateAction<ValidationBag | undefined>>;
}

export function CreateTechnicianSchedule(props: Props) {
  const [t] = useTranslation();

  const colors = useColorScheme();

  const [technicianSchedule, setTechnicianSchedule] = useAtom(technicianScheduleAtom);

  const handleChange = useHandleChange({
    setErrors: props.setErrors,
    setTechnicianSchedule,
  });

  return (
    <Card
      title={t('new_technician_schedule')}
      className="shadow-sm"
      style={{ borderColor: colors.$24 }}
      headerStyle={{ borderColor: colors.$20 }}
    >
      {technicianSchedule && (
        <TechnicianScheduleForm
          errors={props.errors}
          handleChange={handleChange}
          technicianSchedule={technicianSchedule}
        />
      )}
    </Card>
  );
}

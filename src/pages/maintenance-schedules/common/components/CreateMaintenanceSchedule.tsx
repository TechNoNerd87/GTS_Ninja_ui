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
import { maintenanceScheduleAtom } from '../atoms';
import { useHandleChange } from '../hooks';
import { MaintenanceScheduleForm } from './MaintenanceScheduleForm';
import { useColorScheme } from '$app/common/colors';

interface Props {
  errors: ValidationBag | undefined;
  setErrors: Dispatch<SetStateAction<ValidationBag | undefined>>;
}

export function CreateMaintenanceSchedule(props: Props) {
  const [t] = useTranslation();

  const colors = useColorScheme();

  const [maintenanceSchedule, setMaintenanceSchedule] = useAtom(maintenanceScheduleAtom);

  const handleChange = useHandleChange({
    setErrors: props.setErrors,
    setMaintenanceSchedule,
  });

  return (
    <Card
      title={t('new_maintenance_schedule')}
      className="shadow-sm"
      style={{ borderColor: colors.$24 }}
      headerStyle={{ borderColor: colors.$20 }}
    >
      {maintenanceSchedule && (
        <MaintenanceScheduleForm
          errors={props.errors}
          handleChange={handleChange}
          maintenanceSchedule={maintenanceSchedule}
        />
      )}
    </Card>
  );
}

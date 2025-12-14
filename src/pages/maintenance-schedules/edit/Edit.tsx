/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Card } from '$app/components/cards';
import { useMaintenanceScheduleQuery } from '$app/common/queries/maintenance-schedules';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import { MaintenanceScheduleForm } from '../common/components/MaintenanceScheduleForm';
import { useHandleChange } from '../common/hooks';
import { Spinner } from '$app/components/Spinner';
import { ValidationBag } from '$app/common/interfaces/validation-bag';
import { MaintenanceSchedule } from '$app/common/interfaces/maintenance-schedule';
import { useTitle } from '$app/common/hooks/useTitle';
import { useColorScheme } from '$app/common/colors';

interface Context {
  errors: ValidationBag | undefined;
  setErrors: Dispatch<SetStateAction<ValidationBag | undefined>>;
  maintenanceSchedule: MaintenanceSchedule;
  setMaintenanceSchedule: Dispatch<SetStateAction<MaintenanceSchedule | undefined>>;
}

export default function Edit() {
  const { documentTitle } = useTitle('edit_maintenance_schedule');

  const { id } = useParams();

  const colors = useColorScheme();

  const { data: maintenanceScheduleResponse } = useMaintenanceScheduleQuery({ id });

  const context: Context = useOutletContext();

  const { setErrors, setMaintenanceSchedule, maintenanceSchedule, errors } = context;

  const handleChange = useHandleChange({ setErrors, setMaintenanceSchedule });

  useEffect(() => {
    if (maintenanceScheduleResponse) {
      setMaintenanceSchedule(maintenanceScheduleResponse.data.data);
    }
  }, [maintenanceScheduleResponse]);

  return (
    <>
      {maintenanceScheduleResponse && maintenanceSchedule ? (
        <Card
          title={maintenanceScheduleResponse.data.data.name || documentTitle}
          className="shadow-sm"
          style={{ borderColor: colors.$24 }}
          headerStyle={{ borderColor: colors.$20 }}
        >
          <MaintenanceScheduleForm
            maintenanceSchedule={maintenanceSchedule}
            errors={errors}
            handleChange={handleChange}
            type="edit"
          />
        </Card>
      ) : (
        <Spinner />
      )}
    </>
  );
}

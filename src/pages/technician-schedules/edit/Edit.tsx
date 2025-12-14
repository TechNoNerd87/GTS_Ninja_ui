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
import { useTechnicianScheduleQuery } from '$app/common/queries/technician-schedules';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import { TechnicianScheduleForm } from '../common/components/TechnicianScheduleForm';
import { useHandleChange } from '../common/hooks';
import { Spinner } from '$app/components/Spinner';
import { ValidationBag } from '$app/common/interfaces/validation-bag';
import { TechnicianSchedule } from '$app/common/interfaces/technician-schedule';
import { useTitle } from '$app/common/hooks/useTitle';
import { useColorScheme } from '$app/common/colors';

interface Context {
  errors: ValidationBag | undefined;
  setErrors: Dispatch<SetStateAction<ValidationBag | undefined>>;
  technicianSchedule: TechnicianSchedule;
  setTechnicianSchedule: Dispatch<SetStateAction<TechnicianSchedule | undefined>>;
}

export default function Edit() {
  const { documentTitle } = useTitle('edit_technician_schedule');

  const { id } = useParams();

  const colors = useColorScheme();

  const { data: technicianScheduleResponse } = useTechnicianScheduleQuery({ id });

  const context: Context = useOutletContext();

  const { setErrors, setTechnicianSchedule, technicianSchedule, errors } = context;

  const handleChange = useHandleChange({ setErrors, setTechnicianSchedule });

  useEffect(() => {
    if (technicianScheduleResponse) {
      setTechnicianSchedule(technicianScheduleResponse.data.data);
    }
  }, [technicianScheduleResponse]);

  return (
    <>
      {technicianScheduleResponse && technicianSchedule ? (
        <Card
          title={technicianScheduleResponse.data.data.title || documentTitle}
          className="shadow-sm"
          style={{ borderColor: colors.$24 }}
          headerStyle={{ borderColor: colors.$20 }}
        >
          <TechnicianScheduleForm
            technicianSchedule={technicianSchedule}
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

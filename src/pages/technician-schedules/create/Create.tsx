/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { AxiosError } from 'axios';
import { endpoint } from '$app/common/helpers';
import { request } from '$app/common/helpers/request';
import { route } from '$app/common/helpers/route';
import { toast } from '$app/common/helpers/toast/toast';
import { GenericSingleResourceResponse } from '$app/common/interfaces/generic-api-response';
import { TechnicianSchedule } from '$app/common/interfaces/technician-schedule';
import { ValidationBag } from '$app/common/interfaces/validation-bag';
import { useBlankTechnicianScheduleQuery } from '$app/common/queries/technician-schedules';
import { Container } from '$app/components/Container';
import { Default } from '$app/components/layouts/Default';
import { Spinner } from '$app/components/Spinner';
import { useAtom } from 'jotai';
import { cloneDeep } from 'lodash';
import { FormEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { technicianScheduleAtom } from '../common/atoms';
import { CreateTechnicianSchedule } from '../common/components/CreateTechnicianSchedule';
import { useTitle } from '$app/common/hooks/useTitle';
import { $refetch } from '$app/common/hooks/useRefetch';

export default function Create() {
  const { documentTitle } = useTitle('new_technician_schedule');

  const [t] = useTranslation();

  const [technicianSchedule, setTechnicianSchedule] = useAtom(technicianScheduleAtom);
  const navigate = useNavigate();

  const { data } = useBlankTechnicianScheduleQuery({
    enabled: typeof technicianSchedule === 'undefined',
  });

  const pages = [
    { name: t('technician_schedules'), href: '/technician_schedules' },
    { name: t('new_technician_schedule'), href: '/technician_schedules/create' },
  ];

  const [isFormBusy, setIsFormBusy] = useState<boolean>(false);
  const [errors, setErrors] = useState<ValidationBag>();
  const [searchParams] = useSearchParams();

  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isFormBusy) {
      setIsFormBusy(true);

      request('POST', endpoint('/api/v1/technician_schedules'), technicianSchedule)
        .then((response: GenericSingleResourceResponse<TechnicianSchedule>) => {
          $refetch(['technician_schedules']);

          toast.success('created_technician_schedule');

          navigate(
            route('/technician_schedules/:id/edit', {
              id: response.data.data.id,
            })
          );
        })
        .catch((error: AxiosError<ValidationBag>) => {
          if (error.response?.status === 422) {
            setErrors(error.response.data);
            toast.dismiss();
          }
        })
        .finally(() => setIsFormBusy(false));
    }
  };

  useEffect(() => {
    setTechnicianSchedule((current) => {
      let value = current;

      if (searchParams.get('action') !== 'clone') {
        value = undefined;
      }

      if (
        typeof data !== 'undefined' &&
        typeof value === 'undefined' &&
        searchParams.get('action') !== 'clone'
      ) {
        value = cloneDeep(data);
      }

      return value;
    });
  }, [data]);

  return (
    <Default
      title={documentTitle}
      breadcrumbs={pages}
      disableSaveButton={!technicianSchedule || isFormBusy}
      onSaveClick={handleSave}
    >
      <Container breadcrumbs={[]}>
        {technicianSchedule ? (
          <CreateTechnicianSchedule errors={errors} setErrors={setErrors} />
        ) : (
          <Spinner />
        )}
      </Container>
    </Default>
  );
}

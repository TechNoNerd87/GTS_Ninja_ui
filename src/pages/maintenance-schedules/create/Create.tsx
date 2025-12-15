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
import { MaintenanceSchedule } from '$app/common/interfaces/maintenance-schedule';
import { ValidationBag } from '$app/common/interfaces/validation-bag';
import { useBlankMaintenanceScheduleQuery } from '$app/common/queries/maintenance-schedules';
import { Container } from '$app/components/Container';
import { Default } from '$app/components/layouts/Default';
import { Spinner } from '$app/components/Spinner';
import { useAtom } from 'jotai';
import { cloneDeep } from 'lodash';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { maintenanceScheduleAtom } from '../common/atoms';
import { CreateMaintenanceSchedule } from '../common/components/CreateMaintenanceSchedule';
import { useTitle } from '$app/common/hooks/useTitle';
import { $refetch } from '$app/common/hooks/useRefetch';

export default function Create() {
  const { documentTitle } = useTitle('new_maintenance_schedule');

  const [t] = useTranslation();

  const [maintenanceSchedule, setMaintenanceSchedule] = useAtom(maintenanceScheduleAtom);
  const navigate = useNavigate();

  const { data } = useBlankMaintenanceScheduleQuery({
    enabled: typeof maintenanceSchedule === 'undefined',
  });

  const pages = [
    { name: t('maintenance_schedules'), href: '/maintenance_schedules' },
    { name: t('new_maintenance_schedule'), href: '/maintenance_schedules/create' },
  ];

  const [isFormBusy, setIsFormBusy] = useState<boolean>(false);
  const [errors, setErrors] = useState<ValidationBag>();
  const [searchParams] = useSearchParams();

  const handleSave = () => {
    if (!isFormBusy) {
      setIsFormBusy(true);

      request('POST', endpoint('/api/v1/maintenance_schedules'), maintenanceSchedule)
        .then((response: GenericSingleResourceResponse<MaintenanceSchedule>) => {
          $refetch(['maintenance_schedules']);

          toast.success('created_maintenance_schedule');

          navigate(
            route('/maintenance_schedules/:id/edit', {
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
    setMaintenanceSchedule((current) => {
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
      disableSaveButton={!maintenanceSchedule || isFormBusy}
      onSaveClick={handleSave}
    >
      <Container breadcrumbs={[]}>
        {maintenanceSchedule ? (
          <CreateMaintenanceSchedule errors={errors} setErrors={setErrors} />
        ) : (
          <Spinner />
        )}
      </Container>
    </Default>
  );
}

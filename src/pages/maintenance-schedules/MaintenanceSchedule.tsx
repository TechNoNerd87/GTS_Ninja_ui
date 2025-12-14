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
import { MaintenanceSchedule as MaintenanceScheduleInterface } from '$app/common/interfaces/maintenance-schedule';
import { ValidationBag } from '$app/common/interfaces/validation-bag';
import { useMaintenanceScheduleQuery } from '$app/common/queries/maintenance-schedules';
import { Page } from '$app/components/Breadcrumbs';
import { Container } from '$app/components/Container';
import { Default } from '$app/components/layouts/Default';
import { ResourceActions } from '$app/components/ResourceActions';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useParams } from 'react-router-dom';
import { useActions } from './common/hooks';
import { $refetch } from '$app/common/hooks/useRefetch';
import { useHasPermission } from '$app/common/hooks/permissions/useHasPermission';
import { useEntityAssigned } from '$app/common/hooks/useEntityAssigned';
import { PreviousNextNavigation } from '$app/components/PreviousNextNavigation';

export default function MaintenanceSchedule() {
  const [t] = useTranslation();

  const { id } = useParams();

  const hasPermission = useHasPermission();
  const entityAssigned = useEntityAssigned();

  const { data: maintenanceScheduleData } = useMaintenanceScheduleQuery({ id });

  const actions = useActions();

  const [maintenanceScheduleValue, setMaintenanceScheduleValue] = useState<MaintenanceScheduleInterface>();

  const [errors, setErrors] = useState<ValidationBag>();

  const [isFormBusy, setIsFormBusy] = useState<boolean>(false);

  const pages: Page[] = [
    { name: t('maintenance_schedules'), href: '/maintenance_schedules' },
    {
      name: t('edit_maintenance_schedule'),
      href: route('/maintenance_schedules/:id', { id }),
    },
  ];

  const handleSave = async () => {
    if (!isFormBusy) {
      setErrors(undefined);
      setIsFormBusy(true);

      toast.processing();

      request('PUT', endpoint('/api/v1/maintenance_schedules/:id', { id }), maintenanceScheduleValue)
        .then(() => {
          toast.success('updated_maintenance_schedule');

          $refetch(['maintenance_schedules']);
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
    if (maintenanceScheduleData) {
      setMaintenanceScheduleValue(maintenanceScheduleData.data.data);
    }
  }, [maintenanceScheduleData]);

  return (
    <Default
      title={t('edit_maintenance_schedule')}
      breadcrumbs={pages}
      {...(maintenanceScheduleData &&
        (hasPermission('edit_maintenance_schedule') ||
          entityAssigned(maintenanceScheduleData.data.data)) && {
          navigationTopRight: (
            <ResourceActions
              onSaveClick={handleSave}
              resource={maintenanceScheduleData.data.data}
              actions={actions}
              cypressRef="maintenanceScheduleActionDropdown"
              disableSaveButton={!maintenanceScheduleData || isFormBusy}
            />
          ),
        })}
      afterBreadcrumbs={<PreviousNextNavigation entity="maintenance_schedule" />}
    >
      <Container breadcrumbs={[]}>
        <Outlet
          context={{
            errors,
            setErrors,
            maintenanceSchedule: maintenanceScheduleValue,
            setMaintenanceSchedule: setMaintenanceScheduleValue,
          }}
        />
      </Container>
    </Default>
  );
}

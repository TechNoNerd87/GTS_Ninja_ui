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
import { TechnicianSchedule as TechnicianScheduleInterface } from '$app/common/interfaces/technician-schedule';
import { ValidationBag } from '$app/common/interfaces/validation-bag';
import { useTechnicianScheduleQuery } from '$app/common/queries/technician-schedules';
import { Page } from '$app/components/Breadcrumbs';
import { Container } from '$app/components/Container';
import { Default } from '$app/components/layouts/Default';
import { ResourceActions } from '$app/components/ResourceActions';
import { Tabs } from '$app/components/Tabs';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useParams } from 'react-router-dom';
import { useActions } from './common/hooks';
import { $refetch } from '$app/common/hooks/useRefetch';
import { useTabs } from './common/hooks/useTabs';
import { useHasPermission } from '$app/common/hooks/permissions/useHasPermission';
import { useEntityAssigned } from '$app/common/hooks/useEntityAssigned';
import { PreviousNextNavigation } from '$app/components/PreviousNextNavigation';

export default function TechnicianSchedule() {
  const [t] = useTranslation();

  const { id } = useParams();

  const hasPermission = useHasPermission();
  const entityAssigned = useEntityAssigned();

  const { data: technicianScheduleData } = useTechnicianScheduleQuery({ id });

  const actions = useActions();

  const [technicianScheduleValue, setTechnicianScheduleValue] = useState<TechnicianScheduleInterface>();

  const [errors, setErrors] = useState<ValidationBag>();

  const [isFormBusy, setIsFormBusy] = useState<boolean>(false);

  const pages: Page[] = [
    { name: t('technician_schedules'), href: '/technician_schedules' },
    {
      name: t('edit_technician_schedule'),
      href: route('/technician_schedules/:id', { id }),
    },
  ];

  const tabs = useTabs({ technicianSchedule: technicianScheduleData?.data.data });

  const handleSave = async () => {
    if (!isFormBusy) {
      setErrors(undefined);
      setIsFormBusy(true);

      toast.processing();

      request('PUT', endpoint('/api/v1/technician_schedules/:id', { id }), technicianScheduleValue)
        .then(() => {
          toast.success('updated_technician_schedule');

          $refetch(['technician_schedules']);
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
    if (technicianScheduleData) {
      setTechnicianScheduleValue(technicianScheduleData.data.data);
    }
  }, [technicianScheduleData]);

  return (
    <Default
      title={t('edit_technician_schedule')}
      breadcrumbs={pages}
      {...(technicianScheduleData &&
        (hasPermission('edit_technician_schedule') ||
          entityAssigned(technicianScheduleData.data.data)) && {
          navigationTopRight: (
            <ResourceActions
              onSaveClick={handleSave}
              resource={technicianScheduleData.data.data}
              actions={actions}
              cypressRef="technicianScheduleActionDropdown"
              disableSaveButton={!technicianScheduleData || isFormBusy}
            />
          ),
        })}
      afterBreadcrumbs={<PreviousNextNavigation entity="technician_schedule" />}
    >
      <Container breadcrumbs={[]}>
        <Tabs tabs={tabs} />

        <Outlet
          context={{
            errors,
            setErrors,
            technicianSchedule: technicianScheduleValue,
            setTechnicianSchedule: setTechnicianScheduleValue,
          }}
        />
      </Container>
    </Default>
  );
}

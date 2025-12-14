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
import { Equipment as EquipmentInterface } from '$app/common/interfaces/equipment';
import { ValidationBag } from '$app/common/interfaces/validation-bag';
import { useEquipmentQuery } from '$app/common/queries/equipment';
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

export default function Equipment() {
  const [t] = useTranslation();

  const { id } = useParams();

  const hasPermission = useHasPermission();
  const entityAssigned = useEntityAssigned();

  const { data: equipmentData } = useEquipmentQuery({ id });

  const actions = useActions();

  const [equipmentValue, setEquipmentValue] = useState<EquipmentInterface>();

  const [errors, setErrors] = useState<ValidationBag>();

  const [isFormBusy, setIsFormBusy] = useState<boolean>(false);

  const pages: Page[] = [
    { name: t('equipment'), href: '/equipment' },
    {
      name: t('edit_equipment'),
      href: route('/equipment/:id', { id }),
    },
  ];

  const tabs = useTabs({ equipment: equipmentData?.data.data });

  const handleSave = async () => {
    if (!isFormBusy) {
      setErrors(undefined);
      setIsFormBusy(true);

      toast.processing();

      request('PUT', endpoint('/api/v1/equipment/:id', { id }), equipmentValue)
        .then(() => {
          toast.success('updated_equipment');

          $refetch(['equipment']);
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
    if (equipmentData) {
      setEquipmentValue(equipmentData.data.data);
    }
  }, [equipmentData]);

  return (
    <Default
      title={t('edit_equipment')}
      breadcrumbs={pages}
      {...(equipmentData &&
        (hasPermission('edit_equipment') ||
          entityAssigned(equipmentData.data.data)) && {
          navigationTopRight: (
            <ResourceActions
              onSaveClick={handleSave}
              resource={equipmentData.data.data}
              actions={actions}
              cypressRef="equipmentActionDropdown"
              disableSaveButton={!equipmentData || isFormBusy}
            />
          ),
        })}
      afterBreadcrumbs={<PreviousNextNavigation entity="equipment" />}
    >
      <Container breadcrumbs={[]}>
        <Tabs tabs={tabs} />

        <Outlet
          context={{
            errors,
            setErrors,
            equipment: equipmentValue,
            setEquipment: setEquipmentValue,
          }}
        />
      </Container>
    </Default>
  );
}

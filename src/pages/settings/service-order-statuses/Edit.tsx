/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Card, CardContainer } from '$app/components/cards';
import { InputField, InputLabel } from '$app/components/forms';
import { AxiosError } from 'axios';
import { endpoint } from '$app/common/helpers';
import { request } from '$app/common/helpers/request';
import { route } from '$app/common/helpers/route';
import { toast } from '$app/common/helpers/toast/toast';
import { useAccentColor } from '$app/common/hooks/useAccentColor';
import { useTitle } from '$app/common/hooks/useTitle';
import { ServiceOrderStatus } from '$app/common/interfaces/service-order-status';
import { ValidationBag } from '$app/common/interfaces/validation-bag';
import { useServiceOrderStatusQuery } from '$app/common/queries/service-order-statuses';
import { ColorPicker } from '$app/components/forms/ColorPicker';
import { Settings } from '$app/components/layouts/Settings';
import { FormEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useHandleChange } from './common/hooks';
import { $refetch } from '$app/common/hooks/useRefetch';
import { useColorScheme } from '$app/common/colors';
import Toggle from '$app/components/forms/Toggle';
import { NumberInputField } from '$app/components/forms/NumberInputField';
import { ResourceActions } from '$app/components/ResourceActions';
import { useBulkAction } from '$app/common/queries/service-order-statuses';
import { DropdownElement } from '$app/components/dropdown/DropdownElement';
import { Icon } from '$app/components/icons/Icon';
import { MdArchive, MdDelete, MdRestore } from 'react-icons/md';
import { EntityState } from '$app/common/enums/entity-state';
import { getEntityState } from '$app/common/helpers';

export function Edit() {
  const { documentTitle } = useTitle('edit_service_order_status');

  const [t] = useTranslation();

  const { id } = useParams();

  const colors = useColorScheme();
  const accentColor = useAccentColor();
  const bulkAction = useBulkAction();

  const pages = [
    { name: t('settings'), href: '/settings' },
    { name: t('service_order_settings'), href: '/settings/service_order_settings' },
    {
      name: t('edit_service_order_status'),
      href: route('/settings/service_order_statuses/:id/edit', { id }),
    },
  ];

  const { data: statusResponse } = useServiceOrderStatusQuery({ id });

  const [errors, setErrors] = useState<ValidationBag>();

  const [isFormBusy, setIsFormBusy] = useState<boolean>(false);

  const [serviceOrderStatus, setServiceOrderStatus] =
    useState<ServiceOrderStatus>();

  const handleChange = useHandleChange({
    setErrors,
    setServiceOrderStatus,
  });

  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isFormBusy) {
      toast.processing();

      setErrors(undefined);

      setIsFormBusy(true);

      request(
        'PUT',
        endpoint('/api/v1/service_order_statuses/:id', { id }),
        serviceOrderStatus
      )
        .then(() => {
          toast.success('updated_service_order_status');

          $refetch(['service_order_statuses']);
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
    if (statusResponse) {
      setServiceOrderStatus(statusResponse.data.data);
    }
  }, [statusResponse]);

  const actions = [
    (status: ServiceOrderStatus) =>
      getEntityState(status) === EntityState.Active && (
        <DropdownElement
          onClick={() => bulkAction(status.id, 'archive')}
          icon={<Icon element={MdArchive} />}
        >
          {t('archive')}
        </DropdownElement>
      ),
    (status: ServiceOrderStatus) =>
      (getEntityState(status) === EntityState.Archived ||
        getEntityState(status) === EntityState.Deleted) && (
        <DropdownElement
          onClick={() => bulkAction(status.id, 'restore')}
          icon={<Icon element={MdRestore} />}
        >
          {t('restore')}
        </DropdownElement>
      ),
    (status: ServiceOrderStatus) =>
      (getEntityState(status) === EntityState.Active ||
        getEntityState(status) === EntityState.Archived) && (
        <DropdownElement
          onClick={() => bulkAction(status.id, 'delete')}
          icon={<Icon element={MdDelete} />}
        >
          {t('delete')}
        </DropdownElement>
      ),
  ];

  return (
    <Settings
      title={t('service_order_statuses')}
      breadcrumbs={pages}
      navigationTopRight={
        serviceOrderStatus && (
          <ResourceActions
            resource={serviceOrderStatus}
            onSaveClick={handleSave}
            actions={actions}
            disableSaveButton={isFormBusy}
          />
        )
      }
    >
      <Card
        title={documentTitle}
        className="shadow-sm"
        childrenClassName="pt-4"
        style={{ borderColor: colors.$24 }}
        headerStyle={{ borderColor: colors.$20 }}
        withoutBodyPadding
      >
        <CardContainer>
          <InputField
            required
            label={t('name')}
            value={serviceOrderStatus?.name}
            onValueChange={(value) => handleChange('name', value)}
            errorMessage={errors?.errors.name}
          />

          <div>
            <InputLabel className="mb-1">{t('color')}</InputLabel>

            <ColorPicker
              value={serviceOrderStatus?.color || accentColor}
              onValueChange={(color) => handleChange('color', color)}
            />
          </div>

          <NumberInputField
            label={t('sort_order')}
            value={serviceOrderStatus?.sort_order || 0}
            onValueChange={(value) =>
              handleChange('sort_order', parseInt(value) || 0)
            }
            errorMessage={errors?.errors.sort_order}
          />

          <Toggle
            label={t('is_default')}
            checked={serviceOrderStatus?.is_default || false}
            onValueChange={(value) => handleChange('is_default', value)}
          />

          <Toggle
            label={t('is_completed')}
            checked={serviceOrderStatus?.is_completed || false}
            onValueChange={(value) => handleChange('is_completed', value)}
          />
        </CardContainer>
      </Card>
    </Settings>
  );
}

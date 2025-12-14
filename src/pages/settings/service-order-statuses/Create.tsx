/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { ButtonOption, Card, CardContainer } from '$app/components/cards';
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
import { useBlankServiceOrderStatusQuery } from '$app/common/queries/service-order-statuses';
import { ColorPicker } from '$app/components/forms/ColorPicker';
import { Icon } from '$app/components/icons/Icon';
import { Settings } from '$app/components/layouts/Settings';
import { FormEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BiPlusCircle } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import { useHandleChange } from './common/hooks';
import { $refetch } from '$app/common/hooks/useRefetch';
import { useColorScheme } from '$app/common/colors';
import Toggle from '$app/components/forms/Toggle';
import { NumberInputField } from '$app/components/forms/NumberInputField';

export function Create() {
  const { documentTitle } = useTitle('new_service_order_status');

  const [t] = useTranslation();

  const navigate = useNavigate();

  const colors = useColorScheme();
  const accentColor = useAccentColor();

  const pages = [
    { name: t('settings'), href: '/settings' },
    { name: t('service_order_settings'), href: '/settings/service_order_settings' },
    {
      name: t('new_service_order_status'),
      href: '/settings/service_order_statuses/create',
    },
  ];

  const { data: blankStatus } = useBlankServiceOrderStatusQuery();

  const [errors, setErrors] = useState<ValidationBag>();

  const [isFormBusy, setIsFormBusy] = useState<boolean>(false);

  const [serviceOrderStatus, setServiceOrderStatus] =
    useState<ServiceOrderStatus>();

  const handleChange = useHandleChange({
    setErrors,
    setServiceOrderStatus,
  });

  const handleSave = (
    event: FormEvent<HTMLFormElement>,
    actionType: string
  ) => {
    event.preventDefault();

    if (!isFormBusy) {
      toast.processing();

      setErrors(undefined);

      setIsFormBusy(true);

      request(
        'POST',
        endpoint('/api/v1/service_order_statuses'),
        serviceOrderStatus
      )
        .then((response) => {
          toast.success('created_service_order_status');

          $refetch(['service_order_statuses']);

          if (actionType === 'save') {
            navigate(
              route('/settings/service_order_statuses/:id/edit', {
                id: response.data.data.id,
              })
            );
          } else {
            setServiceOrderStatus(blankStatus);
          }
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
    if (blankStatus) {
      setServiceOrderStatus(blankStatus);
    }
  }, [blankStatus]);

  const saveOptions: ButtonOption[] = [
    {
      onClick: (event: FormEvent<HTMLFormElement>) =>
        handleSave(event, 'create'),
      text: `${t('save')} / ${t('create')}`,
      icon: <Icon element={BiPlusCircle} />,
    },
  ];

  return (
    <Settings title={t('service_order_statuses')} breadcrumbs={pages}>
      <Card
        title={documentTitle}
        className="shadow-sm"
        childrenClassName="pt-4"
        style={{ borderColor: colors.$24 }}
        headerStyle={{ borderColor: colors.$20 }}
        withoutBodyPadding
        withSaveButton
        disableSubmitButton={isFormBusy}
        onSaveClick={(event) => handleSave(event, 'save')}
        additionalSaveOptions={saveOptions}
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

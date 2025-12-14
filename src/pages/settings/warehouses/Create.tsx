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
import { InputField } from '$app/components/forms';
import { AxiosError } from 'axios';
import { endpoint } from '$app/common/helpers';
import { request } from '$app/common/helpers/request';
import { route } from '$app/common/helpers/route';
import { toast } from '$app/common/helpers/toast/toast';
import { useTitle } from '$app/common/hooks/useTitle';
import { Warehouse } from '$app/common/interfaces/warehouse';
import { ValidationBag } from '$app/common/interfaces/validation-bag';
import { useBlankWarehouseQuery } from '$app/common/queries/warehouses';
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
import { CountrySelector } from '$app/components/CountrySelector';

export function Create() {
  const { documentTitle } = useTitle('new_warehouse');

  const [t] = useTranslation();

  const navigate = useNavigate();

  const colors = useColorScheme();

  const pages = [
    { name: t('settings'), href: '/settings' },
    { name: t('warehouses'), href: '/settings/warehouses' },
    { name: t('new_warehouse'), href: '/settings/warehouses/create' },
  ];

  const { data: blankWarehouse } = useBlankWarehouseQuery();

  const [errors, setErrors] = useState<ValidationBag>();

  const [isFormBusy, setIsFormBusy] = useState<boolean>(false);

  const [warehouse, setWarehouse] = useState<Warehouse>();

  const handleChange = useHandleChange({
    setErrors,
    setWarehouse,
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

      request('POST', endpoint('/api/v1/warehouses'), warehouse)
        .then((response) => {
          toast.success('created_warehouse');

          $refetch(['warehouses']);

          if (actionType === 'save') {
            navigate(
              route('/settings/warehouses/:id/edit', {
                id: response.data.data.id,
              })
            );
          } else {
            setWarehouse(blankWarehouse);
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
    if (blankWarehouse) {
      setWarehouse(blankWarehouse);
    }
  }, [blankWarehouse]);

  const saveOptions: ButtonOption[] = [
    {
      onClick: (event: FormEvent<HTMLFormElement>) =>
        handleSave(event, 'create'),
      text: `${t('save')} / ${t('create')}`,
      icon: <Icon element={BiPlusCircle} />,
    },
  ];

  return (
    <Settings title={t('warehouses')} breadcrumbs={pages}>
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
            value={warehouse?.name}
            onValueChange={(value) => handleChange('name', value)}
            errorMessage={errors?.errors.name}
          />

          <InputField
            label={t('warehouse_code')}
            value={warehouse?.code}
            onValueChange={(value) => handleChange('code', value)}
            errorMessage={errors?.errors.code}
          />

          <InputField
            label={t('address1')}
            value={warehouse?.address1}
            onValueChange={(value) => handleChange('address1', value)}
            errorMessage={errors?.errors.address1}
          />

          <InputField
            label={t('address2')}
            value={warehouse?.address2}
            onValueChange={(value) => handleChange('address2', value)}
            errorMessage={errors?.errors.address2}
          />

          <InputField
            label={t('city')}
            value={warehouse?.city}
            onValueChange={(value) => handleChange('city', value)}
            errorMessage={errors?.errors.city}
          />

          <InputField
            label={t('state')}
            value={warehouse?.state}
            onValueChange={(value) => handleChange('state', value)}
            errorMessage={errors?.errors.state}
          />

          <InputField
            label={t('postal_code')}
            value={warehouse?.postal_code}
            onValueChange={(value) => handleChange('postal_code', value)}
            errorMessage={errors?.errors.postal_code}
          />

          <CountrySelector
            value={warehouse?.country_id}
            onChange={(value) => handleChange('country_id', value)}
            errorMessage={errors?.errors.country_id}
          />

          <InputField
            label={t('phone')}
            value={warehouse?.phone}
            onValueChange={(value) => handleChange('phone', value)}
            errorMessage={errors?.errors.phone}
          />

          <InputField
            label={t('email')}
            value={warehouse?.email}
            onValueChange={(value) => handleChange('email', value)}
            errorMessage={errors?.errors.email}
          />

          <InputField
            element="textarea"
            label={t('notes')}
            value={warehouse?.notes}
            onValueChange={(value) => handleChange('notes', value)}
            errorMessage={errors?.errors.notes}
          />

          <Toggle
            label={t('is_active')}
            checked={warehouse?.is_active || false}
            onValueChange={(value) => handleChange('is_active', value)}
          />

          <Toggle
            label={t('is_default')}
            checked={warehouse?.is_default || false}
            onValueChange={(value) => handleChange('is_default', value)}
          />
        </CardContainer>
      </Card>
    </Settings>
  );
}

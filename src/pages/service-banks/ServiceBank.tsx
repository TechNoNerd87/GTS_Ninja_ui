/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { route } from '$app/common/helpers/route';
import { ServiceBank as ServiceBankType } from '$app/common/interfaces/service-bank';
import { ValidationBag } from '$app/common/interfaces/validation-bag';
import { useServiceBankQuery } from '$app/common/queries/service-banks';
import { Page } from '$app/components/Breadcrumbs';
import { Container } from '$app/components/Container';
import { Default } from '$app/components/layouts/Default';
import { ResourceActions } from '$app/components/ResourceActions';
import { Spinner } from '$app/components/Spinner';
import { Tabs } from '$app/components/Tabs';
import { cloneDeep } from 'lodash';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useParams } from 'react-router-dom';
import { useActions } from './common/hooks';
import { useTabs } from './common/hooks/useTabs';
import { request } from '$app/common/helpers/request';
import { endpoint } from '$app/common/helpers';
import { toast } from '$app/common/helpers/toast/toast';
import { AxiosError } from 'axios';
import { $refetch } from '$app/common/hooks/useRefetch';
import { useHasPermission } from '$app/common/hooks/permissions/useHasPermission';

export default function ServiceBank() {
  const { id } = useParams();

  const [t] = useTranslation();

  const hasPermission = useHasPermission();

  const { data, isLoading } = useServiceBankQuery({ id });

  const [serviceBank, setServiceBank] = useState<ServiceBankType>();
  const [errors, setErrors] = useState<ValidationBag>();
  const [isFormBusy, setIsFormBusy] = useState<boolean>(false);

  const tabs = useTabs();
  const actions = useActions();

  const pages: Page[] = [
    { name: t('service_banks'), href: '/service_banks' },
    {
      name: serviceBank?.name || t('service_bank'),
      href: route('/service_banks/:id', { id }),
    },
  ];

  useEffect(() => {
    if (data) {
      setServiceBank(cloneDeep(data.data.data));
    }
  }, [data]);

  const handleSave = () => {
    if (!isFormBusy && serviceBank) {
      setIsFormBusy(true);

      request(
        'PUT',
        endpoint('/api/v1/service_banks/:id', { id }),
        serviceBank
      )
        .then(() => {
          $refetch(['service_banks']);

          toast.success('updated_service_bank');
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

  return (
    <Default
      title={serviceBank?.name || t('service_bank')}
      breadcrumbs={pages}
      navigationTopRight={
        serviceBank && (
          <ResourceActions
            resource={serviceBank}
            actions={actions}
            onSaveClick={handleSave}
            disableSaveButton={!hasPermission('edit_service_bank') || isFormBusy}
          />
        )
      }
    >
      <Container breadcrumbs={[]}>
        {isLoading && <Spinner />}

        {serviceBank && (
          <>
            <Tabs tabs={tabs} />

            <Outlet
              context={{
                serviceBank,
                setServiceBank,
                errors,
                setErrors,
              }}
            />
          </>
        )}
      </Container>
    </Default>
  );
}

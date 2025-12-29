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
import { ServiceOrder as ServiceOrderInterface } from '$app/common/interfaces/service-order';
import { ValidationBag } from '$app/common/interfaces/validation-bag';
import { useServiceOrderQuery } from '$app/common/queries/service-orders';
import { Page } from '$app/components/Breadcrumbs';
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

export default function ServiceOrder() {
  const [t] = useTranslation();

  const { id } = useParams();

  const hasPermission = useHasPermission();
  const entityAssigned = useEntityAssigned();

  const { data: serviceOrderData } = useServiceOrderQuery({ id });

  const actions = useActions();

  const [serviceOrderValue, setServiceOrderValue] = useState<ServiceOrderInterface>();

  const [errors, setErrors] = useState<ValidationBag>();

  const [isFormBusy, setIsFormBusy] = useState<boolean>(false);

  const pages: Page[] = [
    { name: t('service_orders'), href: '/service_orders' },
    {
      name: t('edit_service_order'),
      href: route('/service_orders/:id', { id }),
    },
  ];

  const tabs = useTabs({ serviceOrder: serviceOrderData?.data.data });

  const handleSave = async () => {
    if (!isFormBusy) {
      setErrors(undefined);
      setIsFormBusy(true);

      toast.processing();

      request('PUT', endpoint('/api/v1/service_orders/:id', { id }), serviceOrderValue)
        .then(() => {
          toast.success('updated_service_order');

          $refetch(['service_orders']);
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
    if (serviceOrderData) {
      setServiceOrderValue(serviceOrderData.data.data);
    }
  }, [serviceOrderData]);

  return (
    <Default
      title={t('edit_service_order')}
      breadcrumbs={pages}
      {...(serviceOrderData &&
        (hasPermission('edit_service_order') ||
          entityAssigned(serviceOrderData.data.data)) && {
          navigationTopRight: (
            <ResourceActions
              onSaveClick={handleSave}
              resource={serviceOrderData.data.data}
              actions={actions}
              cypressRef="serviceOrderActionDropdown"
              disableSaveButton={!serviceOrderData || isFormBusy}
            />
          ),
        })}
      afterBreadcrumbs={<PreviousNextNavigation entity="service_order" />}
    >
      <div className="space-y-4">
        <Tabs tabs={tabs} />

        <Outlet
          context={{
            errors,
            setErrors,
            serviceOrder: serviceOrderValue,
            setServiceOrder: setServiceOrderValue,
          }}
        />
      </div>
    </Default>
  );
}

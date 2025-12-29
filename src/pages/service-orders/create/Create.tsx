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
import { ServiceOrder } from '$app/common/interfaces/service-order';
import { ValidationBag } from '$app/common/interfaces/validation-bag';
import { useBlankServiceOrderQuery } from '$app/common/queries/service-orders';
import { Default } from '$app/components/layouts/Default';
import { Spinner } from '$app/components/Spinner';
import { useAtom } from 'jotai';
import { cloneDeep } from 'lodash';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { serviceOrderAtom } from '../common/atoms';
import { CreateServiceOrder } from '../common/components/CreateServiceOrder';
import { useTitle } from '$app/common/hooks/useTitle';
import { $refetch } from '$app/common/hooks/useRefetch';

export default function Create() {
  const { documentTitle } = useTitle('new_service_order');

  const [t] = useTranslation();

  const [serviceOrder, setServiceOrder] = useAtom(serviceOrderAtom);
  const navigate = useNavigate();

  const { data } = useBlankServiceOrderQuery({
    enabled: typeof serviceOrder === 'undefined',
  });

  const pages = [
    { name: t('service_orders'), href: '/service_orders' },
    { name: t('new_service_order'), href: '/service_orders/create' },
  ];

  const [isFormBusy, setIsFormBusy] = useState<boolean>(false);
  const [errors, setErrors] = useState<ValidationBag>();
  const [searchParams] = useSearchParams();

  const handleSave = () => {
    if (!isFormBusy) {
      setIsFormBusy(true);

      request('POST', endpoint('/api/v1/service_orders'), serviceOrder)
        .then((response: GenericSingleResourceResponse<ServiceOrder>) => {
          $refetch(['service_orders']);

          toast.success('created_service_order');

          navigate(
            route('/service_orders/:id/edit', {
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
    setServiceOrder((current) => {
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
      disableSaveButton={!serviceOrder || isFormBusy}
      onSaveClick={handleSave}
    >
      <div className="space-y-4">
        {serviceOrder ? (
          <CreateServiceOrder errors={errors} setErrors={setErrors} />
        ) : (
          <Spinner />
        )}
      </div>
    </Default>
  );
}

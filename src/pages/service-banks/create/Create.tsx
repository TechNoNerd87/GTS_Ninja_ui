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
import { ServiceBank } from '$app/common/interfaces/service-bank';
import { ValidationBag } from '$app/common/interfaces/validation-bag';
import { useBlankServiceBankQuery } from '$app/common/queries/service-banks';
import { Container } from '$app/components/Container';
import { Default } from '$app/components/layouts/Default';
import { Spinner } from '$app/components/Spinner';
import { useAtom } from 'jotai';
import { cloneDeep } from 'lodash';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { serviceBankAtom } from '../common/atoms';
import { CreateServiceBank } from '../common/components/CreateServiceBank';
import { useTitle } from '$app/common/hooks/useTitle';
import { $refetch } from '$app/common/hooks/useRefetch';

export default function Create() {
  const { documentTitle } = useTitle('new_service_bank');

  const [t] = useTranslation();

  const [serviceBank, setServiceBank] = useAtom(serviceBankAtom);
  const navigate = useNavigate();

  const { data } = useBlankServiceBankQuery({
    enabled: typeof serviceBank === 'undefined',
  });

  const pages = [
    { name: t('service_banks'), href: '/service_banks' },
    { name: t('new_service_bank'), href: '/service_banks/create' },
  ];

  const [isFormBusy, setIsFormBusy] = useState<boolean>(false);
  const [errors, setErrors] = useState<ValidationBag>();
  const [searchParams] = useSearchParams();

  const handleSave = () => {
    if (!isFormBusy) {
      setIsFormBusy(true);

      request('POST', endpoint('/api/v1/service_banks'), serviceBank)
        .then((response: GenericSingleResourceResponse<ServiceBank>) => {
          $refetch(['service_banks']);

          toast.success('created_service_bank');

          navigate(
            route('/service_banks/:id/edit', {
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
    setServiceBank((current) => {
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
      disableSaveButton={!serviceBank || isFormBusy}
      onSaveClick={handleSave}
    >
      <Container breadcrumbs={[]}>
        {serviceBank ? (
          <CreateServiceBank errors={errors} setErrors={setErrors} />
        ) : (
          <Spinner />
        )}
      </Container>
    </Default>
  );
}

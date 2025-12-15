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
import { Contract } from '$app/common/interfaces/contract';
import { ValidationBag } from '$app/common/interfaces/validation-bag';
import { useBlankContractQuery } from '$app/common/queries/contracts';
import { Container } from '$app/components/Container';
import { Default } from '$app/components/layouts/Default';
import { Spinner } from '$app/components/Spinner';
import { useAtom } from 'jotai';
import { cloneDeep } from 'lodash';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { contractAtom } from '../common/atoms';
import { CreateContract } from '../common/components/CreateContract';
import { useTitle } from '$app/common/hooks/useTitle';
import { $refetch } from '$app/common/hooks/useRefetch';

export default function Create() {
  const { documentTitle } = useTitle('new_contract');

  const [t] = useTranslation();

  const [contract, setContract] = useAtom(contractAtom);
  const navigate = useNavigate();

  const { data } = useBlankContractQuery({
    enabled: typeof contract === 'undefined',
  });

  const pages = [
    { name: t('contracts'), href: '/contracts' },
    { name: t('new_contract'), href: '/contracts/create' },
  ];

  const [isFormBusy, setIsFormBusy] = useState<boolean>(false);
  const [errors, setErrors] = useState<ValidationBag>();
  const [searchParams] = useSearchParams();

  const handleSave = () => {
    if (!isFormBusy) {
      setIsFormBusy(true);

      request('POST', endpoint('/api/v1/contracts'), contract)
        .then((response: GenericSingleResourceResponse<Contract>) => {
          $refetch(['contracts']);

          toast.success('created_contract');

          navigate(
            route('/contracts/:id/edit', {
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
    setContract((current) => {
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
      disableSaveButton={!contract || isFormBusy}
      onSaveClick={handleSave}
    >
      <Container breadcrumbs={[]}>
        {contract ? (
          <CreateContract errors={errors} setErrors={setErrors} />
        ) : (
          <Spinner />
        )}
      </Container>
    </Default>
  );
}

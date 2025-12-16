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
import { ServiceBank } from '$app/common/interfaces/service-bank';
import { ValidationBag } from '$app/common/interfaces/validation-bag';
import { useOutletContext, useParams } from 'react-router-dom';
import { ServiceBankForm } from '../common/components/ServiceBankForm';
import { useHandleChange } from '../common/hooks';
import { Dispatch, SetStateAction, useState } from 'react';
import { $refetch } from '$app/common/hooks/useRefetch';

interface Context {
  serviceBank: ServiceBank | undefined;
  setServiceBank: Dispatch<SetStateAction<ServiceBank | undefined>>;
  errors: ValidationBag | undefined;
  setErrors: Dispatch<SetStateAction<ValidationBag | undefined>>;
}

export default function Edit() {
  const { id } = useParams();

  const context: Context = useOutletContext();
  const { serviceBank, setServiceBank, errors, setErrors } = context;

  const [isFormBusy, setIsFormBusy] = useState<boolean>(false);

  const handleChange = useHandleChange({
    setErrors,
    setServiceBank,
  });

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

  return serviceBank ? (
    <ServiceBankForm
      type="edit"
      serviceBank={serviceBank}
      errors={errors}
      handleChange={handleChange}
    />
  ) : null;
}

/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { ServiceBank } from '$app/common/interfaces/service-bank';
import { ValidationBag } from '$app/common/interfaces/validation-bag';
import { useSetAtom, useAtomValue } from 'jotai';
import { Dispatch, SetStateAction } from 'react';
import { serviceBankAtom } from '../atoms';
import { useHandleChange } from '../hooks';
import { ServiceBankForm } from './ServiceBankForm';

interface Props {
  errors: ValidationBag | undefined;
  setErrors: Dispatch<SetStateAction<ValidationBag | undefined>>;
}

export function CreateServiceBank(props: Props) {
  const { errors, setErrors } = props;

  const serviceBank = useAtomValue(serviceBankAtom);
  const setServiceBank = useSetAtom(serviceBankAtom);

  const handleChange = useHandleChange({
    setErrors,
    setServiceBank,
  });

  return (
    <ServiceBankForm
      type="create"
      serviceBank={serviceBank as ServiceBank}
      errors={errors}
      handleChange={handleChange}
    />
  );
}

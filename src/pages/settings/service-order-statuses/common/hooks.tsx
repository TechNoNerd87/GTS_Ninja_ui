/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { ServiceOrderStatus } from '$app/common/interfaces/service-order-status';
import { ValidationBag } from '$app/common/interfaces/validation-bag';
import { Dispatch, SetStateAction } from 'react';

interface Params {
  setErrors: Dispatch<SetStateAction<ValidationBag | undefined>>;
  setServiceOrderStatus: Dispatch<
    SetStateAction<ServiceOrderStatus | undefined>
  >;
}

export function useHandleChange(params: Params) {
  const { setErrors, setServiceOrderStatus } = params;

  return (
    property: keyof ServiceOrderStatus,
    value: ServiceOrderStatus[keyof ServiceOrderStatus]
  ) => {
    setErrors(undefined);

    setServiceOrderStatus(
      (status) => status && { ...status, [property]: value }
    );
  };
}

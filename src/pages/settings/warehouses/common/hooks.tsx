/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Warehouse } from '$app/common/interfaces/warehouse';
import { ValidationBag } from '$app/common/interfaces/validation-bag';
import { Dispatch, SetStateAction } from 'react';

interface Params {
  setErrors: Dispatch<SetStateAction<ValidationBag | undefined>>;
  setWarehouse: Dispatch<SetStateAction<Warehouse | undefined>>;
}

export function useHandleChange(params: Params) {
  const { setErrors, setWarehouse } = params;

  return (
    property: keyof Warehouse,
    value: Warehouse[keyof Warehouse]
  ) => {
    setErrors(undefined);

    setWarehouse((warehouse) => warehouse && { ...warehouse, [property]: value });
  };
}

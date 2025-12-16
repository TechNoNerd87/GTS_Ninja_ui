/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { ValidationBag } from '$app/common/interfaces/validation-bag';
import { Dispatch, SetStateAction } from 'react';
import { Rate } from '$app/common/interfaces/rate';
import { useBulkAction } from '$app/common/queries/rates';
import { DropdownElement } from '$app/components/dropdown/DropdownElement';
import { Icon } from '$app/components/icons/Icon';
import { Action } from '$app/components/ResourceActions';
import { useTranslation } from 'react-i18next';
import { MdArchive, MdDelete, MdRestore } from 'react-icons/md';

interface Params {
  setErrors: Dispatch<SetStateAction<ValidationBag | undefined>>;
  setRate: Dispatch<SetStateAction<Rate | undefined>>;
}

export function useHandleChange(params: Params) {
  return (property: keyof Rate, value: Rate[keyof Rate]) => {
    params.setErrors(undefined);

    params.setRate((rate) => rate && { ...rate, [property]: value });
  };
}

export function useActions() {
  const [t] = useTranslation();

  const bulk = useBulkAction();

  const actions: Action<Rate>[] = [
    (rate) =>
      rate.archived_at === 0 && (
        <DropdownElement
          onClick={() => bulk(rate.id, 'archive')}
          icon={<Icon element={MdArchive} />}
        >
          {t('archive')}
        </DropdownElement>
      ),
    (rate) =>
      rate.archived_at > 0 && (
        <DropdownElement
          onClick={() => bulk(rate.id, 'restore')}
          icon={<Icon element={MdRestore} />}
        >
          {t('restore')}
        </DropdownElement>
      ),
    (rate) =>
      !rate.is_deleted && (
        <DropdownElement
          onClick={() => bulk(rate.id, 'delete')}
          icon={<Icon element={MdDelete} />}
        >
          {t('delete')}
        </DropdownElement>
      ),
  ];

  return actions;
}

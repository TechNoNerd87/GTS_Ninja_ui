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
import { Equipment } from '$app/common/interfaces/equipment';
import { ValidationBag } from '$app/common/interfaces/validation-bag';
import { useBlankEquipmentQuery } from '$app/common/queries/equipment';
import { Container } from '$app/components/Container';
import { Default } from '$app/components/layouts/Default';
import { Spinner } from '$app/components/Spinner';
import { useAtom } from 'jotai';
import { cloneDeep } from 'lodash';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { equipmentAtom } from '../common/atoms';
import { CreateEquipment } from '../common/components/CreateEquipment';
import { useTitle } from '$app/common/hooks/useTitle';
import { $refetch } from '$app/common/hooks/useRefetch';

export default function Create() {
  const { documentTitle } = useTitle('new_equipment');

  const [t] = useTranslation();

  const [equipment, setEquipment] = useAtom(equipmentAtom);
  const navigate = useNavigate();

  const { data } = useBlankEquipmentQuery({
    enabled: typeof equipment === 'undefined',
  });

  const pages = [
    { name: t('equipment'), href: '/equipment' },
    { name: t('new_equipment'), href: '/equipment/create' },
  ];

  const [isFormBusy, setIsFormBusy] = useState<boolean>(false);
  const [errors, setErrors] = useState<ValidationBag>();
  const [searchParams] = useSearchParams();

  const handleSave = () => {
    if (!isFormBusy) {
      setIsFormBusy(true);

      request('POST', endpoint('/api/v1/equipment'), equipment)
        .then((response: GenericSingleResourceResponse<Equipment>) => {
          $refetch(['equipment']);

          toast.success('created_equipment');

          navigate(
            route('/equipment/:id/edit', {
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
    setEquipment((current) => {
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
      disableSaveButton={!equipment || isFormBusy}
      onSaveClick={handleSave}
    >
      <Container breadcrumbs={[]}>
        {equipment ? (
          <CreateEquipment errors={errors} setErrors={setErrors} />
        ) : (
          <Spinner />
        )}
      </Container>
    </Default>
  );
}

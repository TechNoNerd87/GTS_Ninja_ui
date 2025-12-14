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
import { Contract as ContractInterface } from '$app/common/interfaces/contract';
import { ValidationBag } from '$app/common/interfaces/validation-bag';
import { useContractQuery } from '$app/common/queries/contracts';
import { Page } from '$app/components/Breadcrumbs';
import { Container } from '$app/components/Container';
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

export default function Contract() {
  const [t] = useTranslation();

  const { id } = useParams();

  const hasPermission = useHasPermission();
  const entityAssigned = useEntityAssigned();

  const { data: contractData } = useContractQuery({ id });

  const actions = useActions();

  const [contractValue, setContractValue] = useState<ContractInterface>();

  const [errors, setErrors] = useState<ValidationBag>();

  const [isFormBusy, setIsFormBusy] = useState<boolean>(false);

  const pages: Page[] = [
    { name: t('contracts'), href: '/contracts' },
    {
      name: t('edit_contract'),
      href: route('/contracts/:id', { id }),
    },
  ];

  const tabs = useTabs({ contract: contractData?.data.data });

  const handleSave = async () => {
    if (!isFormBusy) {
      setErrors(undefined);
      setIsFormBusy(true);

      toast.processing();

      request('PUT', endpoint('/api/v1/contracts/:id', { id }), contractValue)
        .then(() => {
          toast.success('updated_contract');

          $refetch(['contracts']);
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
    if (contractData) {
      setContractValue(contractData.data.data);
    }
  }, [contractData]);

  return (
    <Default
      title={t('edit_contract')}
      breadcrumbs={pages}
      {...(contractData &&
        (hasPermission('edit_contract') ||
          entityAssigned(contractData.data.data)) && {
          navigationTopRight: (
            <ResourceActions
              onSaveClick={handleSave}
              resource={contractData.data.data}
              actions={actions}
              cypressRef="contractActionDropdown"
              disableSaveButton={!contractData || isFormBusy}
            />
          ),
        })}
      afterBreadcrumbs={<PreviousNextNavigation entity="contract" />}
    >
      <Container breadcrumbs={[]}>
        <Tabs tabs={tabs} />

        <Outlet
          context={{
            errors,
            setErrors,
            contract: contractValue,
            setContract: setContractValue,
          }}
        />
      </Container>
    </Default>
  );
}

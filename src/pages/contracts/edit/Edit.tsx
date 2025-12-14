/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Card } from '$app/components/cards';
import { useContractQuery } from '$app/common/queries/contracts';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import { ContractForm } from '../common/components/ContractForm';
import { ContractItemsTable } from '../common/components/ContractItemsTable';
import { useHandleChange } from '../common/hooks';
import { Spinner } from '$app/components/Spinner';
import { ValidationBag } from '$app/common/interfaces/validation-bag';
import { Contract } from '$app/common/interfaces/contract';
import { useTitle } from '$app/common/hooks/useTitle';
import { useColorScheme } from '$app/common/colors';
import { useTranslation } from 'react-i18next';

interface Context {
  errors: ValidationBag | undefined;
  setErrors: Dispatch<SetStateAction<ValidationBag | undefined>>;
  contract: Contract;
  setContract: Dispatch<SetStateAction<Contract | undefined>>;
}

export default function Edit() {
  const { documentTitle } = useTitle('edit_contract');
  const [t] = useTranslation();

  const { id } = useParams();

  const colors = useColorScheme();

  const { data: contractResponse } = useContractQuery({ id });

  const context: Context = useOutletContext();

  const { setErrors, setContract, contract, errors } = context;

  const handleChange = useHandleChange({ setErrors, setContract });

  useEffect(() => {
    if (contractResponse) {
      setContract(contractResponse.data.data);
    }
  }, [contractResponse]);

  return (
    <>
      {contractResponse && contract ? (
        <div className="flex flex-col space-y-4">
          <Card
            title={contractResponse.data.data.name || documentTitle}
            className="shadow-sm"
            style={{ borderColor: colors.$24 }}
            headerStyle={{ borderColor: colors.$20 }}
          >
            <ContractForm
              contract={contract}
              errors={errors}
              handleChange={handleChange}
              type="edit"
            />
          </Card>

          <Card
            title={t('contract_items')}
            className="shadow-sm"
            style={{ borderColor: colors.$24 }}
            headerStyle={{ borderColor: colors.$20 }}
          >
            <div className="px-6 py-4">
              <ContractItemsTable
                contract={contract}
                handleChange={handleChange}
              />
            </div>
          </Card>
        </div>
      ) : (
        <Spinner />
      )}
    </>
  );
}

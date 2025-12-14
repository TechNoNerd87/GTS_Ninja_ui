/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '$app/components/cards';
import { ValidationBag } from '$app/common/interfaces/validation-bag';
import { useAtom } from 'jotai';
import { contractAtom } from '../atoms';
import { useHandleChange } from '../hooks';
import { ContractForm } from './ContractForm';
import { ContractItemsTable } from './ContractItemsTable';
import { useColorScheme } from '$app/common/colors';

interface Props {
  errors: ValidationBag | undefined;
  setErrors: Dispatch<SetStateAction<ValidationBag | undefined>>;
}

export function CreateContract(props: Props) {
  const [t] = useTranslation();

  const colors = useColorScheme();

  const [contract, setContract] = useAtom(contractAtom);

  const handleChange = useHandleChange({
    setErrors: props.setErrors,
    setContract,
  });

  return (
    <div className="flex flex-col space-y-4">
      <Card
        title={t('new_contract')}
        className="shadow-sm"
        style={{ borderColor: colors.$24 }}
        headerStyle={{ borderColor: colors.$20 }}
      >
        {contract && (
          <ContractForm
            errors={props.errors}
            handleChange={handleChange}
            contract={contract}
          />
        )}
      </Card>

      {contract && (
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
      )}
    </div>
  );
}

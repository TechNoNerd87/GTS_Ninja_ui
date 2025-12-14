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
import { serviceOrderAtom } from '../atoms';
import { useHandleChange } from '../hooks';
import { ServiceOrderForm } from './ServiceOrderForm';
import { ServiceOrderLaborTable } from './ServiceOrderLaborTable';
import { ServiceOrderPartsTable } from './ServiceOrderPartsTable';
import { useColorScheme } from '$app/common/colors';

interface Props {
  errors: ValidationBag | undefined;
  setErrors: Dispatch<SetStateAction<ValidationBag | undefined>>;
}

export function CreateServiceOrder(props: Props) {
  const [t] = useTranslation();

  const colors = useColorScheme();

  const [serviceOrder, setServiceOrder] = useAtom(serviceOrderAtom);

  const handleChange = useHandleChange({
    setErrors: props.setErrors,
    setServiceOrder,
  });

  return (
    <div className="flex flex-col space-y-4">
      <Card
        title={t('new_service_order')}
        className="shadow-sm"
        style={{ borderColor: colors.$24 }}
        headerStyle={{ borderColor: colors.$20 }}
      >
        {serviceOrder && (
          <ServiceOrderForm
            errors={props.errors}
            handleChange={handleChange}
            serviceOrder={serviceOrder}
          />
        )}
      </Card>

      {serviceOrder && (
        <>
          <Card
            title={t('labor_entries')}
            className="shadow-sm"
            style={{ borderColor: colors.$24 }}
            headerStyle={{ borderColor: colors.$20 }}
          >
            <div className="px-6 py-4">
              <ServiceOrderLaborTable
                serviceOrder={serviceOrder}
                handleChange={handleChange}
              />
            </div>
          </Card>

          <Card
            title={t('parts_used')}
            className="shadow-sm"
            style={{ borderColor: colors.$24 }}
            headerStyle={{ borderColor: colors.$20 }}
          >
            <div className="px-6 py-4">
              <ServiceOrderPartsTable
                serviceOrder={serviceOrder}
                handleChange={handleChange}
              />
            </div>
          </Card>
        </>
      )}
    </div>
  );
}

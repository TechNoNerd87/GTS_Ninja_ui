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
import { useServiceOrderQuery } from '$app/common/queries/service-orders';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import { ServiceOrderForm } from '../common/components/ServiceOrderForm';
import { ServiceOrderLaborTable } from '../common/components/ServiceOrderLaborTable';
import { ServiceOrderPartsTable } from '../common/components/ServiceOrderPartsTable';
import { ServiceOrderTravelTable } from '../common/components/ServiceOrderTravelTable';
import { ServiceOrderExpenseTable } from '../common/components/ServiceOrderExpenseTable';
import { ServiceOrderTaskTable } from '../common/components/ServiceOrderTaskTable';
import { useHandleChange } from '../common/hooks';
import { Spinner } from '$app/components/Spinner';
import { ValidationBag } from '$app/common/interfaces/validation-bag';
import { ServiceOrder } from '$app/common/interfaces/service-order';
import { useTitle } from '$app/common/hooks/useTitle';
import { useColorScheme } from '$app/common/colors';
import { useTranslation } from 'react-i18next';

interface Context {
  errors: ValidationBag | undefined;
  setErrors: Dispatch<SetStateAction<ValidationBag | undefined>>;
  serviceOrder: ServiceOrder;
  setServiceOrder: Dispatch<SetStateAction<ServiceOrder | undefined>>;
}

export default function Edit() {
  const { documentTitle } = useTitle('edit_service_order');
  const [t] = useTranslation();

  const { id } = useParams();

  const colors = useColorScheme();

  const { data: serviceOrderResponse } = useServiceOrderQuery({ id });

  const context: Context = useOutletContext();

  const { setErrors, setServiceOrder, serviceOrder, errors } = context;

  const handleChange = useHandleChange({ setErrors, setServiceOrder });

  useEffect(() => {
    if (serviceOrderResponse) {
      setServiceOrder(serviceOrderResponse.data.data);
    }
  }, [serviceOrderResponse]);

  return (
    <>
      {serviceOrderResponse && serviceOrder ? (
        <div className="flex flex-col space-y-4">
          <Card
            title={serviceOrderResponse.data.data.title || documentTitle}
            className="shadow-sm"
            style={{ borderColor: colors.$24 }}
            headerStyle={{ borderColor: colors.$20 }}
          >
            <ServiceOrderForm
              serviceOrder={serviceOrder}
              errors={errors}
              handleChange={handleChange}
              type="edit"
            />
          </Card>

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

          <Card
            title={t('travel_entries')}
            className="shadow-sm"
            style={{ borderColor: colors.$24 }}
            headerStyle={{ borderColor: colors.$20 }}
          >
            <div className="px-6 py-4">
              <ServiceOrderTravelTable
                serviceOrder={serviceOrder}
                handleChange={handleChange}
              />
            </div>
          </Card>

          <Card
            title={t('expenses')}
            className="shadow-sm"
            style={{ borderColor: colors.$24 }}
            headerStyle={{ borderColor: colors.$20 }}
          >
            <div className="px-6 py-4">
              <ServiceOrderExpenseTable
                serviceOrder={serviceOrder}
                handleChange={handleChange}
              />
            </div>
          </Card>

          <Card
            title={t('task_checklist')}
            className="shadow-sm"
            style={{ borderColor: colors.$24 }}
            headerStyle={{ borderColor: colors.$20 }}
          >
            <div className="px-6 py-4">
              <ServiceOrderTaskTable
                serviceOrder={serviceOrder}
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

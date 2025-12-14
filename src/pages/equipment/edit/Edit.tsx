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
import { useEquipmentQuery } from '$app/common/queries/equipment';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import { EquipmentForm } from '../common/components/EquipmentForm';
import { useHandleChange } from '../common/hooks';
import { Spinner } from '$app/components/Spinner';
import { ValidationBag } from '$app/common/interfaces/validation-bag';
import { Equipment } from '$app/common/interfaces/equipment';
import { useTitle } from '$app/common/hooks/useTitle';
import { useColorScheme } from '$app/common/colors';

interface Context {
  errors: ValidationBag | undefined;
  setErrors: Dispatch<SetStateAction<ValidationBag | undefined>>;
  equipment: Equipment;
  setEquipment: Dispatch<SetStateAction<Equipment | undefined>>;
}

export default function Edit() {
  const { documentTitle } = useTitle('edit_equipment');

  const { id } = useParams();

  const colors = useColorScheme();

  const { data: equipmentResponse } = useEquipmentQuery({ id });

  const context: Context = useOutletContext();

  const { setErrors, setEquipment, equipment, errors } = context;

  const handleChange = useHandleChange({ setErrors, setEquipment });

  useEffect(() => {
    if (equipmentResponse) {
      setEquipment(equipmentResponse.data.data);
    }
  }, [equipmentResponse]);

  return (
    <>
      {equipmentResponse && equipment ? (
        <Card
          title={equipmentResponse.data.data.name || documentTitle}
          className="shadow-sm"
          style={{ borderColor: colors.$24 }}
          headerStyle={{ borderColor: colors.$20 }}
        >
          <EquipmentForm
            equipment={equipment}
            errors={errors}
            handleChange={handleChange}
            type="edit"
          />
        </Card>
      ) : (
        <Spinner />
      )}
    </>
  );
}

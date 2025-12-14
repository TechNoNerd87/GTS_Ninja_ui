/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useColorScheme } from '$app/common/colors';
import { endpoint } from '$app/common/helpers';
import { useHasPermission } from '$app/common/hooks/permissions/useHasPermission';
import { useEntityAssigned } from '$app/common/hooks/useEntityAssigned';
import { $refetch } from '$app/common/hooks/useRefetch';
import { useEquipmentQuery } from '$app/common/queries/equipment';
import { Card } from '$app/components/cards';
import { DocumentsTable } from '$app/components/DocumentsTable';
import { Upload } from '$app/pages/settings/company/documents/components';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

export default function Documents() {
  const [t] = useTranslation();

  const colors = useColorScheme();

  const { id } = useParams();
  const { data: equipment } = useEquipmentQuery({ id });

  const hasPermission = useHasPermission();
  const entityAssigned = useEntityAssigned();

  const invalidateQuery = () => {
    $refetch(['equipment']);
  };

  return (
    <Card
      title={t('documents')}
      className="shadow-sm"
      style={{ borderColor: colors.$24 }}
      headerStyle={{ borderColor: colors.$20 }}
    >
      <div className="flex flex-col space-y-4 px-6 pt-4">
        <Upload
          endpoint={endpoint('/api/v1/equipment/:id/upload', { id })}
          onSuccess={invalidateQuery}
          disableUpload={
            !hasPermission('edit_equipment') &&
            !entityAssigned(equipment?.data.data)
          }
          widgetOnly
        />

        {equipment?.data.data && (
          <DocumentsTable
            documents={equipment.data.data.documents}
            onDocumentDelete={invalidateQuery}
            disableEditableOptions={
              !entityAssigned(equipment.data.data, true) &&
              !hasPermission('edit_equipment')
            }
          />
        )}
      </div>
    </Card>
  );
}

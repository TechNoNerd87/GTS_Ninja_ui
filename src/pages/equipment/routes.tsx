/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Guard } from '$app/common/guards/Guard';
import { assigned } from '$app/common/guards/guards/assigned';
import { or } from '$app/common/guards/guards/or';
import { permission } from '$app/common/guards/guards/permission';
import { Route } from 'react-router-dom';
import { lazy } from 'react';

const Equipment = lazy(() => import('$app/pages/equipment/Equipment'));
const EquipmentList = lazy(() => import('$app/pages/equipment/index/Equipment'));
const Create = lazy(() => import('$app/pages/equipment/create/Create'));
const Edit = lazy(() => import('$app/pages/equipment/edit/Edit'));
const Show = lazy(() => import('$app/pages/equipment/show/Show'));
const Documents = lazy(() => import('$app/pages/equipment/documents/Documents'));

export const equipmentRoutes = (
  <Route path="equipment">
    <Route
      path=""
      element={
        <Guard
          guards={[
            or(
              permission('view_equipment'),
              permission('create_equipment'),
              permission('edit_equipment')
            ),
          ]}
          component={<EquipmentList />}
        />
      }
    />
    <Route
      path="create"
      element={
        <Guard guards={[permission('create_equipment')]} component={<Create />} />
      }
    />
    <Route
      path=":id"
      element={
        <Guard
          guards={[
            or(
              permission('view_equipment'),
              permission('edit_equipment'),
              assigned('/api/v1/equipment/:id')
            ),
          ]}
          component={<Equipment />}
        />
      }
    >
      <Route path="" element={<Show />} />
      <Route path="documents" element={<Documents />} />
    </Route>

    <Route
      path=":id/edit"
      element={
        <Guard
          guards={[
            or(
              permission('view_equipment'),
              permission('edit_equipment'),
              assigned('/api/v1/equipment/:id')
            ),
          ]}
          component={<Equipment />}
        />
      }
    >
      <Route path="" element={<Edit />} />
    </Route>
  </Route>
);

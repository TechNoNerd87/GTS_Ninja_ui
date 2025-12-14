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

const Contract = lazy(() => import('$app/pages/contracts/Contract'));
const ContractsList = lazy(() => import('$app/pages/contracts/index/Contracts'));
const Create = lazy(() => import('$app/pages/contracts/create/Create'));
const Edit = lazy(() => import('$app/pages/contracts/edit/Edit'));
const Show = lazy(() => import('$app/pages/contracts/show/Show'));
const Documents = lazy(() => import('$app/pages/contracts/documents/Documents'));

export const contractRoutes = (
  <Route path="contracts">
    <Route
      path=""
      element={
        <Guard
          guards={[
            or(
              permission('view_contract'),
              permission('create_contract'),
              permission('edit_contract')
            ),
          ]}
          component={<ContractsList />}
        />
      }
    />
    <Route
      path="create"
      element={
        <Guard guards={[permission('create_contract')]} component={<Create />} />
      }
    />
    <Route
      path=":id"
      element={
        <Guard
          guards={[
            or(
              permission('view_contract'),
              permission('edit_contract'),
              assigned('/api/v1/contracts/:id')
            ),
          ]}
          component={<Contract />}
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
              permission('view_contract'),
              permission('edit_contract'),
              assigned('/api/v1/contracts/:id')
            ),
          ]}
          component={<Contract />}
        />
      }
    >
      <Route path="" element={<Edit />} />
    </Route>
  </Route>
);

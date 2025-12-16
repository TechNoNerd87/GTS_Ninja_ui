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

const ServiceBank = lazy(() => import('$app/pages/service-banks/ServiceBank'));
const ServiceBanksList = lazy(() => import('$app/pages/service-banks/index/ServiceBanks'));
const Create = lazy(() => import('$app/pages/service-banks/create/Create'));
const Edit = lazy(() => import('$app/pages/service-banks/edit/Edit'));
const Show = lazy(() => import('$app/pages/service-banks/show/Show'));
const Transactions = lazy(() => import('$app/pages/service-banks/transactions/Transactions'));

export const serviceBankRoutes = (
  <Route path="service_banks">
    <Route
      path=""
      element={
        <Guard
          guards={[
            or(
              permission('view_service_bank'),
              permission('create_service_bank'),
              permission('edit_service_bank')
            ),
          ]}
          component={<ServiceBanksList />}
        />
      }
    />
    <Route
      path="create"
      element={
        <Guard guards={[permission('create_service_bank')]} component={<Create />} />
      }
    />
    <Route
      path=":id"
      element={
        <Guard
          guards={[
            or(
              permission('view_service_bank'),
              permission('edit_service_bank'),
              assigned('/api/v1/service_banks/:id')
            ),
          ]}
          component={<ServiceBank />}
        />
      }
    >
      <Route path="" element={<Show />} />
      <Route path="transactions" element={<Transactions />} />
    </Route>

    <Route
      path=":id/edit"
      element={
        <Guard
          guards={[
            or(
              permission('view_service_bank'),
              permission('edit_service_bank'),
              assigned('/api/v1/service_banks/:id')
            ),
          ]}
          component={<ServiceBank />}
        />
      }
    >
      <Route path="" element={<Edit />} />
    </Route>
  </Route>
);

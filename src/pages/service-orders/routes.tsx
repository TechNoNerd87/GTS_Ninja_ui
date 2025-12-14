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

const ServiceOrder = lazy(() => import('$app/pages/service-orders/ServiceOrder'));
const ServiceOrdersList = lazy(() => import('$app/pages/service-orders/index/ServiceOrders'));
const Create = lazy(() => import('$app/pages/service-orders/create/Create'));
const Edit = lazy(() => import('$app/pages/service-orders/edit/Edit'));
const Show = lazy(() => import('$app/pages/service-orders/show/Show'));
const Documents = lazy(() => import('$app/pages/service-orders/documents/Documents'));

export const serviceOrderRoutes = (
  <Route path="service_orders">
    <Route
      path=""
      element={
        <Guard
          guards={[
            or(
              permission('view_service_order'),
              permission('create_service_order'),
              permission('edit_service_order')
            ),
          ]}
          component={<ServiceOrdersList />}
        />
      }
    />
    <Route
      path="create"
      element={
        <Guard guards={[permission('create_service_order')]} component={<Create />} />
      }
    />
    <Route
      path=":id"
      element={
        <Guard
          guards={[
            or(
              permission('view_service_order'),
              permission('edit_service_order'),
              assigned('/api/v1/service_orders/:id')
            ),
          ]}
          component={<ServiceOrder />}
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
              permission('view_service_order'),
              permission('edit_service_order'),
              assigned('/api/v1/service_orders/:id')
            ),
          ]}
          component={<ServiceOrder />}
        />
      }
    >
      <Route path="" element={<Edit />} />
    </Route>
  </Route>
);

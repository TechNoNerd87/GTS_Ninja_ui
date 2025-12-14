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

const MaintenanceSchedule = lazy(() => import('$app/pages/maintenance-schedules/MaintenanceSchedule'));
const MaintenanceSchedulesList = lazy(() => import('$app/pages/maintenance-schedules/index/MaintenanceSchedules'));
const Create = lazy(() => import('$app/pages/maintenance-schedules/create/Create'));
const Edit = lazy(() => import('$app/pages/maintenance-schedules/edit/Edit'));
const Show = lazy(() => import('$app/pages/maintenance-schedules/show/Show'));

export const maintenanceScheduleRoutes = (
  <Route path="maintenance_schedules">
    <Route
      path=""
      element={
        <Guard
          guards={[
            or(
              permission('view_maintenance_schedule'),
              permission('create_maintenance_schedule'),
              permission('edit_maintenance_schedule')
            ),
          ]}
          component={<MaintenanceSchedulesList />}
        />
      }
    />
    <Route
      path="create"
      element={
        <Guard guards={[permission('create_maintenance_schedule')]} component={<Create />} />
      }
    />
    <Route
      path=":id"
      element={
        <Guard
          guards={[
            or(
              permission('view_maintenance_schedule'),
              permission('edit_maintenance_schedule'),
              assigned('/api/v1/maintenance_schedules/:id')
            ),
          ]}
          component={<MaintenanceSchedule />}
        />
      }
    >
      <Route path="" element={<Show />} />
    </Route>

    <Route
      path=":id/edit"
      element={
        <Guard
          guards={[
            or(
              permission('view_maintenance_schedule'),
              permission('edit_maintenance_schedule'),
              assigned('/api/v1/maintenance_schedules/:id')
            ),
          ]}
          component={<MaintenanceSchedule />}
        />
      }
    >
      <Route path="" element={<Edit />} />
    </Route>
  </Route>
);

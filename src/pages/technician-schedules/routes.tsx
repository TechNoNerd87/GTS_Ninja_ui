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

const TechnicianSchedule = lazy(() => import('$app/pages/technician-schedules/TechnicianSchedule'));
const TechnicianSchedulesList = lazy(() => import('$app/pages/technician-schedules/index/TechnicianSchedules'));
const Create = lazy(() => import('$app/pages/technician-schedules/create/Create'));
const Edit = lazy(() => import('$app/pages/technician-schedules/edit/Edit'));
const Show = lazy(() => import('$app/pages/technician-schedules/show/Show'));

export const technicianScheduleRoutes = (
  <Route path="technician_schedules">
    <Route
      path=""
      element={
        <Guard
          guards={[
            or(
              permission('view_technician_schedule'),
              permission('create_technician_schedule'),
              permission('edit_technician_schedule')
            ),
          ]}
          component={<TechnicianSchedulesList />}
        />
      }
    />
    <Route
      path="create"
      element={
        <Guard guards={[permission('create_technician_schedule')]} component={<Create />} />
      }
    />
    <Route
      path=":id"
      element={
        <Guard
          guards={[
            or(
              permission('view_technician_schedule'),
              permission('edit_technician_schedule'),
              assigned('/api/v1/technician_schedules/:id')
            ),
          ]}
          component={<TechnicianSchedule />}
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
              permission('view_technician_schedule'),
              permission('edit_technician_schedule'),
              assigned('/api/v1/technician_schedules/:id')
            ),
          ]}
          component={<TechnicianSchedule />}
        />
      }
    >
      <Route path="" element={<Edit />} />
    </Route>
  </Route>
);

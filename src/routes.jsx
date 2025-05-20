import React, { Suspense, Fragment, lazy } from 'react';
import { Routes, Navigate, Route } from 'react-router-dom';

// project import
import Loader from './components/Loader/Loader';
import AdminLayout from './layouts/AdminLayout';

import { BASE_URL } from './config/constant';
import PrivateRoute from 'guards/PrivateRoutes';

// ==============================|| ROUTES ||============================== //

const renderRoutes = (routes = []) => (
  <Suspense fallback={<Loader />}>
    <Routes>
      {routes.map((route, i) => {
        const Guard = route.guard || Fragment;
        const Layout = route.layout || Fragment;
        const Element = route.element;

        return (
          <Route
            key={i}
            path={route.path}
            exact={route.exact}
            element={
              <Guard>
                <Layout>{route.routes ? renderRoutes(route.routes) : <Element props={true} />}</Layout>
              </Guard>
            }
          />
        );
      })}
    </Routes>
  </Suspense>
);

export const routes = [
  {
    exact: 'true',
    path: '/auth/signup-1',
    element: lazy(() => import('./views/auth/signup/SignUp1'))
  },
  {
    exact: 'true',
    path: '/auth/signin-1',
    element: lazy(() => import('./views/auth/signin/SignIn1'))
  },
  {
    exact: 'true',
    path: '/auth/reset-password-1',
    element: lazy(() => import('./views/auth/reset-password/ResetPassword1'))
  },
  {
    exact: 'true',
    path: '/verify-otp',
    element: lazy(() => import('./views/auth/verify-otp/VerifyOTP'))
  },
  {
    path: '*',
    layout: AdminLayout,
    guard: PrivateRoute,
    routes: [
      {
        exact: 'true',
        path: '/app/dashboard/analytics',
        element: lazy(() => import('./views/dashboard'))
      },
    
      {
        exact: 'true',
        path: '/roles/create-role',
        element: lazy(() => import('./views/roles/CreateRole'))
      },
      {
        exact: 'true',
        path: '/roles/update-role/:id',
        element: lazy(() => import('./views/roles/CreateRole'))
      },
      {
        exact: 'true',
        path: '/roles/all-role',
        element: lazy(() => import('./views/roles/AllRoles'))
      },
      {
        exact: 'true',
        path: '/users/add-user',
        element: lazy(() => import('./views/users/AddUser'))
      },
      {
        exact: 'true',
        path: '/users/update-user/:id',
        element: lazy(() => import('./views/users/AddUser'))
      },
      {
        exact: 'true',
        path: '/users/users-list',
        element: lazy(() => import('./views/users/UsersList'))
      },
      {
        exact: 'true',
        path: '/branch/add-branch',
        element: lazy(() => import('./views/branch/AddBranch'))
      },
      {
        exact: 'true',
        path: '/branch/update-branch/:id',
        element: lazy(() => import('./views/branch/AddBranch'))
      },
      {
        exact: 'true',
        path: '/branch/branch-list',
        element: lazy(() => import('./views/branch/BranchList'))
      },
      {
        exact: 'true',
        path: '/model/add-model',
        element: lazy(() => import('./views/model/AddModel'))
      },
      {
        exact: 'true',
        path: '/model/update-model/:id',
        element: lazy(() => import('./views/model/UpdateModel'))
      },
      {
        exact: 'true',
        path: '/model/model-list',
        element: lazy(() => import('./views/model/ModelList'))
      },
     
      {
        exact: 'true',
        path: '/headers/add-header',
        element: lazy(() => import('./views/headers/AddHeader'))
      },
      {
        exact: 'true',
        path: '/headers/update-header/:id',
        element: lazy(() => import('./views/headers/AddHeader'))
      },
      {
        exact: 'true',
        path: '/headers/update-header/:id',
        element: lazy(() => import('./views/headers/AddHeader'))
      },
      {
        exact: 'true',
        path: '/headers/headers-list',
        element: lazy(() => import('./views/headers/HeadersList'))
      },
      {
        exact: 'true',
        path: '/customers/add-customer',
        element: lazy(() => import('./views/customers/AddCustomer'))
      },
      {
        exact: 'true',
        path: '/customers/update-customer/:id',
        element: lazy(() => import('./views/customers/AddCustomer'))
      },
      {
        exact: 'true',
        path: '/customers/customers-list',
        element: lazy(() => import('./views/customers/CustomersList'))
      },
      {
        exact: 'true',
        path: '/documents/add-document',
        element: lazy(() => import('./views/documents/AddDocument'))
      },
      {
        exact: 'true',
        path: '/documents/update-document/:id',
        element: lazy(() => import('./views/documents/AddDocument'))
      },
      {
        exact: 'true',
        path: '/documents/documents-list',
        element: lazy(() => import('./views/documents/DocumentsList'))
      },
      {
        exact: 'true',
        path: '/conditions/add-condition',
        element: lazy(() => import('./views/terms-and-conditions/AddCondition'))
      },
      {
        exact: 'true',
        path: '/conditions/update-condition/:id',
        element: lazy(() => import('./views/terms-and-conditions/AddCondition'))
      },
      {
        exact: 'true',
        path: '/conditions/conditions-list',
        element: lazy(() => import('./views/terms-and-conditions/ConditionList'))
      },
      {
        exact: 'true',
        path: '/offers/add-offer',
        element: lazy(() => import('./views/model-offers/AddOffers'))
      },
      {
        exact: 'true',
        path: '/offers/update-offer/:id',
        element: lazy(() => import('./views/model-offers/AddOffers'))
      },
      {
        exact: 'true',
        path: '/offers/offer-list',
        element: lazy(() => import('./views/model-offers/OffersList'))
      },
      {
        exact: 'true',
        path: '/attachments/add-attachments',
        element: lazy(() => import('./views/attachments/Attachments'))
      },
      {
        exact: 'true',
        path: '/attachments/update-attachments/:id',
        element: lazy(() => import('./views/attachments/Attachments'))
      },
      {
        exact: 'true',
        path: '/attachments/attachments-list',
        element: lazy(() => import('./views/attachments/AttachmentsList'))
      },
      {
        exact: 'true',
        path: '/sample-page',
        element: lazy(() => import('./views/extra/SamplePage'))
      },
      {
        path: '*',
        exact: 'true',
        element: () => <Navigate to={BASE_URL} />
      }
    ]
  }
];

export default renderRoutes;

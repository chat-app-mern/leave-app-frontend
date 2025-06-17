import { QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { client } from './utils/api';
import {
    adminloader,
    employeeloader,
    loader,
    managerloader,
} from './utils/loader';

import Register from './auth/Register';
import Login from './auth/Login';
import VerifyEmail from './auth/VerifyEmail';

import Admin from './themes/admin/Admin';
import AdminProfile from './themes/admin/Profile';
import AddManager from './themes/admin/AddManager';
import EditProfile from './themes/admin/EditProfile';
import AdminChangePassword from './themes/admin/ChangePassword';
import EditUserProfile from './themes/admin/EditManagerProfile';
import EmployeeLeaves from './themes/admin/EmployeeLeaves';
import Managers from './themes/admin/Managers';

import Manager from './themes/manager/Manager';
import ManagerProfile from './themes/manager/Profile';
import TeamLeaves from './themes/manager/TeamLeaves';
import ManagerEditProfile from './themes/manager/EditProfile';
import { LeaveDetails } from './themes/manager/LeaveDetails';

import Employee from './themes/employee/Employee';
import UpdateProfile from './themes/employee/EditProfile';
import ChangePassword from './themes/employee/ChangePassword';
import Profile from './themes/employee/Profile';
import TakeLeave from './themes/employee/TakeLeave';
import Leaves from './themes/employee/Leaves';

import AdminLayout from './root-layout/AdminLayout';
import ManagerLayout from './root-layout/ManagerLayout';
import EmployeeLayout from './root-layout/EmployeeLayout';

import NotFound from './404/NotFound';

const router = createBrowserRouter([
    {
        path: '/',
        loader: employeeloader,
        element: <EmployeeLayout />,
        errorElement: <NotFound />,
        children: [
            {
                index: true,
                element: <Employee />,
            },
            {
                path: 'leaves',
                element: <Leaves />,
            },
            {
                path: 'take-leave',
                element: <TakeLeave />,
            },
            {
                path: 'profile',
                element: <Profile />,
            },
            {
                path: 'edit-profile',
                element: <UpdateProfile />,
            },
            {
                path: 'change-password',
                element: <ChangePassword />,
            },
        ],
    },
    {
        path: '/manager',
        loader: managerloader,
        element: <ManagerLayout />,
        errorElement: <NotFound />,
        children: [
            {
                index: true,
                element: <Manager />,
            },
            {
                path: 'leaves',
                children: [
                    {
                        index: true,
                        element: <TeamLeaves />,
                    },
                    {
                        path: ':id',
                        element: <LeaveDetails />,
                    },
                ],
            },
            {
                path: 'profile',
                element: <ManagerProfile />,
            },
            {
                path: 'edit-profile',
                element: <ManagerEditProfile />,
            },
            {
                path: 'change-password',
                element: <ChangePassword />,
            },
        ],
    },
    {
        path: '/admin',
        element: <AdminLayout />,
        errorElement: <NotFound />,
        children: [
            { index: true, element: <Admin /> },
            {
                path: 'managers',
                children: [
                    {
                        index: true,
                        element: <Managers />,
                    },
                    {
                        path: ':id',
                        children: [
                            {
                                path: 'edit',
                                element: <EditUserProfile />,
                            },
                        ],
                    },
                ],
            },
            { path: 'employee-leaves', element: <EmployeeLeaves /> },
            { path: 'add-manager', element: <AddManager /> },
            { path: 'profile', element: <AdminProfile /> },
            { path: 'edit-profile', element: <EditProfile /> },
            { path: 'change-password', element: <AdminChangePassword /> },
        ],
        loader: adminloader,
    },
    { element: <Login />, path: '/login', loader },
    { element: <Register />, path: '/register', loader },
    {
        element: <VerifyEmail />,
        path: '/verify-email/:token',
    },
]);

function App() {
    return (
        <QueryClientProvider client={client}>
            <RouterProvider router={router} />
        </QueryClientProvider>
    );
}
export default App;

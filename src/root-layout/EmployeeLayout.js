import { Outlet } from 'react-router-dom';
import { UserHeader } from '../components/Header/EmployeeHeader';

const UserLayout = () => {
    return (
        <>
            <UserHeader />
            <Outlet />
        </>
    );
};

export default UserLayout;

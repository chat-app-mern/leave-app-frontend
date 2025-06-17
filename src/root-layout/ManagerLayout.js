import { Outlet } from 'react-router-dom';
import { ManagerHeader } from '../components/Header/ManagerHeader';

const ManagerLayout = () => {
    return (
        <>
            <ManagerHeader />
            <Outlet />
        </>
    );
};

export default ManagerLayout;

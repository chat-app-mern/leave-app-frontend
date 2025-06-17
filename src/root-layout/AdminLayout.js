import { Outlet } from 'react-router-dom';
import { AdminHeader } from '../components/Header/AdminHeader';

const AdminLayout = () => {
    return (
        <>
            <div className="admin-layout">
                <div className="admin-layout-wrapper">
                    <div className="sidebar">
                        <div className="sidebar-wrapper">
                            <AdminHeader />
                        </div>
                    </div>
                    <div className="content">
                        <Outlet />
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminLayout;

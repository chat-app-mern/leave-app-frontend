import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import { NavLink, useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { backendUrl, getAllData, sendRequest } from '../../utils/api';
import Avatar from '../Avatar/Avatar';

export const AdminHeader = () => {
    let adminImage;
    const { isLoading, isError, error, data } = useQuery({
        queryKey: ['user', `${Cookies.get('token')}`],
        queryFn: () =>
            getAllData(`${backendUrl}/api/v1/user/details`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${Cookies.get('token')}`,
                },
            }),
    });
    if (data) {
        const { data: userData } = data;
        adminImage = !userData.avatar ? (
            <Avatar name={`${userData.name.charAt(0)}`} />
        ) : (
            <>
                <div className="user-image-wrapper text-center pb-2">
                    <img
                        src={`${backendUrl}/uploads/users/${userData.avatar}`}
                        alt="user-image"
                    />
                </div>
            </>
        );
    }
    if (isLoading) {
        adminImage = <Avatar name={'A'}></Avatar>;
    }
    if (isError) {
        Swal.fire({
            title: `${error.message}`,
            icon: 'error',
        });
    }
    const navigate = useNavigate();
    const { isPending, mutate } = useMutation({
        mutationFn: sendRequest,
        onSuccess(response) {
            Swal.fire({
                title: `${response.data.message}`,
                icon: 'success',
                willClose() {
                    Cookies.remove('role');
                    Cookies.remove('token');
                    navigate('/login');
                },
            });
        },
        onError(error) {
            Swal.fire({
                title: `${error.message}`,
                icon: 'error',
            });
        },
    });
    const handleLogout = () => {
        mutate({
            url: `${backendUrl}/api/v1/logout`,
            configuration: {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${Cookies.get('token')}`,
                },
            },
        });
    };
    return (
        <div className="admin-header-wrap">
            <header>
                <div className="admin-header-content">
                    <div className="logo">
                        <a href="/admin">{adminImage}</a>
                    </div>
                    <div className="header-links">
                        <nav>
                            <ul>
                                <li>
                                    <NavLink
                                        to="/admin"
                                        className={({ isActive }) =>
                                            isActive ? 'active' : undefined
                                        }
                                        end
                                    >
                                        Home
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        className={({ isActive }) =>
                                            isActive ? 'active' : undefined
                                        }
                                        to={'/admin/managers'}
                                    >
                                        Managers
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        className={({ isActive }) =>
                                            isActive ? 'active' : undefined
                                        }
                                        to={'/admin/employee-leaves'}
                                    >
                                        Leaves
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        className={({ isActive }) =>
                                            isActive ? 'active' : undefined
                                        }
                                        to={'/admin/profile'}
                                    >
                                        Profile
                                    </NavLink>
                                </li>
                            </ul>
                        </nav>
                    </div>
                    <div className="logout-button text-center">
                        <button
                            className="btn btn-primary"
                            onClick={handleLogout}
                        >
                            {isPending ? 'Logging Out....' : 'Logout'}
                        </button>
                    </div>
                </div>
            </header>
        </div>
    );
};

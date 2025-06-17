import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { backendUrl, getAllData, sendRequest } from '../../utils/api';
import Avatar from '../Avatar/Avatar';
import { useState } from 'react';

export const UserHeader = () => {
    const [open, setOpen] = useState(false);
    const handleOpenMenu = () => {
        setOpen(!open);
    };
    let userImage;
    const { data, isLoading, isError, error } = useQuery({
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
    if (isLoading) {
        userImage = <Avatar name={'U'}></Avatar>;
    }
    if (data) {
        const { data: userData } = data;
        userImage =
            userData.avatar === '' ? (
                <Avatar name={`${userData.name.charAt(0)}`} />
            ) : (
                <div className="user-image-wrapper">
                    <img
                        src={`${backendUrl}/uploads/users/${userData.avatar}`}
                        alt="user-image"
                    />
                </div>
            );
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
        <div className="user-header-wrap">
            <header>
                <div className="container">
                    <div className="user-header-content">
                        <div className="logo">
                            <NavLink className={'p font-weight-bold'} to={'/'}>
                                LEAVE-MANAGEMENT
                            </NavLink>
                        </div>
                        <div className="links">
                            <nav>
                                <ul>
                                    <li>
                                        <NavLink
                                            onClick={() => setOpen(false)}
                                            className={({ isActive }) =>
                                                isActive ? 'active' : undefined
                                            }
                                            to="/"
                                        >
                                            Home
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink
                                            onClick={() => setOpen(false)}
                                            className={({ isActive }) =>
                                                isActive ? 'active' : undefined
                                            }
                                            to="leaves"
                                        >
                                            Leaves
                                        </NavLink>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                        <div className="user-dropdown">
                            <button
                                onClick={handleOpenMenu}
                                className="border-0 bg-none user-dropdown-btn"
                            >
                                {userImage}
                            </button>
                            <ul
                                style={{ display: open ? 'block' : 'none' }}
                                className="user-dropdown-list"
                            >
                                <li>
                                    <Link
                                        onClick={() => setOpen(false)}
                                        to="profile"
                                    >
                                        Profile
                                    </Link>
                                </li>
                                <li>
                                    <button onClick={handleLogout}>
                                        {isPending
                                            ? 'Logging Out....'
                                            : 'Logout'}
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </header>
        </div>
    );
};

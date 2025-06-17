import Cookies from 'js-cookie';
import { backendUrl, getAllData } from '../../utils/api';
import { useQuery } from '@tanstack/react-query';
import Loader from '../../components/Loader/Loader';
import Error from '../../components/Error/Error';
import Avatar from '../../components/Avatar/Avatar';
import { Link } from 'react-router-dom';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import { useEffect } from 'react';

TimeAgo.addLocale(en);

const generateTimeAgo = (date) => {
    if (!date || isNaN(new Date(date))) {
        return 'N/A';
    }

    const timeAgo = new TimeAgo('en-US');
    return timeAgo.format(new Date(date));
};

const Profile = () => {
    const token = Cookies.get('token');

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['user', token],
        queryFn: () =>
            getAllData(`${backendUrl}/api/v1/user/details`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            }),
    });

    useEffect(() => {
        document.title = 'Admin - Profile';
    }, []);

    if (isLoading) return <Loader />;
    if (isError) return <Error message={error.message} />;

    const userData = data?.data || {};

    return (
        <div className="admin-change-password">
            <section className="user-section p-0 changepassword">
                <div className="container">
                    <h3 className="h3 text-center">Profile</h3>
                    <div className="pt-2">
                        <div className="user-image-wrapper text-center">
                            {!userData.avatar ? (
                                <div className="d-flex justify-content-center">
                                    <Avatar name={userData?.name?.charAt(0)} />
                                </div>
                            ) : (
                                <img
                                    src={`${backendUrl}/uploads/users/${userData.avatar}`}
                                    alt="user-avatar"
                                    className="img-fluid"
                                />
                            )}
                        </div>
                    </div>

                    <div className="user-profile">
                        <div className="profile-wrapper">
                            <div className="profile-item">
                                <span className="fw-bold">Name: </span>
                                {userData.name || '-'}
                            </div>
                            <div className="profile-item">
                                <span className="fw-bold">Email: </span>
                                {userData.email || '-'}
                            </div>
                            <div className="profile-item">
                                <span className="fw-bold">Phone: </span>
                                {userData.phone || '-'}
                            </div>
                            <div className="profile-item">
                                <span className="fw-bold at">
                                    Profile Created:
                                </span>{' '}
                                {generateTimeAgo(userData.createdAt)}
                            </div>
                            <div className="profile-item">
                                <span className="fw-bold at">
                                    Profile Updated:
                                </span>{' '}
                                {generateTimeAgo(userData.updatedAt)}
                            </div>
                            <div className="button-wrapper">
                                <Link
                                    className="btn w-100 btn-primary"
                                    to="/admin/edit-profile"
                                >
                                    Edit Profile
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Profile;

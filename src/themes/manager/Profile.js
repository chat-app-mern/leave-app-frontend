import Cookies from 'js-cookie';
import { backendUrl, getAllData } from '../../utils/api';
import { useQuery } from '@tanstack/react-query';
import Loader from '../../components/Loader/Loader';
import Error from '../../components/Error/Error';
import Avatar from '../../components/Avatar/Avatar';
import { Link } from 'react-router-dom';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

TimeAgo.addLocale(en);

const generateTimeAgo = (createdAt) => {
    const timeAgo = new TimeAgo('en-US');
    const formattedDate = timeAgo.format(new Date(createdAt));
    return { formattedDate };
};

const EditProfile = () => {
    let content;
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
        content = <Loader />;
    }

    if (isError) {
        content = <Error message={error.message} />;
    }
    if (data) {
        const { data: userData } = data;
        content = (
            <section className="user-section p-0 changepassword">
                <div className="container">
                    <h3 className="h3 text-center">Profile</h3>
                    <div className="pt-2">
                        <div className="user-image-wrapper text-center">
                            {userData.avatar === '' ? (
                                <div className="d-flex justify-content-center">
                                    <Avatar
                                        name={`${userData.name.charAt(0)}`}
                                    />
                                </div>
                            ) : (
                                <img
                                    src={`${backendUrl}/uploads/users/${userData.avatar}`}
                                    alt="user-image"
                                />
                            )}
                        </div>
                    </div>
                    <div className="user-profile">
                        <div className="profile-wrapper">
                            <div className="profile-item">
                                <span className="fw-bold">Name:</span>
                                {userData.name}
                            </div>
                            <div className="profile-item">
                                <span className="fw-bold">Email:</span>
                                {userData.email}
                            </div>
                            <div className="profile-item">
                                <span className="fw-bold">Phone:</span>
                                {userData.phone}
                            </div>
                            <div className="profile-item">
                                <span className="fw-bold at">
                                    Profile Created:
                                </span>
                                {
                                    generateTimeAgo(userData.createdAt)
                                        .formattedDate
                                }
                            </div>
                            <div className="profile-item">
                                <span className="fw-bold at">
                                    Profile Updated:
                                </span>
                                {
                                    generateTimeAgo(userData.updatedAt)
                                        .formattedDate
                                }
                            </div>
                            <div className="button-wrapper">
                                <Link
                                    className="btn w-100 btn-primary"
                                    to={'/manager/edit-profile'}
                                >
                                    Edit Profile
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
    return (
        <>
            <title>Manager - Profile</title>
            {content}
        </>
    );
};

export default EditProfile;

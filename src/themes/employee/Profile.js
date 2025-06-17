import Cookies from 'js-cookie';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Swal from 'sweetalert2';
import * as yup from 'yup';
import { backendUrl, client, getAllData, sendRequest } from '../../utils/api';
import { useMutation, useQuery } from '@tanstack/react-query';
import Loader from '../../components/Loader/Loader';
import Error from '../../components/Error/Error';
import Avatar from '../../components/Avatar/Avatar';
import { Link } from 'react-router-dom';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import Select from '../../components/Select/Select';

TimeAgo.addDefaultLocale(en);

const generateTimeAgo = (createdAt) => {
    const timeAgo = new TimeAgo('en-US');
    const formattedDate = timeAgo.format(new Date(createdAt));
    return { formattedDate };
};

const schema = yup.object().shape({
    manager: yup.string().required('Select your manager.'),
});

const EditProfile = () => {
    let content;
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(schema),
    });
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
    const {
        data: managersData,
        isLoading: isManagersDataLoading,
        isError: isManagersDataError,
        error: managersDataError,
    } = useQuery({
        queryKey: ['managers', `${Cookies.get('token')}`],
        queryFn: () =>
            getAllData(`${backendUrl}/api/v1/employee/managers`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${Cookies.get('token')}`,
                },
            }),
        enabled: !!data && !data?.data?.manager,
    });

    if (isLoading || isManagersDataLoading) {
        content = <Loader />;
    }

    if (isError || isManagersDataError) {
        content = <Error message={error.message || managersDataError.error} />;
    }
    const { mutate, isPending } = useMutation({
        mutationFn: sendRequest,
        onSuccess(response) {
            Swal.fire({
                title: `${response.data.message}`,
                icon: 'success',
                willClose() {
                    reset();
                    client.invalidateQueries({
                        queryKey: ['user', `${Cookies.get('token')}`],
                    });
                },
            });
        },
        onError(error) {
            Swal.fire({
                icon: 'error',
                title: 'Error Occured.',
                text: `${error.message}`,
            });
        },
    });
    const onSubmit = (data) => {
        mutate({
            url: `${backendUrl}/api/v1/employee/set-manager`,
            configuration: {
                method: 'PATCH',
                body: JSON.stringify(data),
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${Cookies.get('token')}`,
                },
            },
        });
    };
    let allManagersData;
    if (managersData) {
        const { data } = managersData;
        allManagersData = data.map((element) => {
            return (
                <option key={`${element._id}`} value={`${element._id}`}>
                    {element.name}
                </option>
            );
        });
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
                            <div className="profile-item at">
                                <span className="fw-bold">Phone:</span>
                                {userData.phone}
                            </div>
                            {userData.manager?.name ? (
                                <div className="profile-item">
                                    <span className="fw-bold">Manager:</span>
                                    {userData.manager?.name}
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <Select {...register('manager')}>
                                        <option value={''}>
                                            Select Your Manager
                                        </option>
                                        {allManagersData}
                                    </Select>
                                    {errors.manager && (
                                        <p className="p-2 text-danger mb-0">
                                            {errors.manager.message}
                                        </p>
                                    )}
                                    <button className="btn btn-primary mt-3">
                                        {isPending ? 'Submitting' : 'Submit'}
                                    </button>
                                </form>
                            )}
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
                                    to={'/edit-profile'}
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
            <title>Employee - Profile</title>
            {content}
        </>
    );
};

export default EditProfile;

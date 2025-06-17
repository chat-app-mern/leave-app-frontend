import * as yup from 'yup';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import { backendUrl, sendRequest, getAllData, client } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { yupResolver } from '@hookform/resolvers/yup';
import Input from '../../components/Input/Input';
import Loader from '../../components/Loader/Loader';
import Error from '../../components/Error/Error';
import Avatar from '../../components/Avatar/Avatar';

const schema = yup.object().shape({
    name: yup.string().required('Name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    phone: yup
        .string()
        .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
        .required('Phone number is required'),
});

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
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(schema),
    });

    const { mutate, isPending } = useMutation({
        mutationFn: sendRequest,
        onSuccess(response) {
            Swal.fire({
                title: `${response.data.message}`,
                icon: 'success',
                willClose() {
                    reset();
                    client.invalidateQueries({
                        queryKey: ['user', Cookies.get('token')],
                    });
                    navigate('/');
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
        const formData = new FormData();
        if (data.avatar.length) {
            formData.append('avatar', data.avatar[0]);
        }
        for (const key in data) {
            if (key !== 'avatar') {
                formData.append(key, data[key]);
            }
        }
        mutate({
            url: `${backendUrl}/api/v1/user/details`,
            configuration: {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${Cookies.get('token')}`,
                },
                body: formData,
            },
        });
    };

    if (isLoading) {
        content = <Loader />;
    }

    if (isError) {
        content = <Error message={error.message} />;
    }

    if (data) {
        const { data: userData } = data;
        content = (
            <div className="admin-change-password">
                <section className="user-section p-0 changepassword">
                    <div className="container">
                        <h3 className="h3 text-center">Edit Profile</h3>
                        <div className="text-center py-2">
                            <div className="user-image-wrapper">
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
                        <div className="change-password">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div>
                                    <Input
                                        {...register('name')}
                                        type="text"
                                        placeholder="Enter your name"
                                        defaultValue={userData.name}
                                    />
                                    {errors.name && (
                                        <p className="p-2 text-danger mb-0">
                                            {errors.name.message}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <Input
                                        {...register('email')}
                                        type="email"
                                        placeholder="Enter your email"
                                        defaultValue={userData.email}
                                    />
                                    {errors.email && (
                                        <p className="p-2 text-danger mb-0">
                                            {errors.email.message}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <Input
                                        {...register('phone')}
                                        type="tel"
                                        placeholder="Enter your phone number"
                                        defaultValue={userData.phone}
                                    />
                                    {errors.phone && (
                                        <p className="p-2 text-danger mb-0">
                                            {errors.phone.message}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="p pb-2">
                                        Update Your Image:
                                    </label>
                                    <Input
                                        type="file"
                                        accept="image/png, image/jpeg, image/jpg"
                                        {...register('avatar', {
                                            validate: {
                                                fileType: (value) =>
                                                    value[0]?.type ===
                                                        'image/jpeg' ||
                                                    value[0]?.type ===
                                                        'image/png' ||
                                                    'Only JPEG/PNG allowed',
                                                fileSize: (value) =>
                                                    value[0]?.size <
                                                        2 * 1024 * 1024 ||
                                                    'File must be less than 2MB',
                                            },
                                        })}
                                    />
                                    {errors.avatar && (
                                        <p className="p-2 text-danger mb-0">
                                            {errors.avatar.message}
                                        </p>
                                    )}
                                </div>
                                <div className="submit">
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={isPending ? true : false}
                                    >
                                        {isPending ? 'Submiting' : 'Submit'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </section>
            </div>
        );
    }

    return (
        <>
            <title>Admin - EditProfile</title>
            {content}
        </>
    );
};

export default EditProfile;

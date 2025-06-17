import { useMutation } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { backendUrl, sendRequest } from '../../utils/api';
import Input from '../../components/Input/Input';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const schema = yup.object().shape({
    oldPassword: yup
        .string()
        .required('Old Password is required')
        .min(8, 'Password must be at least 8 characters'),
    password: yup
        .string()
        .required('New Password is required')
        .min(8, 'Password must be at least 8 characters'),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password')], 'Passwords must match')
        .required('Confirm Password is required'),
});

const ChangePassword = () => {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });
    const { isPending, mutate } = useMutation({
        mutationFn: sendRequest,
        onSuccess(response) {
            Swal.fire({
                icon: 'success',
                title: `${response.data.message}`,
                text: `Please login again.`,
                willClose() {
                    Cookies.remove('token');
                    Cookies.remove('role');
                    navigate('/login');
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
            url: `${backendUrl}/api/v1/change-password`,
            configuration: {
                method: 'PATCH',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${Cookies.get('token')}`,
                },
            },
        });
    };
    return (
        <>
            <title>Change Password</title>
            <section className="user-section p-0 changepassword">
                <div className="container">
                    <h3 className="h3 text-center">Change Password</h3>
                    <div className="change-password">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div>
                                <Input
                                    {...register('oldPassword')}
                                    type="password"
                                    placeholder="Enter Old Password"
                                />
                                {errors.oldPassword && (
                                    <p className="p-2 mb-0 text-danger">
                                        {errors.oldPassword.message}
                                    </p>
                                )}
                            </div>
                            <div>
                                <Input
                                    {...register('password')}
                                    type="password"
                                    placeholder="New Password"
                                />
                                {errors.password && (
                                    <p className="p-2 mb-0 text-danger">
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>
                            <div>
                                <Input
                                    {...register('confirmPassword')}
                                    type="password"
                                    placeholder="Enter New Password Again"
                                />
                                {errors.confirmPassword && (
                                    <p className="p-2 mb-0 text-danger">
                                        {errors.confirmPassword.message}
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
        </>
    );
};
export default ChangePassword;

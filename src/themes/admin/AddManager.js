import Swal from 'sweetalert2';
import * as yup from 'yup';
import Cookies from 'js-cookie';
import Input from '../../components/Input/Input';
import { backendUrl, sendRequest } from '../../utils/api';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

const schema = yup.object().shape({
    name: yup
        .string()
        .min(1, 'Name must be at least 1 character long.')
        .max(50, 'Name must be at most 50 characters long.')
        .required('Name is required.'),

    email: yup.string().email('Invalid email.').required('Email is required.'),
    phone: yup
        .string()
        .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits.')
        .required('Phone number is required.'),
    password: yup
        .string()
        .min(8, 'Password must be at least 8 characters.')
        .max(16, 'Password cannot be more than 16 characters.')
        .required('Password is required.'),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password'), null], 'Passwords do not match.')
        .required('Confirm password is required.'),
});

const AddManager = () => {
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
                    navigate('/admin/managers');
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
            url: `${backendUrl}/api/v1/admin/managers`,
            configuration: {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${Cookies.get('token')}`,
                },
            },
        });
    };
    return (
        <>
            <title>Admin - Add Manager</title>
            <div className="admin-change-password">
                <section className="user-section p-0 changepassword">
                    <div className="container">
                        <h3 className="h3">Add Manager</h3>
                        <div className="change-password">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div>
                                    <Input
                                        type="text"
                                        {...register('name')}
                                        placeholder="Enter Name"
                                    />
                                    {errors.name && (
                                        <p className="p-2 text-danger mb-0">
                                            {errors.name.message}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <Input
                                        type="email"
                                        {...register('email')}
                                        placeholder="Enter Email"
                                    />
                                    {errors.email && (
                                        <p className="p-2 text-danger mb-0">
                                            {errors.email.message}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <Input
                                        type="password"
                                        {...register('password')}
                                        placeholder="Enter Password"
                                    />
                                    {errors.password && (
                                        <p className="p-2 text-danger mb-0">
                                            {errors.password.message}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <Input
                                        type="password"
                                        {...register('confirmPassword')}
                                        placeholder="Enter Password Again"
                                    />
                                    {errors.confirmPassword && (
                                        <p className="p-2 text-danger mb-0">
                                            {errors.confirmPassword.message}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <Input
                                        type="tel"
                                        {...register('phone')}
                                        placeholder="Enter Phone Number"
                                    />
                                    {errors.phone && (
                                        <p className="p-2 text-danger mb-0">
                                            {errors.phone.message}
                                        </p>
                                    )}
                                </div>
                                <div className="text-center">
                                    <button
                                        disabled={isPending ? true : false}
                                        type="submit"
                                        className="btn btn-primary"
                                    >
                                        {isPending
                                            ? 'Submitting....'
                                            : 'Add Manager'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default AddManager;

import Swal from 'sweetalert2';
import * as yup from 'yup';
import AuthSection from '../components/AuthSection/AuthSection';
import Input from '../components/Input/Input';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { backendUrl, sendRequest } from '../utils/api';

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

const Register = () => {
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
                },
            });
        },
        onError(error) {
            Swal.fire({
                icon: 'error',
                title: `${error.message}`,
            });
        },
    });
    const onSubmit = (data) => {
        mutate({
            url: `${backendUrl}/api/v1/register`,
            configuration: {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-type': 'application/json',
                },
            },
        });
    };
    return (
        <>
            <title>Register</title>
            <AuthSection heading={'Register'}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <Input
                            type="text"
                            {...register('name')}
                            placeholder="Enter Your Name"
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
                            placeholder="Enter Your Email"
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
                            placeholder="Enter Your Password"
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
                            placeholder="Enter Your Password Again"
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
                            placeholder="Enter Your Phone Number"
                        />
                        {errors.phone && (
                            <p className="p-2 text-danger mb-0">
                                {errors.phone.message}
                            </p>
                        )}
                    </div>
                    <button
                        disabled={isPending ? true : false}
                        className="btn btn-primary"
                        type="submit"
                    >
                        {isPending ? 'Submiting....' : 'Register'}
                    </button>
                </form>
                <p className="text-center pt-4">
                    <Link to={'/login'}>Already Have An Account?</Link>
                </p>
            </AuthSection>
        </>
    );
};

export default Register;

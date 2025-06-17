import { Link, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import Swal from 'sweetalert2';
import Input from '../components/Input/Input';
import AuthSection from '../components/AuthSection/AuthSection';
import Cookies from 'js-cookie';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { backendUrl, sendRequest } from '../utils/api';
import { useMutation } from '@tanstack/react-query';

const schema = yup.object().shape({
    email: yup.string().email('Invalid email.').required('Email is required.'),
    password: yup
        .string()
        .min(8, 'Password must be at least 8 characters.')
        .max(16, 'Password cannot be more than 16 characters.')
        .required('Password is required.'),
});

const Login = () => {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(schema),
    });
    const { isPending, mutate } = useMutation({
        mutationFn: sendRequest,
        onSuccess(response) {
            Swal.fire({
                title: `${response.data.message}`,
                icon: 'success',
                willClose() {
                    reset();
                    Cookies.set('token', response.data.token, {
                        expires: 1 / 24,
                    });
                    Cookies.set('role', response.data.role, {
                        expires: 1 / 24,
                    });
                    if (response.data.role === 'admin') {
                        navigate('/admin');
                    } else if (response.data.role === 'manager') {
                        navigate('/manager');
                    } else if (response.data.role === 'employee') {
                        navigate('/');
                    }
                },
            });
        },
        onError(error) {
            const { message } = error;
            Swal.fire({
                icon: 'error',
                title: message || 'Something went wrong.',
            });
        },
    });
    const onSubmit = (data) => {
        mutate({
            url: `${backendUrl}/api/v1/login`,
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
            <title>Login</title>
            <AuthSection heading={'Login'}>
                <form onSubmit={handleSubmit(onSubmit)}>
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
                    <button
                        disabled={isPending ? true : false}
                        className="btn btn-primary"
                        type="submit"
                    >
                        {isPending ? 'Submiting....' : 'Login'}
                    </button>
                </form>
                <p className="text-center pt-4 pb-2 mb-0">
                    <Link to={'/register'}>Create New Account</Link>
                </p>
            </AuthSection>
        </>
    );
};

export default Login;

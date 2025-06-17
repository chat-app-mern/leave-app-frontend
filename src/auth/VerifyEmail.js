import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { backendUrl, sendRequest } from '../utils/api';
import { useEffect } from 'react';

const VerifyEmail = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const { mutate } = useMutation({
        mutationFn: sendRequest,
        onSuccess(response) {
            Swal.fire({
                title: `${response.data.message}`,
                icon: 'success',
                willClose() {
                    navigate('/login');
                },
            });
        },
        onError(error) {
            if (error.message === 'Token not found.') {
                return navigate('/register');
            }
            Swal.fire({
                icon: 'error',
                title: 'Error Occured.',
                text: `${error.message}`,
            });
        },
    });
    const onSubmit = () => {
        mutate({
            url: `${backendUrl}/api/v1/verify-email/${token}`,
            configuration: {
                method: 'GET',
            },
        });
    };
    useEffect(() => {
        onSubmit();
    }, []);
    return (
        <>
            <title>Verify Email</title>
        </>
    );
};

export default VerifyEmail;

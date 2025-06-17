import { useMutation } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { backendUrl, sendRequest } from '../../utils/api';
import Swal from 'sweetalert2';

const OtpTimer = () => {
    const { mutate, isPending } = useMutation({
        mutationFn: sendRequest,
        onSuccess(response) {
            Swal.fire({
                icon: 'success',
                title: `${response.data.message}`,
                willClose() {
                    const newExpiry = Date.now() + 120 * 1000;
                    const newState = {
                        expiry: newExpiry,
                        showResendLink: false,
                    };
                    sessionStorage.setItem(
                        'otp-state',
                        JSON.stringify(newState)
                    );
                    setTimeLeft(120);
                    setShowResendLink(false);
                },
            });
        },
        onError(error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message,
            });
        },
    });

    const [timeLeft, setTimeLeft] = useState(() => {
        const stored = sessionStorage.getItem('otp-state');
        if (stored) {
            try {
                const { expiry } = JSON.parse(stored);
                const remaining = expiry
                    ? Math.max(0, Math.floor((expiry - Date.now()) / 1000))
                    : 120;
                return remaining;
            } catch {
                return 120;
            }
        }
        return 120;
    });

    const [showResendLink, setShowResendLink] = useState(() => {
        const stored = sessionStorage.getItem('otp-state');
        if (stored) {
            try {
                const { showResendLink } = JSON.parse(stored);
                return !!showResendLink;
            } catch {
                return false;
            }
        }
        return false;
    });

    useEffect(() => {
        if (timeLeft <= 0) {
            setShowResendLink(true);
            sessionStorage.setItem(
                'otp-state',
                JSON.stringify({ expiry: null, showResendLink: true })
            );
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    useEffect(() => {
        const expiryTime = Date.now() + timeLeft * 1000;
        sessionStorage.setItem(
            'otp-state',
            JSON.stringify({ expiry: expiryTime, showResendLink })
        );
    }, [timeLeft, showResendLink]);

    const formatTime = (seconds) => {
        const min = String(Math.floor(seconds / 60)).padStart(2, '0');
        const sec = String(seconds % 60).padStart(2, '0');
        return `${min}:${sec}`;
    };

    const handleResend = () => {
        mutate({
            url: `${backendUrl}/api/v1/resend-otp`,
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
        <div className="text-center pt-3">
            {showResendLink ? (
                <button
                    disabled={isPending}
                    className="btn btn-primary"
                    onClick={handleResend}
                >
                    {isPending ? 'Sending' : 'Send another OTP'}
                </button>
            ) : (
                <p>Resend otp available in: {formatTime(timeLeft)}</p>
            )}
        </div>
    );
};

export default OtpTimer;

import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { backendUrl, getAllData, sendRequest } from '../../utils/api';
import { useNavigate, useParams } from 'react-router-dom';
import Error from '../../components/Error/Error';
import Loader from '../../components/Loader/Loader';
import formatDate from '../../utils/formatDate';
import Swal from 'sweetalert2';

export const LeaveDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [status, setStatus] = useState('');
    const [comment, setComment] = useState('');
    const { isPending, mutate } = useMutation({
        mutationFn: sendRequest,
        onSuccess(response) {
            Swal.fire({
                title: `${response.data.message}`,
                icon: 'success',
                willClose() {
                    navigate('/manager/leaves');
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

    const { data, isError, isLoading, error } = useQuery({
        queryKey: ['leave', `${id}`],
        queryFn: () =>
            getAllData(`${backendUrl}/api/v1/manager/leaves/${id}`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${Cookies.get('token')}`,
                },
            }),
    });

    const handleStatusChange = (e) => {
        setStatus(e.target.value);
    };

    const handleCommentChange = (e) => {
        setComment(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (status === 'rejected') {
            if (typeof comment !== 'string' || !comment.trim()) {
                return Swal.fire({
                    icon: 'error',
                    text: 'Comment is required.',
                });
            }
        }
        const payload =
            status === 'rejected' ? { status, comment } : { status };
        mutate({
            url: `${backendUrl}/api/v1/manager/leaves/${id}`,
            configuration: {
                method: 'PATCH',
                body: JSON.stringify(payload),
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${Cookies.get('token')}`,
                },
            },
        });
    };

    if (isLoading) return <Loader />;
    if (isError) return <Error message={error.message} />;

    const { data: leaveData } = data;

    return (
        <>
            <title>Manager - LeaveDetails</title>
            <section className="user-section p-0 changepassword">
                <div className="container">
                    <h3 className="h3 text-center">Leave Details</h3>
                    <div className="user-profile">
                        <div className="profile-wrapper">
                            <div className="profile-item">
                                <span className="fw-bold">From:</span>
                                {formatDate(leaveData.from)}
                            </div>
                            <div className="profile-item">
                                <span className="fw-bold">To:</span>
                                {formatDate(leaveData.to)}
                            </div>
                            <div className="profile-item">
                                <span className="fw-bold">Reason:</span>
                                {leaveData.reason}
                            </div>
                            <h4 className="h4">Employee:</h4>
                            <div className="profile-item">
                                <span className="fw-bold">Name:</span>
                                {leaveData.employee.name}
                            </div>
                            <div className="profile-item">
                                <span className="fw-bold">Email:</span>
                                {leaveData.employee.email}
                            </div>

                            <form onSubmit={handleSubmit} className="mt-3">
                                <label className="h6 pb-2 d-block">
                                    Change Leave Status:
                                </label>
                                <label className="d-block">
                                    <input
                                        type="radio"
                                        name="leaveStatus"
                                        value="approved"
                                        checked={status === 'approved'}
                                        onChange={handleStatusChange}
                                    />{' '}
                                    Approve
                                </label>
                                <label className="d-block">
                                    <input
                                        type="radio"
                                        name="leaveStatus"
                                        value="rejected"
                                        checked={status === 'rejected'}
                                        onChange={handleStatusChange}
                                    />{' '}
                                    Reject
                                </label>
                                {status === 'rejected' && (
                                    <div className="mt-3">
                                        <label
                                            htmlFor="comment"
                                            className="d-block h6 pb-1"
                                        >
                                            Add Comment:
                                        </label>
                                        <textarea
                                            id="comment"
                                            className="form-control"
                                            value={comment}
                                            onChange={handleCommentChange}
                                        />
                                    </div>
                                )}
                                {status && (
                                    <button
                                        type="submit"
                                        className="btn btn-primary mt-2"
                                        disabled={isPending ? true : false}
                                    >
                                        {isPending ? 'Submiting....' : 'Submit'}
                                    </button>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

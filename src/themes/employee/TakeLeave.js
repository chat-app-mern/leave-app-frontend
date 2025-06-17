import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Cookies from 'js-cookie';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useMutation } from '@tanstack/react-query';
import { backendUrl, sendRequest } from '../../utils/api';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const schema = yup.object().shape({
    from: yup.date().required('Leave start date is required'),
    to: yup
        .date()
        .required('Leave end date is required')
        .min(yup.ref('from'), 'Leave end date cannot be before start date'),
    reason: yup
        .string()
        .required('Reason is required')
        .min(5, 'Reason must be at least 5 characters'),
});

const TakeLeave = () => {
    const navigate = useNavigate();
    const {
        control,
        handleSubmit,
        register,
        watch,
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
                willClose() {
                    navigate('/leaves');
                },
            });
        },
        onError(error) {
            Swal.fire({
                icon: 'error',
                title: 'Error Occurred',
                text: `${error.message}`,
            });
        },
    });

    const formatDate = (date) => {
        if (!date) return '';
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
    };

    const onSubmit = (data) => {
        const leaveData = {
            ...data,
            from: formatDate(data.from),
            to: formatDate(data.to),
        };
        mutate({
            url: `${backendUrl}/api/v1/employee/leaves`,
            configuration: {
                method: 'POST',
                body: JSON.stringify(leaveData),
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${Cookies.get('token')}`,
                },
            },
        });
    };

    return (
        <section className="user-section p-0 changepassword">
            <div className="container">
                <h3 className="h3 text-center">Take Leave</h3>
                <div className="change-password">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <label className="mb-2">From Date:</label>
                            <Controller
                                control={control}
                                name="from"
                                render={({ field }) => (
                                    <DatePicker
                                        placeholderText="Select start date"
                                        selected={field.value}
                                        onChange={field.onChange}
                                        dateFormat="dd-MM-yyyy"
                                        className="form-control w-100"
                                        minDate={new Date()}
                                        filterDate={(date) =>
                                            date.getDay() !== 0 &&
                                            date.getDay() !== 6
                                        }
                                    />
                                )}
                            />
                            {errors.from && (
                                <p className="p-2 mb-0 text-danger">
                                    {errors.from.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2">To Date:</label>
                            <Controller
                                control={control}
                                name="to"
                                render={({ field }) => (
                                    <DatePicker
                                        placeholderText="Select end date"
                                        selected={field.value}
                                        onChange={field.onChange}
                                        dateFormat="dd-MM-yyyy"
                                        className="form-control w-100"
                                        minDate={watch('from') || new Date()}
                                        filterDate={(date) =>
                                            date.getDay() !== 0 &&
                                            date.getDay() !== 6
                                        }
                                    />
                                )}
                            />
                            {errors.to && (
                                <p className="p-2 mb-0 text-danger">
                                    {errors.to.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <textarea
                                {...register('reason')}
                                className="form-control"
                                rows={4}
                                placeholder="Enter your reason"
                            ></textarea>
                            {errors.reason && (
                                <p className="p-2 mb-0 text-danger">
                                    {errors.reason.message}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary mt-3"
                            disabled={isPending}
                        >
                            {isPending ? 'Submitting...' : 'Apply Leave'}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default TakeLeave;

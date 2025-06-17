import { useMutation, useQuery } from '@tanstack/react-query';
import { backendUrl, client, getAllData, sendRequest } from '../../utils/api';
import Cookies from 'js-cookie';
import Loader from '../../components/Loader/Loader';
import Error from '../../components/Error/Error';
import Table from 'react-bootstrap/Table';
import Swal from 'sweetalert2';
import UserRecord from '../../components/UserRecord/UserRecord';
import { Link } from 'react-router-dom';

const Managers = () => {
    const { data, isError, isLoading, error } = useQuery({
        queryKey: ['managers'],
        queryFn: () =>
            getAllData(`${backendUrl}/api/v1/admin/managers`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${Cookies.get('token')}`,
                },
            }),
    });
    const { mutate, isPending } = useMutation({
        mutationFn: sendRequest,
        onSuccess(response) {
            Swal.fire({
                title: `${response.data.message}`,
                icon: 'success',
                willClose() {
                    client.invalidateQueries({ queryKey: ['managers'] });
                },
            });
        },
        onError(error) {
            Swal.fire({
                icon: 'error',
                title: error.message || 'Something went wrong.',
            });
        },
    });
    const handleDeleteUser = (id) => {
        Swal.fire({
            title: `Are you sure you want to remove this manager?`,
            icon: 'warning',
            showDenyButton: true,
            confirmButtonText: 'Yes',
            denyButtonText: 'No',
        }).then((result) => {
            if (result.isConfirmed) {
                mutate({
                    url: `${backendUrl}/api/v1/admin/managers/${id}`,
                    configuration: {
                        method: 'DELETE',
                        headers: {
                            'Content-type': 'application/json',
                            Authorization: `Bearer ${Cookies.get('token')}`,
                        },
                    },
                });
            } else if (result.isDenied) {
                Swal.fire('Account is not delete its safe.', '', 'info');
            }
        });
    };
    let content;
    if (isLoading || isPending) {
        content = <Loader />;
    }
    if (data) {
        let users;
        const { data: userData } = data;
        if (userData.length) {
            users = userData.map((user) => {
                return (
                    <UserRecord
                        key={`${user._id}`}
                        user={user}
                        handleDeleteUser={handleDeleteUser}
                    />
                );
            });
            let tableContent = (
                <Table responsive>
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>{users}</tbody>
                </Table>
            );
            content = tableContent;
        } else {
            content = (
                <p className="p text-center">No Managers Available.</p>
            );
        }
    }
    if (isError) {
        content = <Error message={error.message} />;
    }
    return (
        <>
            <title>Admin - Managers</title>
            <div className="users-wrapper">
                <div className="d-flex align-items-center justify-content-between">
                    <h1 className="h1 pb-4 pb-md-5">Managers</h1>
                    <Link className='btn btn-primary' to={'/admin/add-manager'}>Add Manager</Link>
                </div>
                {content}
            </div>
        </>
    );
};

export default Managers;

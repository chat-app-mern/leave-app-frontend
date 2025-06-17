import { useQuery } from '@tanstack/react-query';
import { backendUrl, getAllData } from '../../utils/api';
import Cookies from 'js-cookie';
import Loader from '../../components/Loader/Loader';
import Error from '../../components/Error/Error';
import Table from 'react-bootstrap/esm/Table';
import formatDate from '../../utils/formatDate';

const EmployeeLeaves = () => {
    let content;
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['leaves'],
        queryFn: () =>
            getAllData(`${backendUrl}/api/v1/admin/leaves`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${Cookies.get('token')}`,
                },
            }),
    });
    if (isLoading) {
        content = <Loader />;
    }
    if (data) {
        let leaves;
        const { data: leavesData } = data;
        if (leavesData.length) {
            leaves = leavesData.map((leave) => {
                return (
                    <tr key={leave._id}>
                        <td valign="middle">{leave.employee?.name || 'N/A'}</td>
                        <td valign="middle">{formatDate(leave.from)}</td>
                        <td valign="middle">{formatDate(leave.to)}</td>
                        <td valign="middle">{leave.reason}</td>
                        <td valign="middle">
                            <div
                                className={`leave-status ${
                                    leave.status === 'pending' && 'pending'
                                } ${leave.status === 'rejected' && 'rejected'} 
                                ${leave.status === 'approved' && 'approved'}`}
                            >
                                {leave.status}
                            </div>
                        </td>
                        <td valign="middle">{formatDate(leave.createdAt)}</td>
                    </tr>
                );
            });
            content = (
                <div className="users-wrapper">
                    <Table responsive>
                        <thead>
                            <tr>
                                <th>Employee's Name</th>
                                <th>From Date</th>
                                <th>To Date</th>
                                <th>Reason for Leave</th>
                                <th>Leave Status</th>
                                <th>Applied On</th>
                            </tr>
                        </thead>
                        <tbody>{leaves}</tbody>
                    </Table>
                </div>
            );
        } else {
            content = <p className="p text-center">No Leaves Available.</p>;
        }
    }
    if (isError) {
        content = <Error message={error.message} />;
    }
    return (
        <>
            <title>Admin - EmployeeLeaves</title>
            <div className="users-wrapper">
                <div className="d-flex align-items-center justify-content-between">
                    <h1 className="h1 pb-4 pb-md-5">Employee leaves</h1>
                </div>
                {content}
            </div>
        </>
    );
};
export default EmployeeLeaves;

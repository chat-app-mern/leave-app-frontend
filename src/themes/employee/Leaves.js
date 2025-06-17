import { useQuery } from '@tanstack/react-query';
import Table from 'react-bootstrap/esm/Table';
import { backendUrl, getAllData } from '../../utils/api';
import Loader from '../../components/Loader/Loader';
import Error from '../../components/Error/Error';
import Cookies from 'js-cookie';
import formatDate from '../../utils/formatDate';
import { Link } from 'react-router-dom';

export const Leaves = () => {
    let content;
    const { data, isError, error, isLoading } = useQuery({
        queryKey: ['leaves', `${Cookies.get('token')}`],
        queryFn: () =>
            getAllData(`${backendUrl}/api/v1/employee/leaves`, {
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
    if (isError) {
        content = <Error message={error.message} />;
    }
    if (data) {
        let leaves;
        const { data: leavesData } = data;
        if (leavesData.length) {
            leaves = leavesData.map((leave) => {
                return (
                    <tr key={leave._id}>
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
                    </tr>
                );
            });
            content = (
                <div className="users-wrapper">
                    <Table responsive>
                        <thead>
                            <tr>
                                <th>From</th>
                                <th>To</th>
                                <th>Reason</th>
                                <th>Status</th>
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
    return (
        <>
            <title>Employee - Leaves</title>
            <section className="user-section">
                <div className="container">
                    <div className="d-flex justify-content-between align-items-center pb-4">
                        <h1 className="h1">Leaves</h1>
                        <Link className="btn btn-primary" to={'/take-leave'}>
                            Take Leave
                        </Link>
                    </div>
                    {content}
                </div>
            </section>
        </>
    );
};
export default Leaves;

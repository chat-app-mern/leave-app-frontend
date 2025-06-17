import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { backendUrl, getAllData } from '../../utils/api';
import Cookies from 'js-cookie';
import Loader from '../../components/Loader/Loader';
import Error from '../../components/Error/Error';
import formatDate from '../../utils/formatDate';
import Table from 'react-bootstrap/esm/Table';

const TeamLeaves = () => {
    let content;
    const { data, isError, isLoading, error } = useQuery({
        queryKey: ['leaves', `${Cookies.get('token')}`],
        queryFn: () =>
            getAllData(`${backendUrl}/api/v1/manager/leaves`, {
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
                        <td valign="middle">{leave.employee.name}</td>
                        <td valign="middle">{formatDate(leave.from)}</td>
                        <td valign="middle">{formatDate(leave.to)}</td>
                        <td valign="middle">
                            <Link className='btn btn-primary' to={`${leave._id}`}>View Details</Link>
                        </td>
                    </tr>
                );
            });
            content = (
                <div className="users-wrapper">
                    <Table responsive>
                        <thead>
                            <tr>
                                <th>Employee's Name</th>
                                <th>From</th>
                                <th>To</th>
                                <th>View Details</th>
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
            <title>Manager - TeamLeaves</title>
            <section className="user-section">
                <div className="container">
                    <h1 className="h1 pb-4">Team Leaves</h1>
                    {content}
                </div>
            </section>
        </>
    );
};

export default TeamLeaves;

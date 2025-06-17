import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { backendUrl, getAllData } from '../../utils/api';
import Error from '../../components/Error/Error';
import Loader from '../../components/Loader/Loader';

const Employee = () => {
    const { isLoading, isError, data, error } = useQuery({
        queryKey: ['user', Cookies.get('token')],
        queryFn: () =>
            getAllData(`${backendUrl}/api/v1/user/details`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${Cookies.get('token')}`,
                },
            }),
    });
    let content;
    if (isLoading) {
        content = <Loader />;
    }
    if (data) {
        const { data: userData } = data;
        content = <h1 className="h1 name">Welcome {userData?.name}</h1>;
    }
    if (isError) {
        content = <Error message={error.message} />;
    }
    return (
        <>
            <title>Employee - Home</title>
            <section className="user-section">
                <div className="container">{content}</div>
            </section>
        </>
    );
};

export default Employee;

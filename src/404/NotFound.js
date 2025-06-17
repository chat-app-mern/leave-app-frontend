import Error from '../components/Error/Error';

const NotFound = () => {
    return (
        <section className="py-5">
            <div className="container my-5">
                <div className="my-5">
                    <Error message={'Page not found.'} />
                </div>
            </div>
        </section>
    );
};
export default NotFound;

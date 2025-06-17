const DashBoardCard = ({ title, count }) => {
    return (
        <div className="col-md-6 col-lg-3">
            <div className="dashboard-card-wrapper">
                <div className="dashboard-card">
                    <div className="title">{title}</div>
                    <div className="count">{count}</div>
                </div>
            </div>
        </div>
    );
};

export default DashBoardCard;

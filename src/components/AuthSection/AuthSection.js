import userMgmtImage from '../../images/user-mgmt-image.webp';
const AuthSection = ({ children, heading, subHeading }) => {
    return (
        <section className="auth-section">
            <div className="auth-image">
                <img
                    src={userMgmtImage}
                    alt={'chat-image'}
                    loading={'lazy'}
                    width={'1105'}
                    height={'1097'}
                />
            </div>
            <div className="auth-form">
                <h1 className="auth-form-heading">{heading}</h1>
                {subHeading && (
                    <h2 className="auth-sub-heading">{subHeading}</h2>
                )}
                {children}
            </div>
        </section>
    );
};

export default AuthSection;

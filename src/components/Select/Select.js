const Select = ({ children, ...props }) => {
    return (
        <select className="form-select form-control" {...props}>
            {children}
        </select>
    );
};
export default Select;

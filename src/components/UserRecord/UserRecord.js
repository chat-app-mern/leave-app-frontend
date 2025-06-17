import { Link } from 'react-router-dom';
import { backendUrl } from '../../utils/api';
import Avatar from '../Avatar/Avatar';

const UserRecord = ({ user, handleUserStatusUpdate, handleDeleteUser }) => {
    return (
        <tr>
            <td className="middle">
                <div className="text-center py-2">
                    <div className="user-image-wrapper">
                        {!user.avatar ? (
                            <div className="d-flex justify-content-center">
                                <Avatar name={`${user.name.charAt(0)}`} />
                            </div>
                        ) : (
                            <img
                                src={`${backendUrl}/uploads/users/${user.avatar}`}
                                alt="user-image"
                            />
                        )}
                    </div>
                </div>
            </td>
            <td valign="middle">
                {user.name.charAt(0).toUpperCase() + user.name.slice(1)}
            </td>
            <td valign="middle">{user.email}</td>
            <td valign="middle">{user.phone}</td>
            <td valign="middle">
                <div className="admin-actions">
                    <div>
                        <Link
                            to={`/admin/managers/${user._id}/edit`}
                            className="btn btn-success"
                        >
                            Edit
                        </Link>
                    </div>
                    <div>
                        <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="btn btn-danger"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </td>
        </tr>
    );
};
export default UserRecord;

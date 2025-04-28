import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { updateUserRole, deleteUser } from '../../services/authService';
import './CurrentUsers.css';

const CurrentUsers = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
            const userList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUsers(userList);
        });
    
        return () => unsubscribe();
    }, []);

    const handlePromoteToAdmin = async (userId, currentRole) => {
        if (!confirm('Are you sure you want to make this user an admin?')) {
            return;
        }

        try {
            setError('');
            setSuccessMessage('');
            const result = await updateUserRole(userId, currentRole === 'admin' ? 'user' : 'admin');
            
            if (result.success) {
                setSuccessMessage(`User role updated successfully!`);
                setTimeout(() => setSuccessMessage(''), 3000);
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError('Failed to update user role');
        }
    };

    const handleDeleteUser = async (userId, userName) => {
        if (!confirm(`Are you sure you want to delete user ${userName}? This action cannot be undone.`)) {
            return;
        }

        try {
            setError('');
            setSuccessMessage('');
            const result = await deleteUser(userId);
            
            if (result.success) {
                setSuccessMessage(`User deleted successfully!`);
                setTimeout(() => setSuccessMessage(''), 3000);
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError('Failed to delete user');
        }
    };
    
    return (
        <div className="current-users">
            <h2>Current Users</h2>
            {error && <div className="error-message">{error}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}
            <ul>
                {users.map(user => (
                    <li key={user.id}>
                        <div className="user-info">
                            <span>{user.firstName} {user.lastName}</span>
                        </div>
                        <div className="user-actions">
                            <button 
                                className={`role-toggle-btn ${user.role === 'admin' ? 'demote' : 'promote'}`}
                                onClick={() => handlePromoteToAdmin(user.id, user.role || 'user')}
                            >
                                {user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                            </button>
                            <button 
                                className="delete-btn"
                                onClick={() => handleDeleteUser(user.id, `${user.firstName} ${user.lastName}`)}
                            >
                                Delete User
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CurrentUsers;
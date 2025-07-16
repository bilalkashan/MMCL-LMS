import React from 'react';

const PasswordResetForm = ({ newPassword, confirmPassword, onChangeNewPassword, onChangeConfirmPassword, onSubmit }) => (
    <form onSubmit={onSubmit}>
        <div>
            <input
                onChange={onChangeNewPassword}
                type='password'
                name='newPassword'
                placeholder='Enter new password...'
                value={newPassword}
                
            />
        </div>
        <div>
            <input
                onChange={onChangeConfirmPassword}
                type='password'
                name='confirmPassword'
                placeholder='Confirm new password...'
                value={confirmPassword}
                
            />
        </div>
        <button type='submit'>Reset Password</button>
    </form>
);

export default PasswordResetForm;
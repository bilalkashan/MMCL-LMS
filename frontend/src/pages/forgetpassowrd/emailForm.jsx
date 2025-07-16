import React, { Component } from 'react';

class EmailForm extends Component {
    render() {
        const { email, onChangeEmail, onSubmitEmail } = this.props;

        return (
            <form onSubmit={onSubmitEmail}>
                <div>
                    <input
                        onChange={onChangeEmail}
                        type='email'
                        name='email'
                        autoFocus
                        placeholder='Enter your email...'
                        value={email}
                    />
                </div>
                <button type='submit'>Send OTP</button>
            </form>
        );
    }
}

export default EmailForm;
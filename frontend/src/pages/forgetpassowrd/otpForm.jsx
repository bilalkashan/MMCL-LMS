import React, { Component } from 'react';

class OtpForm extends Component {
    render() {
        const { otp, onChangeOtp, onSubmitOtp } = this.props;

        return (
            <form onSubmit={onSubmitOtp}>
                <div>
                    <input
                        onChange={onChangeOtp}
                        type='text'
                        name='otp'
                        placeholder='Enter your OTP...'
                        value={otp}
                    />
                </div>
                <button type='submit'>Verify OTP</button>
            </form>
        );
    }
}

export default OtpForm;
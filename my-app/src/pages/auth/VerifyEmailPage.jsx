import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export function VerifyEmailPage() {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Verify email</h1>
            <p className="mt-2 text-gray-700 dark:text-gray-300 text-sm">
                We just sent a message to <br />
                <span className="font-medium">hi@example.com</span>. Click the link in the email to activate your account
                and confirm it's you.
            </p>
            <form method="POST" className="mt-6" action="/signup">
                <div className="flex items-center justify-between mt-6">
                    <button type="submit" className="btn-primary dark:bg-blue-600 dark:hover:bg-blue-700">
                        Check your email
                    </button>
                </div>
                <div>
                    <p class="text-sm mt-6 text-gray-700 dark:text-gray-300"> Didn't get the activation email? Check spam.</p>
                    <p class="mt-2"><a href="/forgot-password" class="text-sm link-primary dark:text-blue-400 dark:hover:text-blue-300">Re-enter your email and try again</a></p>
                </div>
            </form>
        </>
    );
}
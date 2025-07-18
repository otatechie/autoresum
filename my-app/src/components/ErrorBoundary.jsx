import React from 'react';
import { toast } from '../utils/notifications';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // You can log the error to an error reporting service here
        this.setState({
            hasError: true,
            error: error,
            errorInfo: errorInfo
        });

        toast.error('Something went wrong. Our team has been notified.');

        // Reset error state after 5 seconds
        setTimeout(() => {
            this.setState({ hasError: false, error: null, errorInfo: null });
        }, 5000);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
                    <div className="max-w-lg w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Oops! Something went wrong
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            We've been notified and are working to fix the issue.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="btn-primary"
                        >
                            Refresh Page
                        </button>
                        {import.meta.env.MODE === 'development' && this.state.error && (
                            <div className="mt-6 text-left">
                                <p className="text-red-600 dark:text-red-400 font-mono text-sm whitespace-pre-wrap">
                                    {this.state.error.toString()}
                                </p>
                                <p className="text-gray-600 dark:text-gray-400 font-mono text-sm mt-2 whitespace-pre-wrap">
                                    {this.state.errorInfo?.componentStack}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary; 
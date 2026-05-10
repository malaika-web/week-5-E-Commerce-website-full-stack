import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="min-h-screen grid place-items-center px-6">
          <div className="card-surface max-w-xl text-center">
            <h1 className="text-3xl font-black text-slate-950">Something went wrong</h1>
            <p className="mt-3 text-slate-500">Refresh the page or go back to the shop. The app recovered safely.</p>
            <button className="btn-primary mt-6" type="button" onClick={() => window.location.assign('/home')}>
              Back to Home
            </button>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

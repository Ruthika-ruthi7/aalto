import React from 'react'

export default class ErrorBoundary extends React.Component<any, { error: Error | null }> {
  constructor(props:any) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  componentDidCatch(error: Error, info: any) {
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 20 }}>
          <h1>Application Error</h1>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{String(this.state.error && this.state.error.stack)}</pre>
        </div>
      )
    }

    return this.props.children
  }
}

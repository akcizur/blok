import { Component, type ErrorInfo, type ReactNode } from 'react'

type ErrorBoundaryProps = {
  children: ReactNode
}

type ErrorBoundaryState = {
  hasError: boolean
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Blok runtime error', error, info.componentStack)
  }

  private reload = () => {
    window.location.reload()
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <main className="runtime-error" role="alert">
        <div className="runtime-error-code">Runtime error</div>
        <h1>Blok se nepodařilo vykreslit.</h1>
        <p>Došlo k chybě v rozhraní. Obnov stránku a zkus to znovu.</p>
        <button type="button" onClick={this.reload}>Obnovit</button>
      </main>
    )
  }
}

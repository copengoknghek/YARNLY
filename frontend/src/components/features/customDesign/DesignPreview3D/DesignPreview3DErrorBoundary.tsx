import { Component, type ReactNode } from 'react'
import type { CustomDesign } from '@/types/customDesign'
import DesignIllustration from '../DesignPreview/DesignIllustration'

interface Props {
  design: CustomDesign
  children: ReactNode
}

interface State {
  hasError: boolean
}

class DesignPreview3DErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return <DesignIllustration design={this.props.design} />
    }

    return this.props.children
  }
}

export default DesignPreview3DErrorBoundary

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import LoadingScreen from '../../components/ui/LoadingScreen'

describe('LoadingScreen', () => {
  it('should render loading screen with progress', () => {
    render(<LoadingScreen progress={50} />)
    
    expect(screen.getByText('INITIALIZING CONTROL STATION')).toBeInTheDocument()
    expect(screen.getByText('50%')).toBeInTheDocument()
  })

  it('should show different messages based on progress', () => {
    const { rerender } = render(<LoadingScreen progress={10} />)
    expect(screen.getByText('Securing tactical connections...')).toBeInTheDocument()
    
    rerender(<LoadingScreen progress={50} />)
    expect(screen.getByText('Loading mission parameters...')).toBeInTheDocument()
    
    rerender(<LoadingScreen progress={90} />)
    expect(screen.getByText('Finalizing deployment...')).toBeInTheDocument()
  })

  it('should handle completion callback', () => {
    const onComplete = vi.fn()
    render(<LoadingScreen progress={100} onComplete={onComplete} />)
    
    // Should call onComplete when progress reaches 100%
    expect(onComplete).toHaveBeenCalled()
  })

  it('should display military-themed interface', () => {
    render(<LoadingScreen progress={25} />)
    
    // Check for military-themed elements
    expect(screen.getByText('CONTROL STATION OS')).toBeInTheDocument()
    expect(screen.getByText('TACTICAL INITIALIZATION')).toBeInTheDocument()
  })

  it('should show progress bar', () => {
    render(<LoadingScreen progress={75} />)
    
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toBeInTheDocument()
    expect(progressBar).toHaveAttribute('aria-valuenow', '75')
  })

  it('should handle edge cases', () => {
    // Test with 0 progress
    const { rerender } = render(<LoadingScreen progress={0} />)
    expect(screen.getByText('0%')).toBeInTheDocument()
    
    // Test with over 100 progress
    rerender(<LoadingScreen progress={150} />)
    expect(screen.getByText('100%')).toBeInTheDocument()
    
    // Test with negative progress
    rerender(<LoadingScreen progress={-10} />)
    expect(screen.getByText('0%')).toBeInTheDocument()
  })
})
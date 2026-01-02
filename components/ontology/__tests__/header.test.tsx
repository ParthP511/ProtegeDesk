import { render, screen } from '@testing-library/react'
import { OntologyHeader } from '../header'

// Mock dialog components to avoid testing their internal behavior.
// We only care that they render trigger buttons.
jest.mock('../new-entity-dialog', () => ({
  NewEntityDialog: () => <button>New Entity</button>,
}))

jest.mock('../reasoner-dialog', () => ({
  ReasonerDialog: () => <button>Reasoner</button>,
}))

jest.mock('../import-export-dialog', () => ({
  ImportExportDialog: () => <button>Import / Export</button>,
}))

describe('OntologyHeader', () => {
  it('renders the application title', () => {
    render(<OntologyHeader />)

    expect(screen.getByText('Protege')).toBeInTheDocument()
    expect(screen.getByText('TS')).toBeInTheDocument()
    expect(screen.getByText('Ontology Editor')).toBeInTheDocument()
  })

  it('renders all action buttons', () => {
    render(<OntologyHeader />)

    expect(screen.getByRole('button', { name: /new entity/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /reasoner/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /import \/ export/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
  })

  it('renders a semantic header element for accessibility', () => {
    render(<OntologyHeader />)

    expect(screen.getByRole('banner')).toBeInTheDocument()
  })

  it('does not crash when rendered (keyboard shortcut baseline)', () => {
    // This test intentionally does not simulate keyboard shortcuts
    // because OntologyHeader does not currently define any.
    // It acts as a guard against regressions when shortcuts are added later.
    expect(() => render(<OntologyHeader />)).not.toThrow()
  })
})

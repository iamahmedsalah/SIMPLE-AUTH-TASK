import { render, screen } from '@testing-library/react';
import { PasswordRequirements } from './password-requirements';

describe('PasswordRequirements', () => {
  it('shows all required password rules', () => {
    render(<PasswordRequirements value="Secure1!" />);
    expect(screen.getByText('At least 8 characters')).toHaveClass('text-primary');
    expect(screen.getByText('Contains a letter')).toHaveClass('text-primary');
    expect(screen.getByText('Contains a number')).toHaveClass('text-primary');
    expect(screen.getByText('Contains a special character')).toHaveClass('text-primary');
  });
});

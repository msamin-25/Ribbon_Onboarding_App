# Implementation Notes - Ribbon Onboarding Form

## Component Structure
The application is structured into a main `OnboardingForm` container that manages the overall flow and state. Each step is broken down into its own functional component to maintain a clean separation of concerns:
- `StepIndicator`: Visual progress tracker.
- `BusinessInfoStep`: Handles data entry for business and owner details.
- `PaymentStep`: Manages the simulated payment confirmation.
- `ReviewStep`: Aggregates all data for final user verification.
- `SuccessStep`: Final confirmation screen.

## State Management
I used React's `useState` to manage the form state centrally in the `App` component. This includes:
- `formData`: An object containing all the business and owner information.
- `currentStep`: An integer tracking the user's progress.
- `isPaymentComplete`: A boolean to track the simulated payment status independently.
- `rejectionError`: A state to track if the "government" has rejected the submission (simulated).

## Rejection Flow
The rejection scenario is triggered upon the first submission from the Review step. 
- When the user clicks "Submit" for the first time, a simulated API call "fails" with a business name conflict.
- The UI displays a clear error message and provides a "Fix Business Name" action.
- This action takes the user back to Step 1 but keeps all other data (including payment status) intact.
- Subsequent submissions (after the user has had a chance to "fix" it) are successful.

## User vs. Internal Data
- **User-facing:** Business name, owner details, address, and payment status are all shown for verification.
- **Internal:** I track `hasAttemptedSubmit` to simulate the one-time rejection logic required by the assignment.

## Future Improvements
- **Persistent State:** Use `localStorage` or a backend to save progress so users can return later.
- **Advanced Validation:** Add real-time email format validation and address autocomplete (e.g., Google Maps API).
- **Accessibility:** Ensure all form fields have proper ARIA labels and keyboard navigation is seamless.
- **Unit Testing:** Add tests for the validation logic and step transition rules.
- **Real Business Name Conflict Detection:** Integrate with an actual business registry API (e.g., a government or provincial database) to check name availability in real time as the user types, rather than simulating a rejection on submit. This would surface conflicts early and could suggest alternative names based on real registered business data.

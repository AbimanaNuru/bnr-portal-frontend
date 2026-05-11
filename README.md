# BNR Licensing & Compliance Portal

A robust, enterprise-grade regulatory platform designed for the Bank of National Reserve (BNR). This portal streamlines the licensing process for financial institutions, ensuring rigorous compliance and transparent auditability.

## Key Features

- **Secure Authentication**: Multi-factor authentication (MFA) and OTP-based verification for enhanced security.
- **Role-Based Access Control (RBAC)**: Granular permissions management ensuring users only access authorized data and workflows.
- **Application Lifecycle Management**: End-to-end tracking of license applications, from draft to final approval.
- **Document Management**: Centralized repository for regulatory documents with versioning and size validation.
- **Workflow Automation**: Multi-stage approval processes with real-time status tracking.
- **Comprehensive Auditing**: Detailed logs of all system activities for regulatory compliance and transparency.
- **Premium UI/UX**: Modern, responsive dashboard built with a custom design system for institutional excellence.

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **State Management**: Zustand, TanStack Query
- **Form Handling**: React Hook Form, Zod
- **Icons**: Lucide React
- **Styling**: Vanilla CSS with Tailwind CSS utilities

## Getting Started

### Development Credentials

For testing and review purposes, you can use the following pre-seeded accounts:

| Email | Password | Role |
| :--- | :--- | :--- |
| `applicant@bnr-dev.rw` | `applicant123` | APPLICANT |
| `reviewer@bnr-dev.rw` | `reviewer123` | REVIEWER |
| `approver@bnr-dev.rw` | `approver123` | APPROVER |
| `admin@bnr-dev.rw` | `admin123` | ADMIN |

### Prerequisites

- Node.js 18.x or higher
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/AbimanaNuru/bnr-portal-frontend.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file in the root directory and add the necessary configuration (see `.env.example`).

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

## Architecture

The project follows a feature-based modular architecture:

- `src/app`: Next.js App Router pages and layouts.
- `src/features`: Business logic, components, and API integration grouped by domain (e.g., auth, applications, documents).
- `src/shared`: Reusable components, hooks, and utilities used across multiple features.
- `src/design-system`: Core UI components and theme tokens.
- `src/core`: Global configuration, API clients, and foundational types.

## Compliance & Security

This portal is built with a "security-first" mindset, implementing:
- JWT-based session management with secure storage.
- Strict input validation using Zod schemas.
- Content Security Policy (CSP) and other security headers.
- Full audit traceability for all sensitive operations.

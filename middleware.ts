import { withAuth } from 'next-auth/middleware';

export default withAuth({
  pages: { signIn: '/login' },
});

export const config = {
  matcher: ['/dashboard/:path*', '/api/tasks/:path*', '/api/expenses/:path*', '/api/revenues/:path*', '/api/bills/:path*', '/api/goals/:path*', '/api/projects/:path*', '/api/assets/:path*', '/api/investments/:path*', '/api/credit-cards/:path*', '/api/reserve-funds/:path*', '/api/companies/:path*', '/api/company-steps/:path*', '/api/protocols/:path*', '/api/protocol-steps/:path*', '/api/donations/:path*', '/api/lifestyle/:path*', '/api/health-routines/:path*', '/api/astral-profiles/:path*', '/api/astral-notes/:path*', '/api/cup/:path*', '/api/vulnerabilities/:path*', '/api/integrations/:path*', '/api/upload/:path*'],
};

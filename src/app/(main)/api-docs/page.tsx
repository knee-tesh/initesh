'use client';

import { useState, useEffect } from 'react';
import TerminalWindow from "@/components/shared/terminal-window";
import AdminLogin from '@/components/admin/admin-login';

type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

type Param = {
  name: string;
  type: string;
  required: boolean;
  description: string;
};

type Endpoint = {
  method: HttpMethod;
  path: string;
  description: string;
  auth: boolean;
  body?: Param[];
  query?: Param[];
  response: string;
  rateLimit?: string;
};

const METHOD_COLORS: Record<HttpMethod, string> = {
  GET: "text-emerald-400",
  POST: "text-amber-400",
  PATCH: "text-sky-400",
  DELETE: "text-red-400",
};

const PUBLIC_ENDPOINTS: Endpoint[] = [
  {
    method: "POST",
    path: "/api/track",
    description: "Track page view",
    auth: false,
    body: [
      { name: "page", type: "string", required: true, description: "Page path (/skills, /services, /about, /contact)" },
      { name: "referrer", type: "string", required: false, description: "Referrer URL" },
      { name: "userAgent", type: "string", required: false, description: "Browser user agent" },
      { name: "sessionId", type: "string", required: false, description: "Session identifier" },
      { name: "visitDuration", type: "number", required: false, description: "Time spent on page (ms)" },
      { name: "scrollDepth", type: "number", required: false, description: "Max scroll depth (0-100)" },
    ],
    response: "204 No Content",
  },
  {
    method: "POST",
    path: "/api/queries",
    description: "Submit a contact query",
    auth: false,
    body: [
      { name: "name", type: "string", required: true, description: "2-100 characters" },
      { name: "email", type: "string", required: true, description: "Valid email address" },
      { name: "message", type: "string", required: true, description: "10-1000 characters" },
    ],
    response: "{ success: true }",
    rateLimit: "3 requests per hour per IP",
  },
  {
    method: "GET",
    path: "/api/presence",
    description: "Get active visitors",
    auth: false,
    response: "{ count: number, visitors: [{ id, page, lastSeen }] }",
  },
  {
    method: "POST",
    path: "/api/presence",
    description: "Register visitor presence (heartbeat)",
    auth: false,
    body: [
      { name: "visitorId", type: "string", required: true, description: "Unique visitor ID" },
      { name: "page", type: "string", required: true, description: "Current page path" },
    ],
    response: "{ success: true }",
  },
  {
    method: "DELETE",
    path: "/api/presence",
    description: "Remove visitor from active presence",
    auth: false,
    body: [
      { name: "visitorId", type: "string", required: true, description: "Visitor ID to remove" },
    ],
    response: "{ success: true }",
  },
  {
    method: "POST",
    path: "/api/chat",
    description: "AI chat powered by Sarvam",
    auth: false,
    body: [
      { name: "messages", type: "Message[]", required: true, description: "Array of { role, content } messages" },
    ],
    response: "{ reply: string }",
  },
];

const ADMIN_ENDPOINTS: Endpoint[] = [
  {
    method: "POST",
    path: "/api/admin/auth",
    description: "Admin login",
    auth: false,
    body: [
      { name: "password", type: "string", required: true, description: "Admin password" },
    ],
    response: "{ success: true }",
  },
  {
    method: "GET",
    path: "/api/admin/stats",
    description: "Visitor statistics",
    auth: true,
    response: "{ totalVisitors, uniqueVisitors, pageViews, ... }",
  },
  {
    method: "GET",
    path: "/api/admin/analytics",
    description: "Advanced analytics data",
    auth: true,
    response: "{ traffic, devices, referrers, ... }",
  },
  {
    method: "GET",
    path: "/api/admin/visitors",
    description: "Recent visitors list",
    auth: true,
    query: [
      { name: "limit", type: "number", required: false, description: "Max results (default: 20)" },
    ],
    response: "Visitor[]",
  },
  {
    method: "GET",
    path: "/api/admin/queries",
    description: "All submitted queries",
    auth: true,
    response: "Query[]",
  },
  {
    method: "PATCH",
    path: "/api/admin/queries/[id]",
    description: "Update query status",
    auth: true,
    body: [
      { name: "status", type: "string", required: true, description: "'new' | 'read' | 'replied'" },
    ],
    response: "{ success: true }",
  },
  {
    method: "POST",
    path: "/api/admin/export",
    description: "Export all data",
    auth: true,
    response: "{ visitors, queries, ... }",
  },
];

function EndpointCard({ endpoint }: { endpoint: Endpoint }) {
  return (
    <div className="border border-border rounded-md p-4 space-y-3">
      <div className="flex items-center gap-3 flex-wrap">
        <span className={`font-bold font-[family-name:var(--font-mono)] text-xs ${METHOD_COLORS[endpoint.method]}`}>
          {endpoint.method}
        </span>
        <code className="text-sm text-text font-[family-name:var(--font-mono)]">
          {endpoint.path}
        </code>
        {endpoint.auth && (
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-400 font-[family-name:var(--font-mono)]">
            AUTH
          </span>
        )}
      </div>
      <p className="text-sm text-muted">{endpoint.description}</p>

      {endpoint.body && endpoint.body.length > 0 && (
        <div>
          <h4 className="text-xs font-bold text-text mb-2 font-[family-name:var(--font-mono)]">Request Body</h4>
          <div className="space-y-1">
            {endpoint.body.map((param) => (
              <div key={param.name} className="flex gap-2 text-xs font-[family-name:var(--font-mono)]">
                <span className="text-sky-400">{param.name}</span>
                <span className="text-muted">{param.type}</span>
                {param.required && <span className="text-red-400">*</span>}
                <span className="text-muted/60 hidden sm:inline">— {param.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {endpoint.query && endpoint.query.length > 0 && (
        <div>
          <h4 className="text-xs font-bold text-text mb-2 font-[family-name:var(--font-mono)]">Query Parameters</h4>
          <div className="space-y-1">
            {endpoint.query.map((param) => (
              <div key={param.name} className="flex gap-2 text-xs font-[family-name:var(--font-mono)]">
                <span className="text-sky-400">{param.name}</span>
                <span className="text-muted">{param.type}</span>
                {param.required && <span className="text-red-400">*</span>}
                <span className="text-muted/60 hidden sm:inline">— {param.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h4 className="text-xs font-bold text-text mb-1 font-[family-name:var(--font-mono)]">Response</h4>
        <code className="text-xs text-muted font-[family-name:var(--font-mono)]">{endpoint.response}</code>
      </div>

      {endpoint.rateLimit && (
        <p className="text-xs text-amber-400/80 font-[family-name:var(--font-mono)]">Rate limit: {endpoint.rateLimit}</p>
      )}
    </div>
  );
}

export default function ApiDocsPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((res) => {
        setAuthenticated(res.ok);
        setChecking(false);
      })
      .catch(() => setChecking(false));
  }, []);

  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-sm" style={{ color: 'var(--muted)' }}>Verifying access...</p>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <AdminLogin onLogin={() => setAuthenticated(true)} />
      </div>
    );
  }

  return (
    <div className="max-w-[640px]">
      <h1 className="text-2xl md:text-3xl font-bold text-text mb-2 font-[family-name:var(--font-display)]">
        API Documentation
      </h1>
      <p className="text-sm text-muted mb-8 font-[family-name:var(--font-mono)]">
        All available REST endpoints for this portfolio site.
      </p>

      <div className="space-y-10">
        <section>
          <TerminalWindow title="api docs --public">
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-text font-[family-name:var(--font-mono)]">
                <span className="text-emerald-400">$</span> Public Endpoints
              </h2>
              <p className="text-xs text-muted font-[family-name:var(--font-mono)]">
                No authentication required. Rate limits may apply.
              </p>
              <div className="space-y-4">
                {PUBLIC_ENDPOINTS.map((endpoint) => (
                  <EndpointCard key={`${endpoint.method}-${endpoint.path}`} endpoint={endpoint} />
                ))}
              </div>
            </div>
          </TerminalWindow>
        </section>

        <section>
          <TerminalWindow title="api docs --admin">
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-text font-[family-name:var(--font-mono)]">
                <span className="text-amber-400">$</span> Admin Endpoints
              </h2>
              <p className="text-xs text-muted font-[family-name:var(--font-mono)]">
                Requires valid session cookie. Login via /api/admin/auth first.
              </p>
              <div className="space-y-4">
                {ADMIN_ENDPOINTS.map((endpoint) => (
                  <EndpointCard key={`${endpoint.method}-${endpoint.path}`} endpoint={endpoint} />
                ))}
              </div>
            </div>
          </TerminalWindow>
        </section>
      </div>
    </div>
  );
}

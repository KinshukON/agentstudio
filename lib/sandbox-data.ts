// Simulated data for sandbox tools

export const sandboxWebSearchData: Record<string, any[]> = {
  'customer retention strategies': [
    {
      title: 'Top 10 Customer Retention Strategies for 2024',
      snippet: 'Implement loyalty programs, personalized communication, and proactive support to retain customers...',
      url: 'https://example.com/retention-strategies',
    },
    {
      title: 'The Complete Guide to Customer Success',
      snippet: 'Customer success teams can reduce churn by 15-25% through regular check-ins and value delivery...',
      url: 'https://example.com/customer-success',
    },
  ],
  'product pricing models': [
    {
      title: 'SaaS Pricing Models Explained',
      snippet: 'Explore flat-rate, usage-based, tiered, and per-user pricing strategies...',
      url: 'https://example.com/pricing-models',
    },
  ],
  'ai agent frameworks': [
    {
      title: 'Building Production AI Agents',
      snippet: 'Learn about ReAct, Plan-and-Execute, and multi-agent orchestration patterns...',
      url: 'https://example.com/ai-agents',
    },
  ],
  default: [
    {
      title: 'Search Results',
      snippet: 'Information about your search query...',
      url: 'https://example.com/search',
    },
  ],
};

export const sandboxCRMData = [
  {
    id: 'CUST-001',
    name: 'Acme Corp',
    tier: 'Enterprise',
    mrr: 5000,
    status: 'active',
    healthScore: 85,
    renewalDate: '2024-06-15',
    contactEmail: 'john@acme.com',
  },
  {
    id: 'CUST-002',
    name: 'TechStart Inc',
    tier: 'Pro',
    mrr: 500,
    status: 'at-risk',
    healthScore: 45,
    renewalDate: '2024-03-20',
    contactEmail: 'sarah@techstart.com',
  },
  {
    id: 'CUST-003',
    name: 'Global Systems',
    tier: 'Enterprise',
    mrr: 8000,
    status: 'active',
    healthScore: 92,
    renewalDate: '2024-09-01',
    contactEmail: 'mike@globalsystems.com',
  },
];

export const sandboxTicketData = [
  {
    id: 'TICK-101',
    customerId: 'CUST-002',
    subject: 'Feature request: Dark mode',
    status: 'open',
    priority: 'medium',
    created: '2024-01-15T10:30:00Z',
    description: 'Users are requesting a dark mode option for better accessibility.',
  },
  {
    id: 'TICK-102',
    customerId: 'CUST-002',
    subject: 'Login issues on mobile app',
    status: 'in-progress',
    priority: 'high',
    created: '2024-01-18T14:20:00Z',
    description: 'Multiple users reporting authentication failures on iOS app.',
  },
  {
    id: 'TICK-103',
    customerId: 'CUST-001',
    subject: 'API rate limit increase',
    status: 'resolved',
    priority: 'low',
    created: '2024-01-10T09:00:00Z',
    description: 'Customer needs higher API limits for integration.',
  },
];

export function simWebSearch(query: string): any[] {
  const lowerQuery = query.toLowerCase();
  for (const [key, results] of Object.entries(sandboxWebSearchData)) {
    if (lowerQuery.includes(key)) {
      return results;
    }
  }
  return sandboxWebSearchData.default;
}

export function simCRMQuery(filters?: Record<string, any>): any[] {
  let results = [...sandboxCRMData];
  
  if (filters) {
    if (filters.status) {
      results = results.filter(c => c.status === filters.status);
    }
    if (filters.tier) {
      results = results.filter(c => c.tier === filters.tier);
    }
    if (filters.minHealthScore) {
      results = results.filter(c => c.healthScore >= filters.minHealthScore);
    }
  }
  
  return results;
}

export function simTicketQuery(filters?: Record<string, any>): any[] {
  let results = [...sandboxTicketData];
  
  if (filters) {
    if (filters.customerId) {
      results = results.filter(t => t.customerId === filters.customerId);
    }
    if (filters.status) {
      results = results.filter(t => t.status === filters.status);
    }
    if (filters.priority) {
      results = results.filter(t => t.priority === filters.priority);
    }
  }
  
  return results;
}


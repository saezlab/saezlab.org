export interface TeamMemberProps {
    name: string
    role: string
    image: string
    bio: string
    email?: string
    telephone?: string
    orcid?: string
    github_url?: string
    research_interests?: string
    professional_career?: Array<{
      period: string
      position: string
    }>
    education?: Array<{
      period: string
      degree: string
    }>
  }

export interface SoftwareCardProps {
    name: string;
    short_description: string;
    long_description: string;
    code_repository: string;
    website: string;
    publication: string;
    image: string;
    categories: {
      featured: boolean;
      tool: boolean;
      database: boolean;
    };
  }

export interface Software {
    name: string;
    short_description: string;
    long_description: string;
    code_repository: string;
    website: string;
    publication: string;
    image: string;
    categories: {
      featured: boolean;
      tool: boolean;
      database: boolean;
    };
  }

export interface Publication {
    title: string;
    authors: string;
    journal: string;
    volume?: string;
    issue?: string;
    pages?: string;
    date: string;
    year: number;
    isOpenAccess?: boolean;
    isPreprint?: boolean;
    isReview?: boolean;
    doi?: string;
    pmid?: string;
    pmcid?: string;
    europePmc?: string;
  }
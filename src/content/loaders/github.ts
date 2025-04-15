import type { Loader, LoaderContext } from 'astro/loaders';
import { z } from 'astro:content';

interface GitHubMember {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
  name: string | null;
  company: string | null;
  blog: string;
  location: string | null;
  email: string | null;
  hireable: boolean | null;
  bio: string | null;
  twitter_username: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export function githubLoader(options: { 
  org: string;
  teams: string[];
  token: string;
}): Loader {
  return {
    name: 'github-loader',
    schema: z.object({
      teams: z.array(z.object({
        name: z.string(),
        slug: z.string(),
        members: z.array(z.object({
          login: z.string(),
          name: z.string().nullable(),
          avatar_url: z.string(),
          bio: z.string().nullable(),
          email: z.string().nullable(),
          location: z.string().nullable(),
          html_url: z.string(),
        }))
      }))
    }),
    load: async ({ store, logger }: LoaderContext) => {
      logger.info('GitHub Loader starting');
      const { org, teams, token } = options;
      const BASE_URL = 'https://api.github.com';
      const allTeams = [];

      logger.info(`Fetching teams for organization: ${org}`);

      for (const teamSlug of teams) {
        try {
          // Get team members
          const membersUrl = `${BASE_URL}/orgs/${org}/teams/${teamSlug}/members`;
          const membersResponse = await fetch(membersUrl, {
            headers: {
              'Accept': 'application/vnd.github+json',
              'Authorization': `Bearer ${token}`,
              'X-GitHub-Api-Version': '2022-11-28'
            }
          });

          if (!membersResponse.ok) {
            throw new Error(`HTTP error! status: ${membersResponse.status}`);
          }

          const members: GitHubMember[] = await membersResponse.json();
          logger.debug(`Fetched ${members.length} members for team ${teamSlug}`);

          // Get detailed member information
          const detailedMembers = await Promise.all(
            members.map(async (member) => {
              const userResponse = await fetch(member.url, {
                headers: {
                  'Accept': 'application/vnd.github+json',
                  'Authorization': `Bearer ${token}`,
                  'X-GitHub-Api-Version': '2022-11-28'
                }
              });

              if (!userResponse.ok) {
                throw new Error(`HTTP error! status: ${userResponse.status}`);
              }

              const userDetails: GitHubMember = await userResponse.json();
              return {
                login: userDetails.login,
                name: userDetails.name,
                avatar_url: userDetails.avatar_url,
                bio: userDetails.bio,
                email: userDetails.email,
                location: userDetails.location,
                html_url: userDetails.html_url
              };
            })
          );

          allTeams.push({
            name: teamSlug,
            slug: teamSlug,
            members: detailedMembers
          });

        } catch (error) {
          logger.error(`Error fetching team ${teamSlug}: ${error}`);
        }
      }

      logger.info(`Total teams processed: ${allTeams.length}`);

      store.set({
        id: 'teams_loaded',
        data: {
          teams: allTeams
        },
        body: '',
      });

      logger.info('Finished loading teams from GitHub');
    },
  };
} 
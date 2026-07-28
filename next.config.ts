import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  async redirects() {
    return [
      {
        source: '/bourses/chinese-government-auc-scholarship-2017-2018-for-young-africans-to-study-in-china-fully-funded',
        destination: '/bourses',
        permanent: true,
      },
      {
        source: '/bourses/australia-awards-scholarships',
        destination: '/bourses',
        permanent: true,
      },
      {
        source: '/bourses/phd-graduate-teaching-assistantship-positions-at-the-university-of-eldoret-kenya',
        destination: '/bourses',
        permanent: true,
      },
      {
        source: '/bourses/featured-grant-guidelines-together-women-rise',
        destination: '/bourses',
        permanent: true,
      },
      {
        source: '/bourses/the-business-school-data-analytics-online-scholarship',
        destination: '/bourses',
        permanent: true,
      },
      {
        source: '/bourses/australian-government-research-training-program-rtp-scholarships',
        destination: '/bourses',
        permanent: true,
      },
      {
        source: '/bourses/udacity-google-africa-scholarship-program-2018',
        destination: '/bourses',
        permanent: true,
      },
      {
        source: '/bourses/daad-in-region-scholarship-programme-call-for-scholarship-applications-2021-at-the-stellenbosch-univ',
        destination: '/bourses',
        permanent: true,
      },
      {
        source: '/bourses/australian-government-research-training-program-scholarship-international',
        destination: '/bourses',
        permanent: true,
      },
      {
        source: '/bourses/enhanced-regional-scholarship-for-africa',
        destination: '/bourses',
        permanent: true,
      },
      {
        source: '/bourses/bourse-hubert-humphrey-togo-2027',
        destination: '/bourses',
        permanent: true,
      },
      {
        source: '/bourses/rosa-luxemburg-foundation-scholarship-programme-for-international-doctoral-students',
        destination: '/bourses',
        permanent: true,
      },
      {
        source: '/bourses/phd-and-research-degree-scholarships-at-griffith-university',
        destination: '/bourses',
        permanent: true,
      },
      {
        source: '/bourses/rhodes-scholarship',
        destination: '/bourses',
        permanent: true,
      },
      {
        source: '/bourses/valar-scholarship-program',
        destination: '/bourses',
        permanent: true,
      },
      {
        source: '/bourses/climate-finance-expert-home-based-retainer-bishkek-kyrgyzstan',
        destination: '/bourses',
        permanent: true,
      },
      {
        source: '/bourses/hubert-h-humphrey-fellowship-program-2027-2028',
        destination: '/bourses',
        permanent: true,
      },
      {
        source: '/bourses/phd-scholarship-rtp-and-duprs',
        destination: '/bourses',
        permanent: true,
      },
      {
        source: '/bourses/sciences-po-emile-boutmy-undergraduate-postgraduate-scholarship-2018-2019-for-study-in-france',
        destination: '/bourses',
        permanent: true,
      },
      {
        source: '/bourses/study-scholarships-for-stem-disciplines',
        destination: '/bourses',
        permanent: true,
      },
      {
        source: '/bourses/coca-cola-mena-scholarship-program-2014-to-study-in-usa',
        destination: '/bourses',
        permanent: true,
      },
      {
        source: '/bourses/hubert-humphrey-fellowship-program',
        destination: '/bourses',
        permanent: true,
      },
      {
        source: '/bourses/research-degree-scholarships',
        destination: '/bourses',
        permanent: true,
      },
      {
        source: '/bourses/pays/afrique-subsaharienne-a-l-exclusion-de-l-afrique-du-sud',
        destination: '/bourses',
        permanent: true,
      },
      {
        source: '/bourses/niveau/diplome-de-recherche',
        destination: '/bourses',
        permanent: true,
      },
      {
        source: '/connexion',
        destination: '/',
        permanent: true,
      }
    ];
  }
};

export default nextConfig;

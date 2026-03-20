/**
 * Demo company profiles across different industries RecoverKit targets.
 * Each has unique branding, emails, campaigns, and customer messaging.
 */

export interface DemoCompany {
  id: string;
  name: string;
  industry: string;
  icon: string;
  domain: string;
  tagline: string;
  billingEmail: string;
  brandColor: string;
  founderName: string;
  founderEmail: string;
  mrr: number;
  plans: { name: string; price: number }[];
  lostPerMonth: number;
  discoveryProblem: string;
  discoveryFind: string;
  productNoun: string; // what customers lose access to
  emails: DemoEmail[];
  campaigns: DemoCampaign[];
  stats: DemoStats;
  paymentPageMessage: string;
}

export interface DemoEmail {
  step: number;
  delayHours: number;
  subject: string;
  body: string;
}

export interface DemoCampaign {
  name: string;
  email: string;
  amount: number;
  status: "active" | "recovered" | "failed";
}

export interface DemoStats {
  recovered: number;
  rate: number;
  active: number;
  emailsSent: number;
}

export const DEMO_COMPANIES: DemoCompany[] = [
  // ─── 1. SaaS / Developer Tools ───
  {
    id: "saas",
    name: "CloudPulse",
    industry: "SaaS / Developer Tools",
    icon: "📡",
    domain: "cloudpulse.io",
    tagline: "Infrastructure monitoring for growing teams",
    billingEmail: "billing@cloudpulse.io",
    brandColor: "#0ea5e9",
    founderName: "Sarah Chen",
    founderEmail: "sarah@cloudpulse.io",
    mrr: 38000,
    plans: [
      { name: "Starter", price: 49 },
      { name: "Team", price: 99 },
      { name: "Business", price: 249 },
    ],
    lostPerMonth: 2700,
    discoveryProblem:
      "Sarah notices she's losing about $2,700/mo to failed payments. Cards expire, banks flag charges, customers don't even know their payment failed. Stripe's built-in retry recovers some, but she's still losing 7% of her MRR every month.",
    discoveryFind:
      'Sarah searches for "Churnkey alternatives" and finds RecoverKit. At $79 AUD/mo (~$56 USD) for the Growth plan, it\'s a fraction of what Churnkey charges ($250+ USD/mo). She signs up in 2 minutes.',
    productNoun: "monitoring dashboards, alerts, and incident history",
    emails: [
      {
        step: 1, delayHours: 4,
        subject: "Quick heads up about your CloudPulse payment",
        body: "Hi there,\n\nWe just tried to process your CloudPulse subscription payment, but it didn't go through. This usually happens when a card expires or your bank flags an unusual charge.\n\nThe good news: it takes less than a minute to fix. Just click the button below to update your payment details and you'll be all set.\n\nYour monitoring dashboards and alerts are still active, so nothing to worry about right now.",
      },
      {
        step: 2, delayHours: 24,
        subject: "Your CloudPulse payment still needs attention",
        body: "Hi there,\n\nJust following up on your CloudPulse payment. We tried again but it was still declined.\n\nWe know how important uptime monitoring is for your team, and we'd hate for a billing issue to interrupt your service. Updating your card takes about 30 seconds.\n\nIf you're having trouble or have questions about your account, just reply to this email and we'll help sort it out.",
      },
      {
        step: 3, delayHours: 72,
        subject: "Action needed: update your payment for CloudPulse",
        body: "Hi there,\n\nWe've attempted to process your CloudPulse subscription payment several times now, but it keeps being declined by your bank.\n\nYour account is still active, but we will need a valid payment method on file to keep your monitoring running. Without it, your dashboards, alerts, and incident history could be interrupted.\n\nPlease take a moment to update your payment details. It only takes a few seconds and ensures your team stays covered.",
      },
      {
        step: 4, delayHours: 120,
        subject: "Your CloudPulse subscription is at risk",
        body: "Hi there,\n\nThis is an urgent reminder about your CloudPulse payment. We've tried multiple times to charge your card, but each attempt has been declined.\n\nIf we don't receive payment within the next few days, your CloudPulse subscription will be cancelled and your team will lose access to monitoring dashboards, alerting, and all historical data.\n\nPlease update your payment method now to avoid any disruption to your service.",
      },
      {
        step: 5, delayHours: 240,
        subject: "Final notice: your CloudPulse account will be cancelled",
        body: "Hi there,\n\nThis is our final notice regarding your CloudPulse subscription. Your payment has been declined repeatedly and we've been unable to reach you.\n\nYour account will be cancelled within 48 hours. Once cancelled, your team will immediately lose access to all monitoring dashboards, alert configurations, and incident history.\n\nIf you'd like to keep your CloudPulse account, please update your payment details now. This is the last email we'll send about this.",
      },
    ],
    campaigns: [
      { name: "James Rivera", email: "james@northstarops.com", amount: 99, status: "active" },
      { name: "Priya Sharma", email: "finance@stackbuild.dev", amount: 249, status: "recovered" },
      { name: "Matt O'Brien", email: "matt@sideproject.co", amount: 49, status: "active" },
      { name: "Rachel Kim", email: "accounting@fintechplus.com.au", amount: 99, status: "recovered" },
    ],
    stats: { recovered: 4671, rate: 66, active: 8, emailsSent: 112 },
    paymentPageMessage: "Your recent CloudPulse payment didn't go through. Please update your card details below to keep your monitoring active. It only takes a moment.",
  },

  // ─── 2. Online Education / Course Platform ───
  {
    id: "education",
    name: "SkillForge",
    industry: "Online Education",
    icon: "🎓",
    domain: "skillforge.com",
    tagline: "Live cohort courses for professionals",
    billingEmail: "billing@skillforge.com",
    brandColor: "#8b5cf6",
    founderName: "Marcus Webb",
    founderEmail: "marcus@skillforge.com",
    mrr: 52000,
    plans: [
      { name: "Learner", price: 29 },
      { name: "Professional", price: 79 },
      { name: "Team", price: 199 },
    ],
    lostPerMonth: 4200,
    discoveryProblem:
      "Marcus notices that students keep getting dropped mid-course because their payment fails and they never realize it. He's losing $4,200/mo in recurring revenue, and worse, students lose progress and access to live cohorts they're enrolled in.",
    discoveryFind:
      'Marcus finds RecoverKit while searching for "dunning email tools for subscription businesses." At $29 AUD/mo to start, it costs less than a single recovered student subscription. He starts the $5 trial first.',
    productNoun: "course materials, live cohort access, and learning progress",
    emails: [
      {
        step: 1, delayHours: 4,
        subject: "Heads up: your SkillForge payment needs attention",
        body: "Hi there,\n\nWe just tried to process your SkillForge subscription payment, but it didn't go through. Don't worry, this is usually a quick fix like an expired card or a temporary bank hold.\n\nYour courses and progress are safe. Just update your payment method and you'll be right back on track.\n\nWe'd hate for a billing issue to interrupt your learning.",
      },
      {
        step: 2, delayHours: 24,
        subject: "Your SkillForge access needs a payment update",
        body: "Hi there,\n\nJust a friendly follow up. Your recent SkillForge payment is still outstanding. We tried charging your card again but it was declined.\n\nYour enrolled courses, assignments, and progress are all still saved. Updating your card takes less than a minute and keeps everything running smoothly.\n\nIf something has changed or you need help, just reply to this email.",
      },
      {
        step: 3, delayHours: 72,
        subject: "Action needed: keep your SkillForge courses active",
        body: "Hi there,\n\nWe've made several attempts to process your SkillForge payment, but your card keeps being declined.\n\nYour account is still active for now, but without a valid payment method, you may lose access to your enrolled courses, live cohort sessions, and all your learning progress.\n\nPlease update your payment details to continue learning without interruption.",
      },
      {
        step: 4, delayHours: 120,
        subject: "Your SkillForge enrollment is at risk",
        body: "Hi there,\n\nThis is an urgent notice about your SkillForge payment. We've been unable to charge your card after multiple attempts.\n\nWithout payment, your subscription will be cancelled soon. That means losing access to your current courses, upcoming live sessions, certificates in progress, and all saved materials.\n\nPlease update your payment method now to protect your learning journey.",
      },
      {
        step: 5, delayHours: 240,
        subject: "Final notice: your SkillForge account will be cancelled",
        body: "Hi there,\n\nThis is our final notice about your SkillForge subscription. Your payment has failed repeatedly and your account will be cancelled within 48 hours.\n\nOnce cancelled, you will lose access to all enrolled courses, live cohort sessions, certificates, and learning progress. Re-enrollment in active cohorts may not be possible.\n\nPlease update your payment details now if you'd like to continue.",
      },
    ],
    campaigns: [
      { name: "Aisha Patel", email: "aisha.patel@gmail.com", amount: 79, status: "recovered" },
      { name: "Tom Nguyen", email: "tom.n@outlook.com", amount: 199, status: "active" },
      { name: "Jessica Liu", email: "jess.liu@company.co", amount: 29, status: "recovered" },
      { name: "Daniel Okafor", email: "d.okafor@enterprise.com", amount: 199, status: "active" },
    ],
    stats: { recovered: 6830, rate: 71, active: 12, emailsSent: 184 },
    paymentPageMessage: "Your recent SkillForge payment didn't go through. Update your card below to keep access to your courses, live sessions, and learning progress.",
  },

  // ─── 3. Fitness / Gym Management ───
  {
    id: "fitness",
    name: "GymEngine",
    industry: "Fitness & Wellness",
    icon: "💪",
    domain: "gymengine.io",
    tagline: "All-in-one gym management software",
    billingEmail: "billing@gymengine.io",
    brandColor: "#ef4444",
    founderName: "Jake Morrison",
    founderEmail: "jake@gymengine.io",
    mrr: 28000,
    plans: [
      { name: "Solo", price: 39 },
      { name: "Studio", price: 89 },
      { name: "Enterprise", price: 179 },
    ],
    lostPerMonth: 1960,
    discoveryProblem:
      "Jake's gym management platform has a high rate of failed payments because many gym owners use business debit cards that get flagged easily. He's losing $1,960/mo and gym owners don't even know their software is about to lapse until class scheduling and member check-ins stop working.",
    discoveryFind:
      'Jake discovers RecoverKit after a frustrated gym owner emails support about losing access. He realizes automated dunning would save hours of manual follow-up. At $29 AUD/mo it\'s a no-brainer compared to the support time alone.',
    productNoun: "class scheduling, member check-ins, and billing management",
    emails: [
      {
        step: 1, delayHours: 4,
        subject: "Quick update about your GymEngine payment",
        body: "Hi there,\n\nWe just tried to process your GymEngine subscription, but the payment didn't go through. This usually happens when a card expires or gets a temporary hold from your bank.\n\nYour gym management tools are still running. Just pop in a new card and you're sorted. Takes about 30 seconds.\n\nYour members won't notice a thing.",
      },
      {
        step: 2, delayHours: 24,
        subject: "Your GymEngine payment still needs updating",
        body: "Hi there,\n\nFollowing up on your GymEngine payment. We gave it another go, but your card was declined again.\n\nWe know your gym runs on GymEngine for class bookings, member check-ins, and billing. We don't want a card issue to get in the way of that. Updating takes less than a minute.\n\nNeed a hand? Just reply here.",
      },
      {
        step: 3, delayHours: 72,
        subject: "Action needed: update your GymEngine payment",
        body: "Hi there,\n\nWe've tried processing your GymEngine payment several times now, but it keeps being declined.\n\nYour account is still active, but we need a valid card on file to keep things running. Without it, your class scheduling, member check-in system, and automated billing could be interrupted. That means disruption for your members too.\n\nPlease take a moment to update your payment details.",
      },
      {
        step: 4, delayHours: 120,
        subject: "Urgent: your GymEngine subscription is at risk",
        body: "Hi there,\n\nThis is urgent. Your GymEngine payment has failed multiple times and your subscription is at risk of cancellation.\n\nIf we can't process payment in the next few days, your gym will lose access to class scheduling, member management, check-in systems, and automated billing. Your members may be unable to book classes or check in.\n\nPlease update your payment method now.",
      },
      {
        step: 5, delayHours: 240,
        subject: "Final notice: GymEngine access will be cancelled",
        body: "Hi there,\n\nThis is our last email about your GymEngine payment. Your card has been declined repeatedly and your account will be cancelled within 48 hours.\n\nOnce cancelled, your gym will immediately lose access to all scheduling, member management, check-in, and billing tools. Your members will not be able to book or check in.\n\nUpdate your payment now to keep your gym running smoothly.",
      },
    ],
    campaigns: [
      { name: "Sarah Mitchell", email: "sarah@crossfitcentral.com", amount: 89, status: "recovered" },
      { name: "Mike Torres", email: "mike@ironworksfit.com", amount: 179, status: "active" },
      { name: "Lisa Wang", email: "lisa@zenflowstudio.com", amount: 39, status: "recovered" },
      { name: "Chris Dunn", email: "chris@peakperformancegym.com", amount: 89, status: "active" },
    ],
    stats: { recovered: 3240, rate: 62, active: 6, emailsSent: 78 },
    paymentPageMessage: "Your recent GymEngine payment didn't go through. Update your card below so your gym's scheduling, check-ins, and billing keep running without interruption.",
  },

  // ─── 4. Creative / Design Tools ───
  {
    id: "creative",
    name: "PixelStack",
    industry: "Creative & Design Tools",
    icon: "🎨",
    domain: "pixelstack.design",
    tagline: "Design collaboration for remote teams",
    billingEmail: "billing@pixelstack.design",
    brandColor: "#ec4899",
    founderName: "Nina Rodriguez",
    founderEmail: "nina@pixelstack.design",
    mrr: 45000,
    plans: [
      { name: "Freelancer", price: 19 },
      { name: "Studio", price: 59 },
      { name: "Agency", price: 149 },
    ],
    lostPerMonth: 3600,
    discoveryProblem:
      "Nina's design tool has a high volume of freelancer customers on low-cost plans. Credit cards churn constantly. She's losing $3,600/mo and the low price points mean customers don't bother re-subscribing once they lose access. Every failed payment is a permanent churn risk.",
    discoveryFind:
      'Nina reads a blog post about involuntary churn costing SaaS companies 9% of MRR. She finds RecoverKit and realizes the Growth plan at $79 AUD/mo would pay for itself by recovering just two Freelancer subscriptions.',
    productNoun: "design files, shared workspaces, and team collaboration features",
    emails: [
      {
        step: 1, delayHours: 4,
        subject: "Heads up about your PixelStack payment",
        body: "Hi there,\n\nYour latest PixelStack payment didn't go through. No stress, this happens. Cards expire, banks get cautious, the usual.\n\nYour designs and workspaces are all safe. Just update your card and you're back in action. Takes less than a minute.\n\nWe'll keep everything right where you left it.",
      },
      {
        step: 2, delayHours: 24,
        subject: "Your PixelStack payment needs a quick update",
        body: "Hi there,\n\nJust circling back on your PixelStack payment. We tried again but your card was still declined.\n\nAll your design files and shared workspaces are safe. We just need an updated payment method to keep your account active. Your collaborators can still view files, but editing will be paused if we can't process payment.\n\nQuick update and you're good to go.",
      },
      {
        step: 3, delayHours: 72,
        subject: "Keep your PixelStack workspace active",
        body: "Hi there,\n\nWe've attempted to process your PixelStack subscription payment several times, but it keeps being declined.\n\nYour account is still active for now, but without a valid payment method, you and your team may lose access to design files, shared workspaces, version history, and all collaboration features.\n\nPlease update your payment details to avoid any disruption to your creative workflow.",
      },
      {
        step: 4, delayHours: 120,
        subject: "Your PixelStack subscription is about to expire",
        body: "Hi there,\n\nUrgent notice about your PixelStack account. Multiple payment attempts have failed and your subscription will be cancelled soon.\n\nOnce cancelled, you and your team will lose access to all design files, workspaces, shared assets, and collaboration tools. Exported files will still be available, but live projects will be frozen.\n\nPlease update your payment method now.",
      },
      {
        step: 5, delayHours: 240,
        subject: "Final notice: your PixelStack account will be cancelled",
        body: "Hi there,\n\nThis is our final notice. Your PixelStack payment has failed repeatedly and your account will be cancelled within 48 hours.\n\nAll design files, shared workspaces, version history, and team collaboration access will be suspended. You'll be able to export your files for 30 days after cancellation, but live editing and sharing will stop immediately.\n\nUpdate your payment now to keep creating.",
      },
    ],
    campaigns: [
      { name: "Alex Kim", email: "alex@designstudio.co", amount: 149, status: "recovered" },
      { name: "Jamie Frost", email: "jamie.frost@freelance.me", amount: 19, status: "recovered" },
      { name: "Ravi Gupta", email: "ravi@brandagency.com", amount: 149, status: "active" },
      { name: "Sophie Turner", email: "sophie@creativelab.io", amount: 59, status: "active" },
    ],
    stats: { recovered: 5890, rate: 68, active: 14, emailsSent: 203 },
    paymentPageMessage: "Your recent PixelStack payment didn't go through. Update your card below to keep access to your design files, workspaces, and team collaboration.",
  },

  // ─── 5. B2B / Agency Platform ───
  {
    id: "agency",
    name: "ClientVault",
    industry: "Agency & Consulting",
    icon: "🏢",
    domain: "clientvault.com",
    tagline: "Client portal and project management for agencies",
    billingEmail: "billing@clientvault.com",
    brandColor: "#0d9488",
    founderName: "David Park",
    founderEmail: "david@clientvault.com",
    mrr: 67000,
    plans: [
      { name: "Solo", price: 49 },
      { name: "Agency", price: 129 },
      { name: "Enterprise", price: 299 },
    ],
    lostPerMonth: 5400,
    discoveryProblem:
      "David's agency platform handles high-value B2B subscriptions. When an Enterprise client's corporate card fails, it takes weeks of manual follow-up with their finance department. He's losing $5,400/mo and each lost Enterprise client is devastating at $299/mo.",
    discoveryFind:
      'David finds RecoverKit after losing two Enterprise accounts to failed payments that nobody noticed for 3 weeks. The $149 AUD/mo Scale plan with custom payment pages lets him keep everything on-brand for his agency clients.',
    productNoun: "client portals, project files, reporting dashboards, and team workspaces",
    emails: [
      {
        step: 1, delayHours: 4,
        subject: "Payment notice for your ClientVault subscription",
        body: "Hi there,\n\nWe attempted to process your ClientVault subscription payment, but it was declined by your bank. This is typically caused by an expired card or a temporary hold.\n\nYour client portals and projects are fully active. Please update your payment method at your earliest convenience to ensure uninterrupted service for your team and clients.\n\nIf this was processed through a corporate card, you may need to check with your finance department.",
      },
      {
        step: 2, delayHours: 24,
        subject: "Your ClientVault payment requires attention",
        body: "Hi there,\n\nThis is a follow up regarding your ClientVault subscription payment. We attempted to charge your card again, but it was declined.\n\nYour agency's client portals, project management tools, and reporting dashboards remain active. However, we do need an updated payment method to maintain your service.\n\nIf you need to route this to your accounts payable team, please forward this email to them along with the payment update link below.",
      },
      {
        step: 3, delayHours: 72,
        subject: "Urgent: update your ClientVault payment method",
        body: "Hi there,\n\nWe have attempted to process your ClientVault payment multiple times without success. Your subscription is still active, but continued service requires a valid payment method.\n\nWithout an update, your agency may lose access to client portals, active projects, reporting tools, and all shared workspaces. This would also affect your clients' ability to access their portals.\n\nPlease update your payment details or contact us if you need to arrange alternative payment.",
      },
      {
        step: 4, delayHours: 120,
        subject: "Critical: your ClientVault subscription will be suspended",
        body: "Hi there,\n\nYour ClientVault subscription payment has failed repeatedly and your account is at immediate risk of suspension.\n\nSuspension will affect your entire agency: all client portals will go offline, active projects will be frozen, reporting dashboards will be inaccessible, and your clients will lose portal access.\n\nPlease update your payment method immediately to prevent service disruption.",
      },
      {
        step: 5, delayHours: 240,
        subject: "Final notice: ClientVault account cancellation",
        body: "Hi there,\n\nThis is our final notice regarding your ClientVault subscription. After multiple failed payment attempts, your account will be cancelled within 48 hours.\n\nUpon cancellation, all client portals, project data, reporting dashboards, and team workspaces will be suspended. Your clients will immediately lose access to their portals. Data will be retained for 30 days, after which it will be permanently deleted.\n\nPlease update your payment details now to prevent cancellation.",
      },
    ],
    campaigns: [
      { name: "MediaHaus Group", email: "accounts@mediahaus.agency", amount: 299, status: "recovered" },
      { name: "Bright Ideas Co.", email: "finance@brightideas.co", amount: 129, status: "active" },
      { name: "Lunar Digital", email: "ops@lunardigital.com", amount: 299, status: "recovered" },
      { name: "Spark Creative", email: "admin@sparkcreative.io", amount: 49, status: "active" },
    ],
    stats: { recovered: 8920, rate: 73, active: 5, emailsSent: 67 },
    paymentPageMessage: "Your ClientVault subscription payment didn't go through. Please update your payment method below to maintain your agency's client portals and project access.",
  },
];

import type { CollabApplication, Collaboration, Community, CreatorDuo, EventRegistration, RegionalEvent } from "../types";
import { addDays, toISODate } from "../utils";

/**
 * Ecosystem demo data (communities, regional events, creator duos, brand collaborations).
 * All brands, member counts, registrations and applicant numbers are illustrative sample data.
 */

const d = (n: number) => toISODate(addDays(new Date(), n));
const ago = (n: number) => addDays(new Date(), -n).toISOString();

export const seedCommunities: Community[] = [
  {
    id: "cm1", slug: "hyderabad-foodies", name: "Hyderabad Foodies", category: "Food", city: "Hyderabad", hue: 22, icon: "food",
    tagline: "Biryani debates, hidden gems and food walks across the city",
    description: "A community for people who plan their weekends around food. Discover Old City classics and new-wave cafés, join creator-led food walks, and share honest recommendations with fellow Hyderabadis.",
    baseMembers: 4820, hostCreatorIds: ["c14", "c10"], tags: ["Street food", "Biryani", "Cafés", "Food walks"],
    guidelines: ["Share honest, first-hand recommendations", "No paid promotions without disclosure", "Be kind about other people's biryani preferences"],
    posts: [
      { author: "Shreya Iyer", role: "Host · Food creator", text: "Ramzan food walk dates are up in Regional Events — 25 spots each night. Who's joining for paya and haleem?", ago: "3h", replies: 42 },
      { author: "Rohit P.", role: "Member", text: "Best Irani chai near Gachibowli that isn't a chain? Looking for a quiet place to work from.", ago: "1d", replies: 18 },
      { author: "Farhan Qureshi", role: "Host · F&B founder", text: "Running a session on what makes a cloud kitchen menu profitable — useful if you're thinking of starting one.", ago: "2d", replies: 9 },
    ],
    createdAt: "2025-05-02",
  },
  {
    id: "cm2", slug: "career-mba", name: "Career and MBA Community", category: "Career", city: "All India", hue: 215, icon: "career",
    tagline: "CVs, interviews, MBA applications and career switches",
    description: "Peer support for students and professionals planning their next move — MBA applications, career switches, interview preparation and salary negotiation, with regular AMAs from hiring leaders.",
    baseMembers: 12350, hostCreatorIds: ["c9", "c5"], tags: ["MBA", "Interview prep", "Career switch", "Salary"],
    guidelines: ["No recruitment spam", "Keep salary discussions respectful and anonymous", "Credit sources when sharing resources"],
    posts: [
      { author: "Nisha Bhatt", role: "Host · Career coach", text: "Mock interview Fridays are back. Drop your target role below and I'll pick three for live feedback.", ago: "5h", replies: 67 },
      { author: "Aisha K.", role: "Member", text: "Switched from consulting to product after 4 years — happy to answer questions about the transition.", ago: "1d", replies: 31 },
    ],
    createdAt: "2025-02-10",
  },
  {
    id: "cm3", slug: "travel-explorers", name: "Travel Explorers", category: "Travel", city: "All India", hue: 190, icon: "travel",
    tagline: "Offbeat itineraries, weekend escapes and travel meetups",
    description: "For slow travellers and weekend explorers. Swap itineraries, find travel buddies for group trips and join creator-led photowalks and treks.",
    baseMembers: 8640, hostCreatorIds: ["c15"], tags: ["Weekend trips", "Treks", "Homestays", "Photography"],
    guidelines: ["Leave no trace — on trails and in comments", "Verify group trip organisers before paying", "No sharing of others' personal details"],
    posts: [
      { author: "Kavya Reddy", role: "Host · Travel creator", text: "Ananthagiri photowalk this month — 20 spots, sunrise start. Details in Regional Events.", ago: "8h", replies: 24 },
      { author: "Manoj T.", role: "Member", text: "Did Gandikota + Belum Caves over a long weekend from Hyderabad. Itinerary in thread!", ago: "3d", replies: 15 },
    ],
    createdAt: "2025-04-18",
  },
  {
    id: "cm4", slug: "gaming-zone", name: "Gaming Zone", category: "Gaming", city: "Hyderabad", hue: 262, icon: "gaming",
    tagline: "Community esports nights, indie games and streamer meetups",
    description: "Hyderabad's friendly gaming community. Join LAN nights, try Indian indie games before launch and learn streaming from creators who do it full time.",
    baseMembers: 6110, hostCreatorIds: ["c16", "c6"], tags: ["Esports", "LAN nights", "Indie games", "Streaming"],
    guidelines: ["No toxicity — zero tolerance", "Tag spoilers", "Self-promotion only in the weekly thread"],
    posts: [
      { author: "Arnav Kulkarni", role: "Host · Streamer", text: "LAN night bracket is live. Teams of five, beginners welcome — we'll balance the lobbies.", ago: "2h", replies: 88 },
      { author: "Rohan Kapoor", role: "Host · Tech YouTuber", text: "Testing three budget gaming headsets this week. Which one should I tear down first?", ago: "1d", replies: 52 },
    ],
    createdAt: "2025-07-01",
  },
  {
    id: "cm5", slug: "startup-founders", name: "Startup Founders", category: "Startups", city: "Hyderabad", hue: 252, icon: "startup",
    tagline: "Founders helping founders — from first customer to first raise",
    description: "A curated space for early-stage founders in Hyderabad and beyond. Monthly mixers at HITEC City, office hours with operators and investors, and candid peer discussions.",
    baseMembers: 3270, hostCreatorIds: ["c2", "c1", "c7"], tags: ["Fundraising", "GTM", "Hiring", "Product"],
    guidelines: ["What's shared here stays here", "Ask specific questions, share specific numbers", "No unsolicited pitching in DMs"],
    posts: [
      { author: "Vikram Sethi", role: "Host · Angel investor", text: "Office hours this Thursday: bring your seed deck, I'll review three live.", ago: "6h", replies: 21 },
      { author: "Ananya Rao", role: "Host · D2C strategist", text: "Thread: the five pricing mistakes I see most often in early D2C brands.", ago: "2d", replies: 46 },
    ],
    createdAt: "2025-03-08",
  },
];

export const seedEvents: RegionalEvent[] = [
  { id: "ev1", title: "Old City Biryani & Chai Food Walk", type: "Food walk", city: "Hyderabad", area: "Charminar, Old City", date: d(4), time: "18:30", durationMins: 150, price: 799, capacity: 25, baseRegistered: 18, creatorIds: ["c14"], communityId: "cm1", hue: 22,
    description: "Walk the lanes around Charminar with food creator Shreya Iyer — six stops covering Irani chai, kebabs, biryani and Hyderabadi desserts, with stories behind each kitchen.",
    agenda: ["Meet near Charminar, introductions", "Irani chai & Osmania biscuits", "Kebabs and biryani tasting", "Dessert stop and group photo"] },
  { id: "ev2", title: "Coffee with Creators: Building a Food Brand", type: "Coffee with Creators", city: "Hyderabad", area: "Jubilee Hills", date: d(6), time: "10:00", durationMins: 90, price: 499, capacity: 15, baseRegistered: 11, creatorIds: ["c14", "c10"], communityId: "cm1", hue: 30,
    description: "An informal coffee conversation for aspiring F&B founders with a food creator and a cloud-kitchen founder. Small group, real questions.",
    agenda: ["Round-table introductions", "From kitchen to brand: Farhan's story", "What creators look for in food brands", "Open Q&A"] },
  { id: "ev3", title: "Hyderabad Founder Mixer", type: "Startup networking", city: "Hyderabad", area: "HITEC City", date: d(9), time: "18:00", durationMins: 150, price: 0, capacity: 80, baseRegistered: 52, creatorIds: ["c2", "c7"], communityId: "cm5", hue: 252,
    description: "Monthly networking for early-stage founders, operators and angels. Short founder spotlights followed by structured networking.",
    agenda: ["Check-in and coffee", "Three 5-minute founder spotlights", "Fireside chat with Vikram Sethi", "Structured networking"] },
  { id: "ev4", title: "Creator Workshop: Short-form Video for Small Brands", type: "Creator workshop", city: "Hyderabad", area: "Banjara Hills", date: d(12), time: "11:00", durationMins: 180, price: 1499, capacity: 30, baseRegistered: 9, creatorIds: ["c15", "c14"], hue: 200,
    description: "A hands-on workshop on planning, shooting and editing reels on a phone. Bring a product or place to film — you'll leave with two edited videos.",
    agenda: ["Hooks and storytelling", "Shooting on a phone: light, sound, framing", "Hands-on shoot in small groups", "Editing and feedback"] },
  { id: "ev5", title: "Gaming Zone LAN Night", type: "Creator meetup", city: "Hyderabad", area: "Gachibowli", date: d(5), time: "19:00", durationMins: 240, price: 299, capacity: 60, baseRegistered: 47, creatorIds: ["c16"], communityId: "cm4", hue: 262,
    description: "A community esports night hosted by Arnav Kulkarni. Balanced lobbies, beginner-friendly brackets and a live-streamed final.",
    agenda: ["Check-in and team balancing", "Group stage", "Streamed finals with live commentary", "Meet & greet"] },
  { id: "ev6", title: "Coffee with Creators: Switching into Product", type: "Coffee with Creators", city: "Hyderabad", area: "Madhapur", date: d(8), time: "09:30", durationMins: 90, price: 399, capacity: 12, baseRegistered: 12, creatorIds: ["c2", "c7"], communityId: "cm2", hue: 215,
    description: "Small-group coffee with a product leader and a design lead about moving into product roles — portfolios, interviews and the first 90 days.",
    agenda: ["Introductions", "How product hiring really works", "Portfolio and case-study tips", "Q&A"] },
  { id: "ev7", title: "Sunrise Photowalk & Trek, Ananthagiri Hills", type: "Creator meetup", city: "Hyderabad", area: "Ananthagiri Hills, Vikarabad", date: d(11), time: "06:00", durationMins: 300, price: 999, capacity: 20, baseRegistered: 8, creatorIds: ["c15"], communityId: "cm3", hue: 160,
    description: "An easy sunrise trek and photowalk with travel creator Kavya Reddy, with mobile photography tips along the way. Transport from Hyderabad is arranged separately.",
    agenda: ["Sunrise viewpoint", "Forest trail photowalk", "Breakfast with the group", "Photo review session"] },
  { id: "ev8", title: "Morning Run & Strength Clinic", type: "Creator workshop", city: "Hyderabad", area: "KBR Park", date: d(3), time: "06:30", durationMins: 90, price: 0, capacity: 40, baseRegistered: 21, creatorIds: ["c17"], hue: 150,
    description: "A free community run followed by a strength-form clinic for beginners, led by coach Ishaan Malik.",
    agenda: ["Warm-up", "Easy 3 km group run", "Strength form clinic", "Habits Q&A"] },
  { id: "ev9", title: "Career & MBA AMA: Getting into Top B-Schools", type: "Creator workshop", city: "Hyderabad", area: "Ameerpet", date: d(14), time: "17:00", durationMins: 120, price: 299, capacity: 50, baseRegistered: 34, creatorIds: ["c9", "c5"], communityId: "cm2", hue: 215,
    description: "An open AMA on MBA applications, essays and interviews, plus a finance primer for financing your MBA.",
    agenda: ["Application timelines", "Essay and interview tips", "Financing your MBA", "Open AMA"] },
  { id: "ev10", title: "D2C Founders Breakfast", type: "Startup networking", city: "Bengaluru", area: "Indiranagar", date: d(7), time: "08:30", durationMins: 120, price: 599, capacity: 30, baseRegistered: 19, creatorIds: ["c1", "c8"], hue: 252,
    description: "A breakfast round-table for consumer founders on pricing, distribution and building a tech stack on a budget.",
    agenda: ["Breakfast and introductions", "Pricing round-table with Ananya Rao", "Tech on a budget with Karthik Iyer", "Open networking"] },
  { id: "ev11", title: "Mumbai Creator Meetup", type: "Creator meetup", city: "Mumbai", area: "Bandra West", date: d(10), time: "18:00", durationMins: 150, price: 0, capacity: 50, baseRegistered: 33, creatorIds: ["c4", "c11"], hue: 340,
    description: "An evening for creators and marketers on brand collaborations that work for both sides.",
    agenda: ["Welcome", "Panel: collaborations that work", "Speed networking"] },
];

export const seedDuos: CreatorDuo[] = [
  { id: "d1", slug: "hyderabad-on-a-plate", title: "Hyderabad on a Plate", pairing: "Food + Travel", creatorIds: ["c14", "c15"], format: "In person · Hyderabad", durationMins: 180, price: 5999, maxGuests: 4, hue: 22,
    description: "A private half-day food and heritage trail with a food creator and a travel creator — the stories, kitchens and corners of Hyderabad most visitors never see. Ideal for visiting friends, family or a small team outing.",
    includes: ["Curated 5-stop food and heritage route", "Tastings at each stop (up to 4 guests)", "Photography tips along the way", "Personalised list of places to explore later"],
    availability: { 6: ["10:00", "16:00"], 0: ["10:00", "16:00"] } },
  { id: "d2", slug: "money-moves-first-job", title: "Money Moves for Your First Job", pairing: "Finance + Career", creatorIds: ["c5", "c9"], format: "Online", durationMins: 60, price: 3499, maxGuests: 1, hue: 215,
    description: "A joint session with a chartered accountant and a career coach: negotiate your offer, understand your salary structure and set up a simple savings and tax plan from day one.",
    includes: ["Offer and CTC breakdown review", "Negotiation script for your offer", "First-year savings and tax plan", "Written summary from both creators"],
    availability: { 1: ["19:00"], 3: ["19:00"], 6: ["11:00"] } },
  { id: "d3", slug: "fitness-nutrition-reset", title: "The Fitness & Nutrition Reset", pairing: "Fitness + Lifestyle", creatorIds: ["c17", "c12"], format: "Online", durationMins: 60, price: 3999, maxGuests: 1, hue: 150,
    description: "A strength coach and a clinical dietitian build your training and nutrition plan together, so your workouts and meals actually work as one system.",
    includes: ["Movement and lifestyle assessment", "8-week training outline", "Practical Indian meal framework", "Two-week check-in message"],
    availability: { 1: ["17:00"], 2: ["17:00"], 4: ["17:00"] } },
  { id: "d4", slug: "build-your-gaming-channel", title: "Build Your Gaming Channel", pairing: "Gaming + Entertainment", creatorIds: ["c16", "c6"], format: "Online", durationMins: 75, price: 3299, maxGuests: 2, hue: 262,
    description: "A streamer and a tech YouTuber review your channel live — content, setup, thumbnails and the gear worth buying on a budget.",
    includes: ["Live channel and stream audit", "Setup and gear recommendations by budget", "30-day content calendar", "Thumbnail and title feedback"],
    availability: { 2: ["20:00"], 4: ["20:00"], 6: ["15:00"] } },
];

export const seedCollaborations: Collaboration[] = [
  { id: "cb1", brand: "Kosha Naturals", brandHue: 140, ownedByDemoUser: true, title: "Botanical face oil launch — creator partners", category: "Beauty & Personal Care", campaignType: "Product launch", compensation: "Paid + product",
    summary: "Honest reviews and a 30-day routine series for our new 15 ml face oil.",
    description: "Kosha Naturals is launching a 15 ml travel-size kumkumadi face oil for first-time Ayurveda users. We're looking for skincare and lifestyle creators who can test it for 30 days and share an honest review with their audience.",
    budgetMin: 15000, budgetMax: 40000, cities: ["Hyderabad", "Bengaluru", "Chennai"], minFollowers: 50000, slots: 3,
    requirements: ["Skincare or lifestyle content focus", "50K+ engaged followers", "Willing to test for 30 days before posting", "Clear #ad disclosure as per ASCI guidelines"],
    deliverables: ["1 unboxing reel", "1 30-day review video", "3 stories with swipe-up link"], deadline: d(10), status: "open", baseApplicants: 7, createdAt: ago(6) },
  { id: "cb2", brand: "BrewBox Coffee Co.", brandHue: 28, title: "Cold brew campus tour", category: "Food & Beverage", campaignType: "Event partnership", compensation: "Paid",
    summary: "Co-host BrewBox sampling pop-ups at colleges in Hyderabad and Bengaluru.",
    description: "We're taking BrewBox cold brew to 12 college campuses. We need creators to co-host pop-ups, run a short on-ground activity and create content from the day.",
    budgetMin: 20000, budgetMax: 60000, cities: ["Hyderabad", "Bengaluru"], minFollowers: 100000, slots: 2,
    requirements: ["Gen Z audience", "Available on 2 weekdays per city", "Comfortable hosting live audiences"],
    deliverables: ["Co-host 3 campus pop-ups", "1 event recap reel", "Live stories on event days"], deadline: d(14), status: "open", baseApplicants: 12, createdAt: ago(4) },
  { id: "cb3", brand: "Finly Technologies", brandHue: 210, title: "Money for flatmates — content series", category: "Fintech", campaignType: "Content series", compensation: "Paid",
    summary: "A four-part series on splitting rent, bills and groceries without awkward conversations.",
    description: "Finly helps flatmates split expenses and settle via UPI. We want creators to build an entertaining, genuinely useful series about money between flatmates.",
    budgetMin: 25000, budgetMax: 50000, cities: ["All India"], minFollowers: 50000, slots: 3,
    requirements: ["Finance, career or comedy content", "Audience of students or young professionals", "No guaranteed-returns style claims"],
    deliverables: ["4 short-form videos", "1 long-form explainer (optional)"], deadline: d(18), status: "open", baseApplicants: 9, createdAt: ago(8) },
  { id: "cb4", brand: "Deccan Spice Kitchen", brandHue: 15, title: "New outlet launch in Kondapur", category: "Food & Beverage", campaignType: "Store launch", compensation: "Paid + product",
    summary: "Food creators for a tasting night and launch-week content.",
    description: "A family-run Hyderabadi restaurant opening its second outlet. We'd like local food creators to attend a tasting night and share honest content during launch week.",
    budgetMin: 10000, budgetMax: 25000, cities: ["Hyderabad"], minFollowers: 20000, slots: 4,
    requirements: ["Hyderabad-based food creators", "Attend the tasting night in person", "Honest reviews — no scripted content"],
    deliverables: ["1 reel from the tasting night", "2 stories during launch week"], deadline: d(7), status: "open", baseApplicants: 15, createdAt: ago(3) },
  { id: "cb5", brand: "Loomcraft", brandHue: 340, title: "Festive handloom collection lookbook", category: "Fashion", campaignType: "Content series", compensation: "Paid",
    summary: "Style our festive handloom collection for a lookbook and reels.",
    description: "Loomcraft works directly with weavers in Pochampally. We're looking for fashion creators to style and shoot our festive collection.",
    budgetMin: 30000, budgetMax: 80000, cities: ["Hyderabad", "Mumbai"], minFollowers: 100000, slots: 2,
    requirements: ["Fashion or styling focus", "Interest in handloom and slow fashion"], deliverables: ["1 lookbook shoot (6 looks)", "3 reels", "Usage rights for 3 months"], deadline: d(12), status: "open", baseApplicants: 6, createdAt: ago(5) },
  { id: "cb6", brand: "PixelForge Studios", brandHue: 262, title: "Indie game launch stream", category: "Gaming", campaignType: "Product launch", compensation: "Paid",
    summary: "Launch-week streams for an Indian indie action game.",
    description: "A Hyderabad studio launching its first indie game on PC. We're partnering with streamers for launch-week playthroughs.",
    budgetMin: 40000, budgetMax: 100000, cities: ["All India"], minFollowers: 200000, slots: 2,
    requirements: ["Gaming streamer with 200K+ followers", "Stream at least 2 hours in launch week"], deliverables: ["2 launch-week streams", "1 highlights video"], deadline: d(2), status: "in_progress", baseApplicants: 21, createdAt: ago(15) },
  { id: "cb7", brand: "TrailMate Gear", brandHue: 190, title: "Monsoon trek backpack reviews", category: "Travel", campaignType: "Brand awareness", compensation: "Product only",
    summary: "Field-test our monsoon backpack on a real trek.",
    description: "TrailMate is a young outdoor gear brand. This campaign has closed — thanks to everyone who applied.",
    budgetMin: 0, budgetMax: 0, cities: ["All India"], minFollowers: 10000, slots: 5,
    requirements: ["Trekking or travel content"], deliverables: ["1 field review video"], deadline: d(-6), status: "closed", baseApplicants: 34, createdAt: ago(30) },
];

export const seedApplications: CollabApplication[] = [
  { id: "ap1", collabId: "cb1", creatorId: "c3", status: "shortlisted", proposedFee: 38000, portfolioLink: "instagram.com/meera.everyday", createdAt: ago(5), updatedAt: ago(2),
    message: "I've been testing Ayurvedic oils for my audience for two years — a 30-day honest review is exactly how I'd want to do this." },
  { id: "ap2", collabId: "cb1", creatorId: "c11", status: "submitted", proposedFee: 30000, portfolioLink: "instagram.com/tanvistyles", createdAt: ago(3), updatedAt: ago(3),
    message: "I'd pair the face oil with festive get-ready-with-me content — a natural fit for my audience this season." },
  { id: "ap3", collabId: "cb2", creatorId: "c14", status: "accepted", proposedFee: 45000, portfolioLink: "youtube.com/ShreyaEatsHyderabad", createdAt: ago(4), updatedAt: ago(1),
    message: "I host food events regularly and my audience skews college-age in Hyderabad. Happy to co-host all three pop-ups." },
  { id: "ap4", collabId: "cb2", creatorId: "c1", status: "submitted", proposedFee: 40000, portfolioLink: "linkedin.com/in/ananyarao", createdAt: ago(2), updatedAt: ago(2),
    message: "I can bring a brand-building angle to the campus sessions — a short talk on how D2C beverage brands grow." },
  { id: "ap5", collabId: "cb4", creatorId: "c10", status: "shortlisted", proposedFee: 15000, portfolioLink: "instagram.com/farhan.eats.business", createdAt: ago(2), updatedAt: ago(1),
    message: "Happy to cover the tasting night from a restaurateur's perspective." },
  { id: "ap6", collabId: "cb6", creatorId: "c16", status: "accepted", proposedFee: 90000, portfolioLink: "youtube.com/ArnavPlays", createdAt: ago(12), updatedAt: ago(8),
    message: "I've streamed three Indian indie launches this year. I'd love to do a blind first playthrough." },
  { id: "ap7", collabId: "cb6", creatorId: "c6", status: "shortlisted", proposedFee: 70000, portfolioLink: "youtube.com/RohanReviews", createdAt: ago(10), updatedAt: ago(7),
    message: "I can cover performance on budget gaming laptops alongside gameplay." },
  { id: "ap8", collabId: "cb3", creatorId: "c2", status: "declined", proposedFee: 50000, portfolioLink: "linkedin.com/in/vikramsethi", createdAt: ago(7), updatedAt: ago(5),
    message: "I could cover the product and fintech angle.", brandNote: "Thank you — we're prioritising creators with a student audience for this series." },
];

export const seedMemberships: Record<string, string[]> = {
  user: ["cm5", "cm1"],
};

export const seedRegistrations: EventRegistration[] = [
  { id: "rg1", eventId: "ev3", viewer: "user", name: "Aarav Mehta", createdAt: ago(2) },
];

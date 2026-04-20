"use client";

import { useState } from "react";
import { useClerk, useUser } from "@clerk/nextjs";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Space+Mono:wght@400;700&display=swap');`;

// ─── COLOR SYSTEM ──────────────────────────────────────────────────────────
// bg: #080808 | surface: #0F0F0F | card: #141414
// lime: #AAFF00 | purple: #7B2FBE | gold: #C9A227

const MODULES = [
  {
    id: 1, title: "Money & Wealth Basics", subtitle: "Unlearn everything you were taught",
    icon: "₿", tag: "FOUNDATION", duration: "45–60 min", xpReward: 500,
    lessons: [
      {
        title: "What Money Actually Is — And Who Controls It",
        content: [
          { type: "quote", text: "Give me control of a nation's money supply, and I care not who makes its laws.", author: "Mayer Amschel Rothschild, 1838" },
          { type: "heading", text: "Money serves three functions" },
          { type: "list", items: ["Medium of Exchange — replaces barter", "Unit of Account — measures value consistently", "Store of Value — preserves purchasing power over time"] },
          { type: "body", text: "Modern money is fiat currency. It has value because the government says it does — not because it's backed by gold, silver, or anything tangible. The U.S. officially left the gold standard in 1971. Before that, every dollar was redeemable for a fixed amount of gold." },
          { type: "callout", text: "In 1913, the Federal Reserve was created. Most Americans believe the Fed is a government agency. It is not. It is a private banking institution — owned by private member banks — that controls the U.S. money supply. This was not taught in your school. Ask yourself why." },
          { type: "vault", title: "VAULT SECRET: The Money Creation Trick", text: "When the Federal Reserve wants to inject money into the economy, it doesn't print bills — it buys government bonds with money it creates from nothing. This is called 'open market operations.' The money didn't exist yesterday. Today it does. Who pays? Everyone holding dollars, through inflation. This is the hidden tax on the working class." },
          { type: "body", text: "Money is a tool. Not your identity, your worth, or your security. The wealthy treat it as a system to be understood and leveraged. The middle class treats it as something to be earned and spent. The poor treat it as something that was never meant for them." },
          { type: "action", text: "Research: Who are the private member banks of the Federal Reserve? Write what you find." }
        ]
      },
      {
        title: "Inflation — The Silent Tax on the Poor",
        content: [
          { type: "quote", text: "By a continuing process of inflation, government can confiscate, secretly and unobserved, an important part of the wealth of their citizens.", author: "John Maynard Keynes" },
          { type: "heading", text: "The dollar has lost 97% of its purchasing power since 1913" },
          { type: "body", text: "That is not a typo. The same year the Federal Reserve was created, the dollar began its century-long decline. What cost $1 in 1913 costs approximately $31 today. Your grandparents' savings — destroyed. Your parents' retirement — eroding. Yours? Already shrinking." },
          { type: "callout", text: "This is called the Cantillon Effect — a concept economists rarely teach publicly. When new money is created, it doesn't distribute equally. It flows first to banks and large institutions, who spend it before prices rise. By the time new money reaches workers through wages, prices have already increased. The wealthy gain. The working class loses. Every. Single. Time." },
          { type: "vault", title: "VAULT SECRET: How the Wealthy Beat Inflation", text: "They don't hold dollars. They hold assets. Real estate, businesses, commodities, equity — things that rise in price WITH inflation. The poor are told to 'save money.' The wealthy are told to 'own things.' A savings account earning 0.5% when inflation runs 7% is not saving — it's a slow bleed. The bank profits from your compliance." },
          { type: "body", text: "This is not a conspiracy. It's economics. Understanding it is the first step to playing a different game." },
          { type: "action", text: "Look up the price of a median home, a gallon of milk, and a college degree in 1971 vs today. Then ask: was the American Dream stolen, or was it always sold?" }
        ]
      },
      {
        title: "Budgeting — But Make It Real",
        content: [
          { type: "quote", text: "It's not about how much money you make, but how much money you keep, how hard it works for you, and how many generations you keep it for.", author: "Robert Kiyosaki" },
          { type: "heading", text: "A budget is a plan — not a cage" },
          { type: "body", text: "The 50/30/20 rule is a starting framework — 50% needs, 30% wants, 20% savings and debt reduction. But the wealthy don't budget their personal income the same way. They route income through entities. They structure their life so that expenses become deductible." },
          { type: "callout", text: "A W-2 employee earns money, pays taxes, then spends what's left. A business owner earns money, spends on legitimate business expenses, then pays taxes on what's left. Same income. Radically different tax outcome. The system was built this way on purpose — to reward ownership over labor." },
          { type: "vault", title: "VAULT SECRET: The LLC Expense Play", text: "When you own an LLC, your car (if used for business), your phone, your home office, certain meals, travel, education, and software subscriptions may become deductible business expenses. You pay for these with pre-tax dollars instead of post-tax dollars. A $1,000 expense with a 30% tax rate effectively costs you $700. The wealthy know this. It's legal. It's accessible. And nobody tells you about it in school because employees are easier to tax." },
          { type: "action", text: "Track every dollar for 30 days. Then ask: how many of these expenses could be legitimate business deductions if you had an LLC?" }
        ]
      },
      {
        title: "Assets vs Liabilities — The Real Divide",
        content: [
          { type: "quote", text: "The rich don't work for money. They make money work for them.", author: "Robert Kiyosaki, Rich Dad Poor Dad" },
          { type: "heading", text: "An asset puts money in your pocket. A liability takes money out." },
          { type: "list", items: ["Assets: rental property, businesses, investments, intellectual property, systems that generate cash", "Liabilities: high-interest debt, depreciating vehicles, luxury items financed on credit, money spent to impress others"] },
          { type: "body", text: "The middle class is sold the idea that their house is their biggest asset. In most cases, a primary residence is a liability — it costs money in taxes, maintenance, and mortgage interest every single month. A rental property that generates income above expenses is an asset." },
          { type: "vault", title: "VAULT SECRET: Buy, Borrow, Die", text: "This is the actual strategy ultra-wealthy families use to build generational wealth without paying capital gains taxes. Step 1: Buy appreciating assets (real estate, stocks, businesses). Step 2: Never sell them — borrow against them instead. Loans are not taxable income. You get the spending power of your wealth without a taxable event. Step 3: Die. When assets transfer to heirs, the cost basis resets to current market value — eliminating all accumulated capital gains. The wealthy pay zero tax on a lifetime of gains. This is legal. This is documented. This is why Bezos, Musk, and Zuckerberg can 'not earn much' on paper while living like gods." },
          { type: "action", text: "List everything you own. Mark each: Asset (cash flow positive), Liability (cash flow negative), Neutral. Be honest." }
        ]
      },
      {
        title: "Emergency Funds — Your First Defense",
        content: [
          { type: "heading", text: "You cannot build wealth from a position of desperation" },
          { type: "body", text: "The majority of Americans cannot cover a $1,000 emergency without going into debt. This is not laziness — it's the design of a system that profits from financial instability. Payday lenders charge 400% APR. Credit card companies earn billions from minimum payment traps. Banks make money when you're broke and desperate." },
          { type: "callout", text: "Cash margin creates decision-making power. When you have reserves, you can walk away from bad jobs, bad deals, and bad situations. When you have none, you stay trapped — and the system knows this." },
          { type: "list", items: ["Target 1: $1,000 emergency fund — break the debt cycle", "Target 2: 1 month of expenses — breathing room", "Target 3: 3–6 months — true financial leverage"] },
          { type: "vault", title: "VAULT SECRET: Where to Actually Keep It", text: "Don't keep your emergency fund in a big bank savings account earning 0.01%. High-Yield Savings Accounts (HYSAs) through online banks like Marcus, Ally, or SoFi offer 4-5% APY with full FDIC insurance. Same safety. 400-500x the return. The big banks advertise heavily and count on your inertia. Move the money. It's a 10-minute account setup." },
          { type: "action", text: "Calculate your monthly survival number. Multiply by 3. That's your freedom number. How far are you from it?" }
        ]
      },
      {
        title: "Goals That Actually Change Your Life",
        content: [
          { type: "quote", text: "A goal without a plan is just a wish.", author: "Antoine de Saint-Exupéry" },
          { type: "heading", text: "Vague goals produce vague results" },
          { type: "body", text: "Use the SMART framework: Specific, Measurable, Achievable, Relevant, Time-bound. 'I want to be rich' is not a goal. 'I will establish an LLC, open a business checking account, and generate $2,000 in side revenue within 90 days' is a goal." },
          { type: "callout", text: "The wealthy think in decades. The middle class thinks in months. The poor think in days. Time horizon is one of the greatest wealth separators that nobody talks about. A decision that costs you today but compounds over 20 years is the move most people are too impatient to make." },
          { type: "vault", title: "VAULT SECRET: The Entity Mindset", text: "Stop thinking about building a bank account. Start thinking about building an entity — a legal structure (LLC, S-Corp, Trust) that holds assets, receives income, and creates separation between you and your finances. The wealthy don't own things personally. Their entities do. Their entities get the tax breaks. Their entities borrow money. Their personal name stays clean and low-profile. This is not a gray area. Every single major wealth-builder uses entities. You just weren't taught about them." },
          { type: "action", text: "Write your 30-day, 12-month, and 5-year goals — but frame each one around building an entity or system, not just saving a number." }
        ]
      }
    ],
    quiz: [
      { q: "Money serves which three primary functions?", options: ["Entertainment, credit, debt", "Medium of exchange, unit of account, store of value", "Borrowing, investing, saving", "Spending, taxes, budgeting"], correct: 1 },
      { q: "The Federal Reserve is best described as:", options: ["A fully government-owned agency", "A private banking institution that controls U.S. money supply", "A department of the U.S. Treasury", "An international bank based in Switzerland"], correct: 1 },
      { q: "The Cantillon Effect describes:", options: ["How inflation affects everyone equally", "How newly created money benefits those closest to its source first", "Why gold is the best investment", "How taxes are collected"], correct: 1 },
      { q: "Under the 50/30/20 method, 20% is commonly used for:", options: ["Luxury spending", "Taxes only", "Savings and debt reduction", "Rent and utilities"], correct: 2 },
      { q: "The 'Buy, Borrow, Die' strategy allows the wealthy to:", options: ["Pay higher taxes than average citizens", "Access wealth without taxable income events", "Earn interest from savings accounts", "Avoid estate planning entirely"], correct: 1 },
      { q: "Which is generally considered bad debt?", options: ["Low-interest loan for productive growth", "Credit card debt at high interest", "Mortgage with manageable payments", "Business equipment with clear ROI"], correct: 1 },
      { q: "A starter emergency fund target is often:", options: ["$50", "$1,000", "$25,000 minimum", "No savings needed"], correct: 1 },
      { q: "The U.S. officially left the gold standard in:", options: ["1913", "1945", "1971", "1999"], correct: 2 },
      { q: "A business owner vs a W-2 employee primarily differs in that:", options: ["Business owners earn more always", "Business owners pay taxes after expenses; employees pay taxes before spending", "W-2 employees get more deductions", "There is no meaningful tax difference"], correct: 1 },
      { q: "What is the primary advantage of a High-Yield Savings Account over a big bank savings account?", options: ["No FDIC insurance needed", "Significantly higher interest rates with same safety", "Only available to wealthy clients", "Requires a minimum of $100,000"], correct: 1 }
    ]
  },
  {
    id: 2, title: "Traditional Finance Systems", subtitle: "Know the game before you play it",
    icon: "🏦", tag: "SYSTEMS", duration: "50–65 min", xpReward: 500,
    lessons: [
      {
        title: "How Banks Really Work — Follow the Money",
        content: [
          { type: "quote", text: "Banking was conceived in iniquity and born in sin. Bankers own the earth. Take it away from them, but leave them the power to create money, and with the flick of the pen, they will create enough money to buy it back again.", author: "Josiah Stamp, Former President of the Bank of England" },
          { type: "heading", text: "Fractional Reserve Banking" },
          { type: "body", text: "Here is what your bank does with your deposit: it keeps a fraction as reserves and loans out the rest — often 10x what it actually holds. When you deposit $1,000, the bank may loan out $10,000 created from your deposit. They charge interest on money that didn't exist before you walked in. This is called fractional reserve banking, and it is the foundation of the modern financial system." },
          { type: "callout", text: "Banks earn the spread: they pay you 0.5% on your savings and charge borrowers 7-25% on loans. The difference — your money, their profit. You are the product. Your deposits are their inventory." },
          { type: "vault", title: "VAULT SECRET: Business Banking Strategy", text: "Never mix personal and business finances. Open a dedicated business checking account the moment you form an LLC. This creates legal separation (protecting personal assets from business liability), makes accounting cleaner, builds a banking relationship for future credit, and allows you to show business revenue history for loans and lines of credit. Most people skip this step and lose the legal protection entirely." },
          { type: "action", text: "Check your bank accounts: what interest are you earning? What fees are you paying? Calculate how much you've paid your bank in fees over the last 12 months." }
        ]
      },
      {
        title: "Stocks, Bonds & Index Funds — The Honest Truth",
        content: [
          { type: "quote", text: "The stock market is a device for transferring money from the impatient to the patient.", author: "Warren Buffett" },
          { type: "heading", text: "Three categories — and what the wealthy actually do" },
          { type: "body", text: "Stocks: fractional ownership of a company. Bonds: lending money to governments or corporations in exchange for interest. Index funds: diversified exposure to a market segment without picking individual stocks." },
          { type: "callout", text: "Buffett publicly recommends low-cost S&P 500 index funds for most Americans. He has said this repeatedly in shareholder letters. Yet the financial advisory industry makes billions selling actively managed funds that underperform the index 85% of the time — while charging 1-2% annual fees. Follow the incentives." },
          { type: "vault", title: "VAULT SECRET: What the Wealthy Actually Hold", text: "The ultra-wealthy don't primarily build wealth through the stock market. They build it through ownership — of businesses, real estate, and intellectual property that generates cash flow. Stock market investments are often where they park excess capital. The stock market is a tool. Ownership of productive assets is the actual engine. The financial industry doesn't profit from teaching you to own businesses — they profit from managing your portfolio." },
          { type: "action", text: "Research: compare a target-date retirement fund's fees vs a Vanguard S&P 500 index fund over 30 years on $100,000. The difference will shock you." }
        ]
      },
      {
        title: "Real Estate — The Wealth Machine They Can't Print More Of",
        content: [
          { type: "quote", text: "Real estate cannot be lost or stolen, nor can it be carried away. Purchased with common sense, paid for in full, and managed with reasonable care, it is about the safest investment in the world.", author: "Franklin D. Roosevelt" },
          { type: "heading", text: "Four ways real estate builds wealth simultaneously" },
          { type: "list", items: ["Cash Flow — rental income above all expenses", "Appreciation — values historically rise over time", "Loan Paydown — tenants effectively pay your mortgage", "Tax Advantages — depreciation, deductions, and deferrals"] },
          { type: "callout", text: "The government incentivizes real estate ownership more than any other asset class. Why? Because real estate develops communities, houses workers, and stimulates economies. Knowing these incentives and using them is not cheating — it's what every wealthy real estate investor does by default." },
          { type: "vault", title: "VAULT SECRET: 1031 Exchange & Cost Segregation", text: "A 1031 Exchange allows you to sell investment real estate and roll ALL proceeds into a new property — deferring capital gains taxes indefinitely. Do this enough times and the gain never gets taxed in your lifetime. At death, heirs receive stepped-up basis and the gain evaporates. Cost segregation is an accounting strategy where an engineer breaks down a property's components — appliances, flooring, landscaping — and depreciates them faster. This creates massive paper losses that offset real income. A $1M property might generate $150K+ in paper losses in year one through cost segregation. Legal. Used by every sophisticated real estate investor." },
          { type: "action", text: "Research median rent prices in your city and compare to median mortgage payments on similar properties. Is there cash flow potential in your market?" }
        ]
      },
      {
        title: "Retirement Accounts — The Hidden Power Most People Ignore",
        content: [
          { type: "heading", text: "The government is actually on your side here" },
          { type: "body", text: "This is one area where the system legitimately offers the average person a real advantage. 401(k), Traditional IRA, and Roth IRA accounts provide tax advantages that compound significantly over decades. Employer 401(k) matching is literally free money — yet millions of Americans leave it unclaimed." },
          { type: "callout", text: "The Roth IRA is arguably the most powerful wealth-building vehicle available to people under a certain income threshold. Money grows completely tax-free. Withdrawals in retirement are tax-free. No required minimum distributions if you don't need the money. You can pass it to heirs. The wealthy who qualify use it aggressively." },
          { type: "vault", title: "VAULT SECRET: Backdoor Roth & Roth Conversion Ladder", text: "High earners can't contribute directly to a Roth IRA due to income limits. So they use the 'Backdoor Roth' — contributing to a Traditional IRA and immediately converting it. Completely legal. Used by thousands of high-income earners annually. The Roth Conversion Ladder is used by early retirees: convert Traditional IRA funds to Roth over years of low-income, paying minimal taxes, creating a tax-free income stream in retirement. The IRS allows this. Your financial advisor may not have mentioned it because it reduces the fees they charge on your taxable accounts." },
          { type: "action", text: "Find out: does your employer offer a 401(k) match? If yes, are you contributing at least enough to capture the full match? If not, calculate the exact dollar amount you are leaving on the table annually." }
        ]
      },
      {
        title: "Credit — The Score That Controls Your Access to Capital",
        content: [
          { type: "heading", text: "Credit is not debt. It's leverage." },
          { type: "body", text: "Most people are taught to fear credit. The wealthy use it as a tool. A strong credit profile gives you access to capital at low interest rates — which means you can borrow money cheaply and deploy it into assets that return more than the cost of borrowing." },
          { type: "callout", text: "Poor credit doesn't just cost you on loans. It costs you on car insurance in most states. Rental applications. Security deposits. Business partnerships. Even some job applications. A low score is a tax on everything — paid silently and continuously by those who can least afford it." },
          { type: "vault", title: "VAULT SECRET: Business Credit is a Separate System", text: "Your personal credit and your business credit are two entirely separate profiles. Most people don't know this. A new LLC can begin building business credit through a DUNS number, net-30 vendor accounts (Uline, Grainger, Quill), and a business credit card. Within 12-24 months, a properly structured business can access credit lines that have nothing to do with your personal social security number or personal credit score. The business takes the liability. Your personal credit stays clean. This is how sophisticated entrepreneurs separate personal financial exposure from business risk." },
          { type: "action", text: "Pull your free credit report at AnnualCreditReport.com. Identify every negative item and look up the statute of limitations for removal in your state." }
        ]
      },
      {
        title: "Comparing Wealth Paths — Employee vs Owner",
        content: [
          { type: "quote", text: "The problem with the rat race is that even if you win, you're still a rat.", author: "Lily Tomlin" },
          { type: "heading", text: "The system taxes labor. It subsidizes ownership." },
          { type: "body", text: "W-2 employees pay income tax, Social Security tax (6.2%), and Medicare tax (1.45%) — all before they spend a dollar. Business owners pay themselves after deducting legitimate business expenses, can choose their salary structure, and access retirement contribution strategies unavailable to employees." },
          { type: "callout", text: "An S-Corp owner can pay themselves a reasonable salary — say $60,000 — and take additional profit as distributions, which are not subject to self-employment tax. On $150,000 in business income, the difference in tax treatment compared to W-2 can be $10,000-$20,000 annually. That's not illegal. That's the tax code doing exactly what it was designed to do — reward business ownership." },
          { type: "vault", title: "VAULT SECRET: The Solo 401(k) for Self-Employed", text: "A self-employed individual or LLC owner can contribute to a Solo 401(k) as BOTH employer and employee — up to $66,000+ annually (2024 limits). This creates a massive tax deduction for high earners while building retirement wealth. A W-2 employee is limited to $23,000 in contributions. The business owner can contribute nearly 3x that. Same income. Completely different outcome. The tax code rewards those who understand it." },
          { type: "action", text: "Calculate the difference in take-home pay between earning $100,000 as a W-2 employee vs a properly structured S-Corp owner in your state. Use a tax calculator. Write what you find." }
        ]
      }
    ],
    quiz: [
      { q: "Fractional reserve banking means:", options: ["Banks keep all deposits in a vault", "Banks loan out multiples of their actual deposits", "Banks only accept gold", "Banks are fully government-owned"], correct: 1 },
      { q: "A 1031 Exchange allows investors to:", options: ["Avoid all taxes permanently", "Defer capital gains by reinvesting into another property", "Sell stocks tax-free", "Access retirement funds early"], correct: 1 },
      { q: "An index fund is designed to:", options: ["Hold many investments in one fund", "Guarantee profits every year", "Replace all savings accounts", "Eliminate market risk entirely"], correct: 0 },
      { q: "The Roth IRA's main advantage is:", options: ["Tax-free growth and tax-free withdrawals in retirement", "Immediate tax deduction on contributions", "No contribution limits", "Guaranteed returns"], correct: 0 },
      { q: "Business credit differs from personal credit in that:", options: ["It doesn't exist", "It's a separate profile that doesn't require your SSN for all accounts", "It always requires personal guarantees", "It's only for corporations"], correct: 1 },
      { q: "An S-Corp salary structure can reduce taxes by:", options: ["Eliminating income tax entirely", "Allowing some profit to be taken as distributions not subject to self-employment tax", "Hiding income from the IRS", "Moving income offshore automatically"], correct: 1 },
      { q: "Which strategy can create large paper losses to offset real income in real estate?", options: ["Flipping houses", "Cost segregation", "Renting below market", "Paying cash for properties"], correct: 1 },
      { q: "The Backdoor Roth IRA is primarily used by:", options: ["People with no income", "High-income earners who exceed direct Roth contribution limits", "People under age 18", "Foreign nationals only"], correct: 1 },
      { q: "A Solo 401(k) allows self-employed individuals to contribute:", options: ["Only $6,000 annually", "As both employer and employee — up to $66,000+", "Nothing until age 50", "Only in gold"], correct: 1 },
      { q: "The tax code primarily rewards:", options: ["High-income W-2 employees", "Business ownership and investment income over labor income", "People who save cash", "Those who spend the most"], correct: 1 }
    ]
  },
  {
    id: 3, title: "Introduction to Crypto & Blockchain", subtitle: "The technology they couldn't contain",
    icon: "⛓", tag: "CRYPTO", duration: "55–70 min", xpReward: 500,
    lessons: [
      {
        title: "What Problem Does Blockchain Actually Solve?",
        content: [
          { type: "quote", text: "Bitcoin is a remarkable cryptographic achievement and the ability to create something that is not duplicable in the digital world has enormous value.", author: "Eric Schmidt, Former Google CEO" },
          { type: "heading", text: "The Trust Problem" },
          { type: "body", text: "Every financial transaction you make is controlled by a middleman. Your bank approves or denies your wire. PayPal freezes your account. A government can freeze an entire banking system overnight. We saw this in Canada in 2022 when protesters had their accounts frozen without trial. We saw it in Cyprus in 2013 when banks confiscated a percentage of every deposit above €100,000 to bail out the government. These are not conspiracy theories. These are documented events." },
          { type: "callout", text: "Blockchain doesn't ask for permission. It doesn't require trust in any single institution. It runs on consensus — thousands of nodes validating every transaction simultaneously. To alter a transaction, you'd need to control 51% of the entire network simultaneously. That's the first truly trustless financial system in human history." },
          { type: "vault", title: "VAULT SECRET: Why Governments Fear Bitcoin", text: "A central bank controls inflation, interest rates, and the money supply — the three most powerful economic levers in a nation. Bitcoin has a fixed supply of 21 million coins, coded in from day one. No government, no board, no executive order can change this. This is why Bitcoin is called 'hard money.' It cannot be debased by printing. No central authority controls it. For governments built on the power to print money, this is an existential threat. Watch the regulatory environment carefully — the attack will always come labeled as 'protecting consumers.'" },
          { type: "action", text: "Research: What happened to Cyprus bank depositors in 2013? What happened to Canadian truckers' bank accounts in 2022? Write what you find." }
        ]
      },
      {
        title: "Bitcoin & Ethereum — Two Different Revolutions",
        content: [
          { type: "quote", text: "Bitcoin is Gold 2.0.", author: "Tyler Winklevoss" },
          { type: "heading", text: "Not all crypto is the same" },
          { type: "body", text: "Bitcoin was designed as one thing: peer-to-peer electronic cash with a fixed supply. No CEO. No headquarters. No shutdown switch. It has processed trillions of dollars in value without a single day of downtime since 2009. Ethereum introduced programmability — smart contracts that execute automatically when conditions are met. No lawyers, no banks, no middlemen required to enforce agreements." },
          { type: "callout", text: "Ethereum enabled an entire new financial system built on code — DeFi (Decentralized Finance). Loans, exchanges, insurance, and yield — all operating without banks. In 2020-2021, DeFi grew from $1 billion to $100 billion in locked value in under 18 months. The traditional financial industry had to watch from the sidelines." },
          { type: "vault", title: "VAULT SECRET: Why Institutions Are Buying Bitcoin", text: "MicroStrategy holds over 200,000 Bitcoin on its corporate balance sheet. BlackRock, the world's largest asset manager with $10 trillion AUM, launched a Bitcoin ETF. El Salvador made Bitcoin legal tender. These are not random events. Institutions and sovereigns are quietly moving out of dollars and into hard assets. The retail investor is always the last to know — and typically pays the highest price for being last." },
          { type: "action", text: "Write one sentence describing Bitcoin and one sentence describing Ethereum in your own words — not the definition you read. Your understanding, your words." }
        ]
      },
      {
        title: "Solana & Why Speed Matters for the New Economy",
        content: [
          { type: "heading", text: "Not every blockchain optimizes the same way" },
          { type: "body", text: "Bitcoin prioritizes security and decentralization above all else — at the cost of speed and transaction cost. Ethereum prioritizes programmability. Solana was built for throughput — 65,000 transactions per second, sub-second finality, fractions of a cent per transaction. For real-world adoption, speed matters enormously." },
          { type: "callout", text: "Iron Vault Token is built on Solana. This is a deliberate choice. Fast settlement means distributions can flow to token holders automatically and immediately. Low fees mean small holders aren't priced out by transaction costs. Real estate income on-chain needs to move like digital cash — not wait 10 minutes and cost $30 per transaction." },
          { type: "vault", title: "VAULT SECRET: Puerto Rico Act 60", text: "If you establish residency in Puerto Rico and qualify under Act 60 (formerly Acts 20 and 22), your capital gains tax rate drops to 0%. Zero. Not reduced — eliminated. Your crypto gains, your investment gains, realized after establishing bona fide residency — pay no federal capital gains tax and no Puerto Rico capital gains tax. This is a U.S. territory. It uses U.S. dollars. It has U.S. infrastructure. And it has a tax treaty with the mainland that creates this window. The wealthy know about it. Most people have never heard of it." },
          { type: "action", text: "Look up Solana's current transaction speed and cost vs Ethereum's. Then look up what Act 60 requires for qualification." }
        ]
      },
      {
        title: "Wallets, Private Keys & Self-Custody",
        content: [
          { type: "heading", text: "Not your keys. Not your coins." },
          { type: "body", text: "When you keep crypto on an exchange, you don't own it — you own a claim on it. FTX had $32 billion in customer assets in 2022. In November of that year, customer withdrawals were frozen. The money was gone. Celsius Network — same story. BlockFi — same story. Three major platforms. Millions of users. Billions in losses. All because users didn't hold their own keys." },
          { type: "callout", text: "Self-custody through a hardware wallet (Ledger, Trezor) means the asset is mathematically yours. No platform can freeze it, lose it, or loan it out. The private key is the only thing that matters. Whoever holds the key holds the asset. This is the first time in history that regular people can hold sovereign assets with no counterparty risk." },
          { type: "vault", title: "VAULT SECRET: The Seed Phrase is Your Vault", text: "Your 12 or 24-word seed phrase is worth exactly as much as the assets secured by it. Treat it accordingly. Do not photograph it. Do not store it digitally. Do not speak it to anyone claiming to be 'support.' Engrave it on steel. Store copies in separate physical locations. Trusts and estate planning can include crypto instructions — consult an estate attorney familiar with digital assets. This is how you pass crypto to heirs without probate and without anyone knowing what you hold." },
          { type: "action", text: "Write three security habits you would follow before holding any crypto in self-custody." }
        ]
      },
      {
        title: "What a Token Actually Is — And How to Evaluate One",
        content: [
          { type: "heading", text: "Most tokens are worthless. A few change everything." },
          { type: "body", text: "A token is a digital asset issued on a blockchain. The range is enormous — from Bitcoin with a $1 trillion+ market cap backed by 15 years of security, to tokens created in minutes by anonymous developers that disappear overnight. The difference between them is utility, transparency, team, economics, and time." },
          { type: "list", items: ["Utility tokens: enable access or function within a system", "Governance tokens: grant voting rights over a protocol", "Stablecoins: designed to maintain stable value", "Asset-backed tokens: connected to real-world value (RWA)", "Meme/community tokens: driven by culture and speculation"] },
          { type: "callout", text: "The question that separates sophisticated participants from gamblers: 'If price never moved, would this token still have value?' If the answer is no — it's speculation, not investment." },
          { type: "action", text: "Pick two tokens. For each, answer: What does it do? Who uses it? Why does it need to be a token? What drives demand beyond price speculation?" }
        ]
      },
      {
        title: "Risks Everyone Ignores — Including the Ones You Can't See",
        content: [
          { type: "quote", text: "Risk comes from not knowing what you're doing.", author: "Warren Buffett" },
          { type: "heading", text: "The risks they tell you about — and the ones they don't" },
          { type: "list", items: ["Market Risk — prices can move 80% in either direction rapidly", "Scam Risk — phishing, fake giveaways, rug pulls, impersonation, fake support", "Regulatory Risk — governments can restrict access, classify assets, impose taxes", "Technology Risk — exchange failures, smart contract exploits, wallet errors", "Emotional Risk — the most expensive and least discussed"] },
          { type: "callout", text: "The emotional risk in crypto is categorically different from traditional markets because it never closes. It trades 24/7, 365 days a year. 3am panic sells. Weekend manipulation. Holiday flash crashes. Your brain was not designed for this. The investors who survive long-term are not the smartest — they're the most disciplined." },
          { type: "vault", title: "VAULT SECRET: The Regulatory Playbook", text: "When governments can't stop a technology, they regulate it. Watch for three tactics: (1) Classification — labeling tokens as securities forces compliance and limits retail access. (2) Taxation — treating every swap and trade as a taxable event creates compliance burden that pushes out small participants. (3) Exchange licensing — restricting which exchanges can operate in a jurisdiction limits access. None of this stops the underlying technology. It just temporarily advantages those with resources to navigate compliance — which is always the existing wealthy class. Stay informed. Stay adaptive." },
          { type: "action", text: "Write three personal rules you would follow before ever buying any digital asset. Make them specific enough that you would actually follow them." }
        ]
      }
    ],
    quiz: [
      { q: "Blockchain technology primarily attempts to solve:", options: ["Making all investments risk-free", "The need to trust a central middleman for records and transfers", "Eliminating taxes worldwide", "Guaranteeing profits for users"], correct: 1 },
      { q: "What happened to FTX customer funds in November 2022?", options: ["They doubled in value", "Withdrawals were frozen and billions were lost", "They were transferred to Bitcoin", "The government reimbursed everyone"], correct: 1 },
      { q: "'Not your keys, not your coins' means:", options: ["You should change passwords frequently", "Crypto on exchanges is not truly yours until in self-custody", "Keys are required to open blockchain apps", "Bitcoin requires a physical key"], correct: 1 },
      { q: "Solana was selected for Iron Vault Token primarily because:", options: ["It's the cheapest blockchain to use", "It offers high speed and low fees suited for real-world asset distribution", "It has the most users globally", "It requires no regulation"], correct: 1 },
      { q: "Bitcoin's supply is fixed at:", options: ["100 million coins", "21 million coins", "1 billion coins", "It increases annually with inflation"], correct: 1 },
      { q: "Puerto Rico Act 60 can reduce capital gains tax to:", options: ["15%", "10%", "5%", "0%"], correct: 3 },
      { q: "A seed phrase should be:", options: ["Stored in a password manager app", "Photographed and saved to the cloud", "Engraved on steel and stored in multiple physical locations", "Shared with a trusted exchange for recovery"], correct: 2 },
      { q: "Which of the following is a common crypto risk many ignore?", options: ["Rug pulls and phishing scams", "Guaranteed monthly returns", "Government insurance on all wallets", "Automatic fraud reversal"], correct: 0 },
      { q: "The question that separates investment from speculation in tokens is:", options: ["Will the price go up?", "Does any influencer promote it?", "If price never moved, would this token still have value?", "Is it listed on Coinbase?"], correct: 2 },
      { q: "A responsible beginner approach to crypto is:", options: ["Borrow money to invest quickly", "Invest more than you can afford to lose", "Learn first and use only risk capital if participating", "Buy based only on hype"], correct: 2 }
    ]
  },
  {
    id: 4, title: "Digital Assets & Modern Wealth", subtitle: "The strategies they keep to themselves",
    icon: "⚡", tag: "STRATEGY", duration: "50–65 min", xpReward: 500,
    lessons: [
      {
        title: "Stablecoins & Real-World Asset Backing",
        content: [
          { type: "heading", text: "Stability in a volatile world" },
          { type: "body", text: "Stablecoins are digital assets designed to maintain a stable value — usually pegged to the U.S. dollar. They allow you to move money globally in seconds, earn yield on-chain, and settle transactions without cryptocurrency volatility. Common uses: international payments, DeFi liquidity, settlement between platforms." },
          { type: "list", items: ["Cash-backed (USDC, USDT) — dollar reserves held by a custodian", "Government security-backed — short-term treasuries as collateral", "Crypto-overcollateralized (DAI) — crypto reserves exceeding the issued value", "Algorithmic (historically high-risk — see Terra/Luna 2022)"] },
          { type: "callout", text: "Real-World Asset (RWA) tokens go further — connecting on-chain digital tokens directly to real estate, bonds, invoices, or other physical assets. This is the bridge between traditional finance and decentralized infrastructure. It's where Iron Vault operates." },
          { type: "vault", title: "VAULT SECRET: Yield on Stablecoins", text: "While your bank pays 0.01% on savings, DeFi protocols currently offer 4-8% APY on stablecoin deposits. Platforms like Aave and Compound allow you to lend stablecoins to borrowers who over-collateralize with crypto. No bank approval. No minimum. Risks exist — smart contract exploits, protocol failures — but the yield differential is real and significant. The wealthy who understand DeFi have been earning 5-10x bank rates for years." },
          { type: "action", text: "Research one stablecoin. Write how it maintains its peg, what backs it, and what risks exist if that backing fails." }
        ]
      },
      {
        title: "Revenue-Sharing Models & How to Evaluate Them",
        content: [
          { type: "heading", text: "When tokens share real economics — and when they're lying" },
          { type: "body", text: "Some token ecosystems attempt to distribute a portion of real platform revenue to holders — through fee sharing, staking rewards, treasury distributions, or asset-generated income. These models can be powerful when real economics exist. They are traps when they don't." },
          { type: "callout", text: "The critical question: Where does the money actually come from? If the answer is 'new investor deposits' — that's not revenue sharing. That's a Ponzi structure. Real revenue comes from external economic activity: rental income, transaction fees from actual users, licensing, or services. Transparent. Auditable. Real." },
          { type: "vault", title: "VAULT SECRET: The LLC + On-Chain Income Structure", text: "Sophisticated Web3 operators structure their token income through LLCs, receive distributions as business income, and deploy that capital strategically into additional assets. The entity — not the person — participates in the ecosystem. Business income has deductions available that personal income does not. Legal fees, software, education, travel for business purposes — all potentially deductible against crypto income when properly structured. Consult a tax professional familiar with digital assets. This is a frontier area where structure matters enormously." },
          { type: "action", text: "Write the difference between 'real revenue' and 'speculative hype' in your own words. Then apply that test to three projects you've heard of." }
        ]
      },
      {
        title: "Token Utility vs Speculation — Know What You're Buying",
        content: [
          { type: "heading", text: "Utility makes assets. Speculation makes bubbles." },
          { type: "body", text: "Utility means a token enables something real — access, payments, governance, fee reduction, network usage. Speculation means buying because you expect someone else to pay more later. Both exist in every market. The error is thinking speculation is investment." },
          { type: "callout", text: "A useful diagnostic: if the founding team disappeared tomorrow, would the token still have value? Strong utility tokens power systems that exist independent of any team. Pure speculation tokens are entirely dependent on continued promotion and narrative maintenance." },
          { type: "vault", title: "VAULT SECRET: The Accredited Investor Wall", text: "The most lucrative investment opportunities — private equity, venture capital, certain real estate syndications, hedge funds — are legally restricted to 'accredited investors' (net worth over $1M excluding primary residence, or income over $200K). This wall keeps average people out of the best deals while institutional capital compounds. Tokenization is starting to break this wall. Real estate syndications on-chain with $500 minimums. Private credit accessible to retail. The democratization is real — and the establishment hates it for exactly that reason." },
          { type: "action", text: "Choose one token. List every use case you can verify. If speculation is the only story, write that honestly." }
        ]
      },
      {
        title: "The Infinite Banking Concept — How the Wealthy Use Life Insurance",
        content: [
          { type: "quote", text: "The greatest financial secret of the wealthy is not stocks or real estate. It's cash value life insurance — and they've been using it for 200 years.", author: "Nelson Nash, Becoming Your Own Banker" },
          { type: "heading", text: "This is the play most financial advisors won't explain" },
          { type: "body", text: "A properly structured Indexed Universal Life (IUL) or Whole Life insurance policy builds cash value over time. That cash value is an asset you can borrow against at low interest rates. The loan is not taxable income. The policy continues to grow as if you hadn't borrowed." },
          { type: "callout", text: "The structure: You fund the policy aggressively. Cash value grows tax-deferred, indexed to market gains with a floor protecting against loss. You borrow against cash value to invest in real estate, business, or other assets. Cash flow from those assets repays the loan. Your policy keeps compounding. Repeat. The wealthy call this 'Be Your Own Bank.'" },
          { type: "vault", title: "VAULT SECRET: The Trust + Life Insurance Strategy", text: "Place a $1M+ life insurance policy inside an Irrevocable Life Insurance Trust (ILIT). The trust — not you — owns the policy. The death benefit passes to heirs completely outside of your estate, avoiding estate taxes entirely on that amount. The trust can be structured to borrow against the cash value during your lifetime. The trust now has a $1M asset it can leverage. Invest borrowed capital into cash-flowing assets. Cash flow services the policy loan. Asset appreciates. At death, trust distributes tax-free to heirs. This is generational wealth infrastructure. It's legal. It's been used by banking families for over a century. It requires a specialized estate attorney and a knowledgeable insurance professional. Most people never hear about it because there's no recurring fee for anyone to explain it to you once." },
          { type: "action", text: "Research: What is an Irrevocable Life Insurance Trust (ILIT)? Write how it differs from owning a life insurance policy personally." }
        ]
      },
      {
        title: "Tax Strategy — Legal Structures the Wealthy Actually Use",
        content: [
          { type: "quote", text: "The avoidance of taxes is the only intellectual pursuit that carries any reward.", author: "John Maynard Keynes" },
          { type: "heading", text: "Tax avoidance is legal. Tax evasion is not. Know the difference." },
          { type: "body", text: "Tax avoidance — using legal strategies to minimize your tax liability — is not only legal, it's expected. The tax code is literally an instruction manual for reducing your taxes, written by legislators who themselves use every strategy available." },
          { type: "callout", text: "The U.S. tax code taxes different types of income at radically different rates. W-2 wages can be taxed up to 37% federal. Long-term capital gains are taxed at 0%, 15%, or 20%. Qualified dividends — same rates. Carried interest (hedge fund managers) — taxed as capital gains. Distributions from certain entities — lower rates. The system is not neutral. It was designed with winners in mind." },
          { type: "vault", title: "VAULT SECRET: The 'On-Paper-Broke' LLC Strategy", text: "A legitimately operating LLC can receive business income while the owner takes a modest personal salary. The LLC pays for business expenses — reducing taxable income. The owner's W-2 or personal income appears modest. When personal income is low enough, the individual may qualify for ACA health subsidies, certain tax credits, and income-tested government programs — all while the LLC holds and builds assets. This is 100% legal when the LLC is legitimately operating and expenses are genuine business expenses. Wealthy people do not personally own their cars, homes, or anything they can legitimately put in an entity. The entity takes the deduction. The person takes the lifestyle. This is basic tax strategy that took wealthy families generations to perfect and costs nothing but knowledge to implement." },
          { type: "action", text: "Research: What is the difference between a Schedule C sole proprietorship, an LLC, and an S-Corp? Write the tax treatment differences for each." }
        ]
      },
      {
        title: "Building a Sustainable Strategy — Process Over Prediction",
        content: [
          { type: "quote", text: "Compound interest is the eighth wonder of the world. He who understands it, earns it. He who doesn't, pays it.", author: "Albert Einstein (attributed)" },
          { type: "heading", text: "A sustainable strategy looks boring from the outside" },
          { type: "list", items: ["Learn deeply before committing capital", "Build the entity structure before building the portfolio", "Use only risk capital — money you could lose without crisis", "Dollar-cost average into volatile assets over time", "Diversify across asset classes, not just within crypto", "Hold for long enough to let compounding work", "Review quarterly — not daily"] },
          { type: "callout", text: "The enemy of wealth is not the tax man or the market. It's impatience. The people who lost the most in every crash were those who needed the money tomorrow. The people who built wealth were those who stayed alive long enough to be right." },
          { type: "vault", title: "VAULT SECRET: The Portfolio of the Informed", text: "A sophisticated participant in 2025 might hold: cash flow real estate (core wealth engine), index funds (passive market exposure), a small Bitcoin position (hard money hedge against dollar debasement), a small allocation to emerging assets like tokenized RWA (asymmetric upside), and permanent life insurance cash value (tax-free growth, leverage vehicle). Not one or the other. All of them, properly sized. This is not radical. This is what diversified private wealth looks like when you've been educated correctly." },
          { type: "action", text: "Write three personal rules your future self would thank you for. Make them behavioral — not about returns, about process." }
        ]
      }
    ],
    quiz: [
      { q: "A stablecoin is generally designed to:", options: ["Increase in price every month", "Maintain a relatively stable value", "Replace all stocks permanently", "Eliminate taxes"], correct: 1 },
      { q: "The Infinite Banking Concept involves:", options: ["Hiding money in Swiss accounts", "Using life insurance cash value as a personal borrowing facility", "Investing only in index funds", "Opening multiple checking accounts"], correct: 1 },
      { q: "An Irrevocable Life Insurance Trust (ILIT) primarily benefits heirs by:", options: ["Paying them monthly during your lifetime", "Passing death benefits outside the taxable estate", "Replacing a will", "Providing government matching funds"], correct: 1 },
      { q: "The 'on-paper-broke' LLC strategy works because:", options: ["It hides income illegally", "The LLC legitimately receives income and deducts business expenses, reducing personal taxable income", "LLCs don't pay taxes ever", "Only applies to corporations"], correct: 1 },
      { q: "Token utility means the token provides:", options: ["Guaranteed profits", "Access or function within an ecosystem independent of price", "Automatic government insurance", "Free tax refunds"], correct: 1 },
      { q: "The Accredited Investor standard historically excludes regular people from:", options: ["Opening bank accounts", "The most lucrative private investment opportunities", "Buying public stocks", "Filing taxes"], correct: 1 },
      { q: "Long-term capital gains are taxed compared to W-2 wages:", options: ["At identical rates", "At significantly lower rates", "At higher rates", "They are not taxed at all"], correct: 1 },
      { q: "Why is the Roth IRA powerful for wealth building?", options: ["Contributions are tax-deductible", "Growth and qualifying withdrawals are completely tax-free", "It has no contribution limits", "It guarantees returns"], correct: 1 },
      { q: "In the Buy, Borrow, Die strategy, borrowing against assets is advantageous because:", options: ["Loans carry zero interest", "Loan proceeds are not taxable income", "It eliminates estate taxes automatically", "Banks are required to approve these loans"], correct: 1 },
      { q: "A sustainable crypto strategy primarily emphasizes:", options: ["Borrowing heavily and trading emotionally", "Learning first, building structure, and using only risk capital", "Buying every trending asset immediately", "Relying on tips from social media"], correct: 1 }
    ]
  },
  {
    id: 5, title: "The Iron Vault System", subtitle: "Why we built this. What comes next.",
    icon: "🛡", tag: "IRON VAULT", duration: "45–60 min", xpReward: 500,
    lessons: [
      {
        title: "The Iron Vault 3-Phase Vision",
        content: [
          { type: "quote", text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
          { type: "heading", text: "Phase 1 — Community & Education (Now)" },
          { type: "body", text: "Before a single token is sold at scale, the community must understand what they're participating in. This is not standard practice in crypto. Most projects launch first, educate never, and wonder why their communities panic-sell at the first dip. Iron Vault inverts the model. Education is the product. The token is the reward for being informed." },
          { type: "heading", text: "Phase 2 — Real Asset Acquisition & Revenue" },
          { type: "body", text: "Income-producing real-world assets — real estate and related opportunities — provide the economic engine. Rental income, appreciation, and cash flow from physical assets tied to digital infrastructure. Subject to market conditions, execution quality, and regulatory compliance." },
          { type: "heading", text: "Phase 3 — Digital Infrastructure Expansion" },
          { type: "body", text: "Additional financial tools, expanded token utility, and asset-linked digital products — if legally and operationally viable. The roadmap is phased deliberately. Foundation first. Expansion when earned." },
          { type: "callout", text: "A phased model is the opposite of how most projects are marketed. No promises of instant returns. No manufactured urgency. The community that understands the system is the asset. Everything else is built on top of that." },
          { type: "action", text: "Write which phase you believe creates the most long-term value — and defend your reasoning." }
        ]
      },
      {
        title: "How Real Assets Connect to Digital Systems",
        content: [
          { type: "heading", text: "Real substance + digital efficiency = the actual opportunity" },
          { type: "body", text: "Traditional real estate is powerful but slow. Buying takes months. Selling takes months. Ownership records are on paper or in county databases. Distributions to investors require wire transfers, accounting, and human coordination. Blockchain changes all of this." },
          { type: "callout", text: "A smart contract can hold rental income and distribute it proportionally to token holders within seconds of receipt — automatically, transparently, and without a third party taking a cut. The property manager collects rent. The smart contract receives it. Token holders receive their share. On-chain, auditable, instant." },
          { type: "vault", title: "VAULT SECRET: How Iron Vault's Smart Contracts Work", text: "Iron Vault's distribution mechanism is structured to receive income from real-world asset activity and allocate it according to token holdings recorded on-chain. When the contract triggers, it reads token balances, calculates proportional shares, and executes distributions — without manual intervention, without a bank transfer, without a middleman skimming the transaction. Every distribution is publicly verifiable on the Solana blockchain. No trust required. The code is the agreement." },
          { type: "action", text: "Name one real-world asset class that would benefit most from this kind of automated, transparent distribution infrastructure." }
        ]
      },
      {
        title: "Why Education-First Is Actually the Strategy",
        content: [
          { type: "quote", text: "The man who does not read has no advantage over the man who cannot read.", author: "Mark Twain" },
          { type: "heading", text: "Uninformed money is emotional money — and emotional money is exploitable" },
          { type: "body", text: "The history of financial markets is a history of the informed transferring wealth from the uninformed during moments of fear and greed. The crash of 2008: informed banks sold mortgage-backed securities to uninformed pension funds. The crypto crashes: informed insiders sold to uninformed retail at the top. The pattern is consistent. The solution is knowledge." },
          { type: "callout", text: "An educated community doesn't panic. Educated participants ask better questions. They recognize manipulation, can evaluate claims independently, and hold through volatility because they understand what they own. This is not idealism — it's strategic. A panic-resistant community is a stronger community. And a stronger community is a more valuable ecosystem." },
          { type: "body", text: "This is why you're here. This is why this course exists before the token launch. Not as marketing. As infrastructure." },
          { type: "action", text: "Write one thing you understand now that you didn't before this course. Be specific." }
        ]
      },
      {
        title: "Risks, Disclosures & Eyes Wide Open",
        content: [
          { type: "heading", text: "Every opportunity carries real risk. Honesty here is non-negotiable." },
          { type: "list", items: ["Market Risk — token value can decline significantly and rapidly", "Execution Risk — plans may delay, underperform, or change", "Regulatory Risk — laws governing digital assets continue to evolve", "Liquidity Risk — buying or selling may be difficult in certain market conditions", "Technology Risk — smart contract bugs, network outages, wallet vulnerabilities", "Team Risk — execution depends on human performance and decision-making"] },
          { type: "callout", text: "There are no guarantees. Not of returns, not of appreciation, not of success. Anyone who tells you otherwise is either uninformed or dishonest. The difference between Iron Vault and most projects is that we tell you this before you participate — not in fine print afterward." },
          { type: "body", text: "A mature participant asks: What can go wrong? — before asking: What if this works? If you cannot answer the first question, you are not ready to participate." },
          { type: "action", text: "Write the top three risks that concern you personally. Then write how you would manage each one before committing capital." }
        ]
      },
      {
        title: "What You Do After This Course",
        content: [
          { type: "heading", text: "Knowledge without action is expensive entertainment" },
          { type: "list", items: ["Step 1: Pause. Do not make emotional decisions because you feel motivated.", "Step 2: Organize your financial foundation — emergency fund, debt plan, basic budget.", "Step 3: Evaluate your entity structure. Do you have an LLC? Should you?", "Step 4: If participating in digital assets — learn self-custody first.", "Step 5: Continue learning. This course is a starting point, not a destination."] },
          { type: "callout", text: "The gap between knowing and doing is where most people stay permanently. The people who act on what they learn — even imperfectly — are the ones who look back in five years grateful they started." },
          { type: "vault", title: "VAULT SECRET: The First Move Most People Skip", text: "Before you buy your first investment, open a business checking account under an LLC. Before that, form the LLC ($50-200 in most states). Before that, get an EIN from the IRS (free, takes 5 minutes online). These three steps create the legal separation that protects your personal assets, opens business credit, enables business deductions, and positions you to operate as an entity rather than an individual. Most people skip this entirely and build wealth in their personal name — exposed, taxable, and vulnerable. Do it first. Everything else is easier from there." },
          { type: "action", text: "Write a 30-day action plan. Include at least one concrete structural move — not just 'save money.'" }
        ]
      },
      {
        title: "Completion — What You Now Know That Most People Don't",
        content: [
          { type: "quote", text: "The first step to getting the things you want out of life is this: Decide what you want.", author: "Ben Stein" },
          { type: "heading", text: "You have crossed a threshold most people never approach" },
          { type: "body", text: "Most people will spend their entire lives inside a financial system they don't understand, paying taxes they don't have to, building wealth they never reach. They weren't lazy. They weren't stupid. They were never taught. The information in this course has existed for decades — locked inside expensive accountants, private family offices, and word-of-mouth among the wealthy." },
          { type: "callout", text: "You now know: how money is created, how it's debased, and how to protect yourself. How the tax code rewards ownership over labor. How entities separate your personal exposure from your financial activity. How real assets connect to digital infrastructure. How to evaluate an opportunity without being manipulated. How to build — not just earn." },
          { type: "body", text: "The system was designed by people who understood it, for people who didn't. You've closed that gap. Use it wisely, patiently, and with full awareness of the risks. And share it — because the awakening of one person helps everyone." },
          { type: "action", text: "Answer: What belief about money changed most? What action will you take in the next 7 days? What mistake will you now avoid?" }
        ]
      }
    ],
    quiz: [
      { q: "Iron Vault's Phase 1 focuses on:", options: ["Immediate token launch and sales", "Community building and education before scale", "Eliminating all financial intermediaries", "Guaranteed monthly distributions"], correct: 1 },
      { q: "Iron Vault's smart contracts are built on:", options: ["Ethereum", "Bitcoin", "Solana", "Cardano"], correct: 2 },
      { q: "Real-world asset tokenization can improve:", options: ["Only marketing optics", "Transparency, distribution speed, and accessibility", "Nothing that traditional finance can't already do", "Government tax collection"], correct: 1 },
      { q: "An education-first model benefits the community by:", options: ["Guaranteeing profits for early participants", "Creating panic-resistant, informed participants less susceptible to manipulation", "Replacing all legal disclosures", "Removing all investment risk"], correct: 1 },
      { q: "Which of the following is a real risk Iron Vault discloses?", options: ["Execution delays and regulatory changes", "Guaranteed upside only", "Automatic liquidity always available", "No downside exists"], correct: 0 },
      { q: "The first structural financial move most people skip is:", options: ["Buying Bitcoin immediately", "Forming an LLC and opening a business checking account", "Moving to Puerto Rico", "Buying a rental property"], correct: 1 },
      { q: "Financial literacy is best viewed as:", options: ["A one-time certificate to earn", "An ongoing, lifelong strategic advantage", "Something only relevant if you're wealthy", "Unrelated to everyday decisions"], correct: 1 },
      { q: "Smart contract distributions are advantageous because:", options: ["They require bank approval to process", "They execute automatically, proportionally, and publicly on-chain", "They are only accessible to accredited investors", "They eliminate all tax obligations"], correct: 1 },
      { q: "There are guarantees of returns, success, or appreciation in Iron Vault:", options: ["Yes, as stated in the smart contract", "Only for founding members", "No — participation involves real risk", "Yes, backed by government insurance"], correct: 2 },
      { q: "The appropriate mindset after completing this course is:", options: ["Rush into all available investment opportunities immediately", "Share nothing — information is power to keep private", "Apply knowledge deliberately, structurally, and with full awareness of risk", "Wait until the market is perfect before acting"], correct: 2 }
    ]
  }
];

const PASS_SCORE = 8;
const TOTAL_XP = MODULES.reduce((s, m) => s + m.xpReward, 0);

// ─── STYLES ────────────────────────────────────────────────────────────────
const CSS = `
  ${FONTS}
  *{box-sizing:border-box;margin:0;padding:0;}
  
  .iv{
    min-height:100vh;
    background:#080808;
    color:#E8E8E8;
    font-family:'DM Sans',sans-serif;
    position:relative;
    overflow-x:hidden;
  }
  
  /* Grid texture */
  .iv::before{
    content:'';
    position:fixed;inset:0;
    background-image:
      linear-gradient(rgba(123,47,190,0.04) 1px,transparent 1px),
      linear-gradient(90deg,rgba(123,47,190,0.04) 1px,transparent 1px);
    background-size:80px 80px;
    pointer-events:none;z-index:0;
  }
  
  /* Purple glow top right */
  .iv::after{
    content:'';
    position:fixed;top:-300px;right:-300px;
    width:800px;height:800px;
    background:radial-gradient(circle,rgba(123,47,190,0.08) 0%,transparent 70%);
    pointer-events:none;z-index:0;
  }

  /* ── AUTH ── */
  .iv-auth{
    min-height:100vh;
    display:flex;align-items:center;justify-content:center;
    padding:24px;position:relative;z-index:1;
  }
  
  .iv-auth-card{
    width:100%;max-width:460px;
    background:#0F0F0F;
    border:1px solid rgba(123,47,190,0.3);
    border-radius:6px;padding:48px 40px;
    animation:fadeUp 0.5s ease;
    position:relative;overflow:hidden;
  }
  
  .iv-auth-card::before{
    content:'';position:absolute;top:0;left:0;right:0;height:2px;
    background:linear-gradient(90deg,transparent,#7B2FBE,#AAFF00,transparent);
  }
  
  .iv-auth-logo{
    display:flex;align-items:center;gap:10px;
    font-family:'Bebas Neue',sans-serif;
    font-size:22px;letter-spacing:3px;color:#fff;
    margin-bottom:32px;
  }
  
  .iv-dot{
    width:10px;height:10px;
    background:#AAFF00;border-radius:50%;
    box-shadow:0 0 12px #AAFF00;
    animation:glow 2s infinite;
  }
  
  .iv-auth-title{
    font-family:'Bebas Neue',sans-serif;
    font-size:44px;line-height:1;letter-spacing:2px;
    color:#fff;margin-bottom:6px;
  }
  .iv-auth-title span{color:#AAFF00;}
  
  .iv-auth-sub{font-size:14px;color:#555;line-height:1.6;margin-bottom:28px;}
  
  .iv-tab-row{
    display:flex;gap:0;margin-bottom:28px;
    border:1px solid #1E1E1E;border-radius:4px;overflow:hidden;
  }
  .iv-tab{
    flex:1;padding:10px;text-align:center;
    font-family:'Space Mono',monospace;font-size:11px;letter-spacing:2px;
    cursor:pointer;transition:all 0.2s;
    background:#0F0F0F;color:#555;border:none;
  }
  .iv-tab.active{background:#7B2FBE;color:#fff;}
  
  .iv-label{
    display:block;
    font-family:'Space Mono',monospace;font-size:9px;
    letter-spacing:2px;color:#7B2FBE;margin-bottom:8px;
  }
  .iv-input{
    width:100%;background:#080808;
    border:1px solid #1E1E1E;border-radius:3px;
    padding:14px 16px;color:#E8E8E8;
    font-family:'DM Sans',sans-serif;font-size:15px;
    outline:none;transition:border-color 0.2s;margin-bottom:14px;
  }
  .iv-input:focus{border-color:#7B2FBE;}
  .iv-input::placeholder{color:#333;}
  
  .iv-btn{
    width:100%;border:none;border-radius:3px;
    padding:16px;font-family:'Bebas Neue',sans-serif;
    font-size:18px;letter-spacing:2px;
    cursor:pointer;transition:all 0.2s;
  }
  .iv-btn-lime{background:#AAFF00;color:#080808;}
  .iv-btn-lime:hover{background:#BFFF33;transform:translateY(-1px);}
  .iv-btn-purple{background:#7B2FBE;color:#fff;}
  .iv-btn-purple:hover{background:#9D4EDD;}
  .iv-btn-ghost{
    background:none;border:1px solid #2A2A2A;
    color:#888;border-radius:3px;
    padding:12px 24px;
    font-family:'Bebas Neue',sans-serif;
    font-size:15px;letter-spacing:2px;cursor:pointer;
    transition:all 0.2s;
  }
  .iv-btn-ghost:hover{border-color:#7B2FBE;color:#7B2FBE;}
  
  .iv-auth-note{
    margin-top:16px;font-size:11px;color:#444;
    text-align:center;line-height:1.6;
  }

  /* ── HEADER ── */
  .iv-header{
    background:#0F0F0F;border-bottom:1px solid #1A1A1A;
    padding:0 28px;
    display:flex;align-items:center;justify-content:space-between;
    height:60px;position:sticky;top:0;z-index:100;
  }
  .iv-logo{
    display:flex;align-items:center;gap:10px;
    font-family:'Bebas Neue',sans-serif;
    font-size:18px;letter-spacing:3px;color:#fff;
  }
  .iv-xp-wrap{display:flex;align-items:center;gap:12px;}
  .iv-xp-label{font-family:'Space Mono',monospace;font-size:10px;color:#555;letter-spacing:1px;}
  .iv-xp-track{width:140px;height:3px;background:#1A1A1A;border-radius:2px;overflow:hidden;}
  .iv-xp-fill{height:100%;background:linear-gradient(90deg,#7B2FBE,#AAFF00);transition:width 0.8s ease;box-shadow:0 0 8px rgba(170,255,0,0.3);}
  .iv-xp-val{font-family:'Space Mono',monospace;font-size:12px;color:#AAFF00;font-weight:700;}
  .iv-chip{
    display:flex;align-items:center;gap:8px;
    background:#141414;border:1px solid #1E1E1E;
    border-radius:20px;padding:5px 14px;
    font-size:12px;color:#555;cursor:pointer;
    transition:all 0.2s;
  }
  .iv-chip:hover{border-color:#7B2FBE;color:#fff;}

  /* ── HUB ── */
  .iv-hub{min-height:100vh;position:relative;z-index:1;}
  .iv-wrap{max-width:1080px;margin:0 auto;padding:44px 28px;}
  
  .iv-eyebrow{
    font-family:'Space Mono',monospace;font-size:9px;
    letter-spacing:3px;color:#AAFF00;margin-bottom:10px;
  }
  .iv-h1{
    font-family:'Bebas Neue',sans-serif;
    font-size:52px;line-height:1;letter-spacing:2px;
    color:#fff;margin-bottom:10px;
  }
  .iv-sub{font-size:14px;color:#555;line-height:1.6;max-width:460px;margin-bottom:40px;}
  
  /* Stats */
  .iv-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:44px;}
  .iv-stat{
    background:#0F0F0F;border:1px solid #1A1A1A;
    border-radius:4px;padding:18px;position:relative;overflow:hidden;
  }
  .iv-stat::after{
    content:'';position:absolute;bottom:0;left:0;right:0;height:1px;
    background:linear-gradient(90deg,transparent,rgba(170,255,0,0.15),transparent);
  }
  .iv-stat-l{font-family:'Space Mono',monospace;font-size:8px;letter-spacing:2px;color:#444;margin-bottom:8px;}
  .iv-stat-v{font-family:'Bebas Neue',sans-serif;font-size:34px;color:#AAFF00;line-height:1;}
  .iv-stat-u{font-family:'Space Mono',monospace;font-size:9px;color:#444;margin-top:4px;}
  
  /* Module cards */
  .iv-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px;}
  .iv-card{
    background:#0F0F0F;border:1px solid #1A1A1A;
    border-radius:4px;padding:24px;cursor:pointer;
    transition:all 0.2s;position:relative;overflow:hidden;
    animation:fadeUp 0.4s ease both;
  }
  .iv-card:hover:not(.locked){border-color:rgba(123,47,190,0.5);transform:translateY(-2px);box-shadow:0 8px 32px rgba(0,0,0,0.5);}
  .iv-card.locked{opacity:0.35;cursor:not-allowed;}
  .iv-card.passed{border-color:rgba(170,255,0,0.2);}
  .iv-card:not(.locked):not(.passed)::before,
  .iv-card.passed::before{
    content:'';position:absolute;top:0;left:0;right:0;height:2px;
  }
  .iv-card:not(.locked):not(.passed)::before{background:linear-gradient(90deg,transparent,#7B2FBE,transparent);}
  .iv-card.passed::before{background:linear-gradient(90deg,transparent,#AAFF00,transparent);}
  
  .iv-card-hd{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:16px;}
  .iv-icon{
    width:44px;height:44px;background:rgba(123,47,190,0.15);
    border:1px solid rgba(123,47,190,0.3);border-radius:4px;
    display:flex;align-items:center;justify-content:center;font-size:20px;
  }
  .iv-badge{
    font-family:'Space Mono',monospace;font-size:8px;letter-spacing:2px;
    padding:4px 10px;border-radius:2px;
  }
  .b-lock{color:#333;background:#141414;}
  .b-avail{color:#AAFF00;background:rgba(170,255,0,0.08);border:1px solid rgba(170,255,0,0.2);}
  .b-prog{color:#7B2FBE;background:rgba(123,47,190,0.1);border:1px solid rgba(123,47,190,0.3);}
  .b-pass{color:#AAFF00;background:rgba(170,255,0,0.1);border:1px solid rgba(170,255,0,0.3);}
  
  .iv-prog-bar{height:2px;background:#1A1A1A;border-radius:1px;margin-bottom:14px;overflow:hidden;}
  .iv-prog-fill{height:100%;background:linear-gradient(90deg,#7B2FBE,#AAFF00);transition:width 0.5s;}
  .iv-prog-fill.green{background:linear-gradient(90deg,#AAFF00,#88FF44);}
  
  .iv-card-tag{font-family:'Space Mono',monospace;font-size:8px;letter-spacing:2px;color:#7B2FBE;margin-bottom:5px;}
  .iv-card-title{font-family:'Bebas Neue',sans-serif;font-size:20px;letter-spacing:1px;color:#fff;margin-bottom:5px;line-height:1.1;}
  .iv-card-sub{font-size:12px;color:#444;line-height:1.5;margin-bottom:16px;}
  .iv-card-ft{display:flex;align-items:center;gap:14px;padding-top:14px;border-top:1px solid #141414;}
  .iv-meta{font-family:'Space Mono',monospace;font-size:9px;color:#444;}
  .iv-meta span{color:#666;}

  /* ── MODULE PAGE ── */
  .iv-page{max-width:860px;margin:0 auto;padding:44px 28px;}
  .iv-back{
    display:inline-flex;align-items:center;gap:8px;
    background:none;border:1px solid #1E1E1E;border-radius:2px;
    padding:9px 18px;color:#555;
    font-family:'Space Mono',monospace;font-size:10px;letter-spacing:1px;
    cursor:pointer;transition:all 0.2s;margin-bottom:28px;
  }
  .iv-back:hover{border-color:#7B2FBE;color:#AAFF00;}
  
  .iv-lessons{display:flex;flex-direction:column;gap:10px;margin-bottom:24px;}
  .iv-lesson-row{
    background:#0F0F0F;border:1px solid #1A1A1A;border-radius:4px;
    padding:18px 22px;display:flex;align-items:center;gap:18px;
    cursor:pointer;transition:all 0.2s;
  }
  .iv-lesson-row:hover:not(.l-locked){border-color:rgba(123,47,190,0.4);}
  .iv-lesson-row.l-locked{opacity:0.35;cursor:not-allowed;}
  .iv-ln{font-family:'Space Mono',monospace;font-size:11px;color:#444;min-width:28px;}
  .iv-lt{flex:1;font-size:14px;color:#E8E8E8;font-weight:500;}
  .iv-lc{
    width:22px;height:22px;border-radius:50%;
    display:flex;align-items:center;justify-content:center;
    font-size:11px;flex-shrink:0;
  }
  .lc-done{background:rgba(170,255,0,0.1);color:#AAFF00;border:1px solid rgba(170,255,0,0.3);}
  .lc-avail{background:rgba(123,47,190,0.1);color:#7B2FBE;border:1px solid rgba(123,47,190,0.3);}
  .lc-pend{background:#141414;color:#333;border:1px solid #1E1E1E;}
  
  .iv-quiz-box{
    background:#0F0F0F;border:1px solid rgba(170,255,0,0.15);
    border-radius:4px;padding:24px;
    display:flex;align-items:center;justify-content:space-between;gap:16px;
  }
  .iv-quiz-box.locked{opacity:0.35;}
  .iv-quiz-box h3{font-family:'Bebas Neue',sans-serif;font-size:20px;letter-spacing:1px;color:#fff;margin-bottom:3px;}
  .iv-quiz-box p{font-size:12px;color:#444;}
  .iv-quiz-box .pass{color:#AAFF00;margin-top:3px;}
  .iv-qbtn{
    background:#AAFF00;border:none;border-radius:3px;
    padding:12px 26px;color:#080808;
    font-family:'Bebas Neue',sans-serif;font-size:15px;letter-spacing:2px;
    cursor:pointer;transition:all 0.2s;white-space:nowrap;flex-shrink:0;
  }
  .iv-qbtn:hover{background:#BFFF33;}
  .iv-qbtn:disabled{opacity:0.4;cursor:not-allowed;}

  /* ── LESSON ── */
  .iv-lesson-view{max-width:740px;margin:0 auto;padding:44px 28px;position:relative;z-index:1;}
  .iv-lesson-nav{display:flex;align-items:center;justify-content:space-between;margin-bottom:36px;}
  .iv-lesson-ctr{font-family:'Space Mono',monospace;font-size:10px;color:#444;}
  .iv-lesson-hd{margin-bottom:32px;}
  .iv-lesson-tag{font-family:'Space Mono',monospace;font-size:9px;letter-spacing:2px;color:#7B2FBE;margin-bottom:8px;}
  .iv-lesson-title{font-family:'Bebas Neue',sans-serif;font-size:36px;letter-spacing:1px;color:#fff;line-height:1.1;}
  
  .iv-body-stack{display:flex;flex-direction:column;gap:22px;margin-bottom:36px;}
  
  /* Content blocks */
  .c-quote{
    border-left:3px solid #7B2FBE;padding:16px 20px;
    background:rgba(123,47,190,0.04);border-radius:0 4px 4px 0;
  }
  .c-quote blockquote{font-size:15px;color:#B8A8D8;font-style:italic;line-height:1.7;margin-bottom:8px;}
  .c-quote cite{font-family:'Space Mono',monospace;font-size:9px;color:#7B2FBE;letter-spacing:1px;}
  
  .c-heading{
    font-family:'Bebas Neue',sans-serif;font-size:22px;letter-spacing:1px;
    color:#fff;border-left:3px solid #AAFF00;padding-left:14px;
  }
  
  .c-body{font-size:14px;color:#777;line-height:1.85;}
  
  .c-callout{
    background:rgba(170,255,0,0.04);
    border-left:3px solid #AAFF00;border-radius:0 4px 4px 0;
    padding:16px 20px;font-size:14px;color:#AAD870;line-height:1.7;
  }
  
  .c-list{display:flex;flex-direction:column;gap:10px;}
  .c-list-item{display:flex;align-items:flex-start;gap:12px;font-size:14px;color:#777;line-height:1.6;}
  .c-list-item::before{content:'▸';color:#7B2FBE;flex-shrink:0;margin-top:2px;}
  
  .c-action{
    background:rgba(123,47,190,0.06);border:1px solid rgba(123,47,190,0.2);
    border-radius:4px;padding:16px 18px;
    display:flex;gap:12px;align-items:flex-start;
  }
  .c-action-label{font-family:'Space Mono',monospace;font-size:8px;letter-spacing:2px;color:#7B2FBE;flex-shrink:0;margin-top:2px;}
  .c-action-text{font-size:13px;color:#7B2FBE;line-height:1.6;}
  
  /* VAULT SECRET — gold Easter egg */
  .c-vault{
    background:rgba(201,162,39,0.05);
    border:1px solid rgba(201,162,39,0.25);
    border-radius:4px;padding:20px;position:relative;overflow:hidden;
  }
  .c-vault::before{
    content:'';position:absolute;top:0;left:0;right:0;height:1px;
    background:linear-gradient(90deg,transparent,#C9A227,transparent);
  }
  .c-vault-label{
    display:flex;align-items:center;gap:8px;
    font-family:'Space Mono',monospace;font-size:9px;letter-spacing:2px;
    color:#C9A227;margin-bottom:12px;
  }
  .c-vault-title{font-family:'Bebas Neue',sans-serif;font-size:16px;letter-spacing:1px;color:#C9A227;}
  .c-vault-text{font-size:13px;color:#A08830;line-height:1.75;}
  
  .iv-lesson-footer{display:flex;justify-content:flex-end;padding-top:20px;border-top:1px solid #141414;}

  /* ── QUIZ ── */
  .iv-quiz-view{max-width:740px;margin:0 auto;padding:44px 28px;position:relative;z-index:1;}
  .iv-q-prog-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;}
  .iv-q-prog-label{font-family:'Space Mono',monospace;font-size:10px;color:#444;}
  .iv-q-prog-track{height:2px;background:#1A1A1A;border-radius:1px;overflow:hidden;margin-bottom:28px;}
  .iv-q-prog-fill{height:100%;background:linear-gradient(90deg,#7B2FBE,#AAFF00);transition:width 0.3s;}
  
  .iv-q-card{
    background:#0F0F0F;border:1px solid #1A1A1A;
    border-radius:4px;padding:28px;margin-bottom:20px;
    animation:fadeUp 0.25s ease;
  }
  .iv-q-num{font-family:'Space Mono',monospace;font-size:9px;letter-spacing:2px;color:#7B2FBE;margin-bottom:14px;}
  .iv-q-text{font-size:17px;font-weight:600;color:#fff;line-height:1.5;margin-bottom:24px;}
  
  .iv-opts{display:flex;flex-direction:column;gap:10px;}
  .iv-opt{
    background:#080808;border:1px solid #1E1E1E;border-radius:4px;
    padding:14px 18px;cursor:pointer;font-size:13px;color:#666;
    text-align:left;transition:all 0.2s;display:flex;align-items:center;gap:14px;
  }
  .iv-opt:hover:not(.sel):not(.dis){border-color:rgba(123,47,190,0.4);color:#E8E8E8;}
  .iv-opt.sel{border-color:#7B2FBE;background:rgba(123,47,190,0.08);color:#E8E8E8;}
  .iv-opt.correct{border-color:#AAFF00!important;background:rgba(170,255,0,0.06)!important;color:#AAFF00!important;}
  .iv-opt.wrong{border-color:#EF4444!important;background:rgba(239,68,68,0.06)!important;color:#EF4444!important;}
  .iv-opt.dis{cursor:default;}
  .iv-opt-l{
    font-family:'Space Mono',monospace;font-size:10px;
    width:22px;height:22px;border-radius:2px;
    background:#141414;display:flex;align-items:center;justify-content:center;
    flex-shrink:0;color:#444;transition:all 0.2s;
  }
  .iv-opt.sel .iv-opt-l{background:#7B2FBE;color:#fff;}
  .iv-opt.correct .iv-opt-l{background:#AAFF00;color:#080808;}
  .iv-opt.wrong .iv-opt-l{background:#EF4444;color:#fff;}
  
  .iv-q-footer{display:flex;justify-content:space-between;align-items:center;}
  .iv-q-score{font-family:'Space Mono',monospace;font-size:11px;color:#444;}

  /* ── RESULTS ── */
  .iv-results{
    max-width:600px;margin:0 auto;
    padding:64px 28px;text-align:center;
    position:relative;z-index:1;animation:fadeUp 0.4s ease;
  }
  .iv-results-icon{font-size:60px;margin-bottom:16px;display:block;}
  .iv-results-score{font-family:'Bebas Neue',sans-serif;font-size:88px;line-height:1;margin-bottom:6px;}
  .rs-pass{color:#AAFF00;text-shadow:0 0 30px rgba(170,255,0,0.3);}
  .rs-fail{color:#EF4444;}
  .iv-results-title{font-family:'Bebas Neue',sans-serif;font-size:28px;letter-spacing:2px;color:#fff;margin-bottom:10px;}
  .iv-results-sub{font-size:14px;color:#555;max-width:380px;margin:0 auto 28px;line-height:1.6;}
  .iv-results-xp{
    display:inline-flex;align-items:center;gap:10px;
    background:rgba(170,255,0,0.08);border:1px solid rgba(170,255,0,0.2);
    border-radius:4px;padding:12px 24px;margin-bottom:28px;
    font-family:'Space Mono',monospace;font-size:13px;color:#AAFF00;
  }
  .iv-results-btns{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;}

  /* Confetti */
  .confetti-piece{
    position:fixed;width:8px;height:8px;
    animation:fall linear both;z-index:999;pointer-events:none;
  }
  @keyframes fall{
    0%{transform:translateY(-10px) rotate(0);opacity:1;}
    100%{transform:translateY(100vh) rotate(720deg);opacity:0;}
  }
  @keyframes fadeUp{
    from{opacity:0;transform:translateY(14px);}
    to{opacity:1;transform:translateY(0);}
  }
  @keyframes glow{
    0%,100%{box-shadow:0 0 8px #AAFF00;}
    50%{box-shadow:0 0 20px #AAFF00;}
  }

  @media(max-width:768px){
    .iv-stats{grid-template-columns:repeat(2,1fr);}
    .iv-header{padding:0 16px;}
    .iv-wrap,.iv-page,.iv-lesson-view,.iv-quiz-view{padding:28px 16px;}
    .iv-h1{font-size:38px;}
    .iv-xp-track{width:80px;}
    .iv-chip{display:none;}
    .iv-quiz-box{flex-direction:column;align-items:flex-start;}
    .iv-results-btns{flex-direction:column;}
  }
`;

// ─── HELPERS ───────────────────────────────────────────────────────────────
function Confetti() {
  const colors = ["#AAFF00","#7B2FBE","#C9A227","#ffffff","#88FF44","#9D4EDD"];
  return Array.from({length:70},(_,i)=>({
    id:i,color:colors[i%colors.length],
    left:Math.random()*100,delay:Math.random()*2.5,dur:2+Math.random()*2
  })).map(p=>(
    <div key={p.id} className="confetti-piece" style={{
      left:`${p.left}%`,background:p.color,
      animationDelay:`${p.delay}s`,animationDuration:`${p.dur}s`,
      borderRadius:Math.random()>0.5?"50%":"2px"
    }}/>
  ));
}

function ContentBlock({b}){
  switch(b.type){
    case "quote": return (
      <div className="c-quote">
        <blockquote>"{b.text}"</blockquote>
        <cite>— {b.author}</cite>
      </div>
    );
    case "heading": return <div className="c-heading">{b.text}</div>;
    case "body": return <div className="c-body">{b.text}</div>;
    case "callout": return <div className="c-callout">{b.text}</div>;
    case "list": return (
      <div className="c-list">
        {b.items.map((item,i)=><div key={i} className="c-list-item">{item}</div>)}
      </div>
    );
    case "action": return (
      <div className="c-action">
        <span className="c-action-label">ACTION</span>
        <span className="c-action-text">{b.text}</span>
      </div>
    );
    case "vault": return (
      <div className="c-vault">
        <div className="c-vault-label">
          <span>🔐</span>
          <span>VAULT SECRET</span>
          <span style={{flex:1,height:'1px',background:'linear-gradient(90deg,rgba(201,162,39,0.3),transparent)',marginLeft:8}}/>
        </div>
        <div className="c-vault-title">{b.title}</div>
        <div style={{height:8}}/>
        <div className="c-vault-text">{b.text}</div>
      </div>
    );
    default: return null;
  }
}

// ─── MAIN ─────────────────────────────────────────────────────────────────
export default function IronVaultAcademy(){
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const displayName = user?.fullName || user?.firstName || "Student";
  const displayEmail = user?.primaryEmailAddress?.emailAddress || "";

  // Navigation
  const [view, setView] = useState("hub");
  const [modIdx, setModIdx] = useState(0);
  const [lessonIdx, setLessonIdx] = useState(0);
  const [confetti, setConfetti] = useState(false);

  // Progress
  const [progress, setProgress] = useState(
    MODULES.map(()=>({done:new Set(),score:null,passed:false}))
  );

  // Quiz
  const [answers, setAnswers] = useState({});
  const [curQ, setCurQ] = useState(0);
  const [revealed, setRevealed] = useState(false);

  // Computed
  const totalXP = progress.reduce((s,p,i)=>s+(p.passed?MODULES[i].xpReward:0),0);
  const modsDone = progress.filter(p=>p.passed).length;
  const lessonsDone = progress.reduce((s,p)=>s+p.done.size,0);
  const totalLessons = MODULES.reduce((s,m)=>s+m.lessons.length,0);

  function modStatus(i){
    if(i===0){
      if(progress[0].passed) return "passed";
      if(progress[0].done.size>0) return "progress";
      return "available";
    }
    if(!progress[i-1].passed) return "locked";
    if(progress[i].passed) return "passed";
    if(progress[i].done.size>0) return "progress";
    return "available";
  }

  function lessonStatus(mi,li){
    if(progress[mi].done.has(li)) return "done";
    const prev = li===0 ? true : progress[mi].done.has(li-1);
    return prev ? "available" : "locked";
  }

  function allLessonsDone(mi){ return progress[mi].done.size >= MODULES[mi].lessons.length; }

  function markDone(mi,li){
    setProgress(prev=>{
      const next=prev.map(p=>({...p,done:new Set(p.done)}));
      next[mi].done.add(li);
      return next;
    });
  }

  function startQuiz(){
    setAnswers({});setCurQ(0);setRevealed(false);setView("quiz");
  }

  function selectOpt(oi){ if(!revealed) setAnswers(a=>({...a,[curQ]:oi})); }

  function confirmAns(){ setRevealed(true); }

  function nextQ(){
    const quiz=MODULES[modIdx].quiz;
    if(curQ<quiz.length-1){ setCurQ(q=>q+1); setRevealed(false); }
    else {
      const score=quiz.reduce((s,q,i)=>s+(answers[i]===q.correct?1:0),0);
      const passed=score>=PASS_SCORE;
      setProgress(prev=>{
        const next=prev.map(p=>({...p,done:new Set(p.done)}));
        next[modIdx].score=score; next[modIdx].passed=passed;
        return next;
      });
      if(passed){setConfetti(true);setTimeout(()=>setConfetti(false),4000);}
      setView("results");
    }
  }

  const letters=["A","B","C","D"];

  if(!isLoaded) return null;
  if(!isSignedIn) return null;

  // ── HUB ──
  if(view==="hub"){
    return(
      <div className="iv">
        <style>{CSS}</style>
        <header className="iv-header">
          <div className="iv-logo"><div className="iv-dot"/>IRON VAULT</div>
          <div className="iv-xp-wrap">
            <span className="iv-xp-label">XP</span>
            <div className="iv-xp-track"><div className="iv-xp-fill" style={{width:`${(totalXP/TOTAL_XP)*100}%`}}/></div>
            <span className="iv-xp-val">{totalXP.toLocaleString()}</span>
          </div>
          <div className="iv-chip" onClick={async()=>{ await signOut(); setProgress(MODULES.map(()=>({done:new Set(),score:null,passed:false}))); }}>
            👤 {displayName}{displayEmail ? ` · ${displayEmail}` : ""} · Sign Out
          </div>
        </header>
        <div className="iv-hub">
          <div className="iv-wrap">
            <div className="iv-eyebrow">▸ FINANCIAL INTELLIGENCE SYSTEM</div>
            <h1 className="iv-h1">Your Vault<br/>Dashboard</h1>
            <p className="iv-sub">Complete each module in sequence. Pass the quiz at 8/10 to unlock the next level. This knowledge was always available — now it's yours.</p>

            <div className="iv-stats">
              <div className="iv-stat"><div className="iv-stat-l">VAULT XP</div><div className="iv-stat-v">{totalXP.toLocaleString()}</div><div className="iv-stat-u">of {TOTAL_XP.toLocaleString()} total</div></div>
              <div className="iv-stat"><div className="iv-stat-l">MODULES PASSED</div><div className="iv-stat-v">{modsDone}</div><div className="iv-stat-u">of {MODULES.length}</div></div>
              <div className="iv-stat"><div className="iv-stat-l">LESSONS DONE</div><div className="iv-stat-v">{lessonsDone}</div><div className="iv-stat-u">of {totalLessons}</div></div>
              <div className="iv-stat"><div className="iv-stat-l">PASS THRESHOLD</div><div className="iv-stat-v">80<span style={{fontSize:16}}>%</span></div><div className="iv-stat-u">8 of 10 correct</div></div>
            </div>

            <div className="iv-eyebrow" style={{marginBottom:14}}>▸ CURRICULUM</div>
            <div className="iv-grid">
              {MODULES.map((mod,i)=>{
                const st=modStatus(i);
                const pct=(progress[i].done.size/mod.lessons.length)*100;
                return(
                  <div key={mod.id} className={`iv-card ${st==="locked"?"locked":""} ${st==="passed"?"passed":""}`}
                    style={{animationDelay:`${i*0.07}s`}}
                    onClick={()=>{ if(st!=="locked"){setModIdx(i);setView("module");} }}>
                    <div className="iv-card-hd">
                      <div className="iv-icon">{mod.icon}</div>
                      <div className={`iv-badge ${st==="locked"?"b-lock":st==="passed"?"b-pass":st==="progress"?"b-prog":"b-avail"}`}>
                        {st==="locked"?"🔒 LOCKED":st==="passed"?"✓ PASSED":st==="progress"?"● IN PROGRESS":"▶ AVAILABLE"}
                      </div>
                    </div>
                    <div className="iv-prog-bar">
                      <div className={`iv-prog-fill ${st==="passed"?"green":""}`} style={{width:st==="passed"?"100%":`${pct}%`}}/>
                    </div>
                    <div className="iv-card-tag">MODULE {String(mod.id).padStart(2,"0")} ▸ {mod.tag}</div>
                    <div className="iv-card-title">{mod.title}</div>
                    <div className="iv-card-sub">{mod.subtitle}</div>
                    <div className="iv-card-ft">
                      <div className="iv-meta">⏱ <span>{mod.duration}</span></div>
                      <div className="iv-meta">📖 <span>{mod.lessons.length} lessons</span></div>
                      <div className="iv-meta">⚡ <span style={{color:"#AAFF00"}}>{mod.xpReward}xp</span></div>
                      {progress[i].score!==null&&<div className="iv-meta" style={{color:progress[i].passed?"#AAFF00":"#EF4444"}}>Quiz:{progress[i].score}/10</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── MODULE PAGE ──
  if(view==="module"){
    const mod=MODULES[modIdx];
    const allDone=allLessonsDone(modIdx);
    return(
      <div className="iv">
        <style>{CSS}</style>
        <header className="iv-header">
          <div className="iv-logo"><div className="iv-dot"/>IRON VAULT</div>
          <div className="iv-xp-wrap">
            <span className="iv-xp-label">XP</span>
            <div className="iv-xp-track"><div className="iv-xp-fill" style={{width:`${(totalXP/TOTAL_XP)*100}%`}}/></div>
            <span className="iv-xp-val">{totalXP.toLocaleString()}</span>
          </div>
          <div className="iv-chip">👤 {displayName}</div>
        </header>
        <div className="iv-page">
          <button className="iv-back" onClick={()=>setView("hub")}>← DASHBOARD</button>
          <div className="iv-eyebrow">MODULE {String(mod.id).padStart(2,"0")} ▸ {mod.tag}</div>
          <h1 className="iv-h1" style={{marginBottom:6}}>{mod.title}</h1>
          <p className="iv-sub" style={{marginBottom:36}}>{mod.subtitle}</p>
          <div className="iv-eyebrow" style={{marginBottom:12}}>▸ LESSONS</div>
          <div className="iv-lessons">
            {mod.lessons.map((lesson,li)=>{
              const ls=lessonStatus(modIdx,li);
              return(
                <div key={li} className={`iv-lesson-row ${ls==="locked"?"l-locked":""}`}
                  onClick={()=>{ if(ls!=="locked"){setLessonIdx(li);setView("lesson");} }}>
                  <span className="iv-ln">{String(li+1).padStart(2,"0")}</span>
                  <span className="iv-lt">{lesson.title}</span>
                  <div className={`iv-lc ${ls==="done"?"lc-done":ls==="available"?"lc-avail":"lc-pend"}`}>
                    {ls==="done"?"✓":ls==="available"?"▶":"🔒"}
                  </div>
                </div>
              );
            })}
          </div>
          <div className={`iv-quiz-box ${!allDone?"locked":""}`}>
            <div>
              <h3>MODULE QUIZ</h3>
              <p>10 questions · 8/10 to pass · Unlimited retakes</p>
              {progress[modIdx].passed && <p className="pass">✓ Passed — {progress[modIdx].score}/10</p>}
              {!allDone && <p style={{color:"#333",marginTop:4}}>Complete all lessons to unlock</p>}
            </div>
            <button className="iv-qbtn" disabled={!allDone} onClick={()=>{ if(allDone) startQuiz(); }}>
              {progress[modIdx].passed?"RETAKE QUIZ":"START QUIZ →"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── LESSON ──
  if(view==="lesson"){
    const mod=MODULES[modIdx];
    const lesson=mod.lessons[lessonIdx];
    const isLast=lessonIdx===mod.lessons.length-1;
    function complete(){
      markDone(modIdx,lessonIdx);
      if(isLast) setView("module");
      else setLessonIdx(l=>l+1);
    }
    return(
      <div className="iv">
        <style>{CSS}</style>
        <header className="iv-header">
          <div className="iv-logo"><div className="iv-dot"/>IRON VAULT</div>
          <div className="iv-xp-wrap">
            <span className="iv-xp-label">XP</span>
            <div className="iv-xp-track"><div className="iv-xp-fill" style={{width:`${(totalXP/TOTAL_XP)*100}%`}}/></div>
            <span className="iv-xp-val">{totalXP.toLocaleString()}</span>
          </div>
          <div className="iv-chip">👤 {displayName}</div>
        </header>
        <div className="iv-lesson-view">
          <div className="iv-lesson-nav">
            <button className="iv-back" style={{margin:0}} onClick={()=>setView("module")}>← MODULE</button>
            <span className="iv-lesson-ctr">LESSON {lessonIdx+1} / {mod.lessons.length}</span>
          </div>
          <div className="iv-lesson-hd">
            <div className="iv-lesson-tag">MODULE {modIdx+1} ▸ {mod.tag}</div>
            <h1 className="iv-lesson-title">{lesson.title}</h1>
          </div>
          <div className="iv-body-stack">
            {lesson.content.map((b,i)=><ContentBlock key={i} b={b}/>)}
          </div>
          <div className="iv-lesson-footer">
            <button className="iv-btn iv-btn-lime" style={{width:"auto",padding:"14px 32px"}} onClick={complete}>
              {isLast?"COMPLETE MODULE ✓":"NEXT LESSON →"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── QUIZ ──
  if(view==="quiz"){
    const quiz=MODULES[modIdx].quiz;
    const q=quiz[curQ];
    const sel=answers[curQ];
    const correctSoFar=Object.entries(answers).filter(([i,a])=>quiz[parseInt(i)].correct===a).length;
    return(
      <div className="iv">
        <style>{CSS}</style>
        <header className="iv-header">
          <div className="iv-logo"><div className="iv-dot"/>IRON VAULT</div>
          <div className="iv-xp-wrap">
            <span className="iv-xp-label">XP</span>
            <div className="iv-xp-track"><div className="iv-xp-fill" style={{width:`${(totalXP/TOTAL_XP)*100}%`}}/></div>
            <span className="iv-xp-val">{totalXP.toLocaleString()}</span>
          </div>
          <div className="iv-chip">👤 {displayName}</div>
        </header>
        <div className="iv-quiz-view">
          <button className="iv-back" onClick={()=>setView("module")}>← MODULE</button>
          <div className="iv-q-prog-row">
            <span className="iv-q-prog-label">QUESTION {curQ+1} / {quiz.length}</span>
            <span className="iv-q-prog-label">{MODULES[modIdx].title}</span>
          </div>
          <div className="iv-q-prog-track">
            <div className="iv-q-prog-fill" style={{width:`${((curQ+(revealed?1:0))/quiz.length)*100}%`}}/>
          </div>
          <div className="iv-q-card" key={curQ}>
            <div className="iv-q-num">▸ QUESTION {String(curQ+1).padStart(2,"0")}</div>
            <div className="iv-q-text">{q.q}</div>
            <div className="iv-opts">
              {q.options.map((opt,oi)=>{
                let cls="iv-opt";
                if(revealed){ cls+=" dis"; if(oi===q.correct) cls+=" correct"; else if(oi===sel&&oi!==q.correct) cls+=" wrong"; }
                else if(sel===oi) cls+=" sel";
                return(
                  <button key={oi} className={cls} onClick={()=>selectOpt(oi)}>
                    <span className="iv-opt-l">{letters[oi]}</span>{opt}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="iv-q-footer">
            <span className="iv-q-score">{revealed?`${correctSoFar} correct so far`:`Need ${PASS_SCORE}/10 to pass`}</span>
            {!revealed
              ? <button className="iv-qbtn" style={{opacity:sel===undefined?0.4:1}} disabled={sel===undefined} onClick={confirmAns}>CONFIRM</button>
              : <button className="iv-qbtn" onClick={nextQ}>{curQ<quiz.length-1?"NEXT →":"SEE RESULTS →"}</button>
            }
          </div>
        </div>
      </div>
    );
  }

  // ── RESULTS ──
  if(view==="results"){
    const score=progress[modIdx].score;
    const passed=progress[modIdx].passed;
    const mod=MODULES[modIdx];
    const hasNext=modIdx+1<MODULES.length;
    return(
      <div className="iv">
        <style>{CSS}</style>
        {confetti&&passed&&<Confetti/>}
        <header className="iv-header">
          <div className="iv-logo"><div className="iv-dot"/>IRON VAULT</div>
          <div className="iv-xp-wrap">
            <span className="iv-xp-label">XP</span>
            <div className="iv-xp-track"><div className="iv-xp-fill" style={{width:`${(totalXP/TOTAL_XP)*100}%`}}/></div>
            <span className="iv-xp-val">{totalXP.toLocaleString()}</span>
          </div>
          <div className="iv-chip">👤 {displayName}</div>
        </header>
        <div className="iv-results">
          <span className="iv-results-icon">{passed?"🏆":"📖"}</span>
          <div className={`iv-results-score ${passed?"rs-pass":"rs-fail"}`}>{score}/10</div>
          <div className="iv-results-title">{passed?"VAULT UNLOCKED":"NOT YET"}</div>
          <p className="iv-results-sub">
            {passed
              ? `Module ${mod.id} complete. You now know what most people will never be taught.`
              : `${score}/10 — we need ${PASS_SCORE} to pass. Review the lessons. The knowledge will stick harder the second time.`}
          </p>
          {passed&&<div className="iv-results-xp">⚡ +{mod.xpReward} XP EARNED</div>}
          <div className="iv-results-btns">
            <button className="iv-btn-ghost" onClick={startQuiz}>{passed?"RETAKE":"TRY AGAIN →"}</button>
            <button className="iv-btn iv-btn-lime" style={{width:"auto",padding:"14px 28px"}} onClick={()=>{
              if(passed&&hasNext){setModIdx(m=>m+1);setView("module");}
              else setView("hub");
            }}>
              {passed&&hasNext?`NEXT: ${MODULES[modIdx+1].tag} →`:"BACK TO DASHBOARD"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

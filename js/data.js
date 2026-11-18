/**
 * Structured portfolio data sourced strictly from Hassan Mohamed's CV.
 */
(function (global) {
    'use strict';

    const PROFILE = {
        name: 'Hassan Mohamed',
        role: 'Backend Software Engineer',
        subtitle: 'Java Spring Boot & PHP Laravel',
        location: 'Cairo, Egypt',
        phone: '+20 1129730475',
        whatsappUrl: 'https://wa.me/201129730475',
        email: 'hassanaamer048@gmail.com',
        linkedinUrl: 'https://linkedin.com/in/hassan-mohamed-dev',
        linkedinDisplay: 'linkedin.com/in/hassan-mohamed-dev',
        githubUrl: 'https://github.com/hassan-aamer',
        githubDisplay: 'github.com/hassan-aamer',
        cvPath: './Hassan Mohamed - Software Engineer CV.pdf',
        summary: [
            'Backend Software Engineer with 5 years of production experience building scalable backend systems using Java/Spring Boot and PHP/Laravel.',
            'Experienced in RESTful APIs, Microservices, Modular Monoliths, Multi-Tenant SaaS, Clean Architecture, SOLID, and Design Patterns.',
            'Strong experience in database optimization, distributed systems, transactional workflows, concurrency control, idempotency, event-driven architecture, caching, and asynchronous processing.',
            'Delivered production systems across e-commerce, IoT/logistics, healthcare/EMR, HR, and booking, with a focus on performance, security, scalability, and maintainability.'
        ],
        metrics: [
            { value: '5', label: 'Years in Production', meta: 'Java & PHP Stacks' },
            { value: '15+', label: 'Systems Shipped', meta: 'Enterprise & SaaS' },
            { value: '7', label: 'Service Saga Core', meta: 'E-Wallet Topology' },
            { value: '24/7', label: 'Distributed Reliability', meta: 'Idempotent & Locked' }
        ],
        terminalCommands: {
            whoami: {
                endpoint: 'GET /api/v1/engineer/hassan',
                status: '200 OK • 4ms',
                payload: {
                    name: 'Hassan Mohamed',
                    role: 'Backend Software Engineer',
                    primaryStack: ['Java 21 / Spring Boot 3.5', 'PHP 8+ / Laravel'],
                    location: 'Cairo, Egypt (Remote Ready)',
                    experienceYears: 5,
                    focus: [
                        'Distributed Systems & Microservices',
                        'Multi-Tenant SaaS & Clean Architecture',
                        'Database Tuning & Concurrency Control'
                    ]
                }
            },
            patterns: {
                endpoint: 'GET /api/v1/architecture/patterns',
                status: '200 OK • 3ms',
                payload: {
                    architecture: ['Microservices', 'Modular Monolith', 'Event-Driven', 'Clean Architecture'],
                    consistency: ['Saga Pattern', 'Double-Entry Ledger', 'Pessimistic Locking', 'Idempotency Keys'],
                    designPatterns: ['State', 'Strategy', 'Factory', 'Observer', 'Repository-Service'],
                    multiTenancy: ['UUID v7 Keys', 'Tenant Isolation', 'RBAC / Spatie / Spring Security']
                }
            },
            systems: {
                endpoint: 'GET /api/v1/production/domains',
                status: '200 OK • 6ms',
                payload: {
                    domains: ['Fintech & Wallets', 'IoT Telemetry & Logistics', 'Multi-Vendor E-Commerce', 'Healthcare & Clinical ERP', 'Enterprise HR & Payroll', 'AI Knowledge Engines'],
                    protocols: ['RESTful APIs', 'GraphQL (Lighthouse)', 'gRPC', 'WebSockets (Pusher)', 'Workerman TCP'],
                    messagingAndCache: ['Redis', 'Apache Kafka', 'RabbitMQ', 'MeiliSearch', 'Elasticsearch']
                }
            },
            availability: {
                endpoint: 'GET /api/v1/engineer/availability',
                status: '200 OK • READY',
                payload: {
                    status: 'ONLINE',
                    email: 'hassanaamer048@gmail.com',
                    phone: '+20 1129730475',
                    languages: ['Arabic (Native)', 'English (Professional Working Proficiency)'],
                    openTo: ['Senior Backend Roles', 'Distributed Systems Consulting', 'API Architecture']
                }
            }
        }
    };

    const TOPOLOGIES = {
        ewallet: {
            id: 'ewallet',
            name: 'E-Wallet Microservices',
            badge: '7-Service Spring Cloud Saga',
            tagline: 'Distributed financial ledger with double-entry accounting, pessimistic row locking, idempotent retries, and RabbitMQ notifications.',
            stack: ['Java 21', 'Spring Boot 3.3', 'Spring Cloud', 'Eureka', 'RabbitMQ', 'Docker'],
            repoUrl: 'https://github.com/hassan-aamer/E-Wallet-Microservices',
            flowSequence: ['gateway', 'eureka', 'tx', 'wallet', 'rabbitmq', 'notify'],
            nodes: [
                {
                    id: 'gateway',
                    label: 'API Gateway',
                    short: 'GW',
                    role: 'Edge Routing & JWT Filter',
                    color: '#22d3ee',
                    pos: { x: 0, y: -125, z: 35 },
                    details: 'Single ingress point routing client transfer requests, validating stateless JWT tokens, and forwarding idempotency headers across downstream microservices.'
                },
                {
                    id: 'eureka',
                    label: 'Eureka Discovery',
                    short: 'EUR',
                    role: 'Service Registry',
                    color: '#818cf8',
                    pos: { x: -165, y: -55, z: -65 },
                    details: 'Dynamic service registration and client-side load balancing across the 7 independent wallet, transaction, user, and notification instances.'
                },
                {
                    id: 'user',
                    label: 'User Service',
                    short: 'USR',
                    role: 'Identity & Account Profile',
                    color: '#38bdf8',
                    pos: { x: 165, y: -55, z: -65 },
                    details: 'Owns user identity records, verification state, and profile lookup for sender/recipient resolution during wallet transfers.'
                },
                {
                    id: 'tx',
                    label: 'Transaction Service',
                    short: 'TX',
                    role: 'Saga Orchestrator & Idempotency',
                    color: '#f59e0b',
                    pos: { x: -95, y: 35, z: 85 },
                    details: 'Coordinates Saga-based distributed transfers, enforces idempotency keys to prevent duplicate debits on retries, and logs immutable state transitions.'
                },
                {
                    id: 'wallet',
                    label: 'Wallet Ledger',
                    short: 'WLT',
                    role: 'Double-Entry & Pessimistic Lock',
                    color: '#10b981',
                    pos: { x: 95, y: 35, z: 85 },
                    details: 'Maintains a strict double-entry ledger with pessimistic locking for concurrency control so simultaneous transfers never corrupt balances.'
                },
                {
                    id: 'rabbitmq',
                    label: 'RabbitMQ Broker',
                    short: 'MQ',
                    role: 'Async Event Bus',
                    color: '#f97316',
                    pos: { x: 0, y: 125, z: -20 },
                    details: 'Decouples synchronous ledger commits from downstream alerts, publishing reliable transfer-completed and failure events.'
                },
                {
                    id: 'notify',
                    label: 'Notification Service',
                    short: 'NTF',
                    role: 'Event-Driven Consumer',
                    color: '#a78bfa',
                    pos: { x: 0, y: 165, z: 95 },
                    details: 'Consumes RabbitMQ domain events asynchronously to dispatch user receipts and transaction status updates without blocking financial APIs.'
                }
            ],
            edges: [
                ['gateway', 'eureka'],
                ['gateway', 'user'],
                ['gateway', 'tx'],
                ['tx', 'eureka'],
                ['tx', 'wallet'],
                ['tx', 'rabbitmq'],
                ['wallet', 'user'],
                ['rabbitmq', 'notify']
            ]
        },
        gasly: {
            id: 'gasly',
            name: 'Gasly IoT & Geo-Logistics',
            badge: 'Workerman TCP + Redis + Spatial DB',
            tagline: 'Real-time IoT cylinder telemetry ingestion over TCP with Redis alert queues and database-layer spatial distributor matching.',
            stack: ['PHP 8+', 'Laravel', 'Workerman TCP', 'Redis Queues', 'MySQL Spatial', 'B2B/B2C'],
            repoUrl: null,
            flowSequence: ['cylinders', 'workerman', 'redis', 'alerts', 'spatial', 'tenants'],
            nodes: [
                {
                    id: 'cylinders',
                    label: 'IoT Gas Cylinders',
                    short: 'IOT',
                    role: 'Live Consumption Sensors',
                    color: '#f59e0b',
                    pos: { x: -175, y: -70, z: 50 },
                    details: 'Field-deployed IoT gas cylinders streaming real-time pressure and consumption telemetry packets from commercial and residential sites.'
                },
                {
                    id: 'workerman',
                    label: 'Workerman TCP',
                    short: 'TCP',
                    role: 'Persistent Socket Ingestor',
                    color: '#22d3ee',
                    pos: { x: -45, y: -115, z: 85 },
                    details: 'High-concurrency PHP Workerman TCP server maintaining persistent socket connections and parsing raw binary/framed sensor payloads.'
                },
                {
                    id: 'redis',
                    label: 'Redis Queue Bus',
                    short: 'RDS',
                    role: 'Async Buffer & Dispatch',
                    color: '#ef4444',
                    pos: { x: 95, y: -75, z: 20 },
                    details: 'Buffers burst telemetry events into background queues, isolating TCP socket throughput from downstream alert evaluation and persistence.'
                },
                {
                    id: 'alerts',
                    label: 'Central Alert Engine',
                    short: 'ALT',
                    role: 'Threshold & Anomaly Worker',
                    color: '#f97316',
                    pos: { x: 165, y: 35, z: -55 },
                    details: 'Evaluates live consumption drops and safety thresholds asynchronously, triggering automated refill workflows and distributor notifications.'
                },
                {
                    id: 'spatial',
                    label: 'Spatial MySQL Engine',
                    short: 'GEO',
                    role: 'ST_Distance_Sphere() Routing',
                    color: '#10b981',
                    pos: { x: -15, y: 120, z: 70 },
                    details: 'Executes nearest-neighbor distributor filtering directly inside MySQL via ST_Distance_Sphere(), eliminating PHP-side distance loops.'
                },
                {
                    id: 'tenants',
                    label: 'B2B / B2C Network',
                    short: 'API',
                    role: 'Multi-Tenant Distributors',
                    color: '#818cf8',
                    pos: { x: -145, y: 65, z: -60 },
                    details: 'Multi-tenant distributor/branch network API orchestrating fleet dispatch, shipping logistics, and B2B/B2C order fulfillment.'
                }
            ],
            edges: [
                ['cylinders', 'workerman'],
                ['workerman', 'redis'],
                ['redis', 'alerts'],
                ['alerts', 'spatial'],
                ['spatial', 'tenants'],
                ['workerman', 'spatial'],
                ['tenants', 'redis']
            ]
        },
        pawclaw: {
            id: 'pawclaw',
            name: 'Paw & Claw Multi-Tenant SaaS',
            badge: 'UUID v7 Tenants + Clinic POS + AI',
            tagline: 'Solo-architected veterinary multi-tenant SaaS featuring UUID v7 tenant keys, POS/billing, digital passports, and vital-sign AI diagnostics.',
            stack: ['PHP 8+', 'Laravel', 'UUID v7', 'Multi-Tenancy', 'LLM AI Assist', 'WhatsApp API'],
            repoUrl: null,
            flowSequence: ['router', 'pos', 'passport', 'ai', 'whatsapp', 'store'],
            nodes: [
                {
                    id: 'router',
                    label: 'UUID v7 Tenant Core',
                    short: 'TNT',
                    role: 'Time-Ordered Multi-Tenancy',
                    color: '#22d3ee',
                    pos: { x: 0, y: -125, z: 45 },
                    details: 'Time-ordered UUID v7 primary keys providing globally unique, B-tree index-friendly tenant isolation across clinic databases and requests.'
                },
                {
                    id: 'pos',
                    label: 'Clinic POS & Billing',
                    short: 'POS',
                    role: 'Transactional Invoicing',
                    color: '#10b981',
                    pos: { x: -160, y: -35, z: 65 },
                    details: 'Handles clinic walk-ins, treatment billing, recurring clinic subscription tiers, and transactional payment reconciliation.'
                },
                {
                    id: 'passport',
                    label: 'Digital Pet Passport',
                    short: 'PET',
                    role: 'EMR & Vaccination Records',
                    color: '#38bdf8',
                    pos: { x: 160, y: -35, z: 65 },
                    details: 'Structured veterinary medical records, immunization histories, and portable digital passports shared between clinics and owners.'
                },
                {
                    id: 'ai',
                    label: 'AI Diagnostic Assistant',
                    short: 'AI',
                    role: 'Vital-Sign Triage Engine',
                    color: '#a78bfa',
                    pos: { x: 0, y: 40, z: 105 },
                    details: 'Analyzes recorded pet vital signs and symptoms to flag candidate differential diagnoses for veterinarians during clinical intake.'
                },
                {
                    id: 'whatsapp',
                    label: 'WhatsApp Alert Worker',
                    short: 'WA',
                    role: 'Automated Reminders',
                    color: '#f59e0b',
                    pos: { x: -110, y: 120, z: -55 },
                    details: 'Dispatches appointment confirmations, vaccination reminders, and billing updates via asynchronous queued WhatsApp alerts.'
                },
                {
                    id: 'store',
                    label: 'Storefront & Community',
                    short: 'COM',
                    role: 'Pet-Owner Portal',
                    color: '#f472b6',
                    pos: { x: 110, y: 120, z: -55 },
                    details: 'Integrated pet-owner e-commerce storefront, subscription management, and interactive community engagement modules.'
                }
            ],
            edges: [
                ['router', 'pos'],
                ['router', 'passport'],
                ['passport', 'ai'],
                ['pos', 'whatsapp'],
                ['passport', 'whatsapp'],
                ['router', 'store'],
                ['ai', 'passport']
            ]
        },
        bookflex: {
            id: 'bookflex',
            name: 'BookFlex Microservices',
            badge: 'SOLID + GoF Patterns + Redis Locks',
            tagline: 'Design-pattern driven Java microservices applying State, Strategy, Factory, Observer, and Saga with Spring Security JWT, PostgreSQL, and Redis concurrency control.',
            stack: ['Java 21', 'Spring Boot 3.3', 'Spring Cloud', 'Spring Security', 'PostgreSQL', 'Redis', 'Docker'],
            repoUrl: 'https://github.com/hassan-aamer/BookFlex-Microservices',
            flowSequence: ['gateway', 'security', 'patterns', 'redis', 'saga', 'postgres'],
            nodes: [
                {
                    id: 'gateway',
                    label: 'Spring Cloud Gateway',
                    short: 'GW',
                    role: 'Edge Ingress & Routing',
                    color: '#22d3ee',
                    pos: { x: 0, y: -125, z: 35 },
                    details: 'Unified API Gateway routing client booking traffic cleanly across isolated domain microservices with centralized filtering.'
                },
                {
                    id: 'security',
                    label: 'Spring Security JWT',
                    short: 'JWT',
                    role: 'Stateless Auth & RBAC',
                    color: '#38bdf8',
                    pos: { x: -155, y: -45, z: -45 },
                    details: 'Enforces stateless JWT authentication, token validation, and role-based access control across client and inter-service boundaries.'
                },
                {
                    id: 'patterns',
                    label: 'Design Pattern Core',
                    short: 'GOF',
                    role: 'State, Strategy & Factory',
                    color: '#a78bfa',
                    pos: { x: 155, y: -45, z: 65 },
                    details: 'Applies SOLID and classic GoF patterns: State manages complex booking lifecycles, while Strategy & Factory decouple extensible pricing and rules.'
                },
                {
                    id: 'redis',
                    label: 'Redis Lock & Cache',
                    short: 'RDS',
                    role: 'Distributed Concurrency Control',
                    color: '#f59e0b',
                    pos: { x: -85, y: 45, z: 85 },
                    details: 'Provides fast caching alongside distributed concurrency guards so concurrent booking attempts never double-allocate shared inventory.'
                },
                {
                    id: 'saga',
                    label: 'Saga & Observer Bus',
                    short: 'SGA',
                    role: 'Workflow & Event Dispatch',
                    color: '#f472b6',
                    pos: { x: 95, y: 45, z: -45 },
                    details: 'Coordinates multi-step Saga transactions with compensating rollbacks and uses Observer hooks to propagate domain state changes cleanly.'
                },
                {
                    id: 'postgres',
                    label: 'PostgreSQL ACID DB',
                    short: 'PG',
                    role: 'Transactional Persistence',
                    color: '#10b981',
                    pos: { x: 0, y: 135, z: 25 },
                    details: 'Guarantees ACID relational persistence for bookings, ledger states, and inventory integrity inside containerized Docker Compose environments.'
                }
            ],
            edges: [
                ['gateway', 'security'],
                ['gateway', 'patterns'],
                ['security', 'patterns'],
                ['patterns', 'redis'],
                ['patterns', 'saga'],
                ['redis', 'postgres'],
                ['saga', 'postgres'],
                ['saga', 'redis']
            ]
        },
        shopak: {
            id: 'shopak',
            name: 'Shopak Multi-Tenant SaaS',
            badge: '59 Tables • 244 APIs • Zero-500 Chaos QA',
            tagline: 'Enterprise B2B2C multi-tenant SaaS e-commerce platform (PHP 8.4 / Laravel 12) with TenantScope isolation, deterministic ascending row locks, SaaS billing state machine, and 216 tests (6,447 assertions).',
            stack: ['PHP 8.4', 'Laravel 12', 'MySQL 8 (59 Tables)', 'TenantScope', 'Sanctum', '216 Tests / Chaos QA'],
            repoUrl: null,
            footerLabel: 'PERSONAL ENTERPRISE SAAS ARCHITECTURE',
            flowSequence: ['tenant', 'scope', 'inventory', 'digital', 'billing', 'ledger'],
            nodes: [
                {
                    id: 'tenant',
                    label: 'IdentifyTenant Edge',
                    short: 'TNT',
                    role: 'Header, Subdomain & Domain Resolver',
                    color: '#22d3ee',
                    pos: { x: 0, y: -125, z: 35 },
                    details: 'Resolves active tenant context across X-Tenant-ID, X-Store-Subdomain, and Custom Domain before passing requests through SetLocale (AR/EN) and Sanctum auth.'
                },
                {
                    id: 'scope',
                    label: 'TenantScope & Sequences',
                    short: 'SCP',
                    role: 'Logical Isolation & ORD-#',
                    color: '#38bdf8',
                    pos: { x: -160, y: -45, z: -45 },
                    details: 'Enforces strict logical query isolation across 59 MySQL tables via Global TenantScope and BelongsToTenant, with conflict-free sequential numbering via tenant_sequences.'
                },
                {
                    id: 'inventory',
                    label: 'Atomic Inventory Core',
                    short: 'INV',
                    role: 'Ascending lockForUpdate()',
                    color: '#10b981',
                    pos: { x: 160, y: -45, z: 65 },
                    details: 'Eliminates checkout deadlocks mathematically via deterministic ascending row-lock ordering, ledgerized inventory_movements, and scheduled 10-min expiry release.'
                },
                {
                    id: 'billing',
                    label: 'SaaS Billing & Grace',
                    short: 'BIL',
                    role: 'Active → Grace → Suspended',
                    color: '#f59e0b',
                    pos: { x: -95, y: 45, z: 85 },
                    details: 'Manages country-driven SaaS plans, 3-day past-due grace windows, and 403 storefront/ops suspension while keeping billing endpoints open for receipt-verified renewal.'
                },
                {
                    id: 'digital',
                    label: 'Digital, COD & AI Hub',
                    short: 'DIG',
                    role: 'Serials, Themes & AI Assistant',
                    color: '#a78bfa',
                    pos: { x: 95, y: 45, z: -45 },
                    details: 'Delivers atomic serial codes and signed expiring downloads with zero-shipping checkout, XSS-sanitized store themes, manual/COD payments, and AI store diagnostics.'
                },
                {
                    id: 'ledger',
                    label: 'Partner Ledger & QA',
                    short: 'QA',
                    role: 'Zero-500 Chaos & Profit Split',
                    color: '#f472b6',
                    pos: { x: 0, y: 135, z: 25 },
                    details: 'Runs official partner_ledger_entries distributions, afterCommit queued jobs, withoutOverlapping schedulers, and passes 216 tests (6,447 assertions) + 244-request Chaos Fuzzing.'
                }
            ],
            edges: [
                ['tenant', 'scope'],
                ['scope', 'inventory'],
                ['inventory', 'digital'],
                ['scope', 'billing'],
                ['billing', 'ledger'],
                ['inventory', 'ledger'],
                ['digital', 'ledger']
            ]
        }
    };

    const EXPERIENCE = [
        {
            id: 'visual-innovate',
            company: 'Visual Innovate',
            location: 'Jordan (Remote from Egypt)',
            role: 'Backend Software Engineer',
            period: 'May 2024 – Present',
            badge: 'CURRENT ROLE',
            summary: 'Architect, build, and maintain enterprise backend systems using Spring Boot and Laravel, driving RESTful API design, database performance tuning, and scalable third-party integrations.',
            highlights: [
                {
                    title: 'Spring Boot E-Commerce Engine',
                    stack: 'Java 21 • Spring Boot 3.5 • JWT • MySQL/H2 • Docker',
                    description: 'Architected a production-ready modular REST API; implemented stateless JWT, transactional inventory locking/restocking, cart management, and full order pipeline. Integrated Swagger, ModelMapper, and packaged via Docker.',
                    projectId: 'spring-ecommerce'
                },
                {
                    title: 'Gasly — IoT Smart Gas & Logistics Ecosystem',
                    stack: 'Workerman TCP • Redis Queues • MySQL Spatial • Multi-Tenant',
                    description: 'Engineered real-time telemetry ingestion via Workerman TCP (IoT-fitted gas cylinders reporting live consumption) and a central alert engine via Redis queues. Built B2B/B2C modules, multi-tenant distributor/branch networks, and optimized nearest-neighbor search using ST_Distance_Sphere() at the DB layer.',
                    projectId: 'gasly'
                },
                {
                    title: 'Shift 7 — Multi-Tenant & Multi-Vendor E-Commerce',
                    stack: 'Laravel • MeiliSearch • QuickBooks • Geo-Pricing',
                    description: 'Engineered a bilingual multi-tenant platform where every store runs its own dashboard for products, categories, staff roles, and incoming orders. Built map-based delivery pricing from live distance, dynamic coupons, QuickBooks integration, DB-layer query optimization, and MeiliSearch.',
                    projectId: 'shift7'
                },
                {
                    title: 'SAWA Academy — Clinical ERP & EdTech Ecosystem',
                    stack: 'Clinical ERP • RBAC • Video Streaming • Fleet System',
                    description: 'Built an ERP managing clinical assessments (VB-MAPP, ABLLS-R, Carolina), an automated specialist-to-room assignment algorithm (autoAssignSpecialist), session management, parents\' portal, full fleet/transportation system, strict RBAC, and secure video streaming.',
                    projectId: 'sawa'
                },
                {
                    title: 'Enterprise HR & Workforce Management System',
                    stack: 'Headless REST API • Payroll Engine • Offline Biometric/GPS',
                    description: 'Designed a headless RESTful API featuring GPS/biometric offline attendance, dynamic shifts, leaves/balances, missions, public holidays, full payroll engine, and dynamic bilingual report generator.',
                    projectId: 'enterprise-hr'
                },
                {
                    title: 'Mursheed — Travel, Booking & Tourism Platform',
                    stack: 'MySQL/Redis Geo • Pusher WebSockets • Google Auth',
                    description: 'Developed APIs allowing users to pre-book hotels, vehicles, and tours before arrival, with drivers and hotels managing their own listings. Implemented dual rating systems, trip statuses, spatial queries (MySQL/Redis Geo), and live chats via Pusher WebSockets.',
                    projectId: 'mursheed'
                },
                {
                    title: 'DevOps & Infrastructure Automation',
                    stack: 'CI/CD • GitHub Actions • Automated Releases',
                    description: 'Automated deployments with CI/CD pipelines, eliminating manual server pulls and streamlining the production release process.'
                }
            ]
        },
        {
            id: 'future-sword',
            company: 'Future Sword',
            location: 'Saudi Arabia (Remote from Egypt)',
            role: 'Backend Software Engineer',
            period: 'Aug 2022 – May 2024',
            badge: '2 YEARS',
            summary: 'Engineered and maintained multi-tenant SaaS platforms, medical booking portals, real estate marketplaces, and AI-assisted archive platforms applying SOLID principles and Clean Architecture.',
            highlights: [
                {
                    title: 'Paw & Claw — Veterinary Multi-Tenant SaaS & Clinic POS',
                    stack: 'Solo End-to-End • UUID v7 • AI Diagnostics • POS/Billing',
                    description: 'Designed and built solo end-to-end: a multi-tenant SaaS (UUID v7 keys) featuring POS/billing, digital pet passports, WhatsApp alerts, an AI diagnostic assistant flagging differential diagnoses from vital signs, a pet-owner storefront, subscriptions, and community.',
                    projectId: 'paw-claw'
                },
                {
                    title: 'Aqar 2030 — Real Estate Marketplace & Financing Platform',
                    stack: 'GraphQL (Lighthouse) • REST API • Map Search • Mortgages',
                    description: 'Developed GraphQL and REST APIs (Lighthouse) for map-based property search, custom property requests, complete real estate financing/mortgages, and subscription packages for offices and developers.',
                    projectId: 'aqar2030'
                },
                {
                    title: 'Reaya Clinics — Multi-Branch Hospital & Clinic Management',
                    stack: 'Multi-Facility • Transactional Booking • Mobile API',
                    description: 'Engineered multi-facility backend where patients book directly with doctors across hospital branches. Managed doctor schedules, transactional appointments, medical offers, per-branch sales & booking reports, staff management, and companion mobile app API.',
                    projectId: 'reaya-clinics'
                },
                {
                    title: 'Waqf Al-Majed — AI-Assisted Fatwa & Knowledge Platform',
                    stack: 'Laravel Repository-Service • Semantic Indexing • AI Search',
                    description: 'Built a full fatwa lifecycle pipeline (intake, review, approval, archive) utilizing Laravel Repository-Service, AI-driven historical search, smart synonyms engine, semantic indexing, and SMS alerts.',
                    projectId: 'waqf-almajed'
                },
                {
                    title: 'Fatwa Legacy Automation Engine',
                    stack: 'Native PHP → Secure PDO • Query Re-Indexing • External APIs',
                    description: 'Migrated a high-volume native PHP platform to secure PDO instances, re-indexed core queries, rebuilt permissions and reporting, and developed external APIs.'
                },
                {
                    title: 'Corporate Platform & Bilingual CMS',
                    stack: 'RTL/LTR CMS • SEO Automation • Rule-Based Chatbot',
                    description: 'Built a bilingual (RTL/LTR) CMS with services/packages management, SEO metadata automations, FAQ, media management, and an interactive rule-based client chatbot.'
                }
            ]
        },
        {
            id: 'freelance',
            company: 'Freelance Backend Developer',
            location: 'Remote',
            role: 'Backend Consultant & API Engineer',
            period: 'Mar 2024 – Present',
            badge: 'CONSULTING',
            summary: 'Deliver backend architectural consulting, API development, and legacy performance refactoring for select regional clients.',
            highlights: [
                {
                    title: 'On-Demand Bus & Room Booking Platform',
                    stack: 'Digital Wallets • Code Matching • DB Query Optimization',
                    description: 'Engineered reservation systems with passenger-driver code matching and digital wallets. Optimized booking search by moving filtering and joins to the database layer, reducing unnecessary data retrieval and improving API response time.'
                },
                {
                    title: 'Dolphin Education Platform',
                    stack: 'E-Learning Architecture • Scalable Schemas • Certificate of Appreciation',
                    description: 'Designed backend architecture and scalable database schemas for an interactive e-learning platform, receiving a formal Certificate of Appreciation for delivery excellence.'
                },
                {
                    title: 'Agency E-Commerce Store Builds',
                    stack: 'Laravel • Payment Gateways • Custom Coupon Engines',
                    description: 'Engineered bespoke backends using Laravel, integrating third-party payment gateways, custom promotional coupon engines, and clean service abstractions.'
                }
            ]
        }
    ];

    const PROJECTS = [
        {
            id: 'ewallet-microservices',
            title: 'E-Wallet Microservices',
            subtitle: 'Distributed Ledger & Saga Transactions',
            categories: ['java', 'microservices'],
            primaryStack: 'Java 21 • Spring Boot 3.3 • Spring Cloud • RabbitMQ • Docker',
            featured: true,
            summary: 'Production-grade e-wallet microservices ecosystem across 7 services featuring double-entry accounting, idempotency protection, Saga-based distributed transfers, pessimistic concurrency locking, and RabbitMQ notifications.',
            architecture: {
                pattern: '7-Service Microservices + Saga Orchestration + Double-Entry Ledger',
                services: ['API Gateway', 'Eureka Discovery', 'User Service', 'Wallet Service', 'Transaction Service', 'Notification Service', 'RabbitMQ Broker'],
                engineeringDecisions: [
                    'Implemented double-entry ledger accounting so every debit pairs with an auditable credit entry.',
                    'Applied pessimistic database locking on wallet balance rows to eliminate race conditions under concurrent transfers.',
                    'Enforced idempotency keys on transfer endpoints to ensure safe client/network retries without duplicate charges.',
                    'Decoupled transfer notifications asynchronously via RabbitMQ domain events.'
                ]
            },
            links: [
                { label: 'GitHub Repository', url: 'https://github.com/hassan-aamer/E-Wallet-Microservices', type: 'github' }
            ]
        },
        {
            id: 'bookflex-microservices',
            title: 'BookFlex Microservices',
            subtitle: 'Design-Pattern Driven Distributed Architecture',
            categories: ['java', 'microservices'],
            primaryStack: 'Java 21 • Spring Boot 3.3 • Spring Cloud • Spring Security • PostgreSQL • Redis',
            featured: true,
            summary: 'Production-grade microservices architecture demonstrating SOLID principles, classic behavioral/creational design patterns (State, Strategy, Factory, Observer, Saga), and distributed concurrency control.',
            architecture: {
                pattern: 'Microservices + SOLID + GoF Design Patterns (State, Strategy, Factory, Observer, Saga)',
                services: ['Spring Cloud Gateway', 'Spring Security JWT', 'PostgreSQL Persistence', 'Redis Distributed Lock/Cache', 'Docker Compose'],
                engineeringDecisions: [
                    'Modeled complex booking lifecycles with the State pattern and decoupled pricing/rules via Strategy & Factory.',
                    'Combined PostgreSQL transactional integrity with Redis caching and distributed concurrency guards.',
                    'Secured inter-service and client boundaries with Spring Security and stateless JWT authentication.'
                ]
            },
            links: [
                { label: 'GitHub Repository', url: 'https://github.com/hassan-aamer/BookFlex-Microservices', type: 'github' }
            ]
        },
        {
            id: 'spring-ecommerce',
            title: 'Spring Boot E-Commerce Engine',
            subtitle: 'Modular REST API & Inventory Locking',
            categories: ['java'],
            primaryStack: 'Java 21 • Spring Boot 3.5 • Stateless JWT • MySQL/H2 • Swagger • Docker',
            featured: true,
            summary: 'Modular production REST API built on Java 21 and Spring Boot 3.5 featuring stateless JWT auth, transactional inventory locking and restocking, cart state, and complete order lifecycle.',
            architecture: {
                pattern: 'Modular Layered Architecture (Controller → Service → Repository → JPA)',
                services: ['Auth & JWT Security', 'Inventory Locking Module', 'Cart & Checkout Pipeline', 'OpenAPI/Swagger Spec', 'Docker Runtime'],
                engineeringDecisions: [
                    'Protected stock integrity during concurrent checkouts using transactional inventory locking and automatic restocking on cancellation.',
                    'Designed clean DTO mapping (ModelMapper) so persistence entities never leak across API boundaries.',
                    'Containerized full API and MySQL/H2 profiles via Docker for reproducible deployments.'
                ]
            },
            links: [
                { label: 'GitHub Repository', url: 'https://github.com/hassan-aamer/Spring-Boot-E-Commerce-Project', type: 'github' }
            ]
        },
        {
            id: 'shopak',
            title: 'Shopak Multi-Tenant SaaS Platform',
            subtitle: 'B2B2C Core, Zero-Deadlock Ledger & Chaos-Tested API',
            categories: ['php', 'ai'],
            primaryStack: 'PHP 8.4 • Laravel 12 • MySQL 8 (59 Tables) • TenantScope • Sanctum',
            featured: true,
            summary: 'Personal enterprise B2B2C multi-tenant SaaS e-commerce platform built on PHP 8.4 and Laravel 12 across 59 clean MySQL tables, achieving 216 passing tests (6,447 assertions) and Zero-500 Chaos Fuzzing across 244 API endpoints.',
            architecture: {
                pattern: 'Shared-DB Logical Multi-Tenancy (TenantScope) + Clean Service Layer + Deterministic Locking',
                services: ['IdentifyTenant & TenantScope', 'Atomic Inventory & Serials', 'SaaS Billing State Machine', 'XSS-Safe Themes & AI Hub', 'Partner Profit Ledger', '244-API Chaos QA'],
                engineeringDecisions: [
                    'Enforced strict logical isolation across 59 MySQL tables via IdentifyTenant (header/subdomain/custom domain), global TenantScope, and per-store tenant_sequences.',
                    'Prevented checkout and profit-ledger deadlocks using deterministic ascending row locks (lockForUpdate()), afterCommit queued jobs, and withoutOverlapping schedulers.',
                    'Implemented full SaaS lifecycle (Active → 3-day Grace → 403 Suspended with open renewal billing), atomic digital serial delivery, bilingual AR/EN localization, and XSS-safe store themes.',
                    'Verified all 244 endpoints across 5 Postman collections with 216 tests (6,447 assertions) and adversarial Chaos Fuzzing under a strict Zero-500 error guarantee.'
                ]
            },
            links: []
        },
        {
            id: 'gasly',
            title: 'Gasly IoT & Smart Logistics',
            subtitle: 'Workerman TCP Telemetry & Spatial Routing',
            categories: ['php', 'iot'],
            primaryStack: 'PHP 8+ • Laravel • Workerman TCP • Redis Queues • MySQL Spatial',
            featured: true,
            summary: 'IoT-enabled gas telemetry & logistics ecosystem ingesting live consumption streams over Workerman TCP, processing central alerts via Redis queues, and routing nearest distributors in MySQL.',
            architecture: {
                pattern: 'TCP Telemetry Ingestion + Redis Queue Workers + Database-Layer Spatial Search',
                services: ['Workerman TCP Server', 'Redis Alert Queue', 'ST_Distance_Sphere() Geo Engine', 'B2B/B2C Multi-Tenant API', 'Shipping & Branch Logistics'],
                engineeringDecisions: [
                    'Built persistent TCP ingestion in Workerman to handle continuous live readings from IoT-fitted gas cylinders.',
                    'Offloaded threshold checks and alert fan-out to Redis queues for non-blocking socket ingestion.',
                    'Pushed location-based nearest-neighbor distributor filtering directly into MySQL using ST_Distance_Sphere().'
                ]
            },
            links: []
        },
        {
            id: 'shift7',
            title: 'Shift 7 Multi-Vendor SaaS',
            subtitle: 'Multi-Tenant Commerce, MeiliSearch & QuickBooks',
            categories: ['php', 'iot'],
            primaryStack: 'PHP 8+ • Laravel • MeiliSearch • QuickBooks API • Map Delivery Pricing',
            featured: true,
            summary: 'Bilingual multi-tenant & multi-vendor platform giving each store an isolated dashboard, live distance-based delivery pricing, dynamic coupon engine, QuickBooks sync, and instant MeiliSearch discovery.',
            architecture: {
                pattern: 'Multi-Tenant SaaS + Search Indexing + ERP Accounting Sync',
                services: ['Store Tenant Dashboards', 'Live Map Delivery Pricing', 'Dynamic Discounts/Coupons', 'MeiliSearch Engine', 'QuickBooks Integration'],
                engineeringDecisions: [
                    'Moved heavy filtering and joins down to the database layer, eliminating unnecessary payload hydration and speeding up catalog endpoints.',
                    'Integrated MeiliSearch for sub-50ms bilingual catalog search across multi-vendor storefronts.',
                    'Automated order-to-accounting synchronization with QuickBooks and live geo-distance fee computation.'
                ]
            },
            links: [
                { label: 'Live Platform', url: 'https://shift7store.com', type: 'live' }
            ]
        },
        {
            id: 'paw-claw',
            title: 'Paw & Claw Veterinary SaaS',
            subtitle: 'Solo End-to-End Multi-Tenant Clinic OS & AI Triage',
            categories: ['php', 'ai'],
            primaryStack: 'PHP 8+ • Laravel • UUID v7 • POS/Billing • AI Diagnostics • WhatsApp',
            featured: false,
            summary: 'Architected and built solo end-to-end: multi-tenant veterinary SaaS using UUID v7 keys, POS/billing, digital pet passports, WhatsApp alerts, vital-sign AI diagnostic assistant, storefront, and community.',
            architecture: {
                pattern: 'Multi-Tenant SaaS (UUID v7) + AI Clinical Decision Assist',
                services: ['UUID v7 Tenant Scoping', 'Clinic POS & Subscriptions', 'Digital Pet Passports', 'Vital-Sign AI Assistant', 'WhatsApp Notification Worker'],
                engineeringDecisions: [
                    'Adopted time-ordered UUID v7 primary keys to preserve B-tree index locality alongside distributed uniqueness.',
                    'Built an AI diagnostic assistant that analyzes vital signs to flag candidate differential diagnoses for clinicians.',
                    'Unified clinic POS, owner storefront, digital pet passports, and automated WhatsApp alerts under clean tenant isolation.'
                ]
            },
            links: []
        },
        {
            id: 'sawa',
            title: 'SAWA Academy Clinical ERP',
            subtitle: 'Special-Ed Clinical Assessments & Scheduling Engine',
            categories: ['php'],
            primaryStack: 'PHP 8+ • Laravel • RBAC • Scheduling Algorithm • Video Streaming • Fleet',
            featured: false,
            summary: 'Enterprise clinical ERP and EdTech platform managing VB-MAPP, ABLLS-R, and Carolina assessments, automated specialist-to-room matching, strict RBAC, secure video streaming, and fleet logistics.',
            architecture: {
                pattern: 'Domain-Driven ERP + Algorithmic Resource Scheduling + Strict RBAC',
                services: ['Clinical Assessments (VB-MAPP/ABLLS-R/Carolina)', 'autoAssignSpecialist Engine', 'Parents Portal', 'Fleet & Transport System', 'Secure Video Streaming'],
                engineeringDecisions: [
                    'Engineered the autoAssignSpecialist algorithm to match specialists, rooms, and clinical sessions without double-booking.',
                    'Enforced granular Role-Based Access Control across therapists, administrators, drivers, and parents.',
                    'Integrated secure streaming and longitudinal student assessment progress tracking.'
                ]
            },
            links: []
        },
        {
            id: 'aqar2030',
            title: 'Aqar 2030 Real Estate & Mortgages',
            subtitle: 'GraphQL Lighthouse & Spatial Property Search',
            categories: ['php', 'iot'],
            primaryStack: 'PHP 8+ • Laravel • GraphQL (Lighthouse) • REST • Map Search • Financing',
            featured: false,
            summary: 'Real estate marketplace and mortgage financing platform powered by GraphQL (Lighthouse) and REST APIs for map-based property discovery, custom property requests, and office/developer subscriptions.',
            architecture: {
                pattern: 'Hybrid GraphQL (Lighthouse) + REST API + Financing Workflows',
                services: ['Lighthouse GraphQL Schema', 'Spatial Map Property Search', 'Mortgage & Financing Engine', 'Office/Developer Subscriptions'],
                engineeringDecisions: [
                    'Exposed flexible GraphQL queries via Lighthouse alongside REST endpoints to eliminate over-fetching on map-heavy clients.',
                    'Implemented end-to-end mortgage/financing calculation workflows and tiered subscription packages for real estate offices.'
                ]
            },
            links: []
        },
        {
            id: 'waqf-almajed',
            title: 'Waqf Al-Majed AI Knowledge Platform',
            subtitle: 'Semantic Indexing, Smart Synonyms & Lifecycle Pipeline',
            categories: ['php', 'ai'],
            primaryStack: 'PHP 8+ • Laravel Repository-Service • AI Historical Search • Semantic Indexing',
            featured: false,
            summary: 'AI-assisted fatwa & knowledge archive platform managing full intake-to-archive lifecycle using Laravel Repository-Service, semantic indexing, smart synonyms engine, and SMS alerts.',
            architecture: {
                pattern: 'Repository-Service Pattern + Semantic Search & Lifecycle State Machine',
                services: ['Intake → Review → Approval → Archive Pipeline', 'AI Historical Search', 'Smart Synonyms Engine', 'Semantic Indexer', 'SMS Gateway'],
                engineeringDecisions: [
                    'Structured multi-stage editorial workflows with Laravel Repository-Service abstractions for clean testability.',
                    'Combined semantic indexing with a domain-specific synonyms engine to drastically improve historical Arabic knowledge recall.'
                ]
            },
            links: []
        },
        {
            id: 'mursheed',
            title: 'Mursheed Travel & Tourism APIs',
            subtitle: 'Spatial Geo Search & Real-Time Pusher Chat',
            categories: ['php', 'iot'],
            primaryStack: 'PHP 8+ • Laravel • MySQL/Redis Geo • Pusher WebSockets • Google Auth',
            featured: false,
            summary: 'Pre-arrival booking APIs for hotels, vehicles, and tours with independent driver/hotel listing portals, dual rating systems, spatial geo discovery, Google Auth, and live Pusher WebSocket chat.',
            architecture: {
                pattern: 'Geo-Indexed Booking API + Real-Time WebSocket Messaging',
                services: ['Hotels/Vehicles/Tours Booking', 'MySQL & Redis Geo Queries', 'Pusher WebSocket Chat', 'Dual Rating & Trip State Machine'],
                engineeringDecisions: [
                    'Combined Redis Geo and MySQL spatial queries for rapid driver/tour proximity lookup.',
                    'Engineered bi-directional trip statuses, dual rating flows, and live customer-driver chat via Pusher WebSockets.'
                ]
            },
            links: []
        },
        {
            id: 'reaya-clinics',
            title: 'Reaya Multi-Branch Hospital System',
            subtitle: 'Multi-Facility Transactional Appointments & Mobile API',
            categories: ['php'],
            primaryStack: 'PHP 8+ • Laravel • Transactional Booking • Branch Reporting • Mobile API',
            featured: false,
            summary: 'Multi-branch hospital and clinic backend coordinating doctor schedules, transactional patient appointments, medical offers, per-branch revenue/booking analytics, nurse/staff roles, and mobile APIs.',
            architecture: {
                pattern: 'Multi-Branch Scheduling + Transactional Reservation Engine',
                services: ['Doctor Schedule Matrix', 'Transactional Slot Locking', 'Per-Branch Sales Analytics', 'Companion Mobile API'],
                engineeringDecisions: [
                    'Guaranteed atomic doctor slot booking across branches using transactional reservation workflows.',
                    'Aggregated per-branch financial and booking telemetry alongside nurse/staff management APIs.'
                ]
            },
            links: []
        },
        {
            id: 'enterprise-hr',
            title: 'Enterprise HR & Payroll Engine',
            subtitle: 'Headless API with Offline GPS/Biometric Sync',
            categories: ['php'],
            primaryStack: 'PHP 8+ • Headless REST API • Payroll Engine • Bilingual Reports',
            featured: false,
            summary: 'Headless enterprise workforce backend powering offline GPS/biometric attendance reconciliation, dynamic shifts, leave balances, missions, full payroll execution, and bilingual report generation.',
            architecture: {
                pattern: 'Headless REST API + Batch Payroll Calculation Engine',
                services: ['Offline GPS/Biometric Sync', 'Dynamic Shift & Leave Ledger', 'Automated Payroll Engine', 'Dynamic Bilingual Reports'],
                engineeringDecisions: [
                    'Reconciled offline biometric and GPS punches cleanly into dynamic shift windows and overtime calculations.',
                    'Automated full-cycle payroll generation paired with dynamic bilingual (Arabic/English) exportable reports.'
                ]
            },
            links: []
        }
    ];

    const SKILL_DOMAINS = [
        {
            id: 'languages',
            title: 'Languages',
            accent: 'cyan',
            items: ['Java', 'PHP 8+', 'SQL', 'JavaScript (ES6+)']
        },
        {
            id: 'java-spring',
            title: 'Java / Spring Boot',
            accent: 'amber',
            items: [
                'Java 21', 'Spring Boot', 'Spring Core', 'Spring MVC', 'Spring Data JPA',
                'Hibernate/JPA', 'Spring Security', 'Spring AOP', 'Spring Cloud',
                'Microservices', 'Service Discovery', 'API Gateway', 'JWT',
                'REST APIs', 'Transactions', 'JPA Relationships', 'Query Optimization'
            ]
        },
        {
            id: 'php-laravel',
            title: 'PHP / Laravel',
            accent: 'emerald',
            items: [
                'PHP 8+', 'Laravel', 'Eloquent ORM', 'Service Container',
                'Dependency Injection', 'Service Providers', 'Artisan', 'Middleware',
                'Form Requests', 'API Resources', 'Queues & Jobs', 'Events & Listeners',
                'Laravel Scheduler', 'Webhooks', 'Laravel Sanctum', 'Gates & Policies',
                'Spatie Laravel-Permission', 'Multi-tenancy', 'Migrations & Seeders',
                'Blade', 'Livewire', 'Filament'
            ]
        },
        {
            id: 'architecture',
            title: 'Software Architecture & Design',
            accent: 'cyan',
            items: [
                'Software Architecture', 'Clean Architecture', 'SOLID Principles',
                'Design Patterns', 'OOP', 'Modular Architecture',
                'Microservices Architecture', 'Event-Driven Architecture'
            ]
        },
        {
            id: 'api-integration',
            title: 'API & Integration',
            accent: 'violet',
            items: [
                'RESTful API Design', 'GraphQL', 'gRPC', 'WebSocket',
                'Swagger/OpenAPI', 'Third-Party API Integration', 'Payment Gateway Integration'
            ]
        },
        {
            id: 'databases',
            title: 'Databases & Persistence',
            accent: 'emerald',
            items: [
                'MySQL', 'PostgreSQL', 'MongoDB', 'Hibernate/JPA',
                'Database Design', 'Query Optimization', 'Indexing'
            ]
        },
        {
            id: 'distributed',
            title: 'Caching, Messaging & Distributed Systems',
            accent: 'amber',
            items: [
                'Redis', 'Apache Kafka', 'RabbitMQ', 'Caching Strategies',
                'Queues', 'Pub/Sub', 'Asynchronous Processing'
            ]
        },
        {
            id: 'security',
            title: 'Security & Authentication',
            accent: 'cyan',
            items: [
                'Spring Security', 'JWT Authentication',
                'Authentication & Authorization', 'Role-Based Access Control (RBAC)'
            ]
        },
        {
            id: 'testing',
            title: 'Testing & Quality',
            accent: 'emerald',
            items: [
                'JUnit', 'Mockito', 'PHPUnit', 'Unit Testing', 'Integration Testing',
                'API Testing', 'Automated Testing', 'Performance Profiling',
                'Load Testing (Apache JMeter, k6)'
            ]
        },
        {
            id: 'devops',
            title: 'DevOps & Cloud',
            accent: 'violet',
            items: [
                'Docker', 'Docker Compose', 'CI/CD', 'GitHub Actions',
                'AWS (EC2, S3)', 'DigitalOcean', 'Linux', 'Kubernetes',
                'Load Balancing', 'Horizontal & Vertical Scaling'
            ]
        },
        {
            id: 'search-tools',
            title: 'Search & Tools',
            accent: 'cyan',
            items: [
                'Elasticsearch', 'MeiliSearch', 'Maven', 'Git',
                'GitHub', 'GitLab', 'Bitbucket', 'Postman', 'Jira'
            ]
        },
        {
            id: 'ai',
            title: 'AI Integration',
            accent: 'amber',
            items: [
                'LLM API Integration', 'Prompt Engineering',
                'GitHub Copilot', 'Workflow Automation (n8n)'
            ]
        }
    ];

    const SPHERE_TAGS = [
        { label: 'Java 21', domain: 'java-spring', weight: 1.2 },
        { label: 'Spring Boot 3', domain: 'java-spring', weight: 1.25 },
        { label: 'Spring Cloud', domain: 'java-spring', weight: 1.05 },
        { label: 'PHP 8+', domain: 'php-laravel', weight: 1.15 },
        { label: 'Laravel', domain: 'php-laravel', weight: 1.25 },
        { label: 'Microservices', domain: 'architecture', weight: 1.2 },
        { label: 'Clean Architecture', domain: 'architecture', weight: 1.1 },
        { label: 'SOLID', domain: 'architecture', weight: 1.1 },
        { label: 'Saga Pattern', domain: 'architecture', weight: 1.05 },
        { label: 'Multi-Tenancy', domain: 'php-laravel', weight: 1.1 },
        { label: 'MySQL', domain: 'databases', weight: 1.15 },
        { label: 'PostgreSQL', domain: 'databases', weight: 1.15 },
        { label: 'MongoDB', domain: 'databases', weight: 0.95 },
        { label: 'Redis', domain: 'distributed', weight: 1.2 },
        { label: 'Apache Kafka', domain: 'distributed', weight: 1.1 },
        { label: 'RabbitMQ', domain: 'distributed', weight: 1.15 },
        { label: 'Docker', domain: 'devops', weight: 1.15 },
        { label: 'Kubernetes', domain: 'devops', weight: 1.05 },
        { label: 'AWS EC2/S3', domain: 'devops', weight: 1.0 },
        { label: 'CI/CD', domain: 'devops', weight: 1.05 },
        { label: 'GraphQL', domain: 'api-integration', weight: 1.05 },
        { label: 'gRPC', domain: 'api-integration', weight: 1.0 },
        { label: 'WebSockets', domain: 'api-integration', weight: 0.98 },
        { label: 'Spring Security', domain: 'security', weight: 1.05 },
        { label: 'JWT & RBAC', domain: 'security', weight: 1.1 },
        { label: 'Elasticsearch', domain: 'search-tools', weight: 1.0 },
        { label: 'JUnit & Mockito', domain: 'testing', weight: 0.95 },
        { label: 'PHPUnit', domain: 'testing', weight: 0.95 },
        { label: 'JMeter & k6', domain: 'testing', weight: 0.98 },
        { label: 'LLM APIs', domain: 'ai', weight: 1.05 },
        { label: 'n8n Automation', domain: 'ai', weight: 0.98 },
        { label: 'SQL Tuning', domain: 'databases', weight: 1.1 }
    ];

    const CREDENTIALS = {
        education: {
            institution: 'Al-Alsun Higher Institute',
            location: 'Cairo, Egypt',
            degree: 'Bachelor of Computer and Information Sciences (Information Systems)',
            period: '2017 – 2021',
            coursework: [
                'Data Structures',
                'Database Systems',
                'System Analysis & Design',
                'Software Engineering'
            ]
        },
        certifications: [
            {
                title: 'Claude Code in Action',
                issuer: 'Anthropic',
                date: 'Mar 2026',
                track: 'AI Engineering'
            },
            {
                title: 'Spring Framework 6 & Spring Boot 3 - Advanced Track',
                issuer: 'Udemy',
                date: 'Dec 2025',
                track: 'Java Backend'
            },
            {
                title: 'Laravel Mastery',
                issuer: 'Udemy',
                date: 'Oct 2023',
                track: 'PHP Backend'
            },
            {
                title: 'Professional Full Stack Web Development',
                issuer: 'YAT Learning Centers',
                date: 'Aug 2021',
                track: 'Full Stack'
            },
            {
                title: 'Version Control with Git',
                issuer: 'Coursera',
                date: 'Jan 2021',
                track: 'Dev Workflow'
            }
        ],
        languages: [
            {
                name: 'Arabic',
                level: 'Native Proficiency',
                detail: 'Full native fluency for regional leadership and client consulting.'
            },
            {
                name: 'English',
                level: 'Professional Working Proficiency',
                detail: 'Technical Documentation, Architectural Design, and Verbal Communication.'
            }
        ]
    };

    global.PortfolioData = Object.freeze({
        PROFILE: PROFILE,
        TOPOLOGIES: TOPOLOGIES,
        EXPERIENCE: EXPERIENCE,
        PROJECTS: PROJECTS,
        SKILL_DOMAINS: SKILL_DOMAINS,
        SPHERE_TAGS: SPHERE_TAGS,
        CREDENTIALS: CREDENTIALS
    });
})(window);

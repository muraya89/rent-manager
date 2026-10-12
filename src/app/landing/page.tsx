"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ArrowRight,
  Bell,
  Building2,
  Check,
  ChevronDown,
  CircleDollarSign,
  Menu,
  Play,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";

const properties = [
  {
    name: "Maple Street Apartments",
    units: "24 units",
    status: "98% collected",
    color: "bg-[#d5f3e4]",
  },
  {
    name: "The Juniper House",
    units: "8 units",
    status: "100% collected",
    color: "bg-[#f9e5bc]",
  },
  {
    name: "Cedar & 5th",
    units: "12 units",
    status: "94% collected",
    color: "bg-[#e6def7]",
  },
];

function Reveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add("is-visible");
          observer.unobserve(node);
        }
      },
      { threshold: 0.14 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`reveal ${className}`}
    >
      {children}
    </div>
  );
}

function ProductScreen() {
  return (
    <div className="product-window">
      <div className="window-bar">
        <div className="window-dots">
          <i />
          <i />
          <i />
        </div>
        <span className="window-title">Rentwise / Overview</span>
        <div className="window-avatar">JM</div>
      </div>
      <div className="product-body">
        <aside className="product-sidebar">
          <div className="mini-brand">
            <span className="brand-mark">r</span> rentwise
          </div>
          <div className="side-label">WORKSPACE</div>
          <div className="side-item active">
            <span>▦</span> Overview
          </div>
          <div className="side-item">
            <span>⌂</span> Properties
          </div>
          <div className="side-item">
            <span>♙</span> Tenants
          </div>
          <div className="side-item">
            <span>↗</span> Payments
          </div>
          <div className="side-item">
            <span>◌</span> Reports
          </div>
          <div className="side-bottom">
            <span>⚙</span> Settings
          </div>
        </aside>
        <section className="product-main">
          <div className="screen-head">
            <div>
              <p className="eyebrow">MONDAY, OCTOBER 12, 2026</p>
              <h3>
                Good morning, Jordan <span>✦</span>
              </h3>
            </div>
            <button className="add-button">+ Add property</button>
          </div>
          <div className="metric-grid">
            <div className="metric-card">
              <span>Total collected</span>
              <strong>$42,860</strong>
              <em>
                ↑ 8.4% <small>vs last month</small>
              </em>
              <div className="sparkline green">
                <b />
                <b />
                <b />
                <b />
                <b />
                <b />
                <b />
              </div>
            </div>
            <div className="metric-card">
              <span>Outstanding</span>
              <strong>$3,240</strong>
              <em className="warm">
                ↓ 12.1% <small>vs last month</small>
              </em>
              <div className="sparkline amber">
                <b />
                <b />
                <b />
                <b />
                <b />
                <b />
                <b />
              </div>
            </div>
            <div className="metric-card">
              <span>Occupancy</span>
              <strong>96.8%</strong>
              <em>
                ↑ 2.6% <small>vs last month</small>
              </em>
              <div className="circle-chart">
                <span>96</span>
              </div>
            </div>
          </div>
          <div className="lower-grid">
            <div className="rent-chart">
              <div className="chart-title">
                <b>Payment activity</b>
                <span>Last 6 months⌄</span>
              </div>
              <div className="chart-area">
                <div className="chart-line" />
                <div className="chart-bars">
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                </div>
                <div className="chart-months">
                  <span>May</span>
                  <span>Jun</span>
                  <span>Jul</span>
                  <span>Aug</span>
                  <span>Sep</span>
                  <span>Oct</span>
                </div>
              </div>
            </div>
            <div className="activity">
              <div className="chart-title">
                <b>Recent activity</b>
                <span>View all →</span>
              </div>
              <div className="activity-row">
                <div className="activity-icon mint">✓</div>
                <div>
                  <b>Rent received</b>
                  <span>Maple Street · Unit 204</span>
                </div>
                <strong>+$1,850</strong>
              </div>
              <div className="activity-row">
                <div className="activity-icon lilac">↗</div>
                <div>
                  <b>Lease signed</b>
                  <span>The Juniper House · Unit 3A</span>
                </div>
                <strong className="neutral">Today</strong>
              </div>
              <div className="activity-row">
                <div className="activity-icon peach">!</div>
                <div>
                  <b>Payment reminder sent</b>
                  <span>Cedar & 5th · Unit 11</span>
                </div>
                <strong className="neutral">9:42 AM</strong>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <>
      <main className="site-shell">
        <nav className={`nav-wrap ${scrolled ? "nav-scrolled" : ""}`}>
          <a className="brand" href="#top" aria-label="rentwise home">
            <span className="brand-mark">r</span>
            <span>rentwise</span>
          </a>
          <div className={`nav-actions ${menuOpen ? "open" : ""}`}>
            <a href="#product" onClick={() => setMenuOpen(false)}>
              Product
            </a>
            <a href="#why" onClick={() => setMenuOpen(false)}>
              Why rentwise
            </a>
            <a href="#pricing" onClick={() => setMenuOpen(false)}>
              Pricing
            </a>
            <a href="#resources" onClick={() => setMenuOpen(false)}>
              Resources
            </a>
            <div className="mobile-actions">
              <a href="/auth/login" className="login">
                Log in
              </a>
              <a className="nav-cta" href="#start">
                Start for free <ArrowRight data-icon="inline-end" />
              </a>
            </div>
          </div>
          <div className="nav-actions">
            <a href="/auth/login" className="login">
              Log in
            </a>
            <a className="nav-cta" href="#start">
              Start for free <ArrowRight data-icon="inline-end" />
            </a>
          </div>
          <button
            className="menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </nav>

        <section className="hero" id="top">
          <div className="hero-orb orb-one" />
          <div className="hero-orb orb-two" />
          <div className="hero-copy">
            <div className="pill">
              <Sparkles data-icon="inline-start" /> The calmer way to manage
              rent
            </div>
            <h1>
              Property management,
              <br />
              <span>without the busywork.</span>
            </h1>
            <p>
              Rentwise brings rent collection, maintenance, and tenant
              communication into one beautifully simple workspace.
            </p>
            <div className="hero-buttons">
              <a className="primary-button" href="#start">
                Start for free <ArrowRight data-icon="inline-end" />
              </a>
              <button className="play-button">
                <span>
                  <Play data-icon="inline-start" />
                </span>{" "}
                See how it works
              </button>
            </div>
            <div className="trust-line">
              <div className="avatar-stack">
                <span>AL</span>
                <span>MR</span>
                <span>TK</span>
              </div>
              <span>Trusted by 4,000+ property owners</span>
            </div>
          </div>
          <div className="hero-product" id="product">
            <ProductScreen />
            <div className="float-card float-payment">
              <div className="float-icon">
                <CircleDollarSign />
              </div>
              <div>
                <b>Payment received</b>
                <span>Maple Street · Unit 204</span>
              </div>
              <strong>+$1,850</strong>
            </div>
            <div className="float-card float-alert">
              <div className="float-icon alert">
                <Bell />
              </div>
              <div>
                <b>All caught up</b>
                <span>No overdue payments</span>
              </div>
              <Check />
            </div>
          </div>
        </section>

        <Reveal className="section-reveal">
          <section className="logo-strip">
            <span>BUILT FOR PEOPLE WHO MANAGE</span>
            <div>
              <b>northstar</b>
              <b>HABITAT</b>
              <b className="serif">morrow</b>
              <b>HOMELY</b>
              <b>oak & co.</b>
            </div>
          </section>
        </Reveal>

        <Reveal className="section-reveal">
          <section className="feature-section" id="why">
            <div className="section-intro">
              <div className="pill light">
                <ShieldCheck data-icon="inline-start" /> Less admin, more living
              </div>
              <h2>
                Everything you need.
                <br />
                <em>Nothing you don&apos;t.</em>
              </h2>
              <p>
                Rentwise turns the everyday work of property management into a
                workflow that feels almost effortless.
              </p>
            </div>
            <div className="feature-grid">
              <article className="feature-card large-card">
                <div className="feature-label">01 / GET PAID</div>
                <h3>Rent collection that runs itself.</h3>
                <p>
                  Automated reminders and easy online payments mean fewer
                  awkward follow-ups and more money in your account.
                </p>
                <div className="payment-demo">
                  <div>
                    <span className="demo-check">✓</span>
                    <b>September rent</b>
                    <small>Maple Street · 24 units</small>
                  </div>
                  <strong>
                    $24,600 <em>Paid</em>
                  </strong>
                </div>
              </article>
              <article className="feature-card peach-card">
                <div className="feature-label">02 / STAY AHEAD</div>
                <h3>Know what needs your attention.</h3>
                <p>
                  One clear view of every property, payment, and open request.
                </p>
                <div className="mini-tasks">
                  <div>
                    <span className="task-dot peach" />
                    Schedule inspection <b>Today</b>
                  </div>
                  <div>
                    <span className="task-dot green" />
                    Lease renewal <b>In 4 days</b>
                  </div>
                  <div>
                    <span className="task-dot purple" />
                    Maintenance request <b>2 open</b>
                  </div>
                </div>
              </article>
              <article className="feature-card green-card">
                <div className="feature-label">03 / KEEP IT HUMAN</div>
                <h3>Better relationships, built in.</h3>
                <p>
                  Give tenants a clear line to you without giving up your whole
                  day.
                </p>
                <div className="message-demo">
                  <div className="message-person">
                    <span>MC</span>
                    <div>
                      <b>Maria Chen</b>
                      <small>Unit 204 · Maple Street</small>
                    </div>
                  </div>
                  <div className="message-bubble">
                    Hi Jordan! The faucet is all fixed. Thanks for the quick
                    help.
                  </div>
                  <div className="message-reply">
                    Reply to Maria <ArrowRight />
                  </div>
                </div>
              </article>
            </div>
          </section>
        </Reveal>

        <Reveal className="section-reveal">
          <section className="bottom-cta" id="start">
            <div className="cta-orb" />
            <div className="pill dark-pill">✦ Make rent day the easy day</div>
            <h2>
              A better way to
              <br />
              <span>run your properties.</span>
            </h2>
            <p>
              Join thousands of property owners who have traded spreadsheets for
              a little more peace of mind.
            </p>
            <a className="primary-button cream" href="#top">
              Start for free <ArrowRight data-icon="inline-end" />
            </a>
            <small>No credit card required · Set up in 5 minutes</small>
          </section>
        </Reveal>
        <footer>
          <a className="brand" href="#top">
            <span className="brand-mark">r</span>
            <span>rentwise</span>
          </a>
          <span>© 2026 rentwise, inc.</span>
          <div className="">
            <a href="#privacy">Privacy</a>
            <a href="#terms">Terms</a>
            <a href="#contact">Contact</a>
          </div>
        </footer>
      </main>
    </>
  );
}

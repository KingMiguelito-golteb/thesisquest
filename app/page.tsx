import Link from "next/link";
import {
  Trophy,
  Target,
  MessageSquare,
  BarChart3,
  ChevronRight,
  Sparkles,
  Shield,
  Users,
  BookOpen,
  Zap,
  Star,
  GraduationCap,
  Swords,
  Flame,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSession } from "@/app/actions/auth";
import { redirect } from "next/navigation";

export default async function LandingPage() {
  const session = await getSession();

  if (session) {
    switch (session.role) {
      case "ADMIN":
        redirect("/dashboard/admin");
      case "TEACHER":
        redirect("/dashboard/teacher");
      case "STUDENT":
        redirect("/dashboard/student");
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg-darkest)] text-[var(--text-primary)]">
      {/* Navigation */}
      <nav className="border-b border-[var(--border-dim)] bg-[var(--bg-darker)]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-[var(--bg-card)] border border-[var(--cyan)] flex items-center justify-center glow-cyan-subtle"
                   style={{ borderRadius: "4px" }}>
                <Swords className="w-4 h-4 text-[var(--cyan)]" />
              </div>
              <span className="text-xl font-bold font-[family-name:var(--font-heading)] tracking-tight text-glow-cyan">
                THESISQUEST
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button
                  variant="ghost"
                  className="text-[var(--text-secondary)] hover:text-[var(--cyan)] hover:bg-[var(--cyan-glow)] btn-cyber text-xs"
                  style={{ borderRadius: "4px" }}
                >
                  Log In
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  className="bg-[var(--cyan)] text-black hover:bg-[var(--cyan-dim)] btn-cyber text-xs px-5 glow-cyan-subtle"
                  style={{ borderRadius: "4px" }}
                >
                  Get Started
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(var(--cyan) 1px, transparent 1px),
              linear-gradient(90deg, var(--cyan) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Glow Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-[var(--cyan)] rounded-full blur-[200px] opacity-[0.04]" />
          <div className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] bg-[var(--magenta)] rounded-full blur-[200px] opacity-[0.04]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-36">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-[var(--cyan)] text-[var(--cyan)] text-xs font-[family-name:var(--font-heading)] uppercase tracking-widest mb-8 glow-cyan-subtle"
                 style={{ borderRadius: "2px" }}>
              <Sparkles className="w-3.5 h-3.5" />
              Gamified Research Tracking
            </div>

            {/* Title */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tighter mb-6 font-[family-name:var(--font-heading)]">
              <span className="block text-[var(--text-primary)]">LEVEL UP YOUR</span>
              <span className="block text-glow-cyan mt-2">
                RESEARCH JOURNEY
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-2xl mx-auto mb-12 leading-relaxed">
              Transform your thesis and capstone projects into an engaging quest.
              Track milestones, earn XP, get real-time feedback, and complete your
              research on time.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button
                  size="lg"
                  className="bg-[var(--cyan)] text-black hover:bg-[var(--cyan-dim)] btn-cyber text-sm px-8 py-6 glow-cyan"
                  style={{ borderRadius: "4px" }}
                >
                  <Zap className="w-5 h-5 mr-2" />
                  START YOUR QUEST
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-[var(--border-medium)] text-[var(--text-secondary)] hover:border-[var(--magenta)] hover:text-[var(--magenta)] hover:bg-[var(--magenta-glow)] btn-cyber text-sm px-8 py-6"
                  style={{ borderRadius: "4px" }}
                >
                  I HAVE AN ACCOUNT
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center gap-8 mt-20">
              {[
                { value: "100%", label: "Free to Use", color: "var(--cyan)" },
                { value: "REAL-TIME", label: "Progress Tracking", color: "var(--magenta)" },
                { value: "GAMIFIED", label: "XP & Achievements", color: "var(--gold)" },
              ].map((stat, i) => (
                <div key={i} className="flex items-center gap-8">
                  <div className="text-center">
                    <div className="text-xl font-bold font-[family-name:var(--font-heading)] tracking-tight"
                         style={{ color: stat.color }}>
                      {stat.value}
                    </div>
                    <div className="text-xs text-[var(--text-dim)] uppercase tracking-wider mt-1">
                      {stat.label}
                    </div>
                  </div>
                  {i < 2 && (
                    <div className="w-px h-8 bg-[var(--border-subtle)]" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative border-t border-[var(--border-dim)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 font-[family-name:var(--font-heading)] tracking-tight">
              EVERYTHING YOU NEED TO{" "}
              <span className="text-glow-cyan">CONQUER</span>{" "}
              YOUR THESIS
            </h2>
            <p className="text-[var(--text-secondary)] text-base max-w-2xl mx-auto">
              A complete toolkit designed to keep you on track, motivated, and
              connected with your adviser.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: Target,
                title: "MILESTONE TRACKING",
                desc: "Break your research into structured chapters and milestones. See your progress at a glance.",
                color: "var(--cyan)",
                glow: "var(--cyan-glow)",
              },
              {
                icon: Trophy,
                title: "XP & ACHIEVEMENTS",
                desc: "Earn experience points for completing tasks. Level up, unlock badges, and climb the leaderboard.",
                color: "var(--magenta)",
                glow: "var(--magenta-glow)",
              },
              {
                icon: MessageSquare,
                title: "TEACHER FEEDBACK",
                desc: "Receive structured feedback directly on your tasks. No more scattered messages across apps.",
                color: "var(--gold)",
                glow: "var(--gold-glow)",
              },
              {
                icon: BarChart3,
                title: "ANALYTICS",
                desc: "Teachers and admins get real-time analytics to identify at-risk students and track progress.",
                color: "var(--emerald)",
                glow: "var(--emerald-glow)",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="card-cyber-accent p-6 group cursor-default"
                style={{ borderRadius: "4px" }}
              >
                <div
                  className="w-12 h-12 flex items-center justify-center mb-4 border transition-all duration-300 group-hover:scale-110"
                  style={{
                    borderRadius: "4px",
                    borderColor: feature.color,
                    background: feature.glow,
                    boxShadow: `0 0 12px ${feature.glow}`,
                  }}
                >
                  <feature.icon
                    className="w-6 h-6"
                    style={{ color: feature.color }}
                  />
                </div>
                <h3 className="text-sm font-bold mb-2 font-[family-name:var(--font-heading)] tracking-wide"
                    style={{ color: feature.color }}>
                  {feature.title}
                </h3>
                <p className="text-[var(--text-secondary)] text-xs leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 border-t border-[var(--border-dim)] bg-[var(--bg-darker)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 font-[family-name:var(--font-heading)] tracking-tight">
              HOW{" "}
              <span className="text-glow-magenta">THESISQUEST</span>{" "}
              WORKS
            </h2>
            <p className="text-[var(--text-secondary)] text-base max-w-2xl mx-auto">
              Three roles, one platform. Everyone stays connected and informed.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: GraduationCap,
                role: "STUDENTS",
                color: "var(--cyan)",
                glow: "var(--cyan-glow)",
                items: [
                  "Manage research tasks and milestones",
                  "Track progress with visual dashboards",
                  "Earn XP, level up, unlock achievements",
                  "Submit tasks for teacher review",
                ],
              },
              {
                icon: Shield,
                role: "TEACHERS",
                color: "var(--magenta)",
                glow: "var(--magenta-glow)",
                items: [
                  "Monitor all assigned groups at once",
                  "Review and approve task submissions",
                  "Provide structured feedback",
                  "Request revisions with clear notes",
                ],
              },
              {
                icon: Users,
                role: "ADMINISTRATORS",
                color: "var(--gold)",
                glow: "var(--gold-glow)",
                items: [
                  "School-wide progress overview",
                  "Identify at-risk students early",
                  "Generate institutional reports",
                  "Monitor submission trends",
                ],
              },
            ].map((card, i) => (
              <div
                key={i}
                className="card-cyber-accent p-8"
                style={{ borderRadius: "4px" }}
              >
                <div
                  className="w-14 h-14 flex items-center justify-center mb-6 border"
                  style={{
                    borderRadius: "4px",
                    borderColor: card.color,
                    background: card.glow,
                  }}
                >
                  <card.icon
                    className="w-7 h-7"
                    style={{ color: card.color }}
                  />
                </div>
                <h3
                  className="text-lg font-bold mb-4 font-[family-name:var(--font-heading)] tracking-wide"
                  style={{ color: card.color }}
                >
                  {card.role}
                </h3>
                <ul className="space-y-3">
                  {card.items.map((item, j) => (
                    <li
                      key={j}
                      className="flex items-start gap-2 text-[var(--text-secondary)] text-sm"
                    >
                      <Flame
                        className="w-3.5 h-3.5 mt-0.5 flex-shrink-0"
                        style={{ color: card.color }}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 border-t border-[var(--border-dim)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div
            className="p-12 card-cyber-accent animate-border-glow"
            style={{ borderRadius: "4px" }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 font-[family-name:var(--font-heading)] tracking-tight">
              READY TO <span className="text-glow-cyan">START</span> YOUR QUEST?
            </h2>
            <p className="text-[var(--text-secondary)] text-base mb-8 max-w-xl mx-auto">
              Join ThesisQuest today and transform how you manage your research
              projects. Free and takes less than a minute.
            </p>
            <Link href="/register">
              <Button
                size="lg"
                className="bg-[var(--cyan)] text-black hover:bg-[var(--cyan-dim)] btn-cyber text-sm px-10 py-6 glow-cyan"
                style={{ borderRadius: "4px" }}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                CREATE FREE ACCOUNT
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border-dim)] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 border border-[var(--cyan)] flex items-center justify-center"
                   style={{ borderRadius: "2px" }}>
                <Swords className="w-3.5 h-3.5 text-[var(--cyan)]" />
              </div>
              <span className="text-sm font-bold font-[family-name:var(--font-heading)] text-[var(--text-secondary)] tracking-wide">
                THESISQUEST
              </span>
            </div>
            <p className="text-xs text-[var(--text-dim)]">
              Built with 🔥 — Gamified Research Progress Tracking
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
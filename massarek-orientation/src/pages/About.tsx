import { Link } from "react-router-dom";
import MassarekLogo from "@/components/MassarekLogo";

const team = [
  { name: "Zouhair El Mazi", role: "Full-Stack Developer" },
  { name: "Aymane El Asri", role: "Full-Stack Developer" },
];

const benefits = [
  {
    title: "Personalized orientation",
    description: "Tailored guidance based on your unique skills, interests, and test results.",
  },
  {
    title: "AI-powered recommendations",
    description: "Intelligent suggestions that match you with the best academic fields and career paths.",
  },
  {
    title: "Better decision-making",
    description: "Clear, data-driven insights to help you choose with confidence and clarity.",
  },
  {
    title: "Easy access to career information",
    description: "Fast, comprehensive access to details about majors, careers, and future opportunities.",
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-6 pb-20 pt-24 sm:px-8 lg:px-10">
        <section className="overflow-hidden rounded-[2rem] border border-border bg-card p-8 shadow-card transition duration-300 sm:p-10">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-3 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                <MassarekLogo size="sm" />
                <span>About Massarek</span>
              </div>
              <h1 className="mt-8 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                AI-powered student orientation for clearer academic decisions.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
                Massarek helps students discover the best academic and career path using intelligent recommendations, in-depth insights, and a simple platform designed for the next generation of learners.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/10 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl"
                >
                  Start your orientation
                </Link>
                <Link
                  to="/careers"
                  className="inline-flex items-center justify-center rounded-2xl border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition duration-300 hover:bg-muted"
                >
                  Explore career paths
                </Link>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-[2rem] border border-border bg-background p-8 shadow-xl transition duration-300 hover:-translate-y-1 hover:shadow-2xl sm:p-10">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary/80 opacity-30" />
              <div className="relative">
                <p className="text-sm uppercase tracking-[0.35em] text-primary font-semibold">Project insight</p>
                <h2 className="mt-4 text-2xl font-semibold text-foreground sm:text-3xl">
                  Crafted to remove uncertainty and bring clarity to student orientation.
                </h2>
                <p className="mt-5 text-muted-foreground leading-7">
                  Designed with modern students in mind, Massarek combines AI analysis with easy-to-read career intelligence so learners can choose their future with confidence.
                </p>
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl bg-primary/5 px-4 py-4">
                    <p className="text-sm font-semibold text-primary">Smart guidance</p>
                    <p className="mt-2 text-sm text-muted-foreground">Focused recommendations for every student journey.</p>
                  </div>
                  <div className="rounded-3xl bg-secondary/5 px-4 py-4">
                    <p className="text-sm font-semibold text-secondary">Data-driven clarity</p>
                    <p className="mt-2 text-sm text-muted-foreground">Insights based on tests, interests, and academic goals.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-12 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] border border-border bg-card p-8 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="flex items-center gap-3 text-primary">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">1</span>
              <h2 className="text-xl font-semibold">Project Idea</h2>
            </div>
            <p className="mt-5 text-muted-foreground leading-7">
              Massarek is an AI-powered platform that helps students find the best academic and career paths based on their skills, interests, and test results. It brings meaningful guidance into the orientation process using modern intelligence.
            </p>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] border border-border bg-card p-8 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="flex items-center gap-3 text-secondary">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">2</span>
                <h2 className="text-xl font-semibold">Why We Built This</h2>
              </div>
              <p className="mt-5 text-muted-foreground leading-7">
                Many students struggle to choose the right academic path due to lack of guidance and clear information. Massarek was created to bridge that gap and provide intelligent, data-driven support for academic decision-making.
              </p>
            </div>

            <div className="rounded-[2rem] border border-border bg-card p-8 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="flex items-center gap-3 text-primary">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">3</span>
                <h2 className="text-xl font-semibold">Our Mission</h2>
              </div>
              <p className="mt-5 text-muted-foreground leading-7">
                To help students make smarter decisions using intelligent AI recommendations. We empower learners to choose the academic path that truly aligns with their strengths and aspirations.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-12 rounded-[2rem] border border-border bg-card p-8 shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-primary font-semibold">Benefits</p>
              <h2 className="mt-4 text-3xl font-bold">Why students love Massarek</h2>
            </div>
            <Link
              to="/test"
              className="rounded-2xl border border-border bg-background px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-muted"
            >
              Try the orientation test
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {benefits.map((item) => (
              <div key={item.title} className="rounded-3xl border border-border bg-background p-6 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-xl">
                <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <div className="rounded-[2rem] border border-border bg-card p-8 shadow-card">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-primary font-semibold">Team</p>
                <h2 className="mt-4 text-3xl font-bold">Created by students, built for students</h2>
                <p className="mt-4 max-w-2xl text-muted-foreground leading-7">
                  Massarek was developed by a focused team of student-oriented engineers who care about accessibility, transparency, and helping learners choose the right academic journey.
                </p>
              </div>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {team.map((member) => (
                <div key={member.name} className="group rounded-3xl border border-border bg-background p-6 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 text-xl font-semibold text-primary">
                      {member.name
                        .split(" ")
                        .map((part) => part[0])
                        .join("")}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{member.name}</h3>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                  <p className="mt-5 text-sm leading-7 text-muted-foreground">
                    Bringing experience, creativity, and an AI-first mindset to every part of the Massarek experience.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;

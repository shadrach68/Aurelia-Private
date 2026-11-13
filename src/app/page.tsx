import {
  ArrowRight,
  ShieldCheck,
  Globe2,
  Landmark,
  LockKeyhole,
  ChevronRight,
  Menu,
} from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#080C12] text-white">

      {/* Demo Notice */}
      <div className="bg-[#C5A46D] text-[#080C12] text-center py-2 text-xs tracking-wide font-medium">
        DEMONSTRATION ENVIRONMENT — NO REAL MONEY OR BANKING SERVICES
      </div>

      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 lg:px-12 py-7 flex items-center justify-between">

        <div>
          <h1 className="text-2xl tracking-[0.18em] font-serif text-[#D6B77A]">
            AURELIA
          </h1>
          <p className="text-[9px] tracking-[0.45em] text-gray-400 text-center">
            PRIVATE BANKING DEMO
          </p>
        </div>

        <div className="hidden md:flex items-center gap-10 text-sm text-gray-300">
          <a href="#home" className="hover:text-[#D6B77A]">Home</a>
          <a href="#services" className="hover:text-[#D6B77A]">Our Services</a>
          <a href="#about" className="hover:text-[#D6B77A]">About</a>
          <a href="#contact" className="hover:text-[#D6B77A]">Contact</a>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <a href="/login" className="text-sm hover:text-[#D6B77A]">
            Sign In
          </a>

          <a
            href="/register"
            className="bg-[#C5A46D] text-[#080C12] px-6 py-3 text-sm font-semibold hover:bg-[#D9BC89] transition"
          >
            Get Started
          </a>
        </div>

        <button className="md:hidden text-[#D6B77A]" aria-label="Open menu">
          <Menu size={25} />
        </button>

      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="max-w-7xl mx-auto px-6 lg:px-12 pt-24 pb-32 grid lg:grid-cols-2 gap-16 items-center"
      >

        <div>

          <div className="flex items-center gap-3 mb-8">
            <div className="h-px w-12 bg-[#C5A46D]"></div>
            <span className="text-[#C5A46D] text-xs tracking-[0.3em] uppercase">
              A Higher Standard of Banking
            </span>
          </div>

          <h2 className="font-serif text-5xl md:text-7xl leading-[1.15] mb-8">
            Your Wealth.
            <br />
            Your Legacy.
            <br />
            <span className="text-[#C5A46D] italic">
              Your World.
            </span>
          </h2>

          <p className="text-gray-400 text-base md:text-lg leading-8 max-w-lg mb-10">
            Experience a refined digital banking demonstration,
            designed around sophistication, privacy and effortless
            financial management.
          </p>

          <div className="flex flex-wrap gap-4">

            <a
              href="/register"
              className="bg-[#C5A46D] text-[#080C12] px-8 py-4 text-sm font-semibold flex items-center gap-3 hover:bg-[#D9BC89] transition"
            >
              Explore Demo
              <ArrowRight size={17} />
            </a>

            <a
              href="#about"
              className="border border-white/20 px-8 py-4 text-sm hover:border-[#C5A46D] transition"
            >
              Discover More
            </a>

          </div>

          <div className="mt-16 flex items-center gap-8 text-gray-500 text-xs">

            <div className="flex items-center gap-2">
              <ShieldCheck size={17} className="text-[#C5A46D]" />
              Secure Demo
            </div>

            <div className="flex items-center gap-2">
              <LockKeyhole size={17} className="text-[#C5A46D]" />
              Privacy Focused
            </div>

          </div>

        </div>

        {/* Decorative Banking Card */}
        <div className="relative">

          <div className="absolute inset-0 bg-[#C5A46D]/10 blur-[100px] rounded-full"></div>

          <div className="relative border border-[#C5A46D]/30 bg-gradient-to-br from-[#20252D] to-[#0B1018] p-8 md:p-12 shadow-2xl">

            <div className="flex justify-between items-start mb-20">

              <div>
                <p className="text-xs tracking-[0.3em] text-gray-400">
                  AURELIA
                </p>
                <p className="text-[9px] tracking-[0.3em] text-[#C5A46D] mt-1">
                  PRIVATE DEMO CARD
                </p>
              </div>

              <Landmark className="text-[#C5A46D]" size={30} />

            </div>

            <p className="text-gray-400 text-xs tracking-widest mb-3">
              ILLUSTRATIVE PORTFOLIO VALUE
            </p>

            <h3 className="font-serif text-4xl md:text-5xl text-[#D6B77A] mb-4">
              $1,000,000.00
            </h3>

            <p className="text-gray-500 text-xs mb-16">
              SIMULATED BALANCE — NOT REAL FUNDS
            </p>

            <div className="flex justify-between items-end">

              <div>
                <p className="text-gray-500 text-[10px] tracking-widest">
                  ACCOUNT HOLDER
                </p>
                <p className="text-sm tracking-wider mt-2">
                  PRIVATE CLIENT
                </p>
              </div>

              <div className="text-right">
                <p className="text-gray-500 text-[10px] tracking-widest">
                  ACCOUNT TYPE
                </p>
                <p className="text-sm mt-2 text-[#C5A46D]">
                  WEALTH DEMO
                </p>
              </div>

            </div>

          </div>

          <div className="absolute -bottom-6 -right-4 bg-[#C5A46D] text-[#080C12] p-5 hidden md:block">
            <Globe2 size={25} />
          </div>

        </div>

      </section>

      {/* Services */}
      <section id="services" className="border-t border-white/10 py-24">

        <div className="max-w-7xl mx-auto px-6 lg:px-12">

          <div className="text-center mb-16">

            <p className="text-[#C5A46D] text-xs tracking-[0.3em] mb-5">
              THE AURELIA EXPERIENCE
            </p>

            <h2 className="font-serif text-4xl md:text-5xl">
              Banking Beyond Ordinary
            </h2>

            <p className="text-gray-500 mt-5 max-w-xl mx-auto leading-7">
              Explore an elegant collection of simulated banking
              experiences designed for the modern private client.
            </p>

          </div>

          <div className="grid md:grid-cols-3 gap-8">

            {[
              {
                icon: Landmark,
                title: "Wealth Management",
                description: "Explore your simulated portfolio and account overview."
              },
              {
                icon: ShieldCheck,
                title: "Digital Security",
                description: "Experience secure authentication and protected account access."
              },
              {
                icon: Globe2,
                title: "Global Banking",
                description: "Explore a simulated international banking experience."
              }
            ].map((service, index) => (

              <div
                key={index}
                className="border border-white/10 p-9 hover:border-[#C5A46D]/50 transition duration-300"
              >

                <service.icon size={30} className="text-[#C5A46D] mb-7" />

                <h3 className="font-serif text-2xl mb-4">
                  {service.title}
                </h3>

                <p className="text-gray-500 leading-7 text-sm">
                  {service.description}
                </p>

                <div className="mt-8 flex items-center gap-2 text-[#C5A46D] text-sm">
                  Explore Experience
                  <ChevronRight size={16} />
                </div>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* Footer */}
      <footer id="contact" className="border-t border-white/10 py-10">

        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row justify-between gap-6">

          <div>
            <h3 className="font-serif tracking-widest text-[#C5A46D]">
              AURELIA PRIVATE
            </h3>
            <p className="text-gray-600 text-xs mt-2">
              An independent simulated banking experience.
            </p>
          </div>

          <p className="text-gray-600 text-xs">
            © 2026 Aurelia Private. Demonstration project.
            Not a licensed financial institution.
          </p>

        </div>

      </footer>

    </main>
  );
}

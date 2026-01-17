import React from "react";
import { Globe, Users, Trophy, Award, Target, Heart } from "lucide-react";

const AboutScreen = () => {
  const stats = [
    {
      icon: <Users />,
      label: "Happy Customers",
      value: "50K+",
      color: "#B08D55",
    },
    {
      icon: <Globe />,
      label: "Countries Served",
      value: "20+",
      color: "#B08D55",
    },
    { icon: <Trophy />, label: "Awards Won", value: "15", color: "#B08D55" },
  ];

  const values = [
    {
      icon: <Target />,
      title: "Quality First",
      desc: "We source only the finest products that meet our rigorous standards.",
    },
    {
      icon: <Heart />,
      title: "Customer Care",
      desc: "Your satisfaction is our priority. We're here to help every step of the way.",
    },
    {
      icon: <Award />,
      title: "Excellence",
      desc: "Committed to delivering exceptional experiences in every interaction.",
    },
  ];

  return (
    <div className="h-screen overflow-y-auto snap-y snap-mandatory scroll-smooth bg-[var(--color-surface)]">
      {/* Static Background - No Animation */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-gradient-to-b from-[var(--color-surface)] to-[var(--color-surface)]"></div>

      {/* Section 1: Hero (Story + Stats) */}
      <section className="min-h-screen w-full snap-start flex items-center justify-center relative z-10 p-6">
        <div className="container mx-auto max-w-[1400px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Story Text */}
            <div className="text-left">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-[#B08D55]/10 flex items-center justify-center">
                    <Globe className="text-[#B08D55]" size={24} />
                  </div>
                  <span className="text-[#B08D55] font-bold tracking-[0.2em] uppercase text-sm">
                    About Us
                  </span>
                </div>

                <h1 className="text-6xl md:text-7xl lg:text-8xl font-serif font-bold tracking-tighter leading-[0.9] mb-8 text-primary">
                  Our <span className="italic text-secondary">Story</span>
                </h1>

                <p className="text-lg text-secondary max-w-xl font-light leading-relaxed mb-8">
                 LUXE  is more than a marketplace. We're curators
                  of exceptional products, bridging the gap between aspiration
                  and reality through thoughtful selection and premium service.
                </p>

                <div className="grid grid-cols-3 gap-4">
                  {stats.map((stat, i) => (
                    <div
                      key={i}
                      className="glass-panel p-4 rounded-2xl border border-[#2c2926]/5 text-center bg-white/40"
                    >
                      <div className="text-2xl font-serif font-bold text-primary">
                        {stat.value}
                      </div>
                      <div className="text-[10px] text-secondary font-bold uppercase">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Feature Image */}
            <div className="relative h-full min-h-[400px]">
              <div className="glass-panel h-full w-full bg-white/20 rounded-[32px] overflow-hidden border border-[#2c2926]/5 relative">
                <img
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80"
                  className="w-full h-full object-cover"
                  alt="Store"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                  <div>
                    <h3 className="text-white text-3xl font-serif font-bold italic mb-2">
                      Redefining Retail
                    </h3>
                    <p className="text-white/80 font-light text-sm">
                      Experience premium shopping in LUXE.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Core Values */}
      <section className="min-h-screen w-full snap-start flex items-center justify-center relative z-10 p-6">
        <div className="container mx-auto max-w-[1400px]">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary">
              Core Values
            </h2>
            <p className="text-secondary mt-4 max-w-xl mx-auto">
              The principles that guide every decision we make.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, i) => (
              <div
                key={i}
                className="glass-panel bg-white/40 p-10 rounded-[32px] border border-[#2c2926]/5 flex flex-col items-center text-center hover:bg-white/60 transition-colors shadow-lg"
              >
                <div className="w-16 h-16 rounded-full bg-[#B08D55]/10 flex items-center justify-center mb-6">
                  {React.cloneElement(value.icon, {
                    size: 28,
                    className: "text-[#B08D55]",
                    strokeWidth: 1.5,
                  })}
                </div>
                <h3 className="text-2xl font-serif font-bold italic text-primary mb-4">
                  {value.title}
                </h3>
                <p className="text-base text-secondary font-light leading-relaxed">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Mission */}
      <section className="min-h-screen w-full snap-start flex items-center justify-center relative z-10 p-6">
        <div className="container mx-auto max-w-[1200px]">
          <div className="glass-panel p-16 md:p-24 rounded-[40px] bg-[#2c2926] text-[#F2EFE9] flex flex-col items-center text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] translate-x-1/2 -translate-y-1/2"></div>
            <div className="relative z-10 max-w-3xl">
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-8">
                <Target className="text-white" size={32} />
              </div>
              <h3 className="text-4xl md:text-5xl font-serif font-bold mb-6">
                Our Mission
              </h3>
              <p className="text-white/80 font-light leading-relaxed text-xl mb-12">
                We believe shopping should be an experience—curated, elegant,
                and personal. Every product we offer undergoes meticulous
                selection to ensure it meets our standards of quality, design,
                and value.
              </p>
              <button className="px-10 py-4 rounded-full bg-white text-[#2c2926] font-bold text-lg hover:bg-white/90 transition-colors">
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutScreen;

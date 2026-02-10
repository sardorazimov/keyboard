import { Keyboard, Target, TrendingUp, Trophy } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: <Keyboard className="w-6 h-6 text-blue-500" />,
      title: "Start Typing",
      desc: "Choose your difficulty and start typing the text. The timer starts with your first keystroke."
    },
    {
      icon: <Target className="w-6 h-6 text-emerald-500" />,
      title: "Track Accuracy",
      desc: "KeyType monitors every stroke. Correct characters turn white, while errors are highlighted in red."
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-amber-500" />,
      title: "Analyze Stats",
      desc: "Instantly see your WPM (Words Per Minute) and accuracy percentage as you progress."
    },
    {
      icon: <Trophy className="w-6 h-6 text-purple-500" />,
      title: "Get Ranked",
      desc: "Submit your score to our global leaderboard and see how you stack up against other developers."
    }
  ];

  return (
    <section className="py-12 border-t border-border/40 mt-20">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl font-black tracking-tighter mb-10 text-center uppercase italic">
          How It Works
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-4 p-6 rounded-3xl bg-card/30 border border-border/50 hover:bg-card/50 transition-colors">
              <div className="shrink-0 bg-background p-3 rounded-2xl border border-border shadow-sm h-fit">
                {step.icon}
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* SEO İçin Ekstra Metin Bloğu (Google Buna Bayılır) */}
        <div className="mt-12 p-8 rounded-[2rem] bg-primary/5 border border-primary/10 text-center">
          <p className="text-sm text-muted-foreground italic">
            <strong>KeyType</strong> is a professional-grade typing tool designed to improve muscle memory 
            and coding speed. By practicing regularly, you can increase your WPM and reduce 
            typing fatigue during long development sessions.
          </p>
        </div>
      </div>
    </section>
  );
}
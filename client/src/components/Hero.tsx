import { Button } from "@/components/ui/button";
import heroImage from "@assets/generated_images/Women_travelers_exploring_together_02cb0e1a.png";

export function Hero() {
  return (
    <section className="relative min-h-[600px] lg:min-h-[700px] flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Women travelers exploring together" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-2xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Explore the World with Confidence & Connection
          </h1>
          <p className="text-lg sm:text-xl text-white/90 mb-8 leading-relaxed">
            Join a global community of women supporting women. Find trusted hosts, plan adventures with AI, and travel safely knowing you're never alone.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button 
              variant="default" 
              size="lg"
              className="bg-primary hover:bg-primary border border-primary-border text-primary-foreground"
              data-testid="button-start-journey"
            >
              Start Your Journey
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
              data-testid="button-how-it-works"
            >
              How It Works
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

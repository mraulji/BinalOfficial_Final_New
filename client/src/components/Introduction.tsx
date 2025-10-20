import { Camera, Award, Users, Heart } from "lucide-react";
import ownerPhoto from "@assets/stock_images/professional_photogr_11293deb.jpg";

export function Introduction() {
  const stats = [
    { icon: Camera, label: "Projects Completed", value: "1000+" },
    { icon: Award, label: "Awards Won", value: "25+" },
    { icon: Users, label: "Happy Clients", value: "500+" },
    { icon: Heart, label: "Years Experience", value: "15+" },
  ];

  return (
    <section id="about" className="py-20 sm:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image */}
          <div className="order-2 md:order-1">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-chart-3/20 rounded-lg transform rotate-3" />
              <img
                src={ownerPhoto}
                alt="Rajesh Binal - Founder & Lead Photographer"
                className="relative rounded-lg shadow-xl w-full object-cover aspect-[4/5]"
              />
              <div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground p-6 rounded-lg shadow-lg">
                <p className="font-serif text-4xl font-bold">15+</p>
                <p className="text-sm font-mono">Years</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="order-1 md:order-2">
            <div className="inline-block px-4 py-2 bg-primary/10 rounded-full mb-6">
              <p className="text-sm font-mono text-primary font-medium">About Our Studio</p>
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-6">
              Capturing Memories That Last Forever
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              Founded in 2009 by Rajesh Binal, Binal Studio Photography has been at the forefront
              of creating timeless visual stories. Our passion for photography combined with
              cutting-edge technology ensures that every moment is captured beautifully.
            </p>
            <p className="text-lg text-muted-foreground mb-8">
              We believe that every photograph tells a story, and we're dedicated to telling yours
              in the most authentic and artistic way possible. From intimate weddings to grand
              corporate events, we bring professionalism, creativity, and heart to every project.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 rounded-lg hover-elevate bg-card border border-card-border"
                >
                  <div className="p-2 bg-primary/10 rounded-md">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { useState, useEffect } from "react";
import { Camera, Video, Plane, Frame, Book, Heart } from "lucide-react";
import { getServices } from "@/lib/data";
import type { Service } from "@shared/schema";

const iconMap: Record<string, React.ElementType> = {
  Camera,
  Video,
  Plane,
  Frame,
  Book,
  Heart,
};

export function ServicesSection() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    setServices(getServices());
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <section id="services" className="py-20 sm:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-primary/10 rounded-full mb-6">
            <p className="text-sm font-mono text-primary font-medium">Our Services</p>
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-6">
            Professional Photography Services
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            We offer a comprehensive range of photography and videography services tailored
            to meet your unique needs and exceed your expectations.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => {
            const IconComponent = iconMap[service.icon] || Camera;
            return (
              <div
                key={service.id}
                className="relative group bg-card border border-card-border rounded-lg p-8 hover-elevate active-elevate-2 transition-all"
                data-testid={`card-service-${service.id}`}
              >
                {/* Price Badge */}
                <div className="absolute top-4 right-4 px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm font-mono font-semibold">
                  {formatPrice(service.basePrice)}
                </div>

                {/* Icon */}
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-lg mb-6">
                  <IconComponent className="h-8 w-8 text-primary" />
                </div>

                {/* Content */}
                <h3 className="font-serif text-2xl font-bold text-foreground mb-3">
                  {service.name}
                </h3>
                <p className="text-muted-foreground mb-4">{service.description}</p>
                <p className="text-sm font-mono text-primary">{service.unit}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

import { Mail, Phone, MapPin, Facebook, Instagram, Youtube, Twitter } from "lucide-react";
import logo from "@assets/logo2_1760959947383.png";

export function Footer() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Binal Studio" className="h-12 w-12 rounded-full" />
              <div>
                <h3 className="font-serif text-xl font-bold text-foreground">Binal Studio</h3>
                <p className="text-xs text-muted-foreground font-mono">Photography</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Creating timeless memories through the art of photography since 2009. Your trusted
              partner for weddings, events, and portraits.
            </p>
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-muted hover-elevate active-elevate-2 rounded-md text-muted-foreground hover:text-primary transition-colors"
                data-testid="link-facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-muted hover-elevate active-elevate-2 rounded-md text-muted-foreground hover:text-primary transition-colors"
                data-testid="link-instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-muted hover-elevate active-elevate-2 rounded-md text-muted-foreground hover:text-primary transition-colors"
                data-testid="link-youtube"
              >
                <Youtube className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-muted hover-elevate active-elevate-2 rounded-md text-muted-foreground hover:text-primary transition-colors"
                data-testid="link-twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-lg font-bold text-foreground mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {["home", "about", "team", "services", "gallery", "videos", "contact"].map((link) => (
                <li key={link}>
                  <button
                    onClick={() => scrollToSection(link)}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors capitalize"
                    data-testid={`footer-link-${link}`}
                  >
                    {link === "about" ? "About Us" : link}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-serif text-lg font-bold text-foreground mb-6">Services</h3>
            <ul className="space-y-3">
              <li className="text-sm text-muted-foreground">Wedding Photography</li>
              <li className="text-sm text-muted-foreground">Event Coverage</li>
              <li className="text-sm text-muted-foreground">Portrait Sessions</li>
              <li className="text-sm text-muted-foreground">Videography</li>
              <li className="text-sm text-muted-foreground">Drone Services</li>
              <li className="text-sm text-muted-foreground">Photo Albums & Framing</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-serif text-lg font-bold text-foreground mb-6">Contact Info</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>123, Photography Lane, Indiranagar, Bangalore - 560038</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <Phone className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <div>+91 98765 43210</div>
                  <div>+91 87654 32109</div>
                </div>
              </li>
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <Mail className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <div>info@binalstudio.com</div>
                  <div>bookings@binalstudio.com</div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Binal Studio Photography. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground font-mono">
            Admin: <span className="text-primary">admin</span> / <span className="text-primary">binal2024</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

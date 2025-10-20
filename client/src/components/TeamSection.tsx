import { useState, useEffect } from "react";
import { getTeamMembers } from "@/lib/data";
import type { TeamMember } from "@shared/schema";

export function TeamSection() {
  const [team, setTeam] = useState<TeamMember[]>([]);

  useEffect(() => {
    setTeam(getTeamMembers());
  }, []);

  return (
    <section id="team" className="py-20 sm:py-32 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-primary/10 rounded-full mb-6">
            <p className="text-sm font-mono text-primary font-medium">Our Team</p>
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-6">
            Meet the Creatives
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Our talented team of photographers, videographers, and creatives work together to
            bring your vision to life with passion and expertise.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member) => (
            <div
              key={member.id}
              className="group hover-elevate active-elevate-2 rounded-lg overflow-hidden bg-background border border-border"
              data-testid={`card-team-${member.id}`}
            >
              <div className="aspect-[3/4] overflow-hidden bg-muted">
                <img
                  src={member.photo}
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-6">
                <h3 className="font-serif text-xl font-bold text-foreground mb-2">
                  {member.name}
                </h3>
                <p className="text-sm font-mono text-primary mb-3">{member.role}</p>
                {member.bio && (
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

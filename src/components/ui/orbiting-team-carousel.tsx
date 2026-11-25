"use client";

import * as React from "react";
import { Briefcase, Check, ChevronLeft, ChevronRight, X } from "lucide-react";

import { Avatar } from "@/lib/avatars";
import { cn } from "@/lib/utils";

/*
 * Orbiting carousel (21st.dev "orbiting-carousel-with-animated-icons"), adapted for DealDesk.
 * Same idea: people orbit a centre card, click one (or use the arrows) and the ring turns to bring them to the top.
 * Changes for DealDesk:
 *  - no framer-motion (CSS transitions, same easing as the rest of the site), no global key handler (arrows work when focused)
 *  - no auto-rotation: nothing moves until the person does (calmer)
 *  - sized with container-query units, so it scales with its box
 *  - people are the fictional deal team from the prototype, each ON HARBOR or NOT ON HARBOR;
 *    for people not on Harbor the card offers "Ask Dana to add", which turns into a PENDING request. Nothing is sent.
 */

export type TeamPerson = {
  id: string;
  name: string;
  role: string;
  /** Deals line shown for people who are not on Harbor yet */
  deals?: string;
  onHarbor: boolean;
  /** key into the illustrated avatars (src/lib/avatars.tsx) */
  avatar: "pat" | "alex" | "dana" | "priya" | "sam" | "maya" | "leo" | "adrian";
};

const EASE = "cubic-bezier(.22,1,.36,1)";

export function OrbitingTeamCarousel({
  people,
  className,
  label = "Deal team",
}: {
  people: TeamPerson[];
  className?: string;
  label?: string;
}) {
  const n = people.length;
  const step = 360 / n;
  const [active, setActive] = React.useState(0);
  /** Continuous angle (never wraps), so the ring always turns the short way round. */
  const [angle, setAngle] = React.useState(0);
  const [requested, setRequested] = React.useState<Set<string>>(new Set());

  const goTo = (index: number) => {
    const delta = ((((index - active) % n) + n + n / 2) % n) - n / 2; // shortest signed distance in cards
    setAngle((a) => a + delta * step);
    setActive(index);
  };
  const nudge = (by: number) => goTo((((active + by) % n) + n) % n);

  const person = people[active];
  const isRequested = requested.has(person.id);
  const toggleRequest = () =>
    setRequested((prev) => {
      const next = new Set(prev);
      if (next.has(person.id)) next.delete(person.id);
      else next.add(person.id);
      return next;
    });

  const statusOf = (p: TeamPerson): "on" | "off" | "pending" =>
    p.onHarbor ? "on" : requested.has(p.id) ? "pending" : "off";

  return (
    <div
      className={cn("mx-auto w-full max-w-[560px]", className)}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          nudge(-1);
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          nudge(1);
        }
      }}
    >
      {/* the orbit: everything is sized in cqw so it scales with the box */}
      <div className="relative mx-auto aspect-square w-full [container-type:inline-size]">
        {/* faint orbit track */}
        <span
          aria-hidden
          className="absolute rounded-full border border-dashed border-white/10"
          style={{ inset: "calc(50cqw - 38cqw)" }}
        />

        {/* centre card for the active person */}
        <div
          key={person.id + String(isRequested)}
          className="pop-in absolute left-1/2 top-1/2 z-20 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center rounded-[22px] bg-[#12151c] px-[4cqw] pb-[4cqw] pt-[9cqw] text-center ring-1 ring-white/10"
          style={{ width: "46cqw", boxShadow: "0 30px 60px -30px rgba(0,0,0,.9)" }}
        >
          <span className="absolute -top-[8cqw] left-1/2 -translate-x-1/2">
            <Avatar name={person.avatar} size={96} ring="#12151c" className="!size-[17cqw]" />
          </span>
          <h3 className="mt-[1.5cqw] text-[clamp(15px,3.7cqw,21px)] font-semibold leading-tight text-text">{person.name}</h3>
          <p className="mt-1 flex items-center gap-1.5 text-[clamp(12px,2.6cqw,14px)] text-muted">
            <Briefcase size={12} aria-hidden /> {person.role}
          </p>
          {person.deals && !person.onHarbor && (
            <p className="mt-0.5 text-[clamp(11px,2.3cqw,13px)] text-muted/70">{person.deals}</p>
          )}

          {/* status chip, same wording as the prototype */}
          <p
            className={cn(
              "mt-[2.4cqw] inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[clamp(10px,2.1cqw,12px)] font-semibold tracking-[0.08em]",
              person.onHarbor && "bg-[#58d6a0]/12 text-[#58d6a0]",
              !person.onHarbor && !isRequested && "bg-[#ff7a6b]/12 text-[#ff9a8d]",
              !person.onHarbor && isRequested && "bg-lavender/15 text-lavender-soft",
            )}
          >
            {person.onHarbor ? <Check size={12} aria-hidden /> : isRequested ? <span aria-hidden>●</span> : <X size={12} aria-hidden />}
            {person.onHarbor ? "ON HARBOR" : isRequested ? "PENDING" : "NOT ON HARBOR"}
          </p>

          {person.onHarbor ? (
            <p className="mt-[2.4cqw] text-[clamp(11px,2.4cqw,13px)] text-muted">On the deal team</p>
          ) : (
            <>
              <button
                type="button"
                onClick={toggleRequest}
                className={cn(
                  "mt-[2.4cqw] min-h-[40px] rounded-full px-4 text-[clamp(12px,2.6cqw,14px)] font-semibold transition-colors",
                  isRequested
                    ? "text-text ring-1 ring-white/25 hover:bg-white/10"
                    : "bg-lavender text-indigo hover:bg-lavender-soft",
                )}
              >
                {isRequested ? "Withdraw request" : "Ask Dana to add"}
              </button>
              <p className="mt-[1.6cqw] text-[clamp(10px,2.2cqw,12px)] text-muted/70" aria-live="polite">
                {isRequested ? "Dana decides. Nothing has been sent." : "Needs Dana's approval"}
              </p>
            </>
          )}
        </div>

        {/* the people on the ring */}
        {people.map((p, i) => {
          const rot = i * step - angle;
          const isActive = i === active;
          const status = statusOf(p);
          return (
            <div
              key={p.id}
              className="absolute"
              style={{
                width: "15cqw",
                height: "15cqw",
                top: "calc(50% - 7.5cqw)",
                left: "calc(50% - 7.5cqw)",
                zIndex: isActive ? 30 : 10,
                transform: `rotate(${rot}deg) translateY(-38cqw)`,
                // the active person "leaves the ring" and appears big in the centre card (no duplicate at the top)
                opacity: isActive ? 0 : 1,
                pointerEvents: isActive ? "none" : "auto",
                transition: `transform 0.9s ${EASE}, opacity 0.5s ${EASE}`,
              }}
              aria-hidden={isActive || undefined}
            >
              {/* counter-rotation keeps the face upright */}
              <div
                className="size-full"
                style={{ transform: `rotate(${-rot}deg)`, transition: `transform 0.9s ${EASE}` }}
              >
                <button
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`${p.name}, ${p.role}, ${p.onHarbor ? "on Harbor" : requested.has(p.id) ? "request pending" : "not on Harbor"}`}
                  tabIndex={isActive ? -1 : 0}
                  className="relative block size-full rounded-full transition-transform duration-500 hover:scale-110 focus-visible:scale-110"
                >
                  <Avatar
                    name={p.avatar}
                    size={80}
                    className="!size-full"
                    ring={isActive ? "#B7ACFF" : status === "on" ? "rgba(88,214,160,.7)" : status === "pending" ? "rgba(155,140,255,.9)" : "rgba(255,255,255,.2)"}
                    dashed={status === "off"}
                  />
                  <span
                    aria-hidden
                    className={cn(
                      "absolute -bottom-0.5 -right-0.5 flex size-[5.2cqw] min-h-[18px] min-w-[18px] items-center justify-center rounded-full text-[10px] ring-2 ring-[#0f1115]",
                      status === "on" && "bg-[#58d6a0] text-[#0f1115]",
                      status === "off" && "bg-[#ff7a6b] text-[#0f1115]",
                      status === "pending" && "bg-lavender text-indigo",
                    )}
                  >
                    {status === "on" ? <Check size={11} strokeWidth={3} /> : status === "off" ? <X size={11} strokeWidth={3} /> : "●"}
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* arrows + dots + legend */}
      <div className="mt-3 flex items-center justify-center gap-4">
        <button type="button" aria-label="Previous person" onClick={() => nudge(-1)} className="flex size-11 items-center justify-center rounded-full bg-white/[0.06] text-text ring-1 ring-white/10 transition-colors hover:bg-white/10">
          <ChevronLeft size={18} />
        </button>
        <div className="flex items-center gap-1.5" aria-hidden>
          {people.map((p, i) => (
            <span key={p.id} className={cn("size-1.5 rounded-full bg-white transition-opacity", i === active ? "opacity-100" : "opacity-25")} />
          ))}
        </div>
        <button type="button" aria-label="Next person" onClick={() => nudge(1)} className="flex size-11 items-center justify-center rounded-full bg-white/[0.06] text-text ring-1 ring-white/10 transition-colors hover:bg-white/10">
          <ChevronRight size={18} />
        </button>
      </div>
      <p className="mt-3 flex items-center justify-center gap-5 text-[13px] text-muted">
        <span className="inline-flex items-center gap-1.5"><span aria-hidden className="size-2 rounded-full bg-[#58d6a0]" /> On Harbor</span>
        <span className="inline-flex items-center gap-1.5"><span aria-hidden className="size-2 rounded-full bg-[#ff7a6b]" /> Not on Harbor · ask Dana to add</span>
      </p>
    </div>
  );
}

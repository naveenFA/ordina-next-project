#!/usr/bin/env python3
"""Generate homepage.ts from ordina-framer-website-content.json — exact strings only."""

from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
JSON_PATH = ROOT / "ordina-framer-website-content.json"
OUT_PATH = Path(__file__).resolve().parents[1] / "src" / "data" / "homepage.ts"


def js_str(s: str) -> str:
    return json.dumps(s, ensure_ascii=False)


def main() -> None:
    data = json.loads(JSON_PATH.read_text(encoding="utf-8"))
    home = next(
        p
        for p in data["pages"]
        if p["url"].rstrip("/") == "https://ordina.framer.website"
    )

    h2_unique: list[str] = []
    for h in home["headings"]["h2"]:
        if h not in h2_unique:
            h2_unique.append(h)

    # Strings verified against Framer HTML h3 / paragraph extraction
    content = {
        "HOME_ASSETS": {
            "heroUnlockCard": "/assets/home/hero-unlock-workflows.jpg",
            "heroLogo0": "/assets/home/hero-logo-0.svg",
            "heroLogo1": "/assets/home/hero-logo-1.svg",
            "heroLogo2": "/assets/home/hero-logo-2.svg",
            "heroLogo3": "/assets/home/hero-logo-3.svg",
            "heroLogo4": "/assets/home/hero-logo-4.svg",
            "heroLogo5": "/assets/home/hero-logo-5.svg",
            "heroLogo6": "/assets/home/hero-logo-6.svg",
            "heroLogo7": "/assets/home/hero-logo-7.svg",
            "featureWorkspaces": "/assets/home/feature-workspaces.png",
            "featureCollaboration": "/assets/home/feature-collaboration.png",
            "featureAutomation": "/assets/home/feature-automation.png",
            "featureTagging": "/assets/home/feature-tagging.png",
            "workflowBg": "/assets/home/workflow-bg.jpg",
            "workflowScreenshot": "/assets/home/workflow-screenshot.jpg",
            "logoStrip": "/assets/home/logo-strip.png",
            "avatarDaniel": "/assets/home/avatar-daniel.png",
            "avatarLiam": "/assets/home/avatar-liam.png",
            "avatarSofia": "/assets/home/avatar-sofia.png",
            "blogFeatured": "/assets/home/blog-featured.jpg",
            "blog1": "/assets/home/blog-1.jpg",
            "blog2": "/assets/home/blog-2.jpg",
            "blog3": "/assets/home/blog-3.jpg",
            "ctaBg": "/assets/home/cta-bg.jpg",
            "bridgeDotPattern": "/assets/home/bridge-dot-pattern.png",
            "bridgeWidget1": "/assets/home/bridge-widget-1.png",
            "bridgeWidget2": "/assets/home/bridge-widget-2.png",
            "bridgeWidget5": "/assets/home/bridge-widget-5.png",
            "bridgeWidget6": "/assets/home/bridge-widget-6.png",
            "bridgeWidget8": "/assets/home/bridge-widget-8.png",
            "bridgeWidget11": "/assets/home/bridge-widget-11.png",
            "bridgeWidget3": "/assets/home/bridge-widget-3.png",
            "bridgeWidget4": "/assets/home/bridge-widget-4.png",
            "bridgeWidget7": "/assets/home/bridge-widget-7.png",
            "bridgeWidget9": "/assets/home/bridge-widget-9.png",
            "bridgeWidget10": "/assets/home/bridge-widget-10.png",
            "bridgeWidget12": "/assets/home/bridge-widget-12.png",
            "bridgeWidget13": "/assets/home/bridge-widget-13.png",
            "bridgeWidget14": "/assets/home/bridge-widget-14.jpg",
            "bridgeWidget15": "/assets/home/bridge-widget-15.png",
            "testimonialDaniel": "/assets/home/testimonial-daniel.jpg",
            "testimonialLiam": "/assets/home/testimonial-liam.jpg",
            "testimonialSofia": "/assets/home/testimonial-sofia.jpg",
            "integration0": "/assets/home/integration-0.svg",
            "integration1": "/assets/home/integration-1.svg",
            "integration2": "/assets/home/integration-2.svg",
            "integration3": "/assets/home/integration-3.svg",
            "integration4": "/assets/home/integration-4.svg",
            "integration5": "/assets/home/integration-5.svg",
            "integration6": "/assets/home/integration-6.svg",
            "integration7": "/assets/home/integration-7.svg",
            "integration8": "/assets/home/integration-8.svg",
            "impact0": "/assets/home/impact-0.jpg",
            "impact1": "/assets/home/impact-1.jpg",
            "impact2": "/assets/home/impact-2.jpg",
            "impact3": "/assets/home/impact-3.jpg",
            "impact4": "/assets/home/impact-4.jpg",
            "impact5": "/assets/home/impact-5.jpg",
            "impact6": "/assets/home/impact-6.jpg",
            "impact7": "/assets/home/impact-7.jpg",
            "impact8": "/assets/home/impact-8.jpg",
            "impact9": "/assets/home/impact-9.jpg",
            "impactLogoGt": "/assets/home/impact-logo-gt.svg",
            "impactLogoNt": "/assets/home/impact-logo-nt.svg",
            "impactLogoUt": "/assets/home/impact-logo-ut.svg",
            "impactLogoLt": "/assets/home/impact-logo-lt.svg",
            "impactLogoTt": "/assets/home/impact-logo-tt.svg",
            "impactLogoAt": "/assets/home/impact-logo-at.svg",
            "impactLogoFt": "/assets/home/impact-logo-ft.svg",
            "impactLogoTn": "/assets/home/impact-logo-tn.svg",
            "impactLogoPt": "/assets/home/impact-logo-pt.svg",
            "impactLogoAn": "/assets/home/impact-logo-an.svg",
            "ordinaMark": "/assets/ordina-mark.svg",
        },
        "HOME_HERO": {
            "eyebrow": "Used by fast-growing B2B teams",
            "title": "The workspace for clear, connected workflows.",
            "description": "Ordina helps teams organize information, automate routine flows, and collaborate more clearly — all in one flexible workspace.",
            "primaryCta": "Start building",
            "secondaryCta": "Explore features",
            "awardPrefix": "Innovative AI solution 2025 by",
        },
        "HOME_HERO_LOGOS": [
            "heroLogo0",
            "heroLogo1",
            "heroLogo2",
            "heroLogo3",
            "heroLogo4",
            "heroLogo5",
            "heroLogo6",
            "heroLogo7",
        ],
        "HOME_UNLOCK": {
            "title": "Unlock clear, shared workflows.",
            "description": "Bring teams, tools, and updates into one connected workspace.",
            "quote": "Ordina replaced three tools and finally gave our teams a shared understanding of what\u2019s happening.",
            "author": "Emma Clark",
            "role": "Head of Operations, Klea",
        },
        "HOME_PAIN_POINTS": {
            "title": "Workflows are scattered.",
            "description": "Most teams aren\u2019t struggling because they lack talent \u2014 they\u2019re struggling because work happens across too many disconnected tools, channels, and processes.",
            "items": [
                {
                    "label": "Time loss",
                    "statPrefix": ">",
                    "statValue": 80,
                    "statSuffix": "%",
                    "body": "80%+ of teams use multiple tools for docs, tasks, and communication \u2014 slowing the work overall.",
                },
                {
                    "label": "Manual effort",
                    "statPrefix": "",
                    "statValue": 30,
                    "statSuffix": "%",
                    "body": "Teams spend around 30% of their time on repetitive updates, handoffs, and moving work between tools.",
                },
                {
                    "label": "Tool overload",
                    "statPrefix": "",
                    "statValue": 12,
                    "statSuffix": "+",
                    "body": "The average mid-sized team juggles over 12 tools for tasks, docs, and communication.",
                },
            ],
        },
        "HOME_BRIDGE": {
            "title": h2_unique[1],
            # bridgeWidgetN = Framer WidgetN (EoODF3NEz/1-5, WeTnZ2IQp/6-10, BjA1xjPwb/11-15)
            "slides": [
                {
                    "highlightWord": "people",
                    "highlightColor": "#9ac9e2",
                    "widgets": [
                        {
                            "key": "bridgeWidget1",
                            "left": 100,
                            "top": -300,
                            "width": 220,
                            "imgWidth": 440,
                            "imgHeight": 360,
                        },
                        {
                            "key": "bridgeWidget2",
                            "right": 100,
                            "top": -300,
                            "width": 320,
                            "imgWidth": 696,
                            "imgHeight": 476,
                        },
                        {
                            "key": "bridgeWidget3",
                            "left": 0,
                            "bottom": -250,
                            "width": 310,
                            "imgWidth": 632,
                            "imgHeight": 416,
                        },
                        {
                            "key": "bridgeWidget4",
                            "right": 350,
                            "bottom": -250,
                            "width": 330,
                            "imgWidth": 672,
                            "imgHeight": 144,
                        },
                        {
                            "key": "bridgeWidget5",
                            "right": 0,
                            "bottom": -250,
                            "width": 220,
                            "imgWidth": 440,
                            "imgHeight": 440,
                        },
                    ],
                },
                {
                    "highlightWord": "tasks",
                    "highlightColor": "#86efac",
                    "widgets": [
                        {
                            "key": "bridgeWidget6",
                            "left": 100,
                            "top": -300,
                            "width": 220,
                            "imgWidth": 440,
                            "imgHeight": 360,
                        },
                        {
                            "key": "bridgeWidget7",
                            "right": 100,
                            "top": -300,
                            "width": 310,
                            "imgWidth": 632,
                            "imgHeight": 416,
                        },
                        {
                            "key": "bridgeWidget8",
                            "left": 50,
                            "bottom": -150,
                            "width": 210,
                            "imgWidth": 452,
                            "imgHeight": 196,
                        },
                        {
                            "key": "bridgeWidget9",
                            "right": 450,
                            "bottom": -300,
                            "width": 360,
                            "imgWidth": 688,
                            "imgHeight": 424,
                        },
                        {
                            "key": "bridgeWidget10",
                            "right": 0,
                            "bottom": -150,
                            "width": 325,
                            "imgWidth": 656,
                            "imgHeight": 202,
                        },
                    ],
                },
                {
                    "highlightWord": "workflows",
                    "highlightColor": "#f0c9b4",
                    "widgets": [
                        {
                            "key": "bridgeWidget11",
                            "left": 100,
                            "top": -300,
                            "width": 220,
                            "imgWidth": 440,
                            "imgHeight": 360,
                        },
                        {
                            "key": "bridgeWidget12",
                            "right": 150,
                            "top": -250,
                            "width": 310,
                            "imgWidth": 636,
                            "imgHeight": 136,
                        },
                        {
                            "key": "bridgeWidget13",
                            "left": 50,
                            "bottom": -250,
                            "width": 320,
                            "imgWidth": 672,
                            "imgHeight": 454,
                        },
                        {
                            "key": "bridgeWidget14",
                            "right": 450,
                            "bottom": -300,
                            "width": 320,
                            "imgWidth": 636,
                            "imgHeight": 136,
                        },
                        {
                            "key": "bridgeWidget15",
                            "right": 50,
                            "bottom": -200,
                            "width": 360,
                            "imgWidth": 688,
                            "imgHeight": 316,
                        },
                    ],
                },
            ],
        },
        "HOME_FEATURES": {
            "eyebrow": "How Ordina Helps",
            "title": h2_unique[2],
            "description": "Ordina removes friction from everyday work with simple, flexible tools your team can adapt to any process.",
            "items": [
                {
                    "title": "Organized Workspaces",
                    "description": "Create clear, structured spaces for every project, keeping tasks and documents easy to manage and simple to navigate.",
                    "imageKey": "featureWorkspaces",
                    "bullets": [
                        "Import Sprint Data",
                        "Create Sprint Folder",
                        "Send Message to Channel",
                    ],
                },
                {
                    "title": "Shared Views & Collaboration",
                    "description": "Work together seamlessly with shared pages and synced updates, ensuring everyone stays aligned and informed in real time.",
                    "imageKey": "featureCollaboration",
                },
                {
                    "title": "Simple Workflow Automation",
                    "description": "Give your team tools that eliminate busywork and keep every process running consistently.",
                    "imageKey": "featureAutomation",
                    "bullets": [
                        "Automate routine steps with flexible triggers and actions",
                        "Connect your existing tools so information flows without manual handoffs",
                        "Standardize how work gets done so nothing falls through the cracks",
                    ],
                },
                {
                    "title": "Smart Organization & Tagging",
                    "description": "Keep everything structured and easy to find \u2014 no more digging through folders or asking where something lives.",
                    "imageKey": "featureTagging",
                    "bullets": [
                        "Use flexible tags to categorize work your way",
                        "Filter and surface exactly what you need in seconds",
                        "Build a shared system of organization that scales as your team grows",
                    ],
                },
            ],
        },
        "HOME_TESTIMONIALS": {
            "eyebrow": "Loved by Enterprises",
            "title": h2_unique[3],
            "items": [
                {
                    "quote": "\u201cOrdina immediately brought structure to our workflow. Within a week, our entire team felt more aligned and confident in what mattered most.\u201d",
                    "name": "Daniel Weber",
                    "role": "Head of Operations",
                    "avatarKey": "avatarDaniel",
                    "portraitKey": "testimonialDaniel",
                },
                {
                    "quote": "\u201cOrdina stood out from the first moment. After a week, our entire team felt more structured, aligned, and clear on what to prioritize.\u201d",
                    "name": "Liam Hart",
                    "role": "Product Lead",
                    "avatarKey": "avatarLiam",
                    "portraitKey": "testimonialLiam",
                },
                {
                    "quote": "\u201cThe level of clarity Ordina provides is incredible. Our projects stay organized, and collaboration finally feels effortless.\u201d",
                    "name": "Sofia Alvarez",
                    "role": "Team Lead, Product Strategy",
                    "avatarKey": "avatarSofia",
                    "portraitKey": "testimonialSofia",
                },
            ],
        },
        "HOME_WORKFLOW": {
            "eyebrow": "The Workflow",
            "title": h2_unique[4],
            "steps": [
                {
                    "title": "Plan with structured tools",
                    "description": "From project timelines to day-to-day tasks, Ordina helps your team stay organized and focused on what matters most.",
                },
                {
                    "title": "Execute seamlessly",
                    "description": "Shared views, comments, assignments, and real-time updates keep everyone aligned, accountable, and moving together.",
                },
                {
                    "title": "Optimize with insights",
                    "description": "Spot bottlenecks early, track progress consistently, and refine processes over time \u2014 without needing heavy analytics.",
                },
            ],
        },
        "HOME_IMPACT": {
            "eyebrow": "Our Impact",
            "title": h2_unique[5],
            "description": "Organizations using Ordina report improved alignment, faster execution, and measurable efficiency gains across departments.",
            "cards": [
                {"value": "61%", "label": "Manual Effort Reduction", "imageKey": "impact0", "logoKey": "impactLogoGt"},
                {"value": "3.6x", "label": "ROI for 1st year", "imageKey": "impact1", "logoKey": "impactLogoNt"},
                {"value": "47%", "label": "Lower Operational Overhead", "imageKey": "impact2", "logoKey": "impactLogoUt"},
                {"value": "$1.8M", "label": "Annual Cost Savings", "imageKey": "impact3", "logoKey": "impactLogoLt"},
                {"value": "61%", "label": "Less Tool Switching", "imageKey": "impact4", "logoKey": "impactLogoTt"},
                {"value": "38%", "label": "Faster Workflows", "imageKey": "impact5", "logoKey": "impactLogoAt"},
                {"value": "94%", "label": "Team Adoption Rate", "imageKey": "impact6", "logoKey": "impactLogoFt"},
                {"value": "11hrs", "label": "Saved Per Week", "imageKey": "impact7", "logoKey": "impactLogoTn"},
                {"value": "$42.6M", "label": "Saved in Operations", "imageKey": "impact8", "logoKey": "impactLogoPt"},
                {"value": "3.2x", "label": "Faster Onboarding", "imageKey": "impact9", "logoKey": "impactLogoAn"},
            ],
        },
        "HOME_INTEGRATIONS": {
            "eyebrow": "Integrations",
            "title": h2_unique[6],
            "grid": [
                [None, None, "integration0", "integration1", "integration2", "integration3", None, None],
                ["integration4", None, "integration5", "integration6", "integration7", None, "integration8", None],
            ],
        },
        "HOME_BLOG": {
            "eyebrow": "Blog",
            "title": h2_unique[7],
            "description": "Explore workflows, coordination strategies, and practical systems that help teams stay focused and aligned.",
            "featured": {
                "slug": "why-most-teams-are-busy-but-not-aligned",
                "title": "Why most teams are busy but not aligned",
                "excerpt": "Busyness and alignment look identical from the outside, but they produce completely different results. Here's how modern teams can close the gap between activity and actual progress.",
                "imageKey": "blogFeatured",
            },
            "posts": [
                {
                    "slug": "why-great-strategies-fail-and-how-leaders-can-keep-them-alive",
                    "category": "Strategy & Leadership",
                    "date": "Feb 2, 2026",
                    "readTime": "8 min read",
                    "title": "Why great strategies fail and how leaders can keep them alive",
                    "excerpt": "Most strategies don\u2019t fail because they\u2019re wrong \u2014 they fail because teams lose connection to them. Here\u2019s how leaders can create clarity, reinforce direction, and turn strategy into an operating system, not a slide deck.",
                    "imageKey": "blog1",
                },
                {
                    "slug": "how-operational-drag-quietly-kills-execution-and-what-high-performing-teams-do-differently",
                    "category": "Operations",
                    "date": "Jan 26, 2026",
                    "readTime": "12 minutes",
                    "title": "How operational drag quietly kills execution and what high-performing teams do differently",
                    "excerpt": "Operational drag doesn\u2019t show up all at once \u2014 it builds slowly through blockers, unclear ownership, repeat work, and scattered communication. Here\u2019s how to spot it early, remove friction, and create an execution engine that actually scales.",
                    "imageKey": "blog2",
                },
                {
                    "slug": "why-strategies-fail-and-how-to-fix-them-before-they-do",
                    "category": "Strategy & Leadership",
                    "date": "Jan 3, 2026",
                    "readTime": "7 min",
                    "title": "Why strategies fail and how to fix them before they do",
                    "excerpt": "Most strategies don\u2019t fail because they were bad ideas \u2014 they fail because teams lose alignment, momentum, and clarity along the way. In this post, we break down why execution breaks down and how to build a strategy engine that actually delivers results.",
                    "imageKey": "blog3",
                },
            ],
        },
        "HOME_FAQ": {
            "eyebrow": "FAQ",
            "title": h2_unique[8],
            "description": "Have a question that's not covered here? Reach out and we'll get back to you within one business day.",
            "cta": "Contact us",
            "items": [
                {
                    "q": "What type of teams is Ordina built for?",
                    "a": "Ordina is built for B2B teams that need more than a task list \u2014 operations, product, strategy, and cross-functional teams who work across multiple projects and people.",
                },
                {
                    "q": "Can I use Ordina alongside my existing tools?",
                    "a": "Yes \u2014 Ordina integrates with tools your team already uses, including Slack, Google Drive, and more. Most teams start by running one workflow inside Ordina and expand from there once they see how it fits.",
                },
                {
                    "q": "Do I need technical skills to set up Ordina?",
                    "a": "Not at all. Setting up workspaces, automations, and views requires no code \u2014 just an understanding of how your team works. If you can map out a process on a whiteboard, you can build it in Ordina.",
                },
                {
                    "q": "How customizable are workspaces and views?",
                    "a": "Highly. Every workspace can be structured around your team's specific processes \u2014 you choose how tasks are grouped, what's visible, and how progress is tracked.",
                },
                {
                    "q": "Is our team's data secure?",
                    "a": "Yes. Ordina uses enterprise-grade encryption with role-based access controls so you decide who can see and edit what. We're SOC 2 compliant and built with the security requirements of B2B scale-ups in mind.",
                },
            ],
        },
        "HOME_CTA": {
            "title": h2_unique[9],
            "description": "Ordina brings your team's work, information, and workflows into one place \u2014 so nothing falls through the cracks.",
            "button": "Start your free trial",
            "noteLine1": "No credit card",
            "noteLine2": "15 day free trial",
        },
        "SITE_FOOTER": {
            "logoMark": "/assets/ordina-mark.svg",
            "tagline": "A modern workspace for clear, connected workflows",
            "cta": "Start building",
            "copyright": "\u00a9 2026 Ordina - All Rights Reserved",
            "companyTitle": "Company",
            "legalTitle": "Legal",
            "newsletterTitle": "Newsletter",
            "newsletterPlaceholder": "Your email",
            "newsletterConsentPrefix": "By submitting, you agree to our",
            "newsletterConsentSuffix": ".",
            "companyLinks": [
                {"label": "Home", "href": "/"},
                {"label": "Pricing", "href": "/pricing"},
                {"label": "Blog", "href": "/blog"},
                {"label": "Contact", "href": "/contact"},
            ],
            "legalLinks": [
                {"label": "Terms of Service", "href": "/legal/terms-of-service"},
                {"label": "Privacy Policy", "href": "/legal/privacy-policy"},
            ],
            "socialLinks": [
                {"label": "X", "href": "https://x.com/krzhej"},
                {"label": "LinkedIn", "href": "https://linkedin.com"},
                {"label": "Instagram", "href": "https://instagram.com"},
                {"label": "Facebook", "href": "https://facebook.com"},
            ],
        },
        "SITE_HEADER": {
            "logoMark": "/assets/ordina-mark.svg",
            "links": [
                {"label": "Features", "href": "/#features"},
                {"label": "Pricing", "href": "/pricing"},
                {"label": "Blog", "href": "/blog"},
                {"label": "Contact", "href": "/contact"},
            ],
            "login": "Login",
            "cta": "Book a demo",
        },
    }

    lines = ["// Auto-generated from ordina-framer-website-content.json — do not edit by hand.\n"]
    for key in [
        "HOME_ASSETS",
        "HOME_HERO",
        "HOME_HERO_LOGOS",
        "HOME_UNLOCK",
        "HOME_PAIN_POINTS",
        "HOME_BRIDGE",
        "HOME_FEATURES",
        "HOME_TESTIMONIALS",
        "HOME_WORKFLOW",
        "HOME_IMPACT",
        "HOME_INTEGRATIONS",
        "HOME_BLOG",
        "HOME_FAQ",
        "HOME_CTA",
        "SITE_FOOTER",
        "SITE_HEADER",
    ]:
        lines.append(
            f"export const {key} = {json.dumps(content[key], ensure_ascii=False)} as const;\n"
        )

    OUT_PATH.write_text("\n".join(lines), encoding="utf-8")
    print(f"Wrote {OUT_PATH}")


if __name__ == "__main__":
    main()

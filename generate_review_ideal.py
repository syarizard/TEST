#!/usr/bin/env python3
"""
Review Ideal PDF Generator for IG Recruit
Generates a structured "Review Ideal" prospect assessment report.
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
)
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT
from datetime import date
import sys

# ─── Colour palette (matches the app's dark theme) ───────────────────────────
C_BG        = colors.HexColor("#0a0f1a")
C_CARD      = colors.HexColor("#0f172a")
C_BORDER    = colors.HexColor("#1e293b")
C_BLUE      = colors.HexColor("#60a5fa")
C_GREEN     = colors.HexColor("#34d399")
C_YELLOW    = colors.HexColor("#fbbf24")
C_RED       = colors.HexColor("#f87171")
C_SLATE     = colors.HexColor("#94a3b8")
C_MUTED     = colors.HexColor("#475569")
C_TEXT      = colors.HexColor("#f1f5f9")
C_SUBTEXT   = colors.HexColor("#cbd5e1")
C_DARK_BLUE = colors.HexColor("#1e3a5f")

STATUS_COLORS = {
    "Not Started":    colors.HexColor("#94a3b8"),
    "DM Sent":        colors.HexColor("#60a5fa"),
    "Replied":        colors.HexColor("#34d399"),
    "Call Booked":    colors.HexColor("#fbbf24"),
    "Not Interested": colors.HexColor("#f87171"),
}

# ─── Sample prospect data ────────────────────────────────────────────────────
PROSPECT = {
    "name":     "Sarah Chen",
    "igHandle": "@sarahchen.life",
    "type":     "Career Switcher",
    "status":   "Replied",
    "date":     "2026-06-01",
    "notes": (
        "Works in marketing at a tech startup, mentioned burnout in Stories. "
        "Seems open to new income streams. Has 4.2k followers, high engagement. "
        "Replied within 2 hours — very promising."
    ),
}

RECRUITER = {
    "name":   "Syazani Ahmad",
    "agency": "IG Recruit — Financial Services Division",
    "date":   date.today().strftime("%B %d, %Y"),
}

CRITERIA = [
    ("Motivated & goal-oriented",       5, "Mentions financial freedom goals in posts"),
    ("Network size (500+ followers)",   5, "4,200 followers — strong social proof"),
    ("Engagement quality",              4, "High reply rate; genuine audience interactions"),
    ("People skills / likeability",     4, "Warm DM replies, uses humour naturally"),
    ("Financial awareness",             3, "Posted about side hustles but no investing content"),
    ("Time availability",               4, "9-5 job, evenings appear flexible"),
    ("Resilience / coachability",       4, "Publicly talks about embracing feedback"),
    ("Urgency / pain point identified", 5, "Burnout visible in Stories — ready for change"),
]

NEXT_ACTIONS = [
    ("Within 24 hrs", "Reply to their latest Story — keep it casual and curious"),
    ("Day 2-3",       "Like & comment on 2-3 posts to build familiarity before the ask"),
    ("Day 4",         "Transition to a soft discovery call invite via DM"),
    ("Day 7+",        "If no response, send a low-pressure follow-up with social proof"),
]


def score_color(s):
    if s >= 5:  return C_GREEN
    if s >= 4:  return C_BLUE
    if s >= 3:  return C_YELLOW
    return C_RED


def build_pdf(output_path="review_ideal_output.pdf"):
    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        leftMargin=18*mm, rightMargin=18*mm,
        topMargin=22*mm, bottomMargin=18*mm,
    )

    W = A4[0] - 36*mm  # usable width

    # ── Styles ────────────────────────────────────────────────────────────────
    def S(name, **kw):
        base = dict(fontName="Helvetica", fontSize=10,
                    textColor=C_TEXT, leading=14)
        base.update(kw)
        return ParagraphStyle(name, **base)

    s_header    = S("header",    fontName="Helvetica-Bold", fontSize=8,
                     textColor=C_SLATE, spaceAfter=1)
    s_name      = S("name",      fontName="Helvetica-Bold", fontSize=22,
                     textColor=C_TEXT, spaceAfter=2)
    s_handle    = S("handle",    fontSize=12, textColor=C_BLUE, spaceAfter=4)
    s_section   = S("section",   fontName="Helvetica-Bold", fontSize=8,
                     textColor=C_BLUE, spaceBefore=10, spaceAfter=4)
    s_label     = S("label",     fontSize=9,  textColor=C_MUTED)
    s_value     = S("value",     fontName="Helvetica-Bold", fontSize=9,
                     textColor=C_TEXT)
    s_note      = S("note",      fontName="Helvetica-Oblique", fontSize=8.5,
                     textColor=C_SLATE, leading=12)
    s_crit_lbl  = S("crit_lbl",  fontSize=8.5, textColor=C_SUBTEXT)
    s_crit_note = S("crit_note", fontName="Helvetica-Oblique", fontSize=7.5,
                     textColor=C_MUTED, leading=10)
    s_verdict   = S("verdict",   fontName="Helvetica-Bold", fontSize=32,
                     textColor=C_GREEN, alignment=TA_CENTER)
    s_vtag      = S("vtag",      fontName="Helvetica-Bold", fontSize=11,
                     textColor=C_GREEN, alignment=TA_CENTER, spaceAfter=6)
    s_rec_body  = S("rec_body",  fontSize=9, textColor=C_SLATE, leading=13)
    s_act_time  = S("act_time",  fontName="Helvetica-Bold", fontSize=9,
                     textColor=C_BLUE)
    s_act_text  = S("act_text",  fontSize=9, textColor=C_SUBTEXT)

    story = []

    # ── Top banner ────────────────────────────────────────────────────────────
    banner_data = [[
        Paragraph("IG RECRUIT", S("b1", fontName="Helvetica-Bold", fontSize=11,
                                   textColor=C_TEXT)),
        Paragraph("REVIEW IDEAL REPORT", S("b2", fontName="Helvetica-Bold",
                                             fontSize=11, textColor=C_BLUE,
                                             alignment=TA_RIGHT)),
    ]]
    banner = Table(banner_data, colWidths=[W/2, W/2])
    banner.setStyle(TableStyle([
        ("BACKGROUND",  (0,0), (-1,-1), C_BG),
        ("TOPPADDING",  (0,0), (-1,-1), 8),
        ("BOTTOMPADDING",(0,0),(-1,-1), 8),
        ("LEFTPADDING", (0,0), (-1,-1), 4),
        ("RIGHTPADDING",(0,0), (-1,-1), 4),
    ]))
    story.append(banner)
    story.append(Spacer(1, 6*mm))

    # ── Prospect name & handle ────────────────────────────────────────────────
    story.append(Paragraph(PROSPECT["name"], s_name))
    story.append(Paragraph(PROSPECT["igHandle"], s_handle))

    # Status badge
    sc = STATUS_COLORS.get(PROSPECT["status"], C_SLATE)
    badge_data = [[Paragraph(PROSPECT["status"],
                              S("badge", fontName="Helvetica-Bold", fontSize=8,
                                textColor=colors.white, alignment=TA_CENTER))]]
    badge = Table(badge_data, colWidths=[30*mm])
    badge.setStyle(TableStyle([
        ("BACKGROUND",   (0,0), (-1,-1), sc),
        ("ROUNDEDCORNERS", [4]),
        ("TOPPADDING",   (0,0), (-1,-1), 3),
        ("BOTTOMPADDING",(0,0), (-1,-1), 3),
    ]))
    story.append(badge)
    story.append(Spacer(1, 5*mm))

    # ── Section 01: Snapshot ──────────────────────────────────────────────────
    story.append(HRFlowable(width=W, color=C_BORDER, thickness=0.5))
    story.append(Paragraph("01  PROSPECT SNAPSHOT", s_section))

    snap_rows = [
        [Paragraph("Prospect Type",  s_label), Paragraph(PROSPECT["type"],     s_value)],
        [Paragraph("First Contact",  s_label), Paragraph(PROSPECT["date"],     s_value)],
        [Paragraph("Current Status", s_label), Paragraph(PROSPECT["status"],
                                                          S("sv", fontName="Helvetica-Bold",
                                                            fontSize=9, textColor=sc))],
        [Paragraph("Recruiter",      s_label), Paragraph(RECRUITER["name"],    s_value)],
        [Paragraph("Report Date",    s_label), Paragraph(RECRUITER["date"],    s_value)],
    ]
    snap_t = Table(snap_rows, colWidths=[44*mm, W-44*mm])
    snap_t.setStyle(TableStyle([
        ("TOPPADDING",    (0,0), (-1,-1), 3),
        ("BOTTOMPADDING", (0,0), (-1,-1), 3),
        ("LEFTPADDING",   (0,0), (-1,-1), 0),
        ("RIGHTPADDING",  (0,0), (-1,-1), 0),
    ]))
    story.append(snap_t)
    story.append(Spacer(1, 3*mm))

    # Notes card
    note_data = [[Paragraph(f'"{PROSPECT["notes"]}"', s_note)]]
    note_t = Table(note_data, colWidths=[W])
    note_t.setStyle(TableStyle([
        ("BACKGROUND",    (0,0), (-1,-1), C_CARD),
        ("BOX",           (0,0), (-1,-1), 0.5, C_BORDER),
        ("TOPPADDING",    (0,0), (-1,-1), 8),
        ("BOTTOMPADDING", (0,0), (-1,-1), 8),
        ("LEFTPADDING",   (0,0), (-1,-1), 10),
        ("RIGHTPADDING",  (0,0), (-1,-1), 10),
    ]))
    story.append(note_t)

    # ── Section 02: Criteria ──────────────────────────────────────────────────
    story.append(HRFlowable(width=W, color=C_BORDER, thickness=0.5))
    story.append(Paragraph("02  IDEAL CRITERIA ASSESSMENT", s_section))
    story.append(Paragraph(
        "Each criterion scored 1 (poor fit) to 5 (excellent fit) based on "
        "public Instagram profile and DM interaction.",
        S("sub", fontSize=8, textColor=C_MUTED, spaceAfter=6)
    ))

    total = 0
    BAR_W = 50*mm

    for label, score, note in CRITERIA:
        total += score
        sc_col = score_color(score)

        # Build a mini bar as a nested table
        filled = int(BAR_W * score / 5)
        bar_inner = [["", ""]]
        bar_t = Table(bar_inner, colWidths=[filled, BAR_W - filled],
                      rowHeights=[4])
        bar_t.setStyle(TableStyle([
            ("BACKGROUND",    (0,0), (0,0), sc_col),
            ("BACKGROUND",    (1,0), (1,0), C_BORDER),
            ("LEFTPADDING",   (0,0), (-1,-1), 0),
            ("RIGHTPADDING",  (0,0), (-1,-1), 0),
            ("TOPPADDING",    (0,0), (-1,-1), 0),
            ("BOTTOMPADDING", (0,0), (-1,-1), 0),
        ]))

        row_data = [[
            Paragraph(label, s_crit_lbl),
            Paragraph(f"{score}/5", S("sc", fontName="Helvetica-Bold",
                                       fontSize=9, textColor=sc_col)),
            bar_t,
        ]]
        row_t = Table(row_data,
                      colWidths=[W - BAR_W - 18*mm, 12*mm, BAR_W])
        row_t.setStyle(TableStyle([
            ("VALIGN",        (0,0), (-1,-1), "MIDDLE"),
            ("LEFTPADDING",   (0,0), (-1,-1), 0),
            ("RIGHTPADDING",  (0,0), (-1,-1), 0),
            ("TOPPADDING",    (0,0), (-1,-1), 3),
            ("BOTTOMPADDING", (0,0), (-1,-1), 2),
        ]))
        story.append(row_t)
        story.append(Paragraph(f"   {note}", s_crit_note))
        story.append(Spacer(1, 1.5*mm))

    # ── Section 03: Score ────────────────────────────────────────────────────
    max_score = len(CRITERIA) * 5
    pct = total / max_score * 100

    if pct >= 80:
        verdict = "STRONG MATCH"
        v_col = C_GREEN
        rec = (
            "This prospect closely matches the Ideal Recruit Profile. "
            "Prioritise moving to a discovery call within 48 hours. "
            "Use the Career Switcher script as a starting point."
        )
    elif pct >= 60:
        verdict = "GOOD MATCH"
        v_col = C_BLUE
        rec = (
            "Solid prospect — continue nurturing. "
            "Engage with their content for 3-5 days before proposing a call. "
            "Address the financial awareness gap with educational content."
        )
    else:
        verdict = "WEAK MATCH"
        v_col = C_YELLOW
        rec = (
            "Several criteria below threshold. "
            "Keep in pipeline at low priority; re-evaluate in 30 days "
            "if engagement improves."
        )

    story.append(HRFlowable(width=W, color=C_BORDER, thickness=0.5))
    story.append(Paragraph("03  OVERALL SCORE", s_section))

    score_para = Paragraph(f"{total} / {max_score}",
                            S("sc2", fontName="Helvetica-Bold", fontSize=34,
                              textColor=v_col, alignment=TA_CENTER))
    verdict_para = Paragraph(verdict,
                              S("vp", fontName="Helvetica-Bold", fontSize=12,
                                textColor=v_col, alignment=TA_CENTER))

    score_block = [[score_para], [verdict_para]]
    score_t = Table(score_block, colWidths=[W])
    score_t.setStyle(TableStyle([
        ("BACKGROUND",    (0,0), (-1,-1), C_CARD),
        ("TOPPADDING",    (0,0), (-1,-1), 8),
        ("BOTTOMPADDING", (0,0), (-1,-1), 8),
        ("BOX",           (0,0), (-1,-1), 0.5, C_BORDER),
    ]))
    story.append(score_t)
    story.append(Spacer(1, 3*mm))

    story.append(Paragraph("Recommendation",
                            S("rh", fontName="Helvetica-Bold", fontSize=9,
                              textColor=C_TEXT, spaceAfter=2)))
    rec_data = [[Paragraph(rec, s_rec_body)]]
    rec_t = Table(rec_data, colWidths=[W])
    rec_t.setStyle(TableStyle([
        ("BACKGROUND",    (0,0), (-1,-1), C_CARD),
        ("BOX",           (0,0), (-1,-1), 0.5, C_BORDER),
        ("TOPPADDING",    (0,0), (-1,-1), 8),
        ("BOTTOMPADDING", (0,0), (-1,-1), 8),
        ("LEFTPADDING",   (0,0), (-1,-1), 10),
        ("RIGHTPADDING",  (0,0), (-1,-1), 10),
    ]))
    story.append(rec_t)

    # ── Section 04: Actions ───────────────────────────────────────────────────
    story.append(HRFlowable(width=W, color=C_BORDER, thickness=0.5))
    story.append(Paragraph("04  SUGGESTED NEXT ACTIONS", s_section))

    for timing, action in NEXT_ACTIONS:
        act_row = [[
            Paragraph(timing, s_act_time),
            Paragraph(action,  s_act_text),
        ]]
        act_t = Table(act_row, colWidths=[26*mm, W-26*mm])
        act_t.setStyle(TableStyle([
            ("TOPPADDING",    (0,0), (-1,-1), 3),
            ("BOTTOMPADDING", (0,0), (-1,-1), 3),
            ("LEFTPADDING",   (0,0), (-1,-1), 0),
            ("RIGHTPADDING",  (0,0), (-1,-1), 0),
            ("VALIGN",        (0,0), (-1,-1), "TOP"),
        ]))
        story.append(act_t)
        story.append(Spacer(1, 1*mm))

    # ── Footer strip ─────────────────────────────────────────────────────────
    story.append(Spacer(1, 6*mm))
    foot_data = [[
        Paragraph(f"Generated {RECRUITER['date']}",
                  S("f1", fontSize=7.5, textColor=C_MUTED)),
        Paragraph(RECRUITER["agency"],
                  S("f2", fontSize=7.5, textColor=C_MUTED, alignment=TA_RIGHT)),
    ]]
    foot_t = Table(foot_data, colWidths=[W/2, W/2])
    foot_t.setStyle(TableStyle([
        ("LINEABOVE",     (0,0), (-1,0), 0.5, C_BORDER),
        ("TOPPADDING",    (0,0), (-1,-1), 5),
        ("BOTTOMPADDING", (0,0), (-1,-1), 0),
        ("LEFTPADDING",   (0,0), (-1,-1), 0),
        ("RIGHTPADDING",  (0,0), (-1,-1), 0),
    ]))
    story.append(foot_t)

    doc.build(story)
    return output_path, total, max_score, verdict


if __name__ == "__main__":
    out = sys.argv[1] if len(sys.argv) > 1 else "review_ideal_output.pdf"
    path, score, max_s, verdict = build_pdf(out)
    print(f"[OK] PDF generated : {path}")
    print(f"     Prospect      : {PROSPECT['name']} ({PROSPECT['igHandle']})")
    print(f"     Type          : {PROSPECT['type']}")
    print(f"     Status        : {PROSPECT['status']}")
    print(f"     Score         : {score}/{max_s}  ({score/max_s*100:.0f}%)")
    print(f"     Verdict       : {verdict}")

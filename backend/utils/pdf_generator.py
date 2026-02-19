"""
ReportLab PDF generator for project risk/progress reports.
"""
import os
from datetime import datetime, timezone
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import cm
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.enums import TA_CENTER, TA_LEFT


SEVERITY_COLORS = {
    'Critical': colors.HexColor('#EF4444'),
    'High':     colors.HexColor('#F97316'),
    'High Risk':colors.HexColor('#F97316'),
    'Medium':   colors.HexColor('#EAB308'),
    'Warning':  colors.HexColor('#EAB308'),
    'Low':      colors.HexColor('#22C55E'),
    'Safe':     colors.HexColor('#22C55E'),
}


def generate_project_report_pdf(project: dict, risk_data: dict, tasks: list, output_path: str) -> str:
    """
    Generate a PDF report and save it to output_path.
    Returns the absolute path of the saved PDF.
    """
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        rightMargin=2 * cm, leftMargin=2 * cm,
        topMargin=2 * cm,   bottomMargin=2 * cm,
    )

    styles = getSampleStyleSheet()
    title_style  = ParagraphStyle('title',  parent=styles['Title'],  fontSize=20, spaceAfter=6, textColor=colors.HexColor('#1E293B'))
    h2_style     = ParagraphStyle('h2',     parent=styles['Heading2'], fontSize=13, textColor=colors.HexColor('#334155'), spaceBefore=12, spaceAfter=4)
    body_style   = ParagraphStyle('body',   parent=styles['Normal'],  fontSize=10, textColor=colors.HexColor('#475569'))
    label_style  = ParagraphStyle('label',  parent=styles['Normal'],  fontSize=9,  textColor=colors.HexColor('#94A3B8'))
    center_style = ParagraphStyle('center', parent=styles['Normal'],  fontSize=10, alignment=TA_CENTER)

    story = []
    ts    = datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')

    # ── Header ────────────────────────────────────────────────────────────────
    story.append(Paragraph('AI Project Monitoring System', title_style))
    story.append(Paragraph(f'Risk & Progress Report — {project.get("name", "Project")}', h2_style))
    story.append(Paragraph(f'Generated: {ts}', label_style))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#E2E8F0'), spaceAfter=12))

    # ── Summary Table ─────────────────────────────────────────────────────────
    risk_pct   = risk_data.get('riskPercent', 0)
    overall    = risk_data.get('overallRisk', 'N/A')
    confidence = risk_data.get('confidence', 0)
    risk_color = SEVERITY_COLORS.get(overall, colors.black)

    summary_data = [
        ['Field', 'Value'],
        ['Project',        project.get('name', '')],
        ['Status',         project.get('status', '').replace('_', ' ').title()],
        ['Progress',       f"{project.get('progress', 0)}%"],
        ['Deadline',       str(project.get('deadline', ''))[:10]],
        ['Overall Risk',   f"{overall} ({risk_pct:.0f}%)"],
        ['AI Confidence',  f"{confidence:.0f}%"],
        ['Team Size',      str(len(project.get('team_members', [])))],
    ]

    summary_table = Table(summary_data, colWidths=[5 * cm, 11 * cm])
    summary_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1E293B')),
        ('TEXTCOLOR',  (0, 0), (-1, 0), colors.white),
        ('FONTNAME',   (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE',   (0, 0), (-1, -1), 9),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.HexColor('#F8FAFC'), colors.white]),
        ('GRID',       (0, 0), (-1, -1), 0.5, colors.HexColor('#E2E8F0')),
        ('PADDING',    (0, 0), (-1, -1), 6),
        ('TEXTCOLOR',  (1, 5), (1, 5), risk_color),
        ('FONTNAME',   (1, 5), (1, 5), 'Helvetica-Bold'),
    ]))
    story.append(summary_table)
    story.append(Spacer(1, 16))

    # ── Task Risk Table ────────────────────────────────────────────────────────
    story.append(Paragraph('Task Risk Analysis', h2_style))

    task_rows = [['Task', 'Assignee', 'Progress', 'Days Left', 'Risk Level']]
    task_risk_info = risk_data.get('tasks', [])
    task_risk_map  = {t['_id']: t for t in task_risk_info}

    for task in tasks:
        tid   = str(task.get('_id', ''))
        ri    = task_risk_map.get(tid, {})
        level = ri.get('riskLevel', 'Low')
        task_rows.append([
            task.get('title', '')[:40],
            ri.get('employee', 'N/A'),
            f"{task.get('progress', 0)}%",
            str(ri.get('daysRemaining', '—')),
            level,
        ])

    task_table = Table(task_rows, colWidths=[5.5 * cm, 4 * cm, 2.5 * cm, 2.5 * cm, 2.5 * cm])
    task_style = [
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#334155')),
        ('TEXTCOLOR',  (0, 0), (-1, 0), colors.white),
        ('FONTNAME',   (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE',   (0, 0), (-1, -1), 8),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.HexColor('#F8FAFC'), colors.white]),
        ('GRID',       (0, 0), (-1, -1), 0.5, colors.HexColor('#E2E8F0')),
        ('PADDING',    (0, 0), (-1, -1), 5),
    ]
    # Colour-code risk level cells
    for row_idx, task in enumerate(tasks, start=1):
        tid   = str(task.get('_id', ''))
        ri    = task_risk_map.get(tid, {})
        level = ri.get('riskLevel', 'Low')
        col   = SEVERITY_COLORS.get(level, colors.black)
        task_style.append(('TEXTCOLOR', (4, row_idx), (4, row_idx), col))
        task_style.append(('FONTNAME',  (4, row_idx), (4, row_idx), 'Helvetica-Bold'))

    task_table.setStyle(TableStyle(task_style))
    story.append(task_table)
    story.append(Spacer(1, 16))

    # ── AI Insights ───────────────────────────────────────────────────────────
    story.append(Paragraph('AI-Generated Insights', h2_style))
    for ri in task_risk_info:
        if ri.get('reason'):
            story.append(Paragraph(f"<b>{ri['name']}</b>: {ri['reason']}", body_style))
            if ri.get('suggestedActions'):
                for action in ri['suggestedActions']:
                    story.append(Paragraph(f"  • {action}", body_style))
            story.append(Spacer(1, 6))

    # ── Footer ────────────────────────────────────────────────────────────────
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#E2E8F0'), spaceBefore=12))
    story.append(Paragraph('Generated by AI Project Monitoring System — Confidential', label_style))

    doc.build(story)
    return output_path

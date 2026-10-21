import jsPDF from 'jspdf';
import { StudyDocument } from '../types';

export function exportNotesToPdf(doc: StudyDocument) {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  function checkPageBreak(neededHeight: number) {
    if (y + neededHeight > pageHeight - margin) {
      pdf.addPage();
      y = margin;
      drawFooter();
    }
  }

  function drawFooter() {
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(140, 140, 150);
    pdf.text(
      `StudyPilot Exam Prep • Page ${pdf.getNumberOfPages()}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  }

  // Header banner
  pdf.setFillColor(79, 70, 229); // Indigo 600
  pdf.rect(0, 0, pageWidth, 12, 'F');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.setTextColor(255, 255, 255);
  pdf.text('STUDYPILOT • HIGH-YIELD REVISION GUIDE', margin, 8);

  y = 26;

  // Title
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(18);
  pdf.setTextColor(30, 41, 59); // Slate 800
  const titleLines = pdf.splitTextToSize(doc.title || 'Study Notes', contentWidth);
  pdf.text(titleLines, margin, y);
  y += titleLines.length * 8 + 4;

  // Metadata
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.setTextColor(100, 116, 139);
  pdf.text(`Source: ${doc.fileName} • Generated: ${new Date(doc.createdAt).toLocaleDateString()}`, margin, y);
  y += 10;

  // Executive Summary Box
  checkPageBreak(35);
  pdf.setFillColor(248, 250, 252);
  pdf.setDrawColor(226, 232, 240);
  pdf.roundedRect(margin, y, contentWidth, 24, 3, 3, 'FD');
  
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.setTextColor(67, 56, 202);
  pdf.text('Executive Summary', margin + 5, y + 6);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.setTextColor(51, 65, 85);
  const summaryLines = pdf.splitTextToSize(doc.summary, contentWidth - 10);
  pdf.text(summaryLines, margin + 5, y + 12);
  y += 30;

  // Exam Tips
  if (doc.examTips && doc.examTips.length > 0) {
    checkPageBreak(30);
    pdf.setFillColor(254, 243, 199); // Amber 100
    pdf.setDrawColor(245, 158, 11);
    pdf.roundedRect(margin, y, contentWidth, 8 + doc.examTips.length * 6, 2, 2, 'FD');

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.setTextColor(180, 83, 9);
    pdf.text('⚡ High-Yield Exam Tips', margin + 5, y + 6);
    y += 10;

    doc.examTips.forEach((tip) => {
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8.5);
      pdf.setTextColor(120, 53, 15);
      const tipLines = pdf.splitTextToSize(`• ${tip}`, contentWidth - 10);
      pdf.text(tipLines, margin + 5, y);
      y += tipLines.length * 5;
    });
    y += 6;
  }

  // Topics
  if (doc.topics && doc.topics.length > 0) {
    checkPageBreak(15);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.setTextColor(30, 41, 59);
    pdf.text('Key Topics & Core Concepts', margin, y);
    y += 8;

    doc.topics.forEach((topic, idx) => {
      checkPageBreak(25);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(11);
      pdf.setTextColor(79, 70, 229);
      pdf.text(`${idx + 1}. ${topic.title}`, margin, y);
      y += 6;

      topic.bullets.forEach((bullet) => {
        checkPageBreak(12);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        pdf.setTextColor(51, 65, 85);
        const bulletLines = pdf.splitTextToSize(`- ${bullet}`, contentWidth - 8);
        pdf.text(bulletLines, margin + 4, y);
        y += bulletLines.length * 4.8;
      });
      y += 4;
    });
  }

  // Key Terms
  if (doc.keyTerms && doc.keyTerms.length > 0) {
    checkPageBreak(20);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.setTextColor(30, 41, 59);
    pdf.text('Key Vocabulary & Definitions', margin, y);
    y += 8;

    doc.keyTerms.forEach((kt) => {
      checkPageBreak(14);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9.5);
      pdf.setTextColor(15, 23, 42);
      pdf.text(`• ${kt.term}: `, margin + 2, y);

      const termWidth = pdf.getTextWidth(`• ${kt.term}: `);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.setTextColor(71, 85, 105);

      const defLines = pdf.splitTextToSize(kt.definition, contentWidth - termWidth - 4);
      pdf.text(defLines, margin + 2 + termWidth, y);
      y += Math.max(defLines.length * 4.8, 6);
    });
  }

  // Final footer on all pages
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    drawFooter();
  }

  const safeFileName = (doc.title || 'StudyPilot_Notes').replace(/[^a-z0-9]/gi, '_').toLowerCase();
  pdf.save(`${safeFileName}_exam_prep.pdf`);
}

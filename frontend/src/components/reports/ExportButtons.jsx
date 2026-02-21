import { HiOutlineDocumentDownload, HiOutlineTable } from 'react-icons/hi';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';

const ExportButtons = ({ data, filename = 'report' }) => {
    const exportCSV = () => {
        let csv = '';
        if (data?.highlights) {
            csv += 'Metric,Value,Change\n';
            data.highlights.forEach(h => {
                csv += `"${h.label}","${h.value}","${h.change}"\n`;
            });
        }
        if (data?.topPerformers) {
            csv += '\nTop Performers\nName,Tasks,Hours\n';
            data.topPerformers.forEach(p => {
                csv += `"${p.name}",${p.tasks},${p.hours}\n`;
            });
        }
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, `${filename}.csv`);
    };

    const exportPDF = () => {
        const doc = new jsPDF();
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(18);
        doc.text('RiskSense AI Report', 20, 20);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 30);

        let y = 45;
        if (data?.highlights) {
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(14);
            doc.text('Key Metrics', 20, y);
            y += 10;
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(11);
            data.highlights.forEach(h => {
                doc.text(`${h.label}: ${h.value} (${h.change})`, 25, y);
                y += 8;
            });
        }

        if (data?.topPerformers) {
            y += 5;
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(14);
            doc.text('Top Performers', 20, y);
            y += 10;
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(11);
            data.topPerformers.forEach(p => {
                doc.text(`${p.name} — ${p.tasks} tasks, ${p.hours}h`, 25, y);
                y += 8;
            });
        }

        if (data?.risksIdentified) {
            y += 5;
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(14);
            doc.text('Risks', 20, y);
            y += 10;
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(11);
            data.risksIdentified.forEach(r => {
                const lines = doc.splitTextToSize(`• ${r}`, 170);
                doc.text(lines, 25, y);
                y += lines.length * 7;
            });
        }

        doc.save(`${filename}.pdf`);
    };

    return (
        <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-secondary btn-sm" onClick={exportCSV}>
                <HiOutlineTable /> CSV
            </button>
            <button className="btn btn-primary btn-sm" onClick={exportPDF}>
                <HiOutlineDocumentDownload /> PDF
            </button>
        </div>
    );
};

export default ExportButtons;

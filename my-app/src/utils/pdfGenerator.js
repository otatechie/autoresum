import jsPDF from 'jspdf';

/**
 * Formats resume content into sections for PDF generation
 * @param {Object} resume - The resume object
 * @returns {Array} Array of formatted sections
 */
export const formatResumeContent = (resume) => {
    const sections = [];

    // Professional Summary
    if (resume.resume_summary) {
        sections.push({
            id: 2,
            title: 'Professional Summary',
            content: resume.resume_summary,
            isExpanded: true
        });
    }

    // Work Experience
    if (resume.work_experience) {
        let workContent = '';
        if (typeof resume.work_experience === 'string') {
            workContent = resume.work_experience;
        } else if (Array.isArray(resume.work_experience)) {
            workContent = resume.work_experience.map(job => {
                if (typeof job === 'string') return job;
                return Object.entries(job).map(([key, value]) => `${key}: ${value}`).join('\n');
            }).join('\n\n');
        } else if (typeof resume.work_experience === 'object') {
            workContent = Object.entries(resume.work_experience).map(([key, value]) => `${key}: ${value}`).join('\n');
        }
        
        if (workContent) {
            sections.push({
                id: 3,
                title: 'Work Experience',
                content: workContent,
                isExpanded: true
            });
        }
    }

    // Education
    if (resume.education) {
        let educationContent = '';
        if (typeof resume.education === 'string') {
            educationContent = resume.education;
        } else if (Array.isArray(resume.education)) {
            educationContent = resume.education.map(edu => {
                if (typeof edu === 'string') return edu;
                return Object.entries(edu).map(([key, value]) => `${key}: ${value}`).join('\n');
            }).join('\n\n');
        } else if (typeof resume.education === 'object') {
            educationContent = Object.entries(resume.education).map(([key, value]) => `${key}: ${value}`).join('\n');
        }
        
        if (educationContent) {
            sections.push({
                id: 4,
                title: 'Education',
                content: educationContent,
                isExpanded: true
            });
        }
    }

    // Skills
    if (resume.skills) {
        let skillsContent = '';
        if (typeof resume.skills === 'string') {
            skillsContent = resume.skills;
        } else if (Array.isArray(resume.skills)) {
            skillsContent = resume.skills.join(', ');
        } else if (typeof resume.skills === 'object') {
            skillsContent = Object.entries(resume.skills).map(([key, value]) => `${key}: ${value}`).join('\n');
        }
        
        if (skillsContent) {
            sections.push({
                id: 5,
                title: 'Skills',
                content: skillsContent,
                isExpanded: true
            });
        }
    }

    // Languages
    if (resume.languages) {
        let languagesContent = '';
        if (typeof resume.languages === 'string') {
            languagesContent = resume.languages;
        } else if (Array.isArray(resume.languages)) {
            languagesContent = resume.languages.join(', ');
        } else if (typeof resume.languages === 'object') {
            languagesContent = Object.entries(resume.languages).map(([key, value]) => `${key}: ${value}`).join('\n');
        }
        
        if (languagesContent) {
            sections.push({
                id: 6,
                title: 'Languages',
                content: languagesContent,
                isExpanded: true
            });
        }
    }

    return sections;
};

/**
 * Generates and downloads a PDF resume
 * @param {Object} resume - The resume object to generate PDF for
 * @param {Function} onSuccess - Success callback function
 * @param {Function} onError - Error callback function
 */
export const generateResumePDF = (resume, onSuccess, onError) => {
    try {
        // Create new PDF document
        const pdf = new jsPDF();
        
        // Page dimensions
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 20;
        const contentWidth = pageWidth - (2 * margin);
        
        let yPosition = margin;
        
        // Header - Name with clean, minimal styling
        pdf.setFontSize(24);
        pdf.setFont('times', 'bold');
        pdf.setTextColor(30, 30, 30);
        const fullName = `${resume.first_name || ''} ${resume.last_name || ''}`.trim();
        const nameWidth = pdf.getTextWidth(fullName);
        pdf.text(fullName, (pageWidth - nameWidth) / 2, yPosition);
        yPosition += 8;
        
        // Contact info with minimal spacing
        pdf.setFontSize(10);
        pdf.setFont('times', 'normal');
        pdf.setTextColor(80, 80, 80);
        const contactInfo = [];
        if (resume.email) contactInfo.push(resume.email);
        if (resume.phone) contactInfo.push(resume.phone);
        
        if (contactInfo.length > 0) {
            const contactText = contactInfo.join(' • ');
            const contactWidth = pdf.getTextWidth(contactText);
            pdf.text(contactText, (pageWidth - contactWidth) / 2, yPosition);
            yPosition += 12;
        }
        
        // Simple line separator
        pdf.setDrawColor(150, 150, 150);
        pdf.setLineWidth(0.3);
        pdf.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 10;
        
        // Process each section with minimal styling
        const sections = formatResumeContent(resume);
        
        sections.forEach((section) => {
            // Check if we need a new page
            if (yPosition > pageHeight - 50) {
                pdf.addPage();
                yPosition = margin;
            }
            
            // Section title - simple and clean
            pdf.setFontSize(12);
            pdf.setFont('times', 'bold');
            pdf.setTextColor(40, 40, 40);
            pdf.text(section.title, margin, yPosition);
            yPosition += 6;
            
            // Section content
            pdf.setFontSize(10);
            pdf.setFont('times', 'normal');
            pdf.setTextColor(60, 60, 60);
            
            // Split content into lines that fit the page width
            const lines = pdf.splitTextToSize(section.content, contentWidth);
            
            lines.forEach(line => {
                // Check if we need a new page
                if (yPosition > pageHeight - 25) {
                    pdf.addPage();
                    yPosition = margin;
                }
                
                pdf.text(line, margin, yPosition);
                yPosition += 5; // Minimal line spacing
            });
            
            // Consistent space between sections
            yPosition += 10;
        });
        
        // Generate filename
        const filename = `${fullName.replace(/\s+/g, '_')}_Resume.pdf`;
        
        // Save the PDF
        pdf.save(filename);
        
        // Call success callback
        if (onSuccess) {
            onSuccess(filename);
        }
        
    } catch (error) {
        // Call error callback
        if (onError) {
            onError(error);
        }
    }
}; 
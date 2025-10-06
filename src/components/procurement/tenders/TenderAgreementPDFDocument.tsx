// TenderAgreementPDFDocument.tsx
import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
} from '@react-pdf/renderer';
import { TenderDocumentType } from './types';

interface TenderDetails {
  title: string;
  description: string;
  projected_amount: string | number;
  deadline: string;
  start_date: string;
  end_date: string;
  status: string;
  tender_document?: string;
}

interface ReviewedBy {
  first_name: string;
  last_name: string;
}

interface ApplicationDetails {
  id: number;
  status: string;
  company_name: string;
  business_type: string;
  company_registration_number: string;
  tax_pin: string;
  contact_person: string;
  phone: string;
  contact_person_phone: string;
  email: string;
  contact_person_email: string;
  address: string;
  created_on: string;
  reviewed_on?: string;
  updated_on: string;
  reviewed_by?: ReviewedBy;
  tender: TenderDetails;
  documents: TenderDocumentType[];
}

// Create styles for PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 11,
    lineHeight: 1.4,
  },
  logoSection: {
    marginBottom: 20,
    flexDirection: 'column',
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 8,
  },
  universityHeaderText: {
    alignItems: 'center',
  },
  universityName: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 3,
  },
  contactInfo: {
    fontSize: 8,
    textAlign: 'center',
    marginBottom: 2,
    lineHeight: 1.2,
  },
  documentType: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    marginTop: 15,
    color: '#1F2937',
  },
  agreementNumber: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 20,
    color: '#6B7280',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 15,
    textAlign: 'center',
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  paragraph: {
    fontSize: 11,
    color: '#374151',
    marginBottom: 8,
    textAlign: 'justify',
    lineHeight: 1.5,
  },
  boldText: {
    fontWeight: 'bold',
  },
  partySection: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#3B82F6',
    borderLeftStyle: 'solid',
  },
  partyTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 6,
  },
  partyDetails: {
    fontSize: 10,
    color: '#4B5563',
    marginBottom: 3,
  },
  tenderDetails: {
    backgroundColor: '#EFF6FF',
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#DBEAFE',
    borderStyle: 'solid',
  },
  tenderTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1E40AF',
    marginBottom: 6,
  },
  tenderInfo: {
    fontSize: 10,
    color: '#1F2937',
    marginBottom: 3,
  },
  clause: {
    marginBottom: 12,
  },
  clauseNumber: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  clauseText: {
    fontSize: 10,
    color: '#374151',
    textAlign: 'justify',
    lineHeight: 1.4,
    paddingLeft: 10,
  },
  signatureSection: {
    marginTop: 30,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    borderTopStyle: 'solid',
    paddingTop: 20,
  },
  signatureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  signatureBox: {
    width: '45%',
    borderBottomWidth: 1,
    borderBottomColor: '#9CA3AF',
    borderBottomStyle: 'solid',
    paddingBottom: 5,
    minHeight: 60,
  },
  signatureLabel: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 5,
    textAlign: 'center',
  },
  signatureLabelWithMargin: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 40,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    borderTopStyle: 'solid',
    paddingTop: 10,
  },
  footerText: {
    fontSize: 8,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  pageNumber: {
    position: 'absolute',
    bottom: 10,
    right: 30,
    fontSize: 8,
    color: '#9CA3AF',
  },
});

interface TenderAgreementPDFDocumentProps {
  data: ApplicationDetails;
  agreementNumber: string;
  agreementDate: string;
}

const TenderAgreementPDFDocument: React.FC<TenderAgreementPDFDocumentProps> = ({
  data,
  agreementNumber,
  agreementDate,
}) => {
  const formatCurrency = (amount: string | number): string => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return `KES ${num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.logoSection}>
          <View style={styles.logoContainer}>
            <View style={styles.universityHeaderText}>
              <Text style={styles.universityName}>
                Kathangaita University of Science and Technology
              </Text>
            </View>
          </View>
          <Text style={styles.contactInfo}>
            P.O. BOX. 190-50100 Kathangaita,
          </Text>
          <Text style={styles.contactInfo}>
            TEL: +057-250523646/3,0745535335, FAX: +056-30150
          </Text>
          <Text style={styles.contactInfo}>
            Email: info@kaust.ac.ke, web: www.kaust.ac.ke
          </Text>
          <Text style={styles.documentType}>TENDER AGREEMENT</Text>
          <Text style={styles.agreementNumber}>
            Agreement No: {agreementNumber}
          </Text>
        </View>

        {/* Agreement Title */}
        <View style={styles.section}>
          <Text style={styles.title}>
            AGREEMENT FOR {data.tender.title.toUpperCase()}
          </Text>
        </View>

        {/* Introduction */}
        <View style={styles.section}>
          <Text style={styles.paragraph}>
            This Agreement is made on{' '}
            <Text style={styles.boldText}>{agreementDate}</Text> between:
          </Text>
        </View>

        {/* Parties Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Parties to the Agreement</Text>

          {/* First Party - University */}
          <View style={styles.partySection}>
            <Text style={styles.partyTitle}>
              FIRST PARTY (The Procuring Entity)
            </Text>
            <Text style={styles.partyDetails}>
              <Text style={styles.boldText}>Name:</Text> Kathangaita University
              of Science and Technology
            </Text>
            <Text style={styles.partyDetails}>
              <Text style={styles.boldText}>Address:</Text> P.O. BOX. 190-50100
              Kathangaita
            </Text>
            <Text style={styles.partyDetails}>
              <Text style={styles.boldText}>Contact:</Text> +057-250523646/3,
              info@kaust.ac.ke
            </Text>
            <Text style={styles.partyDetails}>
              Hereinafter referred to as &ldquo;The University&ldquo; or
              &ldquo;First Party&ldquo;
            </Text>
          </View>

          {/* Second Party - Contractor */}
          <View style={styles.partySection}>
            <Text style={styles.partyTitle}>SECOND PARTY (The Contractor)</Text>
            <Text style={styles.partyDetails}>
              <Text style={styles.boldText}>Company Name:</Text>{' '}
              {data.company_name}
            </Text>
            <Text style={styles.partyDetails}>
              <Text style={styles.boldText}>Registration Number:</Text>{' '}
              {data.company_registration_number}
            </Text>
            <Text style={styles.partyDetails}>
              <Text style={styles.boldText}>Tax PIN:</Text> {data.tax_pin}
            </Text>
            <Text style={styles.partyDetails}>
              <Text style={styles.boldText}>Contact Person:</Text>{' '}
              {data.contact_person}
            </Text>
            <Text style={styles.partyDetails}>
              <Text style={styles.boldText}>Address:</Text>{' '}
              {data.address.replace(/\n/g, ', ')}
            </Text>
            <Text style={styles.partyDetails}>
              <Text style={styles.boldText}>Phone:</Text> {data.phone}
            </Text>
            <Text style={styles.partyDetails}>
              <Text style={styles.boldText}>Email:</Text> {data.email}
            </Text>
            <Text style={styles.partyDetails}>
              Hereinafter referred to as &ldquo;The Contractor&ldquo; or
              &ldquo;Second Party&ldquo;
            </Text>
          </View>
        </View>

        {/* Tender Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tender Details</Text>
          <View style={styles.tenderDetails}>
            <Text style={styles.tenderTitle}>{data.tender.title}</Text>
            <Text style={styles.tenderInfo}>
              <Text style={styles.boldText}>Project Description:</Text>{' '}
              {data.tender.description}
            </Text>
            <Text style={styles.tenderInfo}>
              <Text style={styles.boldText}>Contract Value:</Text>{' '}
              {formatCurrency(data.tender.projected_amount)}
            </Text>
            <Text style={styles.tenderInfo}>
              <Text style={styles.boldText}>Project Start Date:</Text>{' '}
              {formatDate(data.tender.start_date)}
            </Text>
            <Text style={styles.tenderInfo}>
              <Text style={styles.boldText}>Project End Date:</Text>{' '}
              {formatDate(data.tender.end_date)}
            </Text>
          </View>
        </View>

        {/* Terms and Conditions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Terms and Conditions</Text>

          <View style={styles.clause}>
            <Text style={styles.clauseNumber}>1. SCOPE OF WORK</Text>
            <Text style={styles.clauseText}>
              The Contractor agrees to provide all services, materials,
              equipment, and labor necessary for the completion of{' '}
              {data.tender.title} as specified in the tender document and in
              accordance with the technical specifications provided by the
              University.
            </Text>
          </View>

          <View style={styles.clause}>
            <Text style={styles.clauseNumber}>2. CONTRACT PRICE</Text>
            <Text style={styles.clauseText}>
              The total contract price is{' '}
              {formatCurrency(data.tender.projected_amount)} (Kenya Shillings)
              inclusive of all applicable taxes, duties, and charges. Payment
              shall be made according to the payment schedule outlined in the
              tender document.
            </Text>
          </View>

          <View style={styles.clause}>
            <Text style={styles.clauseNumber}>3. PROJECT DURATION</Text>
            <Text style={styles.clauseText}>
              The project shall commence on {formatDate(data.tender.start_date)}{' '}
              and shall be completed by {formatDate(data.tender.end_date)}. Time
              is of the essence in this contract, and any delays must be
              approved in writing by the University.
            </Text>
          </View>

          <View style={styles.clause}>
            <Text style={styles.clauseNumber}>4. QUALITY STANDARDS</Text>
            <Text style={styles.clauseText}>
              All work performed under this agreement must meet industry
              standards and specifications as outlined in the tender document.
              The University reserves the right to inspect and approve all work
              at various stages of completion.
            </Text>
          </View>

          <View style={styles.clause}>
            <Text style={styles.clauseNumber}>5. WARRANTY</Text>
            <Text style={styles.clauseText}>
              The Contractor warrants all work performed and materials supplied
              for a period of twelve (12) months from the date of completion and
              acceptance by the University. Any defects arising during this
              period shall be rectified at no cost to the University.
            </Text>
          </View>

          <View style={styles.clause}>
            <Text style={styles.clauseNumber}>6. INSURANCE AND LIABILITY</Text>
            <Text style={styles.clauseText}>
              The Contractor shall maintain adequate insurance coverage
              including professional indemnity, public liability, and
              workmen&apos;s compensation insurance. The Contractor shall
              indemnify the University against all claims arising from the
              performance of this contract.
            </Text>
          </View>

          <View style={styles.clause}>
            <Text style={styles.clauseNumber}>7. TERMINATION</Text>
            <Text style={styles.clauseText}>
              This agreement may be terminated by either party upon thirty (30)
              days written notice. In case of termination, the Contractor shall
              be compensated for work satisfactorily completed up to the date of
              termination.
            </Text>
          </View>

          <View style={styles.clause}>
            <Text style={styles.clauseNumber}>8. GOVERNING LAW</Text>
            <Text style={styles.clauseText}>
              This agreement shall be governed by the laws of Kenya. Any
              disputes arising shall be resolved through arbitration in
              accordance with the Arbitration Act of Kenya.
            </Text>
          </View>
        </View>

        {/* Signatures */}
        <View style={styles.signatureSection}>
          <Text style={styles.sectionTitle}>Signatures</Text>
          <Text style={styles.paragraph}>
            By signing below, both parties agree to be bound by the terms and
            conditions of this agreement:
          </Text>

          <View style={styles.signatureRow}>
            <View style={styles.signatureBox}>
              <Text style={styles.signatureLabel}>
                For Kathangaita University of Science and Technology
              </Text>
              <Text style={styles.signatureLabelWithMargin}>
                Name: _________________________
              </Text>
              <Text style={styles.signatureLabel}>
                Title: _________________________
              </Text>
              <Text style={styles.signatureLabel}>
                Date: _________________________
              </Text>
            </View>

            <View style={styles.signatureBox}>
              <Text style={styles.signatureLabel}>For {data.company_name}</Text>
              <Text style={styles.signatureLabelWithMargin}>
                Name: {data.contact_person}
              </Text>
              <Text style={styles.signatureLabel}>
                Title: _________________________
              </Text>
              <Text style={styles.signatureLabel}>
                Date: _________________________
              </Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            This agreement is generated electronically and is valid without
            physical signatures pending formal execution.
          </Text>
        </View>

        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `Page ${pageNumber} of ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  );
};

export const exportTenderAgreementToPDF = async (
  data: ApplicationDetails,
  agreementNumber?: string,
  agreementDate?: string,
): Promise<void> => {
  try {
    const defaultAgreementNumber =
      agreementNumber || `AGR-${data.id}-${new Date().getFullYear()}`;
    const defaultAgreementDate =
      agreementDate ||
      new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

    const doc = (
      <TenderAgreementPDFDocument
        data={data}
        agreementNumber={defaultAgreementNumber}
        agreementDate={defaultAgreementDate}
      />
    );

    const asPdf = pdf(doc);
    const blob = await asPdf.toBlob();

    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tender-agreement-${data.company_name.replace(/\s+/g, '-').toLowerCase()}-${
      new Date().toISOString().split('T')[0]
    }.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF agreement');
  }
};

export default TenderAgreementPDFDocument;

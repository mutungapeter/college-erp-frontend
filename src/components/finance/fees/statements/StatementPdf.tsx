import { FeeStatementDetailsType } from "@/definitions/finance/fees/payments";

import {
  Document,
  Image,
  Page,
  PDFViewer,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    borderColor: "#6b7280",
    borderWidth: 2,
    fontFamily: "Helvetica",
  },
  logoSection: {
    marginBottom: 15,
    flexDirection: "column",
    alignItems: "center",
  },
  logoContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 10,
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 8,
  },
  universityHeaderText: {
    alignItems: "center",
  },
  universityName: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 3,
  },
  contactInfo: {
    fontSize: 8,
    textAlign: "center",
    marginBottom: 2,
    lineHeight: 1.2,
  },
  officeTitle: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 3,
  },
  documentType: {
    fontSize: 11,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  studentSection: {
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: "#6b7280",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  infoSection: {
    flexDirection: "column",
    gap: 8,
  },
  infoRow: {
    flexDirection: "row",
    gap: 5,
  },
  label: {
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
    width: 100,
  },
  value: {
    fontSize: 10,
    fontWeight: "normal",
    textTransform: "uppercase",
  },
  
  
  feeStatementSection: {
    marginTop: 20,
  
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  headerCell: {
    fontSize: 9,
    fontWeight: "bold",
    paddingVertical: 8,
    paddingHorizontal: 6,
    textAlign: "center",
    borderRightWidth: 1,
    borderRightColor: "#e5e7eb",
  },
  dateColumn: {
    width: "15%",
  },
  descriptionColumn: {
    width: "35%",
    textAlign: "left",
  },
  typeColumn: {
    width: "15%",
  },
  debitColumn: {
    width: "15%",
  },
  creditColumn: {
    width: "15%",
  },
  balanceColumn: {
    width: "15%",
  },
  
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    minHeight: 25,
  },
  cell: {
    fontSize: 8,
    paddingVertical: 6,
    paddingHorizontal: 6,
    textAlign: "center",
    borderRightWidth: 1,
    borderRightColor: "#e5e7eb",
    justifyContent: "center",
  },
  cellLeft: {
    textAlign: "left",
  },
  cellRight: {
    textAlign: "right",
  },
  
  // Summary Section
  summarySection: {
    marginTop: 10,
    padding: 15,
   
  },
  summaryTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
    paddingVertical: 2,
  },
  summaryLabel: {
    fontSize: 10,
    fontWeight: "bold",
  },
  summaryValue: {
    fontSize: 10,
    fontWeight: "normal",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#6b7280",
  },
  totalLabel: {
    fontSize: 11,
    fontWeight: "bold",
  },
  totalValue: {
    fontSize: 11,
    fontWeight: "bold",
  },
  
  // Status Badge
  statusBadge: {
    marginTop: 15,
    padding: 8,
    borderRadius: 4,
    alignItems: "center",
  },
  statusPaid: {
    backgroundColor: "#dcfce7",
    borderColor: "#16a34a",
    borderWidth: 1,
  },
  statusPending: {
    backgroundColor: "#fef3c7",
    borderColor: "#d97706",
    borderWidth: 1,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "bold",
  },
  statusTextPaid: {
    color: "#16a34a",
  },
  statusTextPending: {
    color: "#d97706",
  },
  
  // Footer and Signature
  footer: {
    marginTop: 30,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 15,
    fontSize: 8,
    color: "#6b7280",
    textAlign: "center",
  },
  signature: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  signatureLine: {
    width: "40%",
    borderTopWidth: 1,
    borderTopColor: "#6b7280",
    marginHorizontal: "5%",
    textAlign: "center",
    paddingTop: 5,
    fontSize: 8,
  },
  
  // Additional Info
  additionalInfo: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#f8fafc",
   
  },
  infoTitle: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 5,
  },
  infoText: {
    fontSize: 8,
    lineHeight: 1.4,
    marginBottom: 3,
  },
});

interface Props {
  data: FeeStatementDetailsType[];

}

const FeeStatementPDF = ({ data }: Props) => {
  console.log("Fee Statement Data:", data);
  const student = data[0]?.student;
  const semester = data[0]?.semester;
 const currentBalance = parseFloat(data[data.length - 1]?.balance || "0");

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        
            <View style={styles.logoSection}>
              <View style={styles.logoContainer}>
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <Image 
                  style={styles.logo}
                  src="/logo/university_logo.png"
                />
                <View style={styles.universityHeaderText}>
                  <Text style={styles.universityName}>
                    Kathangaita University of Science and Technology
                  </Text>
                </View>
              </View>
              <Text style={styles.contactInfo}>P.O. BOX. 190-50100 Kathangaita,</Text>
              <Text style={styles.contactInfo}>
                TEL: +057-250523646/3,0745535335, FAX: +056-30150
              </Text>
              <Text style={styles.contactInfo}>
                Email: info@kaust.ac.ke, web: www.kaust.ac.ke
              </Text>
              <Text style={styles.officeTitle}>
                OFFICE OF THE REGISTRAR - FINANCE
              </Text>
              <Text style={styles.documentType}>
                STUDENT FEE STATEMENT
              </Text>
            </View>

            {/* Student Information Section */}
            <View style={styles.studentSection}>
              <View style={styles.infoSection}>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Student Name:</Text>
                  <Text style={styles.value}>
                    {student.user.first_name} {student.user.last_name}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Programme:</Text>
                  <Text style={styles.value}>
                    {student.programme?.name}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Cohort:</Text>
                  <Text style={styles.value}>
                    {student.cohort?.name}
                  </Text>
                </View>
              </View>
              <View style={styles.infoSection}>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Reg. Number:</Text>
                  <Text style={styles.value}>
                    {student.registration_number}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Semester:</Text>
                  <Text style={styles.value}>
                    {semester.name} {semester.academic_year}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Statement Date:</Text>
                  <Text style={styles.value}>
                    {new Date().toLocaleDateString()}
                  </Text>
                </View>
              </View>
            </View>

            {/* Fee Statement Table */}
            <View style={styles.feeStatementSection}>
              {/* Table Header */}
              <View style={styles.tableHeader}>
                <Text style={[styles.headerCell, styles.dateColumn]}>Date</Text>
                <Text style={[styles.headerCell, styles.descriptionColumn, styles.cellLeft]}>Description</Text>
                <Text style={[styles.headerCell, styles.typeColumn]}>Type</Text>
                <Text style={[styles.headerCell, styles.debitColumn]}>Debit (KSh)</Text>
                <Text style={[styles.headerCell, styles.creditColumn]}>Credit (KSh)</Text>
                <Text style={[styles.headerCell, styles.balanceColumn]}>Balance (KSh)</Text>
              </View>

              {/* Table Rows */}
              {data.map((transaction) => (
                <View key={transaction.id} style={styles.tableRow}>
                  <Text style={[styles.cell, styles.dateColumn]}>
                    {new Date().toLocaleDateString()}
                  </Text>
                  <Text style={[styles.cell, styles.descriptionColumn, styles.cellLeft]}>
                    {transaction.statement_type === 'Invoice' ? 
                      `Tuition Fee - ${semester.name} ${semester.academic_year}` : 
                      `Fee Payment - ${transaction.statement_type}`
                    }
                  </Text>
                  <Text style={[styles.cell, styles.typeColumn]}>
                    {transaction.statement_type}
                  </Text>
                  <Text style={[styles.cell, styles.debitColumn, styles.cellRight]}>
                    {parseFloat(transaction.debit) > 0 ? 
                      parseFloat(transaction.debit).toLocaleString() : '-'
                    }
                  </Text>
                  <Text style={[styles.cell, styles.creditColumn, styles.cellRight]}>
                    {parseFloat(transaction.credit) > 0 ? 
                      parseFloat(transaction.credit).toLocaleString() : '-'
                    }
                  </Text>
                  <Text style={[styles.cell, styles.balanceColumn, styles.cellRight]}>
                    {parseFloat(transaction.balance).toLocaleString()}
                  </Text>
                </View>
              ))}
            </View>

            {/* Summary Section */}
            <View style={styles.summarySection}>
              
              
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>CURRENT BALANCE:</Text>
                <Text style={styles.totalValue}>
                  KSh {currentBalance.toLocaleString()}
                </Text>
              </View>
            </View>

            

            {/* Additional Information */}
            <View style={styles.additionalInfo}>
              <Text style={styles.infoTitle}>PAYMENT INFORMATION:</Text>
              <Text style={styles.infoText}>
                • Payments can be made through MPESA, Bank Transfer, or at the Finance Office
              </Text>
              <Text style={styles.infoText}>
                • All payments should quote the student registration number
              </Text>
              <Text style={styles.infoText}>
                • For queries, contact the Finance Office: finance@kaust.ac.ke
              </Text>
            </View>

            {/* Signature Section */}
            <View style={styles.signature}>
              <View style={styles.signatureLine}>
                <Text>Finance Officer</Text>
              </View>
              <View style={styles.signatureLine}>
                <Text>Date: {new Date().toLocaleDateString()}</Text>
              </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text>
                This is an official fee statement of Kathangaita University of Science and Technology.
              </Text>
              <Text>This document is void if altered in any way.</Text>
            </View>
          </Page>
      
    </Document>
  );
};

export const PDFFeeStatementViewer = ({ data }: {
    data: FeeStatementDetailsType[];
}) => {
  console.log("Fee Statement Viewer Data:", data);
  return (
    <>
    <PDFViewer width="100%" height="100%" className="border-0">
      <FeeStatementPDF data={data} />
    </PDFViewer>
    </>
  );
};

export default PDFFeeStatementViewer;